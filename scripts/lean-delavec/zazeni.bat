@echo off
"%SystemRoot%\System32\chcp.com" 65001 >nul
setlocal EnableExtensions
rem Delavec Lean za Evklid (docs/lean.md L5, NAVODILA.md). Dvoklik zadostuje. Prvič namesti Node, Git, elan,
rem Lean in prevedeni Mathlib (okoli 7 GB), nato vsakih 20 s vpraša evklid.app za trditev in jo dokaže z Leanom.
rem Samo izhodna povezava; okno pusti odprto. Ne zamenjaj te datoteke, dokler okno teče (cmd jo bere sproti).
set "S32=%SystemRoot%\System32"
cd /d "%~dp0"
set "TU=%~dp0"
set "NODE_RAZL=v24.22.3"
set "NODE_ZIP=node-v24.22.3-win-x64.zip"
set "NODE_SHA=e612af99f626ab415ea225af6bce5c971feb448cb5cae250bb1c3fa50c5f7d9f"
set "GIT_ZIP=MinGit-2.51.0-64-bit.zip"
set "GIT_URL=https://github.com/git-for-windows/git/releases/download/v2.51.0.windows.1/MinGit-2.51.0-64-bit.zip"
set "GIT_SHA=c2c955a21fa99889d83f485f24fa5d9a38fffc2d509d4022385510e11c26b250"
set "ELAN_URL=https://github.com/leanprover/elan/releases/download/v4.4.0/elan-x86_64-pc-windows-msvc.zip"
set "ELAN_SHA=63f50605424284927799702347e2bdbd99d017b9d80ae083c65ee2189c4caf75"
set "ORODJA=%TU%orodja"
title Evklid - delavec Lean
echo.
echo  Evklid: delavec Lean (dokazuje matematicne trditve)
echo  Okno pusti odprto. Prenosnik naj bo na polnilcu. Ustavis ga tako, da zapres okno.
echo.
if not exist "%ORODJA%" mkdir "%ORODJA%"

rem ---- Node (prenosna kopija v orodja\node, ce ni namescen) ----
set "NODE=%ORODJA%\node\node-v24.22.3-win-x64\node.exe"
if exist "%NODE%" goto imam_node
echo  Prenasam Node %NODE_RAZL% (okoli 35 MB) ...
call :prenesi "https://nodejs.org/dist/%NODE_RAZL%/%NODE_ZIP%" "%ORODJA%\%NODE_ZIP%" "%NODE_SHA%" "%ORODJA%\node" || goto napaka
:imam_node

rem ---- Git (lake z njim prenese Mathlib) ----
set "GIT=%ORODJA%\git\cmd\git.exe"
if exist "%GIT%" goto imam_git
echo  Prenasam Git (okoli 40 MB) ...
call :prenesi "%GIT_URL%" "%ORODJA%\%GIT_ZIP%" "%GIT_SHA%" "%ORODJA%\git" || goto napaka
:imam_git
set "PATH=%ORODJA%\git\cmd;%USERPROFILE%\.elan\bin;%PATH%"

rem ---- elan v4.4.0 in Lean (razlicica iz projekt\lean-toolchain) ----
if exist "%USERPROFILE%\.elan\bin\lake.exe" goto imam_elan
echo  Namescam elan v4.4.0 ...
call :prenesi "%ELAN_URL%" "%ORODJA%\elan.zip" "%ELAN_SHA%" "%ORODJA%\elan" || goto napaka
"%ORODJA%\elan\elan-init.exe" -y --default-toolchain none
if errorlevel 1 goto napaka
:imam_elan

rem ---- prevedeni Mathlib (prvic dolgo, okoli 7 GB) ----
if exist "%TU%projekt\.lake\packages\mathlib\.lake\build\lib\lean\Mathlib.olean" goto imam_mathlib
echo  Prenasam prevedeni Mathlib (prvic lahko traja ure; okno pusti odprto) ...
pushd "%TU%projekt"
"%USERPROFILE%\.elan\bin\lake.exe" exe cache get
set "RC=%ERRORLEVEL%"
popd
if not "%RC%"=="0" goto napaka
:imam_mathlib

rem ---- nastavitve.json z zetonom (prvic) ----
"%NODE%" "%TU%delavec.mjs" --pripravi
if not exist "%TU%nastavitve.json" goto napaka

rem ---- delavec: ce se kdaj konca, ga po 30 s znova zazenemo ----
:zanka
echo  Delavec tece. Stanje: stanje.json, dnevnik: dnevnik.txt
"%NODE%" "%TU%delavec.mjs"
echo  Delavec se je ustavil; znova cez 30 s ...
"%S32%\timeout.exe" /t 30 /nobreak >nul
goto zanka

rem ---- prenos + SHA-256 + razpakiranje: %1 naslov, %2 datoteka, %3 sha256, %4 mapa ----
:prenesi
"%S32%\curl.exe" -L --fail --retry 5 -o "%~2" "%~1"
if errorlevel 1 exit /b 1
set "DPOT=%~2"
set "DSHA=%~3"
"%S32%\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -ExecutionPolicy Bypass -Command "if ((Get-FileHash -Algorithm SHA256 -LiteralPath $env:DPOT).Hash -ne $env:DSHA) { exit 1 }"
if errorlevel 1 (del "%~2" & echo  NAPAKA: prenesena datoteka je pokvarjena ^(SHA-256^), izbrisana. & exit /b 1)
if not exist "%~4" mkdir "%~4"
"%S32%\tar.exe" -xf "%~2" -C "%~4"
if errorlevel 1 exit /b 1
del "%~2"
exit /b 0

:napaka
echo.
echo  ============================================
echo   NAPAKA. Poslji Claudu datoteko dnevnik.txt
echo   ali sliko tega okna. Nato znova dvakrat klikni zazeni.bat.
echo  ============================================
echo.
pause
exit /b 1
