#!/usr/bin/env python3
"""Pljučni režnji iz CT: TotalSegmentator dataset v1 (Wasserthal in sod., Zenodo 10.5281/zenodo.6802613, CC BY 4.0).

Iz 28 GB arhiva prebere samo potrebne datoteke (zahteve HTTP Range), izbere osebek brez patologije s celimi pljuči,
maske petih režnjev in sapnika pretvori v zglajene površine (marching cubes) in jih shrani v <mapa>/pljuca-v1.npz
(koordinate v metrih, x levo bolnika, y nazaj, z gor – kot Z-Anatomy). Izvoz (izvozi-organe.py, cfg pljuca.ct) jih
poravna na pljuča Z-Anatomy.

  python3 scripts/atlas/pljuca-ct.py <mapa ct> [osebek, npr. s0011]
"""
import csv, io, json, os, subprocess, sys, zipfile
import numpy as np

URL = "https://zenodo.org/api/records/6802614/files/Totalsegmentator_dataset.zip/content"
REZNJI = ["lung_upper_lobe_right", "lung_middle_lobe_right", "lung_lower_lobe_right", "lung_upper_lobe_left", "lung_lower_lobe_left"]


class Oddaljena(io.RawIOBase):
    """Datoteka na strežniku, brana po kosih (curl -r); predpomnilnik blokov 4 MB."""
    B = 4 << 20

    def __init__(self, url, velikost):
        self.url, self.n, self.p, self.bloki = url, velikost, 0, {}

    def seekable(self): return True
    def readable(self): return True
    def tell(self): return self.p

    def seek(self, o, w=0):
        self.p = o if w == 0 else self.p + o if w == 1 else self.n + o
        return self.p

    def _blok(self, i):
        if i not in self.bloki:
            a, b = i * self.B, min(self.n, (i + 1) * self.B) - 1
            for _ in range(4):
                r = subprocess.run(["curl", "-sS", "-L", "-m", "300", "-r", f"{a}-{b}", self.url], capture_output=True)
                if r.returncode == 0 and len(r.stdout) == b - a + 1:
                    break
            else:
                raise IOError(f"prenos {a}-{b}: {r.stderr[-200:]}")
            if len(self.bloki) > 24:
                self.bloki.pop(next(iter(self.bloki)))
            self.bloki[i] = r.stdout
        return self.bloki[i]

    def readinto(self, buf):
        d = self.read(len(buf)); buf[:len(d)] = d
        return len(d)

    def read(self, k=-1):
        if k < 0:
            k = self.n - self.p
        out = bytearray()
        while k > 0 and self.p < self.n:
            i, o = divmod(self.p, self.B)
            d = self._blok(i)[o:o + k]
            out += d; self.p += len(d); k -= len(d)
        return bytes(out)


def maska(z, osebek, ime):
    import nibabel as nib
    d = z.read(f"Totalsegmentator_dataset/{osebek}/segmentations/{ime}.nii.gz")
    im = nib.Nifti1Image.from_bytes(__import__("gzip").decompress(d))
    return np.asarray(im.dataobj) > 0, im.affine


def povrsina(m, aff, glajenje=1.6):
    """Maska → zglajena površina v metrih (x levo, y nazaj, z gor)."""
    from scipy import ndimage
    from skimage import measure
    korak = np.abs(np.diag(aff)[:3])
    polje = ndimage.gaussian_filter(np.pad(m, 3).astype(np.float32), glajenje / korak * 1.5)
    v, f, _, _ = measure.marching_cubes(polje, 0.5)
    v = (v - 3) @ aff[:3, :3].T + aff[:3, 3]            # RAS, mm
    v = v * np.array([-1, -1, 1]) / 1000.0              # RAS → Z-Anatomy: x levo bolnika, y nazaj (zasuk 180° okoli z)
    if np.linalg.det(aff[:3, :3]) > 0:                   # ploskve navzven (marching_cubes: normale proti nižjim vrednostim)
        f = f[:, ::-1]
    return v.astype(np.float32), f.astype(np.int32)


def main():
    mapa = sys.argv[1]; zeleni = sys.argv[2] if len(sys.argv) > 2 else None
    n = int(subprocess.run(["curl", "-sSLI", URL], capture_output=True, text=True).stdout.lower().split("content-length:")[-1].split()[0])
    z = zipfile.ZipFile(io.BufferedReader(Oddaljena(URL, n), 1 << 20))
    meta = list(csv.DictReader(io.StringIO(z.read("Totalsegmentator_dataset/meta.csv").decode("utf-8-sig")), delimiter=";"))
    print("stolpci", list(meta[0].keys()), len(meta))
    kand = [r for r in meta if "thorax" in (r.get("study_type") or "").lower() and "angio" not in (r.get("study_type") or "").lower()]
    kand.sort(key=lambda r: abs(float(r.get("age") or 99) - 30))
    if zeleni:
        kand = [r for r in meta if r["image_id"] == zeleni]
    for r in kand[:25]:
        s = r["image_id"]
        try:
            M = {}; aff = None
            for ime in REZNJI:
                M[ime], aff = maska(z, s, ime)
        except KeyError:
            continue
        vox = abs(np.linalg.det(aff[:3, :3])) / 1e6  # litri
        vol = {k: float(m.sum() * vox) for k, m in M.items()}
        vse = np.any(list(M.values()), axis=0)
        rob = vse[0].any() or vse[-1].any() or vse[:, 0].any() or vse[:, -1].any() or vse[:, :, 0].any() or vse[:, :, -1].any()
        print(s, r.get("age"), r.get("gender"), r.get("study_type"), "L", round(sum(vol.values()), 2), {k[5:]: round(v, 2) for k, v in vol.items()}, "odrezano" if rob else "celo", flush=True)
        if rob or not 3.5 < sum(vol.values()) < 7.5 or min(vol.values()) < 0.25:
            continue
        M["trachea"], _ = maska(z, s, "trachea")
        # celo krilo (režnji skupaj, špranje zaprte): izvoz z njim preverja, ali je veja v pljučih
        from scipy import ndimage
        for stran in ("right", "left"):
            M["lung_" + stran] = ndimage.binary_closing(np.any([m for k, m in M.items() if k.endswith("lobe_" + stran)], axis=0), iterations=4)
        izh = {"osebek": s, "meta": json.dumps(r)}
        for ime, m in M.items():
            v, f = povrsina(m, aff)
            izh[ime + "_v"] = v; izh[ime + "_f"] = f
            print("  ", ime, len(v), len(f))
        np.savez_compressed(os.path.join(mapa, "pljuca-v1.npz"), **izh)
        print("zapisano", os.path.join(mapa, "pljuca-v1.npz"), s)
        return
    sys.exit("ni primernega osebka")


if __name__ == "__main__":
    main()
