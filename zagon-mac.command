#!/bin/bash
# EVKLID-SAMOPOSODOBITEV: vse je v funkciji main, ki jo bash prebere v celoti, zato lahko
# samodejna posodobitev to datoteko varno prepiše tudi med tekom.
main() {
  cd "$(dirname "$0")" || exit 1

  # Če Evklid že teče, samo odpri brskalnik.
  if lsof -iTCP:3000 -sTCP:LISTEN >/dev/null 2>&1; then
    open http://localhost:3000
    exit 0
  fi

  if ! command -v node >/dev/null 2>&1; then
    echo "Node.js ni nameščen. Namesti ga s https://nodejs.org (gumb LTS) in nato znova odpri to datoteko."
    read -r -p "Pritisni Enter za izhod."
    exit 1
  fi

  # Najprej najnovejša različica z GitHuba; nato to datoteko preberemo znova od začetka.
  if [ "$1" != "--posodobljeno" ]; then
    node scripts/posodobitev.js
    exec bash "$0" --posodobljeno
  fi

  if [ ! -f .env ]; then
    echo
    read -r -p "Prilepi svoj API ključ (sk-ant-...) in pritisni Enter: " KEY
    echo "ANTHROPIC_API_KEY=$KEY" > .env
    echo "Ključ je shranjen v datoteko .env"
  fi

  # Knjižnice namesti ob prvem zagonu in po vsaki posodobitvi (ko se package.json spremeni).
  if ! cmp -s package.json node_modules/.evklid-package.json; then
    echo "Nameščam potrebne knjižnice, to traja minuto ..."
    npm install --omit=dev --no-audit --no-fund && cp package.json node_modules/.evklid-package.json
  fi

  echo
  echo "Evklid se zaganja. Brskalnik se bo odprl sam."
  echo "Za ustavitev zapri to okno. Nove različice se namestijo same (preverjanje vsakih 15 minut)."
  node scripts/zaganjalnik.js zagon --odpri
  exit $?
}
main "$@"
exit $?
