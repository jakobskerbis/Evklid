"""Ikone vej za drevo »3D svet« (Blender Cycles, path tracing), v vseh slogih Evklida.

Zagon (Blender 4.2+ / 5.x), iz mape s skriptami:
  IKONE_GLB=<repo>/public/3d/modeli IKONE_TELO=<mapa z razširjenimi koza/okostje/organi/zile.glb> \
  blender -b -P ikone.py -- --id telo,glava --slog cist,antik --izhod <mapa> [--vzorci 128] [--niti 1] [--velikost 768]

Za vsak id in slog zapiše <izhod>/<slog>/<id>.png (motiv), <id>-senca.png (samo senca) in <id>.blend.
v-webp.py iz njiju naredi <id>.webp 512×512 (senca omejena z mehko elipso).
Slogi: cist (barve skupin; velja tudi za Igriv), antik, renesansa, bagdad, indija, egipt.
telo/koza.glb, okostje.glb, organi.glb in zile.glb so v repozitoriju stisnjeni z meshopt (uvoznik v Blenderju
tega ne zna): razširi jih z
  npx @gltf-transform/cli@4.1.1 copy public/3d/modeli/telo/koza.glb <mapa>/koza.glb   (enako za ostale tri)
Vse ikone vseh slogov naenkrat: scripts/3d-ikone-drevo/izrisi.sh (glej docs/3d.md »Ikone vej drevesa«).
Na RTX se samodejno uporabi OptiX (sicer CUDA, sicer CPU).
"""
import bpy, sys, os, argparse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import jedro as J
import motivi as M


def izdelaj(ident, slog, izhod, vzorci, niti, velikost):
    J.pocisti()
    J.SLOG = slog
    skupina, fn, delez = M.MOTIVI[ident]
    J.SK = skupina
    J.nastavi_render(vzorci, niti, velikost)
    J.svet()
    J.studio()
    cam = J.kamera()
    J.KOREN = bpy.data.objects.new("Motiv", None)
    bpy.context.scene.collection.objects.link(J.KOREN)
    fn()
    zmin, zmax = J.uokviri(cam, delez)
    t = J.tla(zmin, zmax - zmin)
    sc = bpy.context.scene
    mapa = os.path.join(izhod, slog)
    os.makedirs(mapa, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(mapa, ident + ".blend"))
    t.hide_render = True
    sc.render.filepath = os.path.join(mapa, ident + ".png")
    bpy.ops.render.render(write_still=True)
    # samo senca: motiv je kameri neviden, a meče senco na lovilec senc
    t.hide_render = False
    for o in sc.objects:
        if o.type in ("MESH", "CURVE", "META") and o is not t:
            o.visible_camera = False
    sc.cycles.samples = max(16, sc.cycles.samples // 4)
    sc.render.filepath = os.path.join(mapa, ident + "-senca.png")
    bpy.ops.render.render(write_still=True)
    print("IKONE gotovo:", slog, ident, flush=True)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    ap = argparse.ArgumentParser()
    ap.add_argument("--id", default=",".join(M.MOTIVI))
    ap.add_argument("--slog", default="cist")
    ap.add_argument("--izhod", default="ikone-izhod")
    ap.add_argument("--vzorci", type=int, default=128)
    ap.add_argument("--niti", type=int, default=0)
    ap.add_argument("--velikost", type=int, default=768)
    ap.add_argument("--preskoci", action="store_true", help="preskoči že izrisane")
    a = ap.parse_args(argv)
    izhod = os.path.abspath(a.izhod)
    napake = []
    for slog in a.slog.split(","):
        for ident in a.id.split(","):
            ident = ident.strip()
            if a.preskoci and os.path.exists(os.path.join(izhod, slog, ident + "-senca.png")):
                continue
            try:
                izdelaj(ident, slog, izhod, a.vzorci, a.niti, a.velikost)
            except Exception as e:
                import traceback
                traceback.print_exc()
                print("IKONE napaka:", slog, ident, e, flush=True)
                napake.append(f"{slog}/{ident}")
    if napake:  # z --python-exit-code 1 Blender konča z 1, izrisi.sh se ustavi pred pretvorbo
        raise SystemExit("IKONE neuspešne: " + ", ".join(napake))


main()
