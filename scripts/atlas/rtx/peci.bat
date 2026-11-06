@echo off
chcp 65001 >nul
setlocal EnableExtensions
rem Peka 3D organov Evklida na grafični kartici Nvidia (scripts/atlas/rtx/). Dvoklik zadostuje.
rem Najde Blender 5.2 (nameščen ali prenosna kopija v mapi blender\; če ga ni, ga prenese z blender.org in preveri),
rem nato koda\rtx.py prenese vhode, speče organe iz organi.txt in piše dnevnik.txt v to mapo.
cd /d "%~dp0"
set "TU=%~dp0"
set "RAZL=5.2.3"
set "BZIP=blender-5.2.3-windows-x64.zip"
set "BURL=https://download.blender.org/release/Blender5.2/blender-5.2.3-windows-x64.zip"
set "BSHA=723f08a4401502561eb763cdeacf8745b31e5f3f154d287d3830d97cf75dc2fb"
set "BMAPA=%TU%blender\blender-5.2.3-windows-x64"
title Evklid - peka 3D organov
echo.
echo  Evklid: peka 3D organov na grafični kartici
echo  Okno pusti odprto. Prenosnik naj bo na polnilcu. Peka lahko traja dolgo.
echo.

set "BLENDER="
if exist "%BMAPA%\blender.exe" set "BLENDER=%BMAPA%\blender.exe"
if not defined BLENDER for /d %%D in ("%ProgramFiles%\Blender Foundation\Blender 5.2*") do if exist "%%~D\blender.exe" set "BLENDER=%%~D\blender.exe"
if defined BLENDER goto imam

echo  Blender %RAZL% ni nameščen: prenašam ga z blender.org (okoli 400 MB) ...
if not exist "%TU%blender" mkdir "%TU%blender"
curl -L --fail --retry 5 -C - -o "%TU%blender\%BZIP%" "%BURL%"
if errorlevel 1 if not errorlevel 34 if errorlevel 33 goto preveri
if errorlevel 1 goto napaka_prenos
:preveri
powershell -NoProfile -ExecutionPolicy Bypass -Command "if ((Get-FileHash -Algorithm SHA256 -LiteralPath '%TU%blender\%BZIP%').Hash -ne '%BSHA%') { exit 1 }"
if errorlevel 1 goto napaka_sha
echo  Blender preverjen (SHA-256). Razpakiram ...
tar -xf "%TU%blender\%BZIP%" -C "%TU%blender"
if errorlevel 1 goto napaka_razpakiraj
del "%TU%blender\%BZIP%"
set "BLENDER=%BMAPA%\blender.exe"
if not exist "%BLENDER%" goto napaka_razpakiraj

:imam
for %%B in ("%BLENDER%") do set "BDIR=%%~dpB"
set "PY="
for /d %%P in ("%BDIR%5.2*") do if exist "%%~P\python\bin\python.exe" set "PY=%%~P\python\bin\python.exe"
if not defined PY goto napaka_python
echo  Blender: %BLENDER%
echo.
"%PY%" -X utf8 "%TU%koda\rtx.py" --blender "%BLENDER%"
if errorlevel 1 goto napaka_peka
echo.
echo  ============================================
echo   KONČANO. Sporoči Claudu, da je peka končana.
echo  ============================================
echo.
pause
exit /b 0

:napaka_prenos
echo  NAPAKA: prenos Blenderja ni uspel. Preveri internet in znova dvakrat klikni peci.bat.
goto konec_napaka
:napaka_sha
del "%TU%blender\%BZIP%"
echo  NAPAKA: preneseni Blender je pokvarjen (SHA-256 se ne ujema), izbrisan. Znova dvakrat klikni peci.bat.
goto konec_napaka
:napaka_razpakiraj
echo  NAPAKA: Blenderja ni bilo mogoče razpakirati (je na disku dovolj prostora, vsaj 5 GB?).
goto konec_napaka
:napaka_python
echo  NAPAKA: v mapi Blenderja ni Pythona (%BDIR%). Izbriši mapo blender in znova dvakrat klikni peci.bat.
goto konec_napaka
:napaka_peka
echo  NAPAKA med peko: podrobnosti so v datoteki dnevnik.txt v tej mapi.
:konec_napaka
echo.
echo  ============================================
echo   KONČANO Z NAPAKO. Sporoči Claudu (dnevnik.txt).
echo  ============================================
echo.
pause
exit /b 1
