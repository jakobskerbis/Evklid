"""Prenese model glasu ob gradnji glasovnega strežnika (glas/streznik.py).

Motor izbere EVKLID_GLAS_MOTOR (render.yaml):
- »supertonic« (privzeto, j 20. 11. 2026: Piper je »preveč robotski«): Supertonic 3 (Supertone, OpenRAIL),
  31 jezikov z slovenščino, prednastavljeni glasovi F1–F5 in M1–M5.
- »piper«: Piper sl_SI »artur« (CC BY 4.0, ppisljar/artur_studio_tts), manjši (~220 MB pomnilnika), bolj robotski.

Vse datoteke so s pripete različice repozitorija in preverjene z zgoščeno vrednostjo SHA-256, da gradnja ne uporabi
spremenjenega ali okvarjenega modela.
Zagon: python glas/prenesi.py  (Render, buildCommand storitve evklid-glas v render.yaml)
"""
import hashlib
import os
import sys
import urllib.request

PIPER_REV = "04ca88f5685ca5253c701af3687e155b113bd512"
PIPER = {
    f"https://huggingface.co/rhasspy/piper-voices/resolve/{PIPER_REV}/sl/sl_SI/artur/medium/{name}": (name, digest)
    for name, digest in {
        "sl_SI-artur-medium.onnx": "9222ed93ef425524ad4be0b083369af8ea8db18455576a6016b154192f4ed38c",
        "sl_SI-artur-medium.onnx.json": "741283430f1fa2be5c61717c6f1fe795a7b9f537491927340dd12f90f3b3cc04",
    }.items()
}

SUPERTONIC_REV = "3cadd1ee6394adea1bd021217a0e650ede09a323"
SUPERTONIC_FILES = {
    "config.json": "4099082b107a9d4029849ac76b89eca65e03732660969c2babe5bf308c7357f2",
    "LICENSE": "0d944a9110fed9a9602d60e0423a272903e7bd21ab060490774efc77c2275e9f",
    "onnx/duration_predictor.onnx": "c3eb91414d5ff8a7a239b7fe9e34e7e2bf8a8140d8375ffb14718b1c639325db",
    "onnx/text_encoder.onnx": "c7befd5ea8c3119769e8a6c1486c4edc6a3bc8365c67621c881bbb774b9902ff",
    "onnx/vector_estimator.onnx": "883ac868ea0275ef0e991524dc64f16b3c0376efd7c320af6b53f5b780d7c61c",
    "onnx/vocoder.onnx": "085de76dd8e8d5836d6ca66826601f615939218f90e519f70ee8a36ed2a4c4ba",
    "onnx/tts.json": "42078d3aef1cd43ab43021f3c54f47d2d75ceb4e75f627f118890128b06a0d09",
    "onnx/unicode_indexer.json": "9bf7346e43883a81f8645c81224f786d43c5b57f3641f6e7671a7d6c493cb24f",
    "voice_styles/F1.json": "bbdec6ee00231c2c742ad05483df5334cab3b52fda3ba38e6a07059c4563dbc2",
    "voice_styles/F2.json": "7c722c6a72707b1a77f035d67f0d1351ba187738e06f7683e8c72b1df3477fc6",
    "voice_styles/F3.json": "12f6ef2573baa2defa1128069cb59f203e3ab67c92af77b42df8a0e3a2f7c6ab",
    "voice_styles/F4.json": "c2fa764c1225a76dfc3e2c73e8aa4f70d9ee48793860eb34c295fff01c2e032b",
    "voice_styles/F5.json": "45966e73316415626cf41a7d1c6f3b4c70dbc1ba2bee5c1978ef0ce33244fc8d",
    "voice_styles/M1.json": "e35604687f5d23694b8e91593a93eec0e4eca6c0b02bb8ed69139ab2ea6b0a5b",
    "voice_styles/M2.json": "b76cbf62bac707c710cf0ae5aba5e31eea1a6339a9734bfae33ab98499534a50",
    "voice_styles/M3.json": "ea1ac35ccb91b0d7ecad533a2fbd0eec10c91513d8951e3b25fbba99954e159b",
    "voice_styles/M4.json": "ca8eefad4fcd989c9379032ff3e50738adc547eeb5e221b82593a6d7b3bac303",
    "voice_styles/M5.json": "dd22b92740314321f8ae11c5e87f8dd60d060f15dd3a632b5adf77f471f77af2",
}
SUPERTONIC = {
    f"https://huggingface.co/Supertone/supertonic-3/resolve/{SUPERTONIC_REV}/{name}": (name, digest)
    for name, digest in SUPERTONIC_FILES.items()
}

MOTOR = (os.environ.get("EVKLID_GLAS_MOTOR") or "supertonic").strip().lower()
DIR = os.environ.get("EVKLID_GLAS_MODEL_DIR") or os.path.join(os.path.dirname(os.path.abspath(__file__)), "model", MOTOR)


def sha(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def main():
    files = {"piper": PIPER, "supertonic": SUPERTONIC}.get(MOTOR)
    if files is None:
        sys.exit(f"neznan motor glasu: {MOTOR}")
    for url, (name, want) in files.items():
        path = os.path.join(DIR, name)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        if os.path.exists(path) and sha(path) == want:
            continue
        tmp = path + ".del"
        urllib.request.urlretrieve(url, tmp)
        got = sha(tmp)
        if got != want:
            os.remove(tmp)
            sys.exit(f"{name}: napačna zgoščena vrednost {got}")
        os.replace(tmp, path)
    print("glas", MOTOR, "pripravljen v", DIR)


if __name__ == "__main__":
    main()
