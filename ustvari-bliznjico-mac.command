#!/bin/bash
# EVKLID-SAMOPOSODOBITEV: kratka skripta, samodejna posodobitev jo sme prepisati.
# Enkrat dvakrat klikni to datoteko: na namizju ustvari bližnjico "Evklid".
DIR="$(cd "$(dirname "$0")" && pwd)"
LINK="$HOME/Desktop/Evklid"
rm -f "$LINK"
osascript -e "tell application \"Finder\" to make alias file to POSIX file \"$DIR/zagon-mac.command\" at POSIX file \"$HOME/Desktop\" with properties {name:\"Evklid\"}" >/dev/null
osascript -l JavaScript -e "ObjC.import('AppKit'); \$.NSWorkspace.sharedWorkspace.setIconForFileOptions(\$.NSImage.alloc.initWithContentsOfFile('$DIR/assets/evklid.png'), '$LINK', 0)" >/dev/null 2>&1
echo
echo "Bližnjica Evklid je na namizju. Odslej klikni kar njo."
read -r -p "Pritisni Enter za izhod."
