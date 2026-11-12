# Profil linea aspera: prerezi pri t = 0,35 … 0,65; r(θ) okoli središča prereza, θ = 0 zadaj (+ lateralno).
# Osnova = Fourier do 3. harmonika, prilegan zunaj |θ| < 40°; višina grebena = največji ostanek pri |θ| < 30°,
# širina = FWHM ostanka (mm po obodu); nagib = največji nagib boka (°), vdolbina = najgloblja vdolbina med vrhovoma
# na |s| < 5 mm (mm; > 0,05 = »žleb« po sredini), ukrivljenost vrha (1/mm; ≈ 0 = ravna planota).
# python3 greben_profil.py [--profil] <ime=pot.ply|json> …  (--profil: še ostanek pri t = 0,5 po 1 mm, s = −8 … +8 mm)
import sys, json, numpy as np
sys.path.insert(0, __import__("os").path.dirname(__import__("os").path.abspath(__file__)))
import kost
PROFIL = "--profil" in sys.argv
for arg in [x for x in sys.argv[1:] if not x.startswith("--")]:
    ime, pot = arg.split("=")
    if pot.endswith(".json"):
        V, F, _, _ = kost.beri_vir(pot)
    else:
        V, F, _ = kost.beri_ply(pot)
    P, _ = kost.vzorec(V, F, 400000)
    o = kost.okvir_stegnenice(P, "l"); t = o["t"]; zad, lat, os_ = -o["spr"], -o["med"], o["os"]
    vrst = []
    for tt in (0.35, 0.45, 0.5, 0.55, 0.65):
        s = np.abs(t - tt) < 0.0025
        Q = P[s]; c = Q.mean(0); rel = Q - c; rel -= np.outer(rel @ os_, os_)
        r = np.linalg.norm(rel, axis=1); th = np.arctan2(rel @ lat, rel @ zad)
        b = np.linspace(-np.pi, np.pi, 181); idx = np.digitize(th, b) - 1
        rb = np.array([r[idx == k].max() if (idx == k).any() else np.nan for k in range(180)])
        tb = (b[:-1] + b[1:]) / 2; ok = ~np.isnan(rb)
        fit = ok & (np.abs(tb) > np.radians(40))
        A = np.stack([np.ones_like(tb)] + [f(k * tb) for k in (1, 2, 3) for f in (np.cos, np.sin)], 1)
        cf, *_ = np.linalg.lstsq(A[fit], rb[fit], rcond=None)
        res = rb - A @ cf
        okn = ok & (np.abs(tb) < np.radians(30))
        h = np.nanmax(np.where(okn, res, np.nan)); k0 = np.nanargmax(np.where(okn, res, -1))
        nad = okn & (res > h / 2)
        # FWHM v mm (zvezni del okoli vrha)
        L = k0; R = k0
        while L - 1 >= 0 and nad[L - 1]: L -= 1
        while R + 1 < 180 and nad[R + 1]: R += 1
        w = (R - L + 1) * np.radians(2) * np.nanmean(rb[L:R + 1])
        # oblika okoli vrha: s (mm po obodu od vrha), ostanek zglajen čez 3 koše (2° ≈ 0,5 mm)
        sm = np.convolve(np.nan_to_num(res), np.ones(3) / 3, mode="same")
        s_mm = (tb - tb[k0]) * np.nanmean(rb[L:R + 1]) * 1000
        blizu = ok & (np.abs(s_mm) < 8)
        nag = np.degrees(np.arctan(np.nanmax(np.abs(np.gradient(sm, s_mm / 1000))[blizu])))
        v5 = ok & (np.abs(s_mm) < 5)
        y = sm[v5]  # »voda«, ki bi ostala v vdolbini med vrhovoma (0 = en sam izbočen vrh)
        dol = float(np.max(np.minimum(np.maximum.accumulate(y), np.maximum.accumulate(y[::-1])[::-1]) - y)) if len(y) else 0.0
        c3 = v5 & (np.abs(s_mm) < 1.6)
        uk = np.polyfit(s_mm[c3], sm[c3] * 1000, 2)[0] * 2 if c3.sum() >= 3 else np.nan
        vrst.append(f"t={tt:.2f}: h={h*1000:.2f} mm, FWHM={w*1000:.1f} mm, θ={np.degrees(tb[k0]):+.0f}°, nagib {nag:.0f}°, "
                    f"vdolbina {dol*1000:.2f} mm, ukr. vrha {uk:+.2f}/mm")
        if PROFIL and tt == 0.5:
            prof = [f"{np.interp(x, s_mm[ok], sm[ok]) * 1000:+.1f}" for x in range(-8, 9)]
            vrst.append("profil −8…+8 mm: " + " ".join(prof))
    print(f"{ime}:\n  " + "\n  ".join(vrst))
