# Zbrane predmetnike (JSON iz raziskave) doda v server/university-extra.js.
# Uporaba: python3 scripts/uvozi-fakultete.py [--novo] <fakultete.json> <ključ skupine> ...
#   --novo: datoteko ustvari na novo (sicer obstoječim fakultetam doda predmete in programe;
#           program z replace: true zamenja letnike istega programa).
import json, re, sys

args = sys.argv[1:]
fresh = args[0] == "--novo"
if fresh:
    args = args[1:]
src, keys = args[0], args[1:]
data = json.load(open(src))
blocks_src = open("server/university-data.js").read()
BLOCKS = set(re.search(r"const BLOCKS = \{ ([^}]*) \};", blocks_src).group(1).replace(" ", "").split(","))
SUBJ = {"MAT", "FIZ", "KEM", "BIO", "GEO", "RAC", "EKO"}

facs = {}
problems = []
if not fresh:
    old = open("server/university-extra.js").read()
    old = old[old.index("export const EXTRA_FACULTIES = ") + len("export const EXTRA_FACULTIES = "):].rstrip().rstrip(";")
    for f in json.loads(old):
        facs[f["id"]] = f
for r in data["results"]:
    if not r or r["key"] not in keys:
        continue
    for f in r["faculties"]:
        fac = facs.setdefault(f["id"], {"id": f["id"], "name": f["name"], "short": f["short"], "courses": {}, "programs": {}})
        for c in f["courses"]:
            code = c["code"].upper()
            if not re.fullmatch(r"[A-Z0-9]{2,12}", code):
                problems.append(f"koda {code}")
            if c["subject"] not in SUBJ:
                problems.append(f"{code}: predmet {c['subject']}")
            bad = [b for b in c["reuseBlocks"] if b not in BLOCKS]
            if bad:
                problems.append(f"{code}: neznani bloki {bad} (izpuščeni)")
            units = [[u["title"], [t.strip() for t in u["topics"] if t.strip()]] for u in c["units"] if u["topics"]]
            if code in fac["courses"]:
                problems.append(f"{f['id']} {code}: podvojen, ostane prvi")
                continue
            fac["courses"][code] = [c["name"], c["subject"], [b for b in c["reuseBlocks"] if b in BLOCKS], units]
        for p in f["programs"]:
            prog = {"name": p["name"], "source": p["source"], "sourceYear": p["sourceYear"], "years": p["years"]}
            if p.get("electives"):
                prog["electives"] = p["electives"]
            if p.get("degree") == "EMŠ":
                prog["degree"] = "EMŠ"
            if p.get("replace"):
                prog["replace"] = True
            elif p["id"] in fac["programs"]:
                problems.append(f"program {p['id']} že obstaja; nov zapis brez replace ga prepiše")
            fac["programs"][p["id"]] = prog

# Kode programov, ki niso definirane (in niso obstoječe kode fakultete), izpustimo.
existing = blocks_src
for fac in facs.values():
    for pid, p in fac["programs"].items():
        def ok(c):
            if c in fac["courses"]:
                return True
            if re.search(rf'^\s+{c}: \[', existing, re.M):
                return True
            problems.append(f"{pid}: neznan predmet {c} (izpuščen)")
            return False
        p["years"] = [[c for c in y if ok(c)] for y in p["years"]]
        if "electives" in p:
            p["electives"] = [c for c in p["electives"] if ok(c)]

out = ["// Dodatne naravoslovne fakultete in strokovni predmeti.",
       "// Ustvarjeno s scripts/uvozi-fakultete.py iz zbranih predmetnikov (docs/predmetniki-naravoslovne-fakultete.md).",
       "// Predmet: [ime, predmet, [imena blokov iz university-data.js], [[sklop, [\"Tema | cilji\", …]], …]].",
       "// Popravke lahko vnašaš kar tukaj.",
       "export const EXTRA_FACULTIES = " + json.dumps(list(facs.values()), ensure_ascii=False, indent=2) + ";", ""]
open("server/university-extra.js", "w").write("\n".join(out))
print("fakultet", len(facs), "predmetov", sum(len(f["courses"]) for f in facs.values()), "programov", sum(len(f["programs"]) for f in facs.values()))
print("\n".join(problems))
