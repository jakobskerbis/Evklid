@echo off
rem EVKLID-SAMOPOSODOBITEV: to datoteko lahko samodejna posodobitev varno prepise tudi med tekom                                            
rem (dolgi ukazi so v eni vrstici z "exit /b", po posodobitvi se datoteka prebere znova).
setlocal enabledelayedexpansion
cd /d "%~dp0"
title Evklid

rem Ce Evklid ze tece, samo odpri brskalnik.
curl -s -o nul -m 2 http://localhost:3000 >nul 2>nul
if not errorlevel 1 (
  start http://localhost:3000
  exit /b 0
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js ni namescen. Namesti ga s https://nodejs.org ^(gumb LTS^) in nato znova dvakrat klikni to datoteko.
  pause
  exit /b 1
)

rem Najprej najnovejsa razlicica z GitHuba; nato to datoteko preberemo znova od zacetka.
if not "%~1"=="--posodobljeno" (
  if exist scripts\posodobitev.js (
    node scripts\posodobitev.js
  ) else (
    rem Starejsa mapa brez programa za posodobitev: prenesi celotno razlicico enkrat po starem.
    echo Prenasam najnovejso razlicico ...
    if exist "%TEMP%\evklid-posodobitev" rmdir /s /q "%TEMP%\evklid-posodobitev"
    mkdir "%TEMP%\evklid-posodobitev"
    curl -L -s -o "%TEMP%\evklid-posodobitev\main.zip" https://github.com/jakobskerbis/evklid/archive/refs/heads/main.zip
    tar -xf "%TEMP%\evklid-posodobitev\main.zip" -C "%TEMP%\evklid-posodobitev" >nul 2>nul
    for /d %%d in ("%TEMP%\evklid-posodobitev\*-main") do if exist "%%d\package.json" robocopy "%%d" "%~dp0." /E /NFL /NDL /NJH /NJS /XF .env /XD data node_modules .git >nul
    rmdir /s /q "%TEMP%\evklid-posodobitev" >nul 2>nul
  )
  call "%~f0" --posodobljeno
  exit /b
)

if not exist .env (
  echo.
  set /p KEY=Prilepi svoj API kljuc ^(sk-ant-...^) in pritisni Enter: 
  echo ANTHROPIC_API_KEY=!KEY!>.env
  echo Kljuc je shranjen v datoteko .env
)

rem Knjiznice namesti ob prvem zagonu in po vsaki posodobitvi (ko se package.json spremeni).
set NEED_INSTALL=0
if not exist node_modules\.evklid-package.json set NEED_INSTALL=1
if exist node_modules\.evklid-package.json fc /b package.json node_modules\.evklid-package.json >nul 2>nul || set NEED_INSTALL=1
if "!NEED_INSTALL!"=="1" (
  echo Namescam potrebne knjiznice, to traja minuto ...
  call npm install --omit=dev --no-audit --no-fund
  copy /y package.json node_modules\.evklid-package.json >nul
)

echo.
echo Evklid se zaganja. Brskalnik se bo odprl sam.
echo Za ustavitev zapri to okno. Nove razlicice se namestijo same (preverjanje vsakih 15 minut).
node scripts\zaganjalnik.js zagon --odpri & pause & exit /b
