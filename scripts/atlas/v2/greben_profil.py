# Profil linea aspera: prerezi pri t = 0,35 … 0,65; r(θ) okoli središča prereza, θ = 0 zadaj (+ lateralno).
# Osnova = Fourier do 3. harmonika, prilegan zunaj |θ| < 40°; višina grebena = največji ostanek pri |θ| < 30°,
# širina = FWHM ostanka (mm po obodu). python3 greben_profil.py <ime=pot.ply|json> …
import sys, json, numpy as np
sys.path.insert(0, __import__("os").path.dirname(__import__("os").path.abspath(__file__)))
import kost
for arg in sys.argv[1:]:
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
        vrst.append(f"t={tt:.2f}: h={h*1000:.2f} mm, FWHM={w*1000:.1f} mm, θ={np.degrees(tb[k0]):+.0f}°")
    print(f"{ime}: " + " | ".join(vrst))
