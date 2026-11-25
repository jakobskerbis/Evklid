#!/usr/bin/env python3
# Zagon lab_izris.py brez programa Blender, z modulom bpy (pip install bpy; npr. /home/claude/bpyenv/bin/python):
#   python bpy_zagon.py -- <poskus> <izhodna mapa> [--vzorci 64] [--merilo 1] [--niti 1]
# Argumenti so isti kot pri »blender -b --python lab_izris.py -- …« (ta pot ostane glavna, npr. na RTX).
import os, runpy, sys

TU = os.path.dirname(os.path.abspath(__file__))
a = sys.argv[1:]
sys.argv = ["blender", "--"] + (a[a.index("--") + 1:] if "--" in a else a)
sys.path.insert(0, TU)
runpy.run_path(os.path.join(TU, "lab_izris.py"), run_name="__main__")
