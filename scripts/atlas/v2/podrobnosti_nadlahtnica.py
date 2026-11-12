# Atlas v2: anatomske podrobnosti NADLAHTNICE (Humerus.l/.r) za postopek.py. Ni samostojen modul: postopek.py izvede
# odseke (»# %% <ime>«) v svojem imenskem prostoru (glej podrobnosti_stegnenica.py za seznam, kaj mora kateri odsek
# določiti). Vir: BodyParts3D FMA23131 (bp3d_vir.py, zunanja lupina), ki že ima pravo obliko glavice, obeh tuberklov,
# sulkusa, deltoidne grčavine, epikondilov, capituluma, trohleje in fos. Zato tu (nauki stegnenice v3s3–v4s3):
#   * zaupamo viru: makro dodatki so majhni (≤ 1 mm) in le široki izbočeni hribi ali plitve široke vdolbine (σ ≥ 2,6 mm;
#     ozki grebeni σ ≤ 1,2 mm se berejo kot vrezane črte); poti grebenov in žlebov sledijo viru (sledi), ne učbeniški skici;
#   * pripoji niso temnejši (temna proga = žleb), le hrapavejši in za odtenek svetlejši (postopek, barva);
#   * meja hrustanca (glavica, capitulum, trohlea) je zglajena v 3D in hrustanec pojema v ~4 mm (dvig1);
#   * drobni artefakti vira (razpokan šiv epifizne črte okoli anatomskega vratu, kapljice na diafizi, grbica v fossa
#     olecrani) so zglajeni le tam, kjer odstopajo od zglajene površine (cistost), ne povsod.
import numpy as np  # noqa: F401  (samo za orodja za preverjanje; postopek ima svoj np)

# %% makro
o1 = kost.okvir_stegnenice(G1, STRAN)  # splošen okvir dolge kosti (os = PCA, proksimalno gor; medialno, spredaj)
t1, os_, med, spr = o1["t"], o1["os"], o1["med"], o1["spr"]
L = o1["dolzina_os"]
mer1, lm1 = kost.mere_nadlahtnice(G1, GF1, STRAN, hr1 > 0.5)
osd = lm1["os_diafize"]
zad, lat = -spr, -med
c0 = G1.mean(0)
_, _, r1, th1 = polarno(G1, osd, c0, zad, lat)  # θ = 0 zadaj, +90° lateralno, ±180° spredaj, −90° medialno
mlg = (G1 - c0) @ med
fov_p = np.zeros(len(G1))  # nadlahtnica nima gole kosti sredi hrustanca (stegnenica: fovea capitis)


def sledi(t_od, t_do, th0, okno, znak=1, korakov=14):
    """Pot grebena (znak +1) ali žleba (−1) VIRA od t_od do t_do: pri vsakem t θ največjega ostanka polmera (po odštetem
    linearnem trendu v oknu ±okno° okoli θ prejšnjega koraka), dušeno in zglajeno. Vrne (t, θ v stopinjah)."""
    ts = np.linspace(t_od, t_do, korakov); ths = []; th = th0
    for tq in ts:
        x = np.degrees(kotna(th1 - np.radians(th)))
        s = (np.abs(t1 - tq) < 0.004) & (np.abs(x) < okno)
        if s.sum() >= 8:
            A = np.c_[np.ones(s.sum()), x[s]]
            cf, *_ = np.linalg.lstsq(A, r1[s], rcond=None)
            th = th + 0.7 * x[s][np.argmax(znak * (r1[s] - A @ cf))]
        ths.append(th)
    ths = np.array(ths); k = 2
    ths = np.convolve(np.r_[[ths[0]] * k, ths, [ths[-1]] * k], np.ones(2 * k + 1) / (2 * k + 1), mode="valid")
    return ts, ths


def pot(ts, ths):
    return [tocka(a, b) for a, b in zip(ts, ths)]


# ---- mejniki ----
hc, R = lm1["glavica"]
a_gl = lm1["os_glavice"]  # od središča krogle proti sredini hrustanca glavice (medialno, gor, nazaj)
d_h1 = np.linalg.norm(G1 - hc, axis=1)
u_h1 = (G1 - hc) / d_h1[:, None]
gt = najbolj((t1 > 0.86) & (u_h1 @ a_gl < 0.2), lat + 0.6 * os_)    # vrh velikega tuberkla (lateralno zgoraj)
lt = najbolj((t1 > 0.84) & (t1 < 0.95) & (u_h1 @ a_gl < 0.3), spr)  # mali tuberkel (spredaj)
t_gt, t_lt = float(t1[np.argmin(np.linalg.norm(G1 - gt, axis=1))]), float(t1[np.argmin(np.linalg.norm(G1 - lt, axis=1))])
# kirurški vrat: najožji prerez pod tuberkloma (t 0,72–0,86)
_tt = np.linspace(0.72, 0.86, 15)
_pp = [np.median(r1[np.abs(t1 - x) < 0.004]) for x in _tt]
t_kv = float(_tt[int(np.argmin(_pp))])

# ---- sklepni hrustanec: glavica (meja po azimutu okoli osi glavice iz vira, krožno zglajena) ----
hr_b = hr1.copy()
e1 = spr - a_gl * (a_gl @ spr); e1 /= np.linalg.norm(e1)
e2 = np.cross(a_gl, e1)
alfa = np.arccos(np.clip(u_h1 @ a_gl, -1, 1)); fi_h = np.arctan2(u_h1 @ e2, u_h1 @ e1)
glava_obm = (d_h1 < 1.5 * R) & (alfa < np.radians(110)) & (t1 > 0.75)
kosi = np.linspace(-np.pi, np.pi, 25)
a_m = []
for k in range(24):
    s_ = glava_obm & (hr1 > 0.5) & (fi_h >= kosi[k]) & (fi_h < kosi[k + 1])
    a_m.append(np.percentile(alfa[s_], 95) if s_.sum() > 5 else np.nan)
a_m = np.array(a_m); a_m[np.isnan(a_m)] = np.nanmedian(a_m)
a_m = np.convolve(np.r_[a_m[-2:], a_m, a_m[:2]], np.ones(5) / 5, mode="valid")  # krožno glajenje (ena gladka obroba)
sred_k = (kosi[:-1] + kosi[1:]) / 2
a_meja = np.interp(fi_h, np.r_[sred_k - 2 * np.pi, sred_k, sred_k + 2 * np.pi], np.r_[a_m, a_m, a_m])
hr_b[glava_obm] = (alfa[glava_obm] < a_meja[glava_obm]).astype(float)
hr_b[(t1 > 0.7) & ~glava_obm] = 0.0
print("[v2] glava: meja vira (st)", np.degrees(a_m).round(0).tolist(), flush=True)
# distalno: capitulum in trohlea; zapiranje (razširi 2,5 mm, nato skrči) zapre ozko golo progo vira med njima
# (v resnici je hrustanec čez žleb med capitulumom in trohleo neprekinjen)
dist_h = t1 < 0.3
zap = (dif3d(hr_b * dist_h, 2.5e-3) > 0.22).astype(float)
zap = (dif3d(zap, 2.5e-3) > 0.78).astype(float)
hr_b = np.where(dist_h, np.maximum(hr_b, zap), hr_b)
# zglajen obris (meja = izolinija 0,5) v 3D: glavica σ 3 mm, komolec σ 4 mm (vir ima stopničaste meje)
w_d = smooth(0.35, 0.25, t1)
hr_s1 = dif3d(hr_b, 3.0e-3) * (1 - w_d) + dif3d(hr_b, 4.0e-3) * w_d
dvig1 = smooth(0.5, 0.97, dif3d((smooth(0.3, 0.7, hr_s1) > 0.5).astype(float), 2.0e-3))  # dvig pojema v ~4 mm
cart1 = smooth(0.3, 0.7, hr_s1)
cart_m = np.clip(dif3d(cart1, 2.5e-3), 0, 1)

# ---- čistost vira: drobni artefakti (razpokan šiv epifizne črte okoli anatomskega vratu, kapljice na diafizi, grbica
# v fossa olecrani). Na G1 jih ne vidimo več dobro (voxel + glajenje), zato jih iščemo na viru: ploskev, katere normala
# odstopa > 28° od povprečne normale v krogli 2,5 mm (gladka kost vira: mediana 3–5°, razpoke 45–160°)
fn_v = np.cross(izvor_V[izvor_F[:, 1]] - izvor_V[izvor_F[:, 0]], izvor_V[izvor_F[:, 2]] - izvor_V[izvor_F[:, 0]])
A_v = np.linalg.norm(fn_v, axis=1); fn_v = fn_v / np.maximum(A_v, 1e-18)[:, None]
c_v = izvor_V[izvor_F].mean(1)
kd_v = KDTree(len(c_v))
for i, p in enumerate(c_v):
    kd_v.insert(p.tolist(), i)
kd_v.balance()
dev_v = np.zeros(len(c_v))
for i, p in enumerate(c_v):
    nb = [j for _, j, _ in kd_v.find_range(p.tolist(), 2.5e-3)]
    m_ = (fn_v[nb] * A_v[nb, None]).sum(0)
    dev_v[i] = np.degrees(np.arccos(np.clip(fn_v[i] @ m_ / max(np.linalg.norm(m_), 1e-18), -1, 1)))
art_f = (dev_v > 28).astype(float)
art_v = np.array([art_f[bvh.find_nearest(p)[2]] for p in v_blender(G1)])
w_art = smooth(0.04, 0.2, dif3d(art_v, 2.5e-3))
del kd_v
print(f"[v2] artefakti vira: {int(art_f.sum())} ploskev (> 28°), utež > 0,5 na {int((w_art > 0.5).sum())} ogliščih G1", flush=True)

# ---- relief (broad convex only; vsi σ ≥ 2,6 mm, višine ≤ 1 mm) ----
# intertuberkularni žleb in njegova grebena (crista tuberculi majoris → sprednji krak deltoidne grčavine; crista
# tuberculi minoris), poti iz vira
ts_s, th_s = sledi(0.90, 0.72, 150.0, 22, -1)
ts_cma, th_cma = sledi(0.88, 0.70, 122.0, 16, +1)
ts_cmi, th_cmi = sledi(0.87, 0.70, 215.0, 18, +1)
greben("sulcus_intertubercularis", pot(ts_s, th_s), -0.75e-3, 3.0e-3, 0.0, (0.15, 0.35))
greben("crista_tuberculi_majoris", pot(ts_cma, th_cma), 0.6e-3, 2.8e-3, 0.7, (0.2, 0.25))
greben("crista_tuberculi_minoris", pot(ts_cmi, th_cmi), 0.5e-3, 2.8e-3, 0.7, (0.2, 0.3))
# deltoidna grčavina: V na anterolateralni strani (vir: izbočen pas pri θ 120–150°, t 0,5–0,6); dva široka kraka in
# široka nizka kupola v sredini, hrapava
ts_dt, th_dt = sledi(0.64, 0.50, 132.0, 25, +1)
vrh_dt = tocka(0.50, th_dt[-1])
greben("tuberositas_deltoidea_spredaj", [tocka(0.66, th_dt[0] + 12)] + [tocka(x, y + 6 * (x - 0.5) / 0.16) for x, y in zip(ts_dt[1:], th_dt[1:])],
       0.8e-3, 3.2e-3, 0.9, (0.25, 0.1))
greben("tuberositas_deltoidea_zadaj", [tocka(0.66, th_dt[0] - 28), tocka(0.60, th_dt[0] - 20), tocka(0.55, th_dt[-1] - 10), vrh_dt],
       0.8e-3, 3.2e-3, 0.9, (0.25, 0.1))
izboklina(tocka(0.565, th_dt[len(th_dt) // 2] - 8), 14e-3, 0.5e-3, 0.9, 2.0)
# sulcus nervi radialis: plitev širok poševen žleb zadaj → lateralno pod deltoidno grčavino (pot vira)
ts_rg, th_rg = sledi(0.62, 0.40, 30.0, 28, -1)
greben("sulcus_nervi_radialis", pot(ts_rg, th_rg), -0.45e-3, 4.0e-3, 0.0, (0.25, 0.25))
# suprakondilarna grebena (lateralni izrazitejši), poti vira; nizka in široka (vir ju že ima kot robova)
ts_sl, th_sl = sledi(0.13, 0.34, 70.0, 20, +1)
ts_sm, th_sm = sledi(0.13, 0.28, -90.0, 20, +1)
greben("crista_supracondylaris_lateralis", pot(ts_sl, th_sl), 0.45e-3, 2.8e-3, 0.8, (0.1, 0.35))
greben("crista_supracondylaris_medialis", pot(ts_sm, th_sm), 0.3e-3, 2.8e-3, 0.7, (0.1, 0.35))
# anatomski vrat: plitva široka vdolbina tik zunaj meje hrustanca glavice (vir: razpokan šiv)
d_meja = alfa - a_meja
vrat_a = glava_obm * gauss(R * d_meja - 3.0e-3, 2.6e-3) * (1 - cart_m)
hp_m -= 0.35e-3 * vrat_a
# fose nad trohleo in capitulumom: vir jih ima; le malo poglobimo (najglobljo točko poiščemo v viru)
dist_k = (t1 > 0.05) & (t1 < 0.16) & (cart1 < 0.1) & (dif3d(cart1, 5.0e-3) > 0.04)  # tik nad hrustancem
hr_d = (t1 < 0.12) & (hr1 > 0.5)
ml_hr = mlg[hr_d]
ml_zleb = float(np.percentile(ml_hr, 40))  # približna meja trohlea (medialno) / capitulum (lateralno)
troh = dist_k & (mlg > ml_zleb + 2e-3) & (mlg < ml_hr.max() - 4e-3)
capm = dist_k & (mlg < ml_zleb - 2e-3) & (mlg > ml_hr.min() + 4e-3)


def najglobje(maska, smer):
    """Najgloblja točka jame: najmanjša višina v smeri »smer« glede na okolico (višina − 3D povprečje v ~6 mm)."""
    v = (G1 - c0) @ smer
    rel = v - dif3d(v, 6.0e-3)
    s = maska & (N1 @ smer > 0.3)
    i = np.where(s)[0]
    return G1[i[np.argmin(rel[i])]] if len(i) else None


f_cor = najglobje(troh, spr); f_rad = najglobje(capm, spr); f_ole = najglobje(troh | ((t1 > 0.06) & (t1 < 0.17) & (np.abs(mlg - ml_zleb) < 4e-3)), zad)
for c_, rr_, h_ in ((f_cor, 8e-3, -0.6e-3), (f_rad, 6e-3, -0.45e-3), (f_ole, 11e-3, -0.6e-3)):
    if c_ is not None:
        izboklina(c_, rr_, h_, 0.0, 2.0)
# epikondila: hrapava (pripoji); obliko ima vir
epi_med = najbolj((t1 < 0.16) & (cart1 < 0.2), med); epi_lat = najbolj((t1 < 0.16) & (cart1 < 0.2), lat)
for c_, rr_ in ((epi_med, 9e-3), (epi_lat, 8e-3)):
    np.maximum(hrap1, 0.7 * smooth(0.0, 0.6, np.clip(1 - (np.linalg.norm(G1 - c_, axis=1) / rr_) ** 2, 0, 1)), out=hrap1)
# tuberkla: hrapava
for c_, rr_ in ((gt, 16e-3), (lt, 9e-3)):
    np.maximum(hrap1, 0.6 * smooth(0.0, 0.6, np.clip(1 - (np.linalg.norm(G1 - c_, axis=1) / rr_) ** 2, 0, 1)) * (1 - cart_m), out=hrap1)

# ---- oblika: najprej čistost vira, nato glajenje sklepnih ploskev, nato relief ----
G1d = taubin(G1, w_art, 3.5e-3)  # artefakti vira (šiv, kapljice)
# šiv epifizne črte proksimalno ni le razpoka, ampak tudi stopnica (~0,5 mm) med epifizo in diafizo: v pasu ~5 mm okoli
# šiva (t > 0,8) zgladimo širše (~5 mm), stran od hrustanca glavice (njegov rob gladi w_rob spodaj)
w_siv = smooth(0.03, 0.15, dif3d(art_v * (t1 > 0.8), 4.0e-3)) * (1 - cart_m)
G1d = taubin(G1d, w_siv, 5.0e-3)
w_hr = smooth(0.05, 0.6, dif3d(cart1, 4.0e-3))
G1d = taubin(G1d, w_hr, 3.0e-3)  # sklepne ploskve brez grobih ploskev vira, utež mehko pojema (brez stopnice na meji)
if f_ole is not None:  # grbica vira v fossa olecrani
    G1d = taubin(G1d, smooth(14e-3, 7e-3, np.linalg.norm(G1 - f_ole, axis=1)), 3.0e-3)
G1d = G1d + N1 * hp_m[:, None]
# glavica: na hrustancu pol poti proti krogli (vir ima grbine < 1,5 mm); rob hrustanca (šiv) v pasu 30° okoli meje
# zglajen kot radialni odmik od krogle v 3D (σ 2,5 mm) – gladek prehod v anatomski vrat
kapa = cart1 * glava_obm * smooth(np.radians(-6), np.radians(-14), d_meja)
d_h1 = np.linalg.norm(G1d - hc, axis=1); u_h1 = (G1d - hc) / d_h1[:, None]
odst = d_h1 - R
polni = -0.5 * kapa * odst * smooth(2.0e-3, 1.0e-3, np.abs(odst))
w_rob = glava_obm * smooth(np.radians(-24), np.radians(-14), d_meja) * smooth(np.radians(22), np.radians(12), d_meja)
odm_s = dif3d(np.where(d_h1 < 1.5 * R, odst, 0.0), 2.5e-3)
nov_r = d_h1 + polni
nov_r = np.where(w_rob > 1e-3, nov_r * (1 - w_rob) + (R + odm_s) * w_rob, nov_r)
gl_ = (kapa > 0) | (w_rob > 1e-3)
G1d[gl_] = hc + u_h1[gl_] * nov_r[gl_][:, None]
crte_poti = {"sulkus_theta_st": [round(float(x), 0) for x in th_s], "deltoidna_theta_st": [round(float(x), 0) for x in th_dt],
             "radialni_zleb_theta_st": [round(float(x), 0) for x in th_rg]}
print(f"[v2] makro: R {R*1000:.1f} mm, t_gt {t_gt:.3f}, t_lt {t_lt:.3f}, kirurški vrat t {t_kv:.3f}; poti {crte_poti}; "
      f"fose {[None if x is None else round(float(t1[np.argmin(np.linalg.norm(G1 - x, axis=1))]), 3) for x in (f_cor, f_rad, f_ole)]}; "
      f"izboklina {hp_m.max()*1000:.2f} mm, vdolbina {hp_m.min()*1000:.2f} mm, glava zglajena {int(gl_.sum())} oglišč", flush=True)

# %% hrapavost
mer_g, lm = kost.mere_nadlahtnice(G, GF, STRAN, hr > 0.5)
d_gt = np.linalg.norm(G - gt, axis=1)
d_lt = np.linalg.norm(G - lt, axis=1)
hrap = np.maximum(hrap, np.maximum(gauss(d_gt, 11e-3) * 0.6, gauss(d_lt, 6e-3) * 0.6) * kompakta)
ml = (G - c0) @ med
epi = (t < 0.16) * kompakta * smooth(0.75, 0.95, np.abs(ml) / np.abs(ml[t < 0.16]).max())
hrap = np.maximum(hrap, epi * 0.6)

# %% odprtine
# Hranilna odprtina: anteromedialno malo pod sredino, kanal usmerjen distalno (proti komolcu): jamica z brazdo navzdol
t_f = 0.43
th_f = np.radians(-125.0)
s_f = kotna(theta - th_f) * r
v_f = (t - t_f) * L
jamica = gauss(s_f, 0.5e-3) * gauss(v_f, 0.8e-3)
brazda = gauss(s_f, 0.45e-3) * gauss(v_f + 2.6e-3, 2.2e-3) * (v_f < 0)
hp -= 1.2e-3 * jamica + 0.25e-3 * brazda
hranilna = smooth(0.25, 0.8, jamica)
_hi = int(np.argmax(jamica))
print(f"[v2] hranilna odprtina: t {t[_hi]:.3f}, θ {np.degrees(theta[_hi]):.0f}°, medialno {((G[_hi] - c0) @ med)*1000:.1f} mm, "
      f"spredaj {((G[_hi] - c0) @ spr)*1000:.1f} mm", flush=True)
temno = np.maximum(temno, 0.55 * hranilna)
# Drobne žilne odprtine: proksimalno okoli vratu in tuberklov (ne na hrustancu), distalno zadaj nad fossa olecrani in ob
# epikondilih; 4 + 4, vsaj 8 mm narazen, plitve (0,3 mm), podolgovate vzdolž kosti
rng = np.random.default_rng(7)
hc_g, hrd = lm["glavica"]
d_h = np.linalg.norm(G - hc_g, axis=1)
prox_v = (t > 0.80) & (t < 0.90) & (d_h > 1.1 * hrd) & (hr_g < 0.05)
dist_v = (t > 0.10) & (t < 0.20) & (hr_g < 0.05) & ((G - c0) @ zad > 0)
izbor = []
for maska, n_ in ((prox_v, 4), (dist_v, 4)):
    idx = rng.permutation(np.where(maska)[0])
    zbrani = []
    for i in idx:
        if len(zbrani) == n_:
            break
        if all(np.linalg.norm(G[i] - G[j]) > 8e-3 for j in zbrani + izbor):
            zbrani.append(i)
    izbor += zbrani
for i in izbor:
    d = G - G[i]
    d_os = d @ osd
    d_pr = np.linalg.norm(d - np.outer(d_os, osd), axis=1)
    rr = rng.uniform(0.3e-3, 0.45e-3)
    k = gauss(np.sqrt(d_pr ** 2 + (d_os / 1.8) ** 2), rr)
    hp -= 0.3e-3 * k; temno = np.maximum(temno, smooth(0.45, 1.0, k) * 0.45)

# %% porocilo
PODROBNOSTI_POROCILO = {
    "vir_lupina": info.get("lupina"), "crte": crte, "poti_vira": crte_poti,
    "mejniki": {"glavica_sredisce": hc.round(4).tolist(), "glavica_polmer_mm": round(R * 1000, 1),
                "tuberculum_majus": gt.round(4).tolist(), "tuberculum_minus": lt.round(4).tolist(),
                "kirurski_vrat_t": t_kv, "epicondylus_medialis": epi_med.round(4).tolist(), "epicondylus_lateralis": epi_lat.round(4).tolist(),
                "fossa_coronoidea": None if f_cor is None else f_cor.round(4).tolist(), "fossa_radialis": None if f_rad is None else f_rad.round(4).tolist(),
                "fossa_olecrani": None if f_ole is None else f_ole.round(4).tolist()},
    "hranilna_odprtina": {"t": t_f, "theta_st": -125.0, "smer": "distalno"}, "zilne_odprtine": len(izbor),
    "makro_mm": [round(float(hp_m.min()) * 1000, 2), round(float(hp_m.max()) * 1000, 2)],
    "hrustanec_delez_povrsine": round(float(hr.mean()), 3)}
