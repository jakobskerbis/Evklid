"""Glasovni strežnik Evklida: slovensko besedilo → MP3 z odprtim glasom Piper (sl_SI artur, CC BY 4.0).

Zakaj: pri ustnem spraševanju Evklid bere vprašanja na glas. Glas naprave (speechSynthesis) slovenščino pozna skoraj
samo v Edgu; Chrome, aplikacija za Android in iPhone slovenskega glasu nimajo (j, 19. 11. 2026: »glas inštruktorja
ne dela«). Zato glas ustvari ta strežnik, za vse naprave enako.

- Teče kot zasebna storitev (Render pserv »evklid-glas«, render.yaml): dosegljiv je samo iz strežnika Evklida, ki
  pošlje samo besedilo vprašanja (nikoli učenčevega odgovora ali zvoka).
- Ločen proces, ker model z onnxruntime porabi ~250 MB, glavni strežnik pa ima 512 MB (render.yaml »Pomnilnik«).
- POST /govor  telo: {"besedilo": "..."}  →  audio/mpeg. GET /healthz → ok.
- Predpomnilnik na disku (ključ: SHA-256 besedila): vprašanja iz lekcij se ponavljajo, drugo branje je takojšnje.
- En sam izris naenkrat (0,5 CPU); dolžina besedila je omejena.
"""
import hashlib
import io
import json
import os
import sys
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

MAX_CHARS = 1200
MAX_BODY = 16_000
DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.environ.get("EVKLID_GLAS_MODEL_DIR") or os.path.join(DIR, "model")
MODEL = os.path.join(MODEL_DIR, "sl_SI-artur-medium.onnx")
CACHE = os.environ.get("EVKLID_GLAS_CACHE") or os.path.join(tempfile.gettempdir(), "evklid-glas")
CACHE_MAX = int(os.environ.get("EVKLID_GLAS_CACHE_MAX") or 5000)  # datotek (~30 KB vsaka)
VERSION = "artur-medium-1"  # ob spremembi glasu ali nastavitev stari posnetki ne veljajo več

_voice = None
_lock = threading.Lock()


def voice():
    global _voice
    if _voice is None:
        from piper import PiperVoice

        _voice = PiperVoice.load(MODEL)
    return _voice


def to_mp3(chunks):
    import numpy as np
    import soundfile as sf

    rate = None
    parts = []
    for c in chunks:
        rate = c.sample_rate
        parts.append(c.audio_int16_array)
        parts.append(np.zeros(int(c.sample_rate * 0.25), dtype=np.int16))  # premor med stavki
    if not parts:
        return b""
    out = io.BytesIO()
    sf.write(out, np.concatenate(parts), rate, format="MP3", subtype="MPEG_LAYER_III")
    return out.getvalue()


def synthesize(text):
    """Besedilo → MP3 (bytes). Uporabi predpomnilnik na disku."""
    key = hashlib.sha256(f"{VERSION}\n{text}".encode("utf-8")).hexdigest()
    path = os.path.join(CACHE, key[:2], key + ".mp3")
    try:
        with open(path, "rb") as f:
            return f.read()
    except OSError:
        pass
    with _lock:
        from piper import SynthesisConfig

        data = to_mp3(voice().synthesize(text, SynthesisConfig(length_scale=1.05)))
    try:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        tmp = path + ".del"
        with open(tmp, "wb") as f:
            f.write(data)
        os.replace(tmp, path)
        prune()
    except OSError:
        pass
    return data


_count = {"n": 0}


def prune():
    # Vsakih 200 novih posnetkov: če jih je preveč, izbrišemo najstarejše.
    _count["n"] += 1
    if _count["n"] % 200:
        return
    files = []
    for root, _, names in os.walk(CACHE):
        files += [os.path.join(root, n) for n in names if n.endswith(".mp3")]
    if len(files) <= CACHE_MAX:
        return
    files.sort(key=lambda p: os.path.getmtime(p))
    for p in files[: len(files) - CACHE_MAX]:
        try:
            os.remove(p)
        except OSError:
            pass


def clean(text):
    text = " ".join(str(text or "").split())
    return text[:MAX_CHARS]


class Handler(BaseHTTPRequestHandler):
    server_version = "evklid-glas"

    def log_message(self, fmt, *args):  # brez besedila v dnevniku
        pass

    def send(self, code, body, ctype="application/json"):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/healthz":
            return self.send(200, b"ok", "text/plain")
        self.send(404, b'{"error":"ni"}')

    def do_POST(self):
        if self.path != "/govor":
            return self.send(404, b'{"error":"ni"}')
        try:
            n = int(self.headers.get("Content-Length") or 0)
            if n <= 0 or n > MAX_BODY:
                return self.send(413, b'{"error":"prevelika zahteva"}')
            text = clean(json.loads(self.rfile.read(n).decode("utf-8")).get("besedilo"))
        except (ValueError, AttributeError):
            return self.send(400, b'{"error":"napacna zahteva"}')
        if not text:
            return self.send(400, b'{"error":"ni besedila"}')
        try:
            data = synthesize(text)
        except Exception as e:  # noqa: BLE001 – strežnik ostane živ
            print("glas: napaka", type(e).__name__, file=sys.stderr)
            return self.send(500, b'{"error":"glas ni uspel"}')
        self.send(200, data, "audio/mpeg")


def main():
    port = int(os.environ.get("PORT") or 10000)
    if os.environ.get("EVKLID_GLAS_PREDGREJ", "1") != "0":
        voice()  # model naložimo ob zagonu, prvo branje ne čaka
    srv = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(f"evklid-glas posluša na {port}", flush=True)
    srv.serve_forever()


if __name__ == "__main__":
    main()
