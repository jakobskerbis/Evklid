"""Prenese slovenski glas Piper »artur« (CC BY 4.0, ppisljar/artur_studio_tts) ob gradnji glasovnega strežnika.

Datoteki preverimo z zgoščeno vrednostjo SHA-256, da gradnja ne uporabi spremenjenega ali okvarjenega modela.
Zagon: python glas/prenesi.py  (Render, buildCommand storitve evklid-glas v render.yaml)
"""
import hashlib
import os
import sys
import urllib.request

# Pripeta različica repozitorija glasov (sprememba na »main« ne spremeni gradnje).
REVISION = "04ca88f5685ca5253c701af3687e155b113bd512"
BASE = f"https://huggingface.co/rhasspy/piper-voices/resolve/{REVISION}/sl/sl_SI/artur/medium/"
FILES = {
    "sl_SI-artur-medium.onnx": "9222ed93ef425524ad4be0b083369af8ea8db18455576a6016b154192f4ed38c",
    "sl_SI-artur-medium.onnx.json": "741283430f1fa2be5c61717c6f1fe795a7b9f537491927340dd12f90f3b3cc04",
}
DIR = os.environ.get("EVKLID_GLAS_MODEL_DIR") or os.path.join(os.path.dirname(os.path.abspath(__file__)), "model")


def sha(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def main():
    os.makedirs(DIR, exist_ok=True)
    for name, want in FILES.items():
        path = os.path.join(DIR, name)
        if os.path.exists(path) and sha(path) == want:
            continue
        tmp = path + ".del"
        urllib.request.urlretrieve(BASE + name, tmp)
        got = sha(tmp)
        if got != want:
            os.remove(tmp)
            sys.exit(f"{name}: napačna zgoščena vrednost {got}")
        os.replace(tmp, path)
    print("glas artur pripravljen v", DIR)


if __name__ == "__main__":
    main()
