// Preverjanje potrdila o izvoru (GitHub artifact attestation, Sigstore) za kazalo vnaprej izdelanih PDF-jev učbenika
// (server/ucbenik-pdf.js). Delovni tok .github/workflows/ucbenik-pdf.yml kazalo podpiše brez skrivnosti: GitHub mu
// prek OIDC izda kratkotrajno potrdilo X.509 (Fulcio), v katerem piše, kateri delovni tok na kateri veji katerega
// repozitorija je podpisoval. Strežnik sprejme kazalo samo, če:
//   1. potrdilo podpisnika izda Sigstorjev vmesni overitelj, tega pa korenski (oba pripeta spodaj);
//   2. je v potrdilu ta repozitorij, ta delovni tok in veja main ter izdajatelj žetona GitHub Actions;
//   3. podpis ovojnice DSSE ustreza ključu iz potrdila;
//   4. izjava v ovojnici navaja natanko SHA-256 prejetega kazala.
// Vsak PDF je v kazalu s svojo SHA-256, zato je s tem potrjena tudi vsaka datoteka. Kdor bi zamenjal datoteke
// izdaje (pravica pisanja v izdaje brez delovnega toka na main), takega potrdila ne more narediti; strežnik potem
// ostane pri prejšnjih datotekah oziroma pri tisku v brskalniku.
// Meja: vpisa v javni dnevnik (Rekor) in časa podpisa ne preverjamo kriptografsko; potrdilo velja 10 minut, njegov
// zasebni ključ pa obstaja le v pomnilniku GitHubovega strežnika med zagonom. Ko Sigstore zamenja vmesnega
// overitelja (veljaven do 2031), preverjanje pade in PDF-ji gredo na rezervo, dokler se spodnji potrdili ne posodobita
// (https://fulcio.sigstore.dev/api/v2/trustBundle).
import crypto, { X509Certificate } from "node:crypto";

const FULCIO_INTERMEDIATE = `-----BEGIN CERTIFICATE-----
MIICGjCCAaGgAwIBAgIUALnViVfnU0brJasmRkHrn/UnfaQwCgYIKoZIzj0EAwMw
KjEVMBMGA1UEChMMc2lnc3RvcmUuZGV2MREwDwYDVQQDEwhzaWdzdG9yZTAeFw0y
MjA0MTMyMDA2MTVaFw0zMTEwMDUxMzU2NThaMDcxFTATBgNVBAoTDHNpZ3N0b3Jl
LmRldjEeMBwGA1UEAxMVc2lnc3RvcmUtaW50ZXJtZWRpYXRlMHYwEAYHKoZIzj0C
AQYFK4EEACIDYgAE8RVS/ysH+NOvuDZyPIZtilgUF9NlarYpAd9HP1vBBH1U5CV7
7LSS7s0ZiH4nE7Hv7ptS6LvvR/STk798LVgMzLlJ4HeIfF3tHSaexLcYpSASr1kS
0N/RgBJz/9jWCiXno3sweTAOBgNVHQ8BAf8EBAMCAQYwEwYDVR0lBAwwCgYIKwYB
BQUHAwMwEgYDVR0TAQH/BAgwBgEB/wIBADAdBgNVHQ4EFgQU39Ppz1YkEZb5qNjp
KFWixi4YZD8wHwYDVR0jBBgwFoAUWMAeX5FFpWapesyQoZMi0CrFxfowCgYIKoZI
zj0EAwMDZwAwZAIwPCsQK4DYiZYDPIaDi5HFKnfxXx6ASSVmERfsynYBiX2X6SJR
nZU84/9DZdnFvvxmAjBOt6QpBlc4J/0DxvkTCqpclvziL6BCCPnjdlIB3Pu3BxsP
mygUY7Ii2zbdCdliiow=
-----END CERTIFICATE-----`;
const FULCIO_ROOT = `-----BEGIN CERTIFICATE-----
MIIB9zCCAXygAwIBAgIUALZNAPFdxHPwjeDloDwyYChAO/4wCgYIKoZIzj0EAwMw
KjEVMBMGA1UEChMMc2lnc3RvcmUuZGV2MREwDwYDVQQDEwhzaWdzdG9yZTAeFw0y
MTEwMDcxMzU2NTlaFw0zMTEwMDUxMzU2NThaMCoxFTATBgNVBAoTDHNpZ3N0b3Jl
LmRldjERMA8GA1UEAxMIc2lnc3RvcmUwdjAQBgcqhkjOPQIBBgUrgQQAIgNiAAT7
XeFT4rb3PQGwS4IajtLk3/OlnpgangaBclYpsYBr5i+4ynB07ceb3LP0OIOZdxex
X69c5iVuyJRQ+Hz05yi+UF3uBWAlHpiS5sh0+H2GHE7SXrk1EC5m1Tr19L9gg92j
YzBhMA4GA1UdDwEB/wQEAwIBBjAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRY
wB5fkUWlZql6zJChkyLQKsXF+jAfBgNVHSMEGDAWgBRYwB5fkUWlZql6zJChkyLQ
KsXF+jAKBggqhkjOPQQDAwNpADBmAjEAj1nHeXZp+13NWBNa+EDsDP8G1WWg1tCM
WP/WHPqpaVo0jhsweNFZgSs0eE7wYI4qAjEA2WB9ot98sIkoF3vZYdd3/VtWB5b9
TNMea7Ix/stJ5TfcLLeABLE4BNJOsQ4vnBHJ
-----END CERTIFICATE-----`;
const OIDC_ISSUER = "https://token.actions.githubusercontent.com";
export const PDF_WORKFLOW = ".github/workflows/ucbenik-pdf.yml";

const b64 = (s) => Buffer.from(String(s || ""), "base64");

// Preveri potrdilo (vsebina kazalo.potrdilo.json) za kazalo s to SHA-256 (hex). Vrne { san, cas } ali vrže napako.
// repo: »lastnik/ime« (velikost črk ni pomembna), ref: npr. »refs/heads/main«.
export function verifyAttestation(bundle, { sha256, repo, ref = "refs/heads/main", workflow = PDF_WORKFLOW }) {
  const fail = (m) => {
    throw new Error(`potrdilo o izvoru: ${m}`);
  };
  if (!bundle || typeof bundle !== "object") fail("ni veljaven zapis");
  const vm = bundle.verificationMaterial || {};
  const der = vm.certificate?.rawBytes || vm.x509CertificateChain?.certificates?.[0]?.rawBytes;
  const env = bundle.dsseEnvelope;
  if (!der || !env?.payload || !env.signatures?.[0]?.sig) fail("manjka potrdilo ali podpis");
  let leaf;
  const inter = new X509Certificate(FULCIO_INTERMEDIATE);
  const root = new X509Certificate(FULCIO_ROOT);
  try {
    leaf = new X509Certificate(b64(der));
  } catch {
    fail("potrdila ni mogoče prebrati");
  }
  // 1. veriga do pripetega korena
  if (!root.verify(root.publicKey) || !inter.checkIssued(root) || !inter.verify(root.publicKey)) fail("pripeti overitelj ni veljaven");
  if (!leaf.checkIssued(inter) || !leaf.verify(inter.publicKey)) fail("potrdila ni izdal Sigstore");
  // 2. kdo je podpisal: delovni tok tega repozitorija na tej veji, žeton GitHub Actions
  const want = `https://github.com/${repo}/${workflow}@${ref}`.toLowerCase();
  const san = String(leaf.subjectAltName || "");
  if (san.toLowerCase() !== `uri:${want}`) fail(`podpisal ga je drug delovni tok ali veja (${san.slice(0, 160)})`);
  if (!leaf.raw.includes(Buffer.from(OIDC_ISSUER))) fail("izdajatelj žetona ni GitHub Actions");
  // 3. podpis ovojnice DSSE
  const type = String(env.payloadType || "");
  const payload = b64(env.payload);
  const pae = Buffer.concat([Buffer.from(`DSSEv1 ${Buffer.byteLength(type)} ${type} ${payload.length} `), payload]);
  let ok = false;
  try {
    ok = crypto.verify("sha256", pae, leaf.publicKey, b64(env.signatures[0].sig));
  } catch {}
  if (!ok) fail("podpis ne ustreza");
  // 4. izjava govori o tem kazalu
  if (type !== "application/vnd.in-toto+json") fail("neznana vrsta izjave");
  let st;
  try {
    st = JSON.parse(payload.toString("utf8"));
  } catch {
    fail("izjave ni mogoče prebrati");
  }
  if (!String(st.predicateType || "").startsWith("https://slsa.dev/provenance/")) fail("ni potrdilo o izvoru");
  if (!Array.isArray(st.subject) || !st.subject.some((s) => s?.digest?.sha256 === sha256)) fail("ne velja za to kazalo (SHA-256 se ne ujema)");
  // Čas vpisa v javni dnevnik mora biti v času veljavnosti potrdila (preverjanje smiselnosti, ni kriptografsko).
  const t = Number(vm.tlogEntries?.[0]?.integratedTime) * 1000;
  if (t && (t < Date.parse(leaf.validFrom) - 60_000 || t > Date.parse(leaf.validTo) + 60_000)) fail("čas podpisa ni v veljavnosti potrdila");
  return { san, cas: t ? new Date(t).toISOString() : null };
}
