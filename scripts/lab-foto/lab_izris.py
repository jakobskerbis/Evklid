# Fotorealistični laboratorij: izris slojev enega poskusa v Blenderju (Cycles).
#   blender -b --factory-startup --python lab_izris.py -- <poskus> <izhodna mapa> [--vzorci 512] [--merilo 2]
#       [--naprava OPTIX|CUDA|CPU] [--sloji ime1,ime2] [--blend] [--niti N]
# Izhod: <mapa>/<sloj>.png (sRGB, pogled Standard; debelina: surove vrednosti exp(−L/Lref)) in <mapa>/meta.json
# (sidra, izrezi, merila). Napredek: vrstice »LAB-SLOJ i/n ime sekund«. Ponovni zagon preskoči že izrisane sloje.
import json, os, sys, time
import bpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lab_modeli as M
import lab_prizori as P


def arg(ime, privzeto=None):
    a = sys.argv[sys.argv.index("--") + 1:]
    return a[a.index(ime) + 1] if ime in a else privzeto


def nastavi_cycles(scene, naprava, vzorci, niti):
    scene.render.engine = "CYCLES"
    c = scene.cycles
    if naprava != "CPU":
        pr = bpy.context.preferences.addons["cycles"].preferences
        pr.compute_device_type = naprava
        pr.get_devices()
        for d in pr.devices:
            d.use = d.type == naprava
        c.device = "GPU"
    else:
        c.device = "CPU"
    if niti:
        scene.render.threads_mode = "FIXED"; scene.render.threads = niti
    c.samples = vzorci
    c.use_adaptive_sampling = True; c.adaptive_threshold = 0.01 if vzorci >= 256 else 0.03
    c.use_denoising = True
    try:
        c.denoiser = "OPTIX" if naprava == "OPTIX" else "OPENIMAGEDENOISE"
        c.denoising_input_passes = "RGB_ALBEDO_NORMAL"
    except Exception:
        pass
    c.max_bounces = 32; c.transmission_bounces = 32; c.glossy_bounces = 12; c.diffuse_bounces = 4; c.transparent_max_bounces = 32; c.volume_bounces = 0
    c.caustics_refractive = True; c.caustics_reflective = True; c.blur_glossy = 0.3
    c.sample_clamp_indirect = 12.0
    scene.render.film_transparent = False
    scene.view_settings.view_transform = "Standard"; scene.view_settings.look = "None"
    scene.view_settings.exposure = 0.0; scene.view_settings.gamma = 1.0
    scene.render.image_settings.file_format = "PNG"; scene.render.image_settings.color_mode = "RGBA"; scene.render.image_settings.color_depth = "8"
    scene.render.image_settings.compression = 60
    scene.render.dither_intensity = 0.5


def main():
    a = sys.argv[sys.argv.index("--") + 1:]
    poskus, mapa = a[0], a[1]
    vzorci = int(arg("--vzorci", "256")); merilo = int(arg("--merilo", "2")); naprava = (arg("--naprava", "CPU") or "CPU").upper()
    samo = arg("--sloji"); niti = int(arg("--niti", "0"))
    os.makedirs(mapa, exist_ok=True)
    scene = M.pocisti()
    nastavi_cycles(scene, naprava, vzorci, niti)
    pr = P.PRIZORI[poskus]()
    for p in pr["pogledi"]:
        p.kamera(scene)
    svet = scene.world
    bel = bpy.data.worlds.new("bel"); bel.use_nodes = True
    bel.node_tree.nodes["Background"].inputs[0].default_value = (1, 1, 1, 1); bel.node_tree.nodes["Background"].inputs[1].default_value = 1.0
    zbirke = [c for c in scene.collection.children]
    sloji = pr["sloji"]
    meta = pr["meta"]; meta["sloji"] = {}; meta["merilo"] = merilo; meta["vzorci"] = vzorci; meta["blender"] = bpy.app.version_string
    if "--blend" in a:
        bpy.ops.wm.save_as_mainfile(filepath=os.path.join(mapa, poskus + ".blend"))
    for i, s in enumerate(sloji, 1):
        Pg = s["pogled"]; vrsta = s.get("vrsta", "slika")
        x0, y0, x1, y1 = s.get("izrez") or (0, 0, Pg.W, Pg.H)
        meta["sloji"][s["ime"]] = dict(okno=Pg.ime, x=x0, y=y0, w=x1 - x0, h=y1 - y0, vrsta=vrsta)
        pot = os.path.join(mapa, s["ime"] + ".png")
        if (samo and s["ime"] not in samo.split(",")) or (os.path.exists(pot) and not samo and "--znova" not in a):
            continue
        t0 = time.time()
        lovilci = set(s.get("lovilci", []))
        for c in zbirke:
            c.hide_render = c.name not in s["vidno"] and c.name not in lovilci
            for o in c.objects:
                o.is_shadow_catcher = c.name in lovilci
        scene.camera = Pg.predmet
        r = scene.render
        r.resolution_x = Pg.W * merilo; r.resolution_y = Pg.H * merilo; r.resolution_percentage = 100
        r.use_border = True; r.use_crop_to_border = True
        r.border_min_x = x0 / Pg.W; r.border_max_x = x1 / Pg.W; r.border_min_y = 1 - y1 / Pg.H; r.border_max_y = 1 - y0 / Pg.H
        if vrsta == "debelina":
            scene.world = bel; scene.cycles.samples = 16; scene.cycles.use_denoising = False
            scene.view_settings.view_transform = "Raw"; r.film_transparent = False
        else:
            scene.world = svet; scene.cycles.samples = max(16, int(vzorci * s.get("vzorci", 1.0))); scene.cycles.use_denoising = True
            scene.view_settings.view_transform = "Standard"; r.film_transparent = vrsta == "prosojno"
        r.filepath = pot
        bpy.ops.render.render(write_still=True)
        print(f"LAB-SLOJ {i}/{len(sloji)} {s['ime']} {time.time() - t0:.0f}", flush=True)
    with open(os.path.join(mapa, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=1)
    print("LAB-KONEC " + poskus, flush=True)


main()
