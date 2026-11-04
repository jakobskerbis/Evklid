// »Organi v 3D«. Pogodba: docs/3d.md (»Organi iz GLB«). Organi so pravi anatomski modeli v GLB
// (public/3d/modeli/organi-3d, gradi jih public/3d/organ.js; viri v public/3d/viri.json). Prerezi tkiv »pod povečavo«
// (mrežnica, pljučni mešički, nefron, jetrni režnjič) so zgrajeni v kodi; organi nanje kažejo z `povecava` v delih.
export default [
  { id: "organ-mozgani", pot: "./mozgani.js", naslov: "Možgani", predmet: "BIO", opis: "Režnji velikih možganov, mali možgani in možgansko deblo v pravi obliki." },
  { id: "organ-srce", pot: "./srce.js", naslov: "Srce", predmet: "BIO", opis: "Prekata, preddvora, zaklopke in venčne žile; prerez odpre srce." },
  { id: "organ-oko", pot: "./oko.js", naslov: "Oko", predmet: "BIO", opis: "Plasti zrkla, leča, šarenica in očesne mišice v prerezu." },
  { id: "organ-mreznica", pot: "./mreznica.js", naslov: "Mrežnica pod povečavo", predmet: "BIO", opis: "Plasti mrežnice s paličicami, čepki in živčnimi celicami; svetloba gre skozi vse plasti." },
  { id: "organ-mesicki", pot: "./mesicki.js", naslov: "Pljučni mešički", predmet: "BIO", opis: "Grozd pljučnih mešičkov s kapilarami; kisik gre iz zraka v kri, ogljikov dioksid iz krvi v zrak." },
  { id: "organ-nefron", pot: "./nefron.js", naslov: "Nefron", predmet: "BIO", opis: "Glomerul, Bowmanova kapsula, cevke in Henlejeva zanka: kako ledvica iz krvi naredi seč." },
  { id: "organ-jetrni-reznjic", pot: "./jetrni-reznjic.js", naslov: "Jetrni režnjič", predmet: "BIO", opis: "Šesterokotni režnjič jeter: kri teče proti centralni veni, žolč proti vogalom." },
];
