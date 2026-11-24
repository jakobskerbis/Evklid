# Zagon lab_izris.py z Blenderjem kot Pythonovim modulom (pip »bpy«) namesto programa blender:
#   <python z bpy> scripts/lab-foto/bpy_zagon.py <poskus> <mapa> [--vzorci 32] [--merilo 1] [--niti 2] …
# je enako kot  blender -b --factory-startup --python scripts/lab-foto/lab_izris.py -- <poskus> <mapa> …
# (lab_izris.py bere argumente za »--« iz sys.argv; pot z ukazom blender ostane nespremenjena).
import os, runpy, sys

TU = os.path.dirname(os.path.abspath(__file__))
izris = os.path.join(TU, "lab_izris.py")
sys.argv = ["blender", "-b", "--factory-startup", "--python", izris, "--"] + sys.argv[1:]
runpy.run_path(izris, run_name="__main__")
