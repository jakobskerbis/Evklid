# Iz surovega izvoza (strukture.json iz izvozi-z-anatomy.py) naredi public/3d/atlas-strukture.json
# in seznam angleških imen za prevod (imena-en.json, z latinskim imenom iz TA2.csv Z-Anatomy).
# Zagon: python3 scripts/atlas/pripravi-podatke.py <surova mapa> <pot do TA2.csv> <mapa za imena-en.json>
import json, re, sys, os, collections
raw, ta2, outdir = sys.argv[1], sys.argv[2], sys.argv[3]
s = json.load(open(os.path.join(raw, "strukture.json"), encoding="utf-8"))
ta = {}
with open(ta2, encoding="utf-8-sig") as f:
    for line in f:
        p = [x.strip().strip('"') for x in line.strip().strip('"').split(";")]
        if len(p) >= 3: ta.setdefault(p[1].lower(), p[2])
SUF = re.compile(r"\.(l|r|i|el|er|ol|or|e\d+[lr]|o\d+[lr])$")
rows, names = [], collections.OrderedDict()
for x in s:
    base = SUF.sub("", x["id"]); side = re.search(r"\.(l|r)$", x["id"])
    rows.append({"id": x["id"], "ime": base, "stran": side.group(1) if side else "", "sistem": x["sistem"],
                 "pot": x["pot"], "material": x["material"], "c": x["sredisce"], "r": x["velikost"]})
    names.setdefault(base, {"en": base, "sistem": x["sistem"], "la": ta.get(base.lower(), "")})
for x in s:
    for g in x["pot"]:
        b = SUF.sub("", g)
        names.setdefault(b, {"en": b, "sistem": x["sistem"], "la": ta.get(b.lower(), ""), "skupina": True})
json.dump(rows, open("public/3d/atlas-strukture.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
json.dump(list(names.values()), open(os.path.join(outdir, "imena-en.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print(len(rows), "struktur,", len(names), "imen za prevod")
