"""Glasovni strežnik Evklida: slovensko besedilo → MP3 z odprtim glasom.

Motor (EVKLID_GLAS_MOTOR, glas/prenesi.py): »supertonic« (Supertonic 3, OpenRAIL, privzeto od 20. 11. 2026, ker je j
Piper slišal »preveč robotski«; glas EVKLID_GLAS_GLAS, npr. F1) ali »piper« (sl_SI artur, CC BY 4.0, manjši).

Zakaj: pri ustnem spraševanju Evklid bere vprašanja na glas. Glas naprave (speechSynthesis) slovenščino pozna skoraj
samo v Edgu; Chrome, aplikacija za Android in iPhone slovenskega glasu nimajo (j, 19. 11. 2026: »glas inštruktorja
ne dela«). Zato glas ustvari ta strežnik, za vse naprave enako.

- Teče kot zasebna storitev (Render pserv »evklid-glas«, render.yaml): dosegljiv je samo iz strežnika Evklida, ki
  pošlje samo besedilo vprašanja (nikoli učenčevega odgovora ali zvoka).
- Ločen proces, ker model z onnxruntime porabi ~250 MB (Piper) oziroma ~530 MB (Supertonic), glavni strežnik pa ima
  512 MB (render.yaml »Pomnilnik«).
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

MAX_CHARS = 600
MAX_BODY = 16_000
DIR = os.path.dirname(os.path.abspath(__file__))
MOTOR = (os.environ.get("EVKLID_GLAS_MOTOR") or "supertonic").strip().lower()
GLAS = (os.environ.get("EVKLID_GLAS_GLAS") or "F1").strip()  # Supertonic: F1–F5, M1–M5
KORAKI = int(os.environ.get("EVKLID_GLAS_KORAKI") or 8)  # Supertonic: manj = hitreje, malo slabše
MODEL_DIR = os.environ.get("EVKLID_GLAS_MODEL_DIR") or os.path.join(DIR, "model", MOTOR)
CACHE = os.environ.get("EVKLID_GLAS_CACHE") or os.path.join(tempfile.gettempdir(), "evklid-glas")
CACHE_MAX = int(os.environ.get("EVKLID_GLAS_CACHE_MAX") or 5000)  # datotek (~30 KB vsaka)
# ob spremembi motorja, glasu ali nastavitev stari posnetki ne veljajo več
VERSION = "artur-medium-1" if MOTOR == "piper" else f"supertonic3-{GLAS}-{KORAKI}-1"

_voice = None
_lock = threading.Lock()


def voice():
    global _voice
    if _voice is None:
        if MOTOR == "piper":
            from piper import PiperVoice

            _voice = PiperVoice.load(os.path.join(MODEL_DIR, "sl_SI-artur-medium.onnx"))
        else:
            from supertonic import TTS

            tts = TTS(model_dir=MODEL_DIR, auto_download=False, intra_op_num_threads=int(os.environ.get("EVKLID_GLAS_NITI") or 1))
            _voice = (tts, tts.get_voice_style(voice_name=GLAS))
    return _voice


def mp3(samples, rate):
    import soundfile as sf

    out = io.BytesIO()
    sf.write(out, samples, rate, format="MP3", subtype="MPEG_LAYER_III")
    return out.getvalue()


def render(text):
    """Besedilo → MP3 (bytes) z izbranim motorjem; prazno, ko ni nič za brati."""
    import numpy as np

    if MOTOR == "piper":
        from piper import SynthesisConfig

        rate = None
        parts = []
        for c in voice().synthesize(text, SynthesisConfig(length_scale=1.05)):
            rate = c.sample_rate
            parts.append(c.audio_int16_array)
            parts.append(np.zeros(int(c.sample_rate * 0.25), dtype=np.int16))  # premor med stavki
        return mp3(np.concatenate(parts), rate) if parts else b""
    tts, style = voice()
    wav, _ = tts.synthesize(text, voice_style=style, lang="sl", total_steps=KORAKI, speed=1.0)
    wav = np.asarray(wav, dtype=np.float32).reshape(-1)
    if not wav.size:
        return b""
    return mp3(np.clip(wav, -1, 1), tts.sample_rate)


class Busy(Exception):
    pass


WAIT_S = 5  # v vrsti največ toliko: glavni strežnik po 11 s odneha, odjemalec po 12 s uporabi glas naprave


def synthesize(text, cache=True):
    """Besedilo → MP3 (bytes). cache=False: brez zapisa na disk (dodatno vprašanje je iz učenčevega odgovora)."""
    key = hashlib.sha256(f"{VERSION}\n{text}".encode("utf-8")).hexdigest()
    path = os.path.join(CACHE, key[:2], key + ".mp3")
    if cache:
        try:
            with open(path, "rb") as f:
                return f.read()
        except OSError:
            pass
    if not _lock.acquire(timeout=WAIT_S):
        raise Busy()
    try:
        data = render(text)
    finally:
        _lock.release()
    if not data or not cache:
        return data
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
            body = json.loads(self.rfile.read(n).decode("utf-8"))
            text = clean(body.get("besedilo"))
            cache = body.get("shrani", True) is not False
        except (ValueError, AttributeError):
            return self.send(400, b'{"error":"napacna zahteva"}')
        if not text:
            return self.send(400, b'{"error":"ni besedila"}')
        try:
            data = synthesize(text, cache)
        except Busy:
            return self.send(503, b'{"error":"zasedeno"}')
        except Exception as e:  # noqa: BLE001 – strežnik ostane živ
            print("glas: napaka", type(e).__name__, file=sys.stderr)
            return self.send(500, b'{"error":"glas ni uspel"}')
        if not data:  # samo ločila: nič za brati
            return self.send(422, b'{"error":"ni besed"}')
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
