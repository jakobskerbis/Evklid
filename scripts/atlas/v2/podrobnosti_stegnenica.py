# Atlas v2: anatomske podrobnosti STEGNENICE (Femur.l/.r) za postopek.py. To ni samostojen modul: postopek.py izvede
# odseke (»# %% <ime>«) v svojem imenskem prostoru (exec v globals()), zato so tu vse spremenljivke postopka (G1, N1, hr1, t1,
# dif, dif3d, taubin, greben, izboklina …) na voljo in vse, kar odsek določi, je postopku vidno naprej.
# Vsak odsek mora določiti (glej postopek.py, »podrobnosti(...)«):
#   makro      (korak 2, na G1): G1d (premaknjena gladka mreža), hr_s1 (zglajena maska hrustanca), dvig1, fov_p (gola kost
#              sredi hrustanca, npr. fovea; 0 = ni), osd/zad/lat/med/spr (osi), hrap1, pas1, hp_m, crte
#   hrapavost  (korak 3, pred šumom): mer_g (mere gladke mreže), lm, hrap (hrapava mesta pripojev)
#   odprtine   (korak 3, po šumu): hp (vdolbine), temno, hranilna (barva odprtin), izbor (žilne odprtine)
#   porocilo   (korak 6): PODROBNOSTI_POROCILO
# Koda stegnenice je premaknjena iz postopek.py brez sprememb (izhod v4s3 ostane bajt za bajtom enak).
import numpy as np  # noqa: F401  (samo za orodja za preverjanje; postopek ima svoj np)

# %% makro
mer1, lm1 = kost.mere_stegnenice(G1, GF1, STRAN, hr1 > 0.5)
o1 = kost.okvir_stegnenice(G1, STRAN)
t1, os_, med, spr = o1["t"], o1["os"], o1["med"], o1["spr"]
L = o1["dolzina_os"]
osd = lm1["os_diafize"]
zad, lat = -spr, -med
c0 = G1.mean(0)
_, _, r1, th1 = polarno(G1, osd, c0, zad, lat)
r_sred = float(np.median(r1[(t1 > 0.4) & (t1 < 0.6)]))
# Linea aspera: vir je na zadnji strani diafize skoraj okrogel, zato sledenje največjemu polmeru odpove (v2s2: θ ob meji
# ±25°). Greben položimo anatomsko: zadnja sredinska črta diafize (θ = 0), ustnici ±2,5 mm.
th_surovo = []
for x in np.linspace(0.22, 0.78, 8):
    s = (np.abs(t1 - x) < 0.01) & (np.abs(th1) < np.radians(45))
    k = np.argsort(-r1[s])[: max(3, int(0.1 * s.sum()))]
    th_surovo.append(float(np.arctan2(np.sin(th1[s][k]).mean(), np.cos(th1[s][k]).mean())) if s.sum() >= 8 else 0.0)

# ---- mejniki ----
hc, R = lm1["glavica"]
d_h1 = np.linalg.norm(G1 - hc, axis=1)
u_h1 = (G1 - hc) / d_h1[:, None]
gt = lm1["veliki_obrtec"]  # najbolj lateralna točka velikega obrtca
d_gt = np.linalg.norm(G1 - gt, axis=1)
vratm = (d_h1 > 1.15 * R) & (d_h1 < 1.6 * R) & (d_gt > 0.03) & (t1 > 0.7)
a_gl = hc - G1[vratm].mean(0); a_gl /= np.linalg.norm(a_gl)  # os vratu: od vratu proti glavici (medialno, gor, naprej)
mlad = np.where(t1 > 0.72, (G1 - c0) @ zad * 0.7 + (G1 - c0) @ med * 0.7, -1e9)
lt_i = int(np.argmax(np.where((t1 > 0.74) & (t1 < 0.86), mlad, -1e9)))
lt = G1[lt_i]; t_lt = float(t1[lt_i])
t_gt = float(t1[np.argmax(np.where(d_gt < 0.04, t1, -1))])  # vrh velikega obrtca
# (pomožne funkcije greben, greben_pot, izboklina, crta, tocka … so v postopek.py)
# ---- sklepni hrustanec: gladek obris (vir ima stopničaste meje po grobih ploskvah) ----
hr_b = hr1.copy()
# Glavica: meja hrustanca po azimutu okoli osi vratu iz vira (zglajena), nato valovita in spredaj dlje na vrat
# (v3s1: ravna vodoravna meja spredaj). Stara izvrtina fovee je s tem hrustanec.
e1 = spr - a_gl * (a_gl @ spr); e1 /= np.linalg.norm(e1)  # spredaj, pravokotno na os vratu
e2 = np.cross(a_gl, e1)
alfa = np.arccos(np.clip(u_h1 @ a_gl, -1, 1)); fi_h = np.arctan2(u_h1 @ e2, u_h1 @ e1)
glava_obm = (d_h1 < 1.6 * R) & (alfa < np.radians(125)) & (t1 > 0.8)
kosi = np.linspace(-np.pi, np.pi, 25)
a_m = []
for k in range(24):
    s_ = glava_obm & (hr1 > 0.5) & (fi_h >= kosi[k]) & (fi_h < kosi[k + 1])
    a_m.append(np.percentile(alfa[s_], 95) if s_.sum() > 5 else np.nan)
a_m = np.array(a_m); a_m[np.isnan(a_m)] = np.nanmedian(a_m)
a_m = np.convolve(np.r_[a_m[-3:], a_m, a_m[:3]], np.ones(7) / 7, mode="valid")  # krožno glajenje (ena gladka obroba)
sred_k = (kosi[:-1] + kosi[1:]) / 2
a_meja = np.interp(fi_h, np.r_[sred_k - 2 * np.pi, sred_k, sred_k + 2 * np.pi], np.r_[a_m, a_m, a_m])
a_meja = (a_meja + np.radians(18) * np.maximum(0, np.cos(fi_h - 0.35)) ** 1.5 + np.radians(2.5) * np.sin(3 * fi_h + 0.7)
          + np.radians(1.0) * np.sin(5 * fi_h + 2.1))
hr_b[glava_obm] = (alfa[glava_obm] < a_meja[glava_obm]).astype(float)
# zunaj glave proksimalno ni hrustanca (v4s1: prenos maske Z-Anatomy na BodyParts3D je pustil »kaplje« na vratu)
hr_b[(t1 > 0.75) & ~glava_obm] = 0.0
print("[v2] glava: meja vira (st)", np.degrees(a_m).round(0).tolist(), "dodano", int(((hr_b > 0.5) & (hr1 < 0.5) & glava_obm).sum()), "odvzeto", int(((hr_b < 0.5) & (hr1 > 0.5) & glava_obm).sum()), flush=True)
# fovea capitis: plitva skledica malo pod in za medialnim polom glavice (vir: izvrtan valj)
u_f = med - np.tan(np.radians(9)) * osd + np.tan(np.radians(13)) * zad; u_f /= np.linalg.norm(u_f)
rho = R * np.arccos(np.clip(u_h1 @ u_f, -1, 1))  # razdalja po glavici od središča fovee
FOV_R, FOV_D, FOV_GOLO = 7.0e-3, 1.0e-3, 0.5  # ena plitva skledica Ø 14 mm, 1 mm, širok poševen rob; gola kost Ø 7 mm
na_glavici = (d_h1 < 1.25 * R) & (u_h1 @ a_gl > 0)
hr_b[na_glavici & (rho < FOV_GOLO * FOV_R)] = 0.0
# facies patellaris naj sega višje spredaj (vir: le ~12 mm nad kondili, v resnici ~35 mm): polje hrustanca na sprednji
# strani distalno raztegnemo navzgor (največja vrednost 5–16 mm niže na isti površini); stranski meji ostaneta.
# Zadaj kondila: hrustanec malo višje (4 mm), da kapici nista odrezani vodoravno.
spredaj_d = (t1 < 0.2) & ((G1 - c0) @ spr > 0) & (N1 @ spr > 0.3)
zadaj_d = (t1 < 0.16) & ((G1 - c0) @ zad > 0) & (N1 @ zad > 0.3)
kd1 = KDTree(len(G1))
for i, p in enumerate(G1):
    kd1.insert(p.tolist(), i)
kd1.balance()
for i in np.where(spredaj_d)[0]:
    # lateralni rob facies patellaris je višji od medialnega: lateralno do 24 mm, medialno do 16 mm
    for pm in ((5e-3, 10e-3, 15e-3, 19e-3) if (G1[i] - c0) @ lat > 0 else (5e-3, 10e-3, 13e-3)):
        _, j, _ = kd1.find((G1[i] - pm * osd).tolist())
        if hr1[j] > 0.5:
            hr_b[i] = 1.0
            break
# zadaj: kapici kondilov segata višje in imata zgoraj obok (sredi kondila do 15 mm višje, ob straneh malo), ne kvadrata
mlg0 = (G1 - c0) @ med
pc = zadaj_d & (hr1 > 0.5) & (t1 < 0.12)
meja_ml = np.median(mlg0[pc])
sredi_k = [np.median(mlg0[pc & (mlg0 > meja_ml)]), np.median(mlg0[pc & (mlg0 <= meja_ml)])]
for i in np.where(zadaj_d)[0]:
    dx = min(abs(mlg0[i] - sk) for sk in sredi_k)
    pm_max = 15e-3 * max(0.0, 1 - (dx / 17e-3) ** 2)
    for pm in np.arange(3e-3, pm_max + 1e-4, 3e-3):
        _, j, _ = kd1.find((G1[i] - pm * osd).tolist())
        if hr1[j] > 0.5:
            hr_b[i] = 1.0
            break
# zglajen obris (meja = izolinija 0,5): 3 mm proksimalno, 9 mm distalno (vir ima na kondilih oglate vogale)
w_d = smooth(0.30, 0.22, t1)
hr_s1 = dif(hr_b, 3.0e-3) * (1 - w_d) + dif3d(hr_b, 6.0e-3) * w_d
# dvig hrustanca (0,3 mm) iz 3D zglajene maske: na meji 0, v ~4 mm proti notranjosti poln (v4s2: polica na spodnjem robu glavice)
dvig1 = smooth(0.5, 0.97, dif3d((smooth(0.3, 0.7, hr_s1) > 0.5).astype(float), 2.0e-3))
cart1 = smooth(0.3, 0.7, hr_s1)    # 0 kost … 1 hrustanec
# v4s3: izbokline in vdolbine (grebeni, epikondila, žleb trohleje) se na meji hrustanca ne smejo odrezati v ~1 mm (cart1):
# odrezan rob je dal gubo ob facies patellaris (pogled 1). cart_m = maska, razmazana v 3D (σ 2,5 mm).
cart_m = np.clip(dif3d(cart1, 2.5e-3), 0, 1)

# ---- linea aspera: pilaster (srednja tretjina), dve ustnici; distalno suprakondilarni liniji, proksimalno lateralna
# ustnica → glutealna grčavina, medialna → spiralna linija (pod malim obrtcem naprej v intertrohanterno linijo),
# vmesna → pektinealna linija do malega obrtca
# v3s3: ozki grebeni (σ ≤ 1,2 mm) so tudi na visoki mreži sami (brez peke) videti kot dve vrezani črti (svetla/temna
# stran ozkega grebena pri stranski luči). v4s2: tudi pilaster s planoto (raven vrh ~10 mm, boka 60–67°) je dal isto:
# robova planote = dve »svinčnikovi črti«, med ustnicama 0,2–1,0 mm vdolbine (greben_profil). v4s3: pilaster je en širok
# izbočen Gaussov hrib (dodatek 4 mm, σ 2,6 mm, proti koncema širši, kjer se ustnici razmakneta); ustnici nista ozka
# grebena, ampak le rahlo razširjeno teme (0,35 mm, σ 2,4 mm, ±3,2 mm: vsota ostane izbočena) + hrapav, malo svetlejši
# pas v barvi in hrapavosti (pas1). Vse ostale linije σ ≥ 2,6 mm.
th_u = np.degrees(3.2e-3 / r_sred)  # ustnici ±3,2 mm od sredine (na ramenih hriba)
# Podrobnejši vir (BodyParts3D) že ima pravo obliko grebenov, obrtcev in jam: dodatke zmanjšamo, da se ne bijejo z njo
# (Z-Anatomy: 1). K_* = množitelji višin.
# Izmerjeno (greben_profil, nizka mreža): vir 1,4–2,3 mm / FWHM 7–8 mm; v4s2 5,0–5,6 mm z ravnim vrhom.
K_LA, K_PROKS, K_DIST = (1.0, 0.8, 1.0) if VIR_JSON else (1.0, 1.0, 1.0)
greben("linea_aspera_pilaster", [tocka(x, 0) for x in (0.22, 0.32, 0.45, 0.55, 0.66, 0.76)], 4.0e-3, 2.6e-3, 0.9, (0.25, 0.25),
       sirina=lambda u: 1.0 + 0.4 * smooth(0.4, 0.05, u) + 0.4 * smooth(0.6, 0.95, u), pas_=0.8)
t_g = t_lt - 0.012  # zgornji konec glutealne grčavine: pod bazo velikega obrtca, v višini malega obrtca
mlg = (G1 - c0) @ med
dist = (t1 > 0.03) & (t1 < 0.12) & (cart1 < 0.2)
epi_med = najbolj(dist, med); epi_lat = najbolj(dist, lat)
add = najbolj((t1 > 0.10) & (t1 < 0.15) & (cart1 < 0.2), med + 0.35 * zad)  # adduktorska grčica: nad med. epikondilom, zadaj
it_kon = tocka(t_lt - 0.004, -150)  # spredaj pred malim obrtcem: konec spiralne, začetek intertrohanterne linije
# Lateralno: suprakondilarna linija → lateralna ustnica → glutealna grčavina (ena pot, višina/σ po sidrih). Glutealna
# grčavina: širok (σ 4,5 mm) podolgovat hrib 3,4 mm, hrapav (v4s2: prešibka)
greben_pot("lateralna_pot", [epi_lat + 0.45 * (tocka(0.135, 70) - epi_lat), tocka(0.135, 70), tocka(0.18, 48), tocka(0.24, 22),
                             tocka(0.31, th_u), tocka(0.45, th_u), tocka(0.60, th_u), tocka(0.70, th_u), tocka(0.72, th_u + 6),
                             tocka((0.72 + t_g) / 2, th_u + 24), tocka(t_g, 50)],
           [k * (0.5 + 0.5 * K_LA) for k in (0.0, 1.5e-3, 1.5e-3, 1.0e-3, 0.35e-3, 0.35e-3, 0.35e-3, 0.5e-3, 2.4e-3, 3.4e-3, 0.0)],
           [2.6e-3, 2.8e-3, 2.8e-3, 2.6e-3, 2.4e-3, 2.4e-3, 2.4e-3, 2.8e-3, 4.0e-3, 4.6e-3, 4.6e-3], 1.0, pas=(4, 7))
# Medialno: adduktorska grčica ← suprakondilarna linija (prekinjena pri žilah) → medialna ustnica → spiralna linija →
# spredaj pred malim obrtcem (tam se začne intertrohanterna linija)
greben_pot("medialna_pot", [add, tocka(0.18, -48), tocka(0.21, -35), tocka(0.24, -22), tocka(0.31, -th_u), tocka(0.45, -th_u),
                            tocka(0.60, -th_u), tocka(0.70, -th_u), tocka(0.72, -30), tocka(0.745, -70), tocka(0.768, -105),
                            tocka(t_lt - 0.022, -135), it_kon],
           [k * (0.5 + 0.5 * K_LA) for k in (1.1e-3, 1.1e-3, 0.25e-3, 1.0e-3, 0.35e-3, 0.35e-3, 0.35e-3, 0.35e-3, 0.8e-3, 1.0e-3, 1.0e-3, 1.0e-3, 0.7e-3)],
           [2.6e-3, 2.6e-3, 2.6e-3, 2.6e-3, 2.4e-3, 2.4e-3, 2.4e-3, 2.4e-3, 2.8e-3, 2.8e-3, 2.8e-3, 2.8e-3, 2.8e-3], 0.8, pas=(4, 7))
greben("pektinealna_linija", [tocka(0.69, -th_u * 0.5), tocka(0.74, -12), tocka(t_lt - 0.04, -22), lt + 0.4 * (tocka(t_lt - 0.02, -30) - lt)],
       1.5e-3 * (0.5 + 0.5 * K_LA), 2.8e-3, 0.8, (0.2, 0.2))

# ---- proksimalno ----
# mali obrtec: večji, stožčast, usmerjen zadaj-medialno (vir: majhen, okrogel)
# Mali obrtec: vir ima okrogel gumb z ostro gubo ob bazi (»prilepljen«). Široka nizka baza zapolni gubo, nato
# podolgovat stožec (vzdolž diafize 1,6 : 1) s topim vrhom, usmerjen zadaj-medialno (po normalah).
izboklina(lt - 4e-3 * os_, 22e-3, 1.2e-3 * K_PROKS, 0.5, 2.0)
d_l = G1 - lt; d_la = d_l @ osd
dd_l = np.sqrt(np.linalg.norm(d_l - np.outer(d_la, osd), axis=1) ** 2 + (np.minimum(d_la, 0) / 1.6) ** 2 + d_la.clip(0) ** 2)
# v4s3: vrh kot kupola (kvadratni profil), ne linearen stožec: od zgoraj (pogled 7) je bila konica videti kot trn pod glavico
prof_l = (np.clip(1 - (dd_l / 16e-3) ** 2, 0, 1) ** 1.4 * 2.4e-3 + np.clip(1 - (dd_l / 9e-3) ** 2, 0, 1) ** 1.5 * 2.4e-3) * (1 - cart_m)
prof_l *= K_PROKS
hp_m += prof_l; np.maximum(hrap1, smooth(0.2e-3, 1.5e-3, prof_l), out=hrap1)  # vrh: stožec s topo konico, hrapav
# intertrohanterni greben (zadaj): od zadnjega zgornjega vogala velikega obrtca do malega obrtca, s kvadratno grčico
prox_m = (d_gt < 0.035) & (t1 > t_lt)
gt_zad = najbolj(prox_m, zad + 0.5 * os_ + 0.2 * lat)
cr_sidra = [gt_zad + 0.15 * (lt - gt_zad), gt_zad + 0.45 * (lt - gt_zad) + 3e-3 * zad, gt_zad + 0.8 * (lt - gt_zad) + 2e-3 * zad, lt]
# greben se pri velikem obrtcu široko zlije z njim (σ 5,4 → 2,7 mm), proti malemu obrtcu ožji (v3s1: »klobasa«)
greben("intertrohanterni_greben", cr_sidra, 2.4e-3 * K_PROKS, 2.7e-3, 0.8, (0.0, 0.25), sirina=lambda u: 2.0 - 1.0 * u)
qt = na_povrsino(gt_zad + 0.42 * (lt - gt_zad) + 4e-3 * zad)[0]
izboklina(qt, 8e-3, 2.6e-3 * K_PROKS, 0.9, 1.6)  # kvadratna grčica (tuberculum quadratum); v4s3 izrazitejša (v4s2: 1,4 mm)
# trohanterna jama: medialna stran velikega obrtca zadaj, pod vrhom (pripoj m. obturator externus)
jm = (d_gt < 0.04) & (t1 > t_lt + 0.01) & ((G1 - c0) @ zad > 0) & (N1 @ med > 0.35) & (d_h1 > 1.4 * R)
fossa_c = G1[np.where(jm)[0][np.argsort(-t1[jm])[: max(5, int(0.05 * jm.sum()))]]].mean(0)
fossa_c = na_povrsino(fossa_c - 2e-3 * os_)[0]
izboklina(fossa_c, 9e-3, -3.5e-3 * (0.5 if VIR_JSON else 1.0), 0.3, 2.0)  # okrogla jama (Z-Anatomy ima podolgovato režo: zgladi jo Taubin spodaj); BodyParts3D: jamo ima, a je od zgoraj komaj vidna (v4s2) → −1,75 mm
# intertrohanterna linija (spredaj): od sprednje spodnje grčice velikega obrtca poševno navzdol medialno, pod malim
# obrtcem se nadaljuje v spiralno linijo
# začne pri sprednji zgornji grčici (stik velikega obrtca z vratom, ~35 mm pod vrhom obrtca), ~60 mm do pred mali obrtec
gt_spr = najbolj((np.abs(t1 - (t_gt - 0.06)) < 0.006) & ((G1 - c0) @ lat > 0) & (d_h1 > 1.5 * R), spr + 0.2 * lat)
greben("intertrohanterna_linija", [gt_spr + k * (it_kon - gt_spr) + (2.5e-3 * np.sin(np.pi * k)) * spr for k in np.linspace(0, 1, 6)],
       2.6e-3 * (0.5 + 0.5 * K_PROKS), 3.4e-3, 1.0, (0.15, 0.1))  # v4s3: 1,6 → 2,3 mm (prešibka)

# ---- distalno ----
# v4s3: epikondila širša in gladka (ostrina 2: kupola brez roba; v4s2 je bil medialni »stopljen vosek« iz več grbin),
# adduktorska grčica manjša in izrazitejša (ločen vrh nad medialnim epikondilom)
izboklina(epi_med, 16e-3, 2.8e-3, 0.8, 2.0)
izboklina(epi_lat, 14e-3, 2.4e-3, 0.8, 2.0)
izboklina(add, 6.5e-3, 3.0e-3, 0.9, 1.5)
# medkondilarna jama: globlja (zadaj spodaj med kondiloma); središče = najvišja zadnja točka med kondiloma
mid = 0.5 * ((epi_med - c0) @ med + (epi_lat - c0) @ med)
med_k = (t1 < 0.09) & (np.abs(mlg - mid) < 5e-3) & ((G1 - c0) @ zad > 0) & (cart1 < 0.5)
fos_c = G1[np.where(med_k)[0][np.argsort(-t1[med_k])[:max(5, int(0.1 * med_k.sum()))]]].mean(0)
fos_c = na_povrsino(fos_c - 3e-3 * os_ + 2e-3 * zad)[0]
d_fc = np.linalg.norm(G1 - fos_c, axis=1)
fosa = np.clip(1 - (d_fc / 13e-3) ** 2, 0, 1) ** 1.5 * smooth(-0.004, 0.004, (G1 - c0) @ zad - (fos_c - c0) @ zad + 0.012) * (1 - cart_m)
hp_m -= 2.2e-3 * fosa * K_DIST
# žleb facies patellaris (trohlea): sredinski žleb spredaj med lateralnim in medialnim robom, poglobljen 1,2 mm
tro = (t1 < 0.16) * smooth(0.0, 0.3, N1 @ spr) * gauss(mlg - mid - 2e-3, 5e-3) * smooth(0.2, 0.6, cart_m) * smooth(0.16, 0.10, t1)
hp_m -= 1.2e-3 * tro * K_DIST
# zadnja izbočenost kondilov: zadnji del obeh kondilov malo bolj nazaj (proč od jame)
zk = (t1 < 0.12) * smooth(0.1, 0.5, N1 @ zad) * smooth(7e-3, 13e-3, np.abs(mlg - mid)) * smooth(0.12, 0.07, t1)
hp_m += 1.2e-3 * zk * K_DIST

# ---- glavica: zapolni staro izvrtino (na kroglo) in izdolbi plitvo fovea capitis z blagimi stenami ----
kapa = smooth(np.cos(np.radians(72)), np.cos(np.radians(58)), u_h1 @ a_gl) * (d_h1 < 1.1 * R)
fov_p = 0.5 * (1 + np.cos(np.pi * np.clip(rho / FOV_R, 0, 1))) * na_glavici  # skledica: gladko dno in poševen rob
hp_m *= (1 - kapa)  # na glavici ni drugih izboklin
# Pred izboklinami zgladimo obliko vira (Taubin, brez krčenja): sklepne ploskve ~2 mm (grobe ploskve vira so na kondilih
# dale valovitost) in okolico malega obrtca ~6 mm (vir: okrogel gumb z gubo ob bazi; nato ga nosi stožec zgoraj)
# sklepne ploskve ~4 mm (v3s2: še valovitost na kondilih), mali obrtec ~6 mm, trohanterna jama ~4 mm (vir: reža)
# v4s3: utež glajenja ne sme imeti ostrega roba na meji hrustanca: Taubin z utežjo, ki pade v ~2 mm, je na meji pustil
# gubo (pogled 1: poševna »praska« nad medialnim kondilom ob robu facies patellaris; ni je v viru ne v nizki mreži,
# je pa v gladki mreži G). Utež zato razmažemo v 3D (σ 4 mm), da v ~8 mm mehko pojema po kosti.
w_hr = smooth(0.05, 0.6, dif3d(cart1, 4.0e-3))
G1d = taubin(G1, w_hr * (1 - kapa), 4.0e-3)
# v4s3: kondila še enkrat širše (~7 mm): v4s2 je imel na medialnem kondilu zmečkano prasko in »x«, na lateralnem vdolbino
# (grobe ploskve vira); utež se proti robu hrustanca zmanjša, da na meji ne nastane stopnica
G1d = taubin(G1d, w_hr * smooth(0.30, 0.22, t1), 7.0e-3)
# sprednja stran distalne metafize nad kondiloma: vir ima tam poševno gubo (v4s2 pogled 1: »praska« nad medialnim kondilom)
G1d = taubin(G1d, smooth(0.25, 0.19, t1) * smooth(0.07, 0.11, t1) * smooth(0.0, 0.4, N1 @ spr), 5.0e-3)
# medialni epikondil: grbine in jamice vira zgladimo (~6 mm), preden dodamo eno gladko kupolo epikondila in adduktorsko grčico
G1d = taubin(G1d, smooth(28e-3, 14e-3, np.linalg.norm(G1 - epi_med, axis=1)), 6.0e-3)
if not VIR_JSON:  # Z-Anatomy: okrogel gumb malega obrtca in reža trohanterne jame; BodyParts3D ju ima pravilna
    G1d = taubin(G1d, smooth(26e-3, 12e-3, np.linalg.norm(G1 - lt, axis=1)), 6.0e-3)
    G1d = taubin(G1d, smooth(18e-3, 8e-3, np.linalg.norm(G1 - fossa_c, axis=1)), 4.0e-3)
G1d = G1d + N1 * hp_m[:, None]
G1d = taubin(G1d, smooth(16e-3, 8e-3, np.linalg.norm(G1 - fos_c, axis=1)), 2.0e-3)  # strop medkondilarne jame brez gube
# glavica: kapa skoraj na kroglo (ostane 25 % odstopanj vira < 1,5 mm): zapolni izvrtino brez roba in zgladi grbine
d_h1 = np.linalg.norm(G1d - hc, axis=1); u_h1 = (G1d - hc) / d_h1[:, None]
odst = d_h1 - R
polni = -kapa * (odst - 0.25 * odst * smooth(1.5e-3, 0.5e-3, np.abs(odst)))
glv = (kapa > 0) | (fov_p > 0)
G1d[glv] = hc + u_h1[glv] * (d_h1[glv] + polni[glv] - FOV_D * fov_p[glv])[:, None]
# rob hrustanca glavice (v4s2: stopničast, valovit spodnji rob s polico; vir ima ~10° nad mejo 1 mm žleb in strm prehod v
# vrat; od zgoraj majhen »trn« spredaj pod glavico): v pasu od 35° nad do 24° pod mejo (po kotu od osi vratu) odmik od
# krogle zgladimo v 3D (σ 3 mm)
d_meja = alfa - a_meja
w_rob = glava_obm * smooth(np.radians(-36), np.radians(-24), d_meja) * smooth(np.radians(24), np.radians(12), d_meja) * (1 - kapa)
d_h1 = np.linalg.norm(G1d - hc, axis=1); u_h1 = (G1d - hc) / d_h1[:, None]
odm = d_h1 - R
odm_s = dif3d(np.where(d_h1 < 1.6 * R, odm, 0.0), 3.0e-3)
rb_ = w_rob > 1e-3
G1d[rb_] = hc + u_h1[rb_] * (R + odm[rb_] * (1 - w_rob[rb_]) + odm_s[rb_] * w_rob[rb_])[:, None]
print(f"[v2] makro: t_lt {t_lt:.3f}, t_gt {t_gt:.3f}, R {R*1000:.1f} mm, zapolnjeno {int((polni > 0.5e-3).sum())} oglišč, "
      f"največ {polni.max()*1000:.1f} mm; izboklina {hp_m.max()*1000:.1f} mm, vdolbina {hp_m.min()*1000:.1f} mm", flush=True)
del kd1

# %% hrapavost
mer_g, lm = kost.mere_stegnenice(G, GF, STRAN, hr > 0.5)
gt = lm["veliki_obrtec"]
d_gt = np.linalg.norm(G - gt, axis=1)
d_lt = np.linalg.norm(G - lt, axis=1)
# hrapava obrtca (barva, hrapavost; brez razpok: v2s2 je |šum| na vratu in obrtcu dal mrežo temnih črt v AO)
hrap = np.maximum(hrap, np.maximum(gauss(d_gt, 14e-3) * 0.7, gauss(d_lt, 7e-3)) * kompakta)
ml = (G - c0) @ med
epi = (t < 0.16) * kompakta * smooth(0.75, 0.95, np.abs(ml) / np.abs(ml[t < 0.16]).max())
hrap = np.maximum(hrap, epi * 0.6)

# %% odprtine
# Hranilna odprtina (ena): zadaj, 3 mm medialno od medialne ustnice linea aspera, 40 % dolžine od proksimalnega konca;
# kanal poševno proksimalno → jamica z brazdo navzgor
t_f = 1 - 0.40
th_f = -7.5e-3 / r_sred  # ob vznožju pilastra, medialno
s_f = kotna(theta - th_f) * r
v_f = (t - t_f) * L
# v4s3: majhna, a jasno vidna (v4s2 prešibka): ustje ~1,2 × 2 mm, 1,4 mm globoko, temno rjavo dno
jamica = gauss(s_f, 0.55e-3) * gauss(v_f, 0.9e-3)
brazda = gauss(s_f, 0.5e-3) * gauss(v_f - 3.0e-3, 2.5e-3) * (v_f > 0)
hp -= 1.4e-3 * jamica + 0.3e-3 * brazda
hranilna = smooth(0.25, 0.8, jamica)
temno = np.maximum(temno, 0.55 * hranilna)

# Drobne žilne odprtine: samo na vratu (retinakularne, zgoraj spredaj in zadaj) in na metafizah ob kondilih.
# Malo in neopazno: 4 + 5 odprtin, vsaj 8 mm narazen, plitve (0,3 mm), podolgovate vzdolž kosti, mehak rob
rng = np.random.default_rng(7)
hc, hrd = lm["glavica"]
d_h = np.linalg.norm(G - hc, axis=1)
vrat = (d_h > 1.15 * hrd) & (d_h < 1.55 * hrd) & (d_gt > 0.025) & (hr_g < 0.05)
metaf = (t > 0.06) & (t < 0.16) & (hr_g < 0.05) & ((G - c0) @ zad > 0)
izbor = []
for maska, n_ in ((vrat, 4), (metaf, 5)):
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
PODROBNOSTI_POROCILO = {"linea_aspera_theta_vir_st": [round(math.degrees(x), 1) for x in th_surovo],
                       "linea_aspera": "anatomsko: pilaster kot izbočen Gaussov hrib +4 mm (σ 2,6 mm, proti koncema širši) na zadnji sredinski črti (θ = 0), ustnici ±3,2 mm le 0,35 mm (σ 2,4 mm) + hrapav svetlejši pas, kot neprekinjeni poti (suprakondilarna → ustnica → glutealna grčavina / spiralna linija)", "crte": crte,
                       "veliki_obrtec": gt.round(4).tolist(), "mali_obrtec": lt.round(4).tolist(),
                       "zilne_odprtine": len(izbor), "hranilna_odprtina_t": t_f, "fovea": {"premer_mm": 2 * FOV_R * 1000, "gola_kost_premer_mm": 2 * FOV_GOLO * FOV_R * 1000, "globina_mm": FOV_D * 1000,
                                 "pod_medialnim_polom_st": 9, "zadaj_st": 13}, "makro_mm": [round(float(hp_m.min()) * 1000, 2), round(float(hp_m.max()) * 1000, 2)],
                       "hrustanec_delez_povrsine": round(float(hr.mean()), 3)}
