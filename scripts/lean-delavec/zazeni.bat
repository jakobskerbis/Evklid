@echo off
"%SystemRoot%\System32\chcp.com" 65001 >nul
setlocal EnableExtensions
rem Delavec Lean za Evklid (docs/lean.md L5, NAVODILA.md). Dvoklik zadostuje (vprasa za skrbniske pravice).
rem Namestitev: vse v C:\Evklid\lean-delavec (zunaj j-jevega profila), Node, Git, elan, Lean in prevedeni Mathlib
rem (okoli 7 GB), omejen uporabnik evklid-lean in opravilo v Razporejevalniku opravil, ki delavca zazene ob vklopu
rem kot ta uporabnik (tudi brez prijave). Lean zato ne more brati j-jevih datotek.
rem "zazeni.bat delavec" zazene opravilo (kot evklid-lean): samo zanka delavca.
rem Brez oklepajev okoli ukazov s potmi (pot z ")" bi pokvarila blok): samo goto.
set "S32=%SystemRoot%\System32"
set "PS=%S32%\WindowsPowerShell\v1.0\powershell.exe"
set "KOREN=C:\Evklid"
set "CILJ=%KOREN%\lean-delavec"
set "UPORABNIK=evklid-lean"
set "OPRAVILO=Evklid Lean delavec"
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
set "NODE=%ORODJA%\node\node-v24.22.3-win-x64\node.exe"
set "GIT=%ORODJA%\git\cmd\git.exe"
rem elan, Lean in predpomnilnik Mathliba v mapi delavca, ne v profilu uporabnika
set "ELAN_HOME=%ORODJA%\elan-home"
set "MATHLIB_CACHE_DIR=%ORODJA%\mathlib-cache"
set "LAKE=%ELAN_HOME%\bin\lake.exe"
set "PATH=%ORODJA%\git\cmd;%ELAN_HOME%\bin;%PATH%"
if /i "%~1"=="delavec" goto delavec

rem ================= namestitev (j, dvoklik) =================
title Evklid - namestitev delavca Lean
rem ---- mapa mora biti razpakirana (dvoklik v zip zazene samo to datoteko iz zacasne mape) ----
if not exist "%TU%delavec.mjs" goto ni_razpakirano
if not exist "%TU%projekt\lean-toolchain" goto ni_razpakirano
if not exist "%TU%omeji.ps1" goto ni_razpakirano
"%S32%\net.exe" session >nul 2>&1
if errorlevel 1 goto povisaj

rem ---- C:\Evklid: lastnik Administratorji, brez podedovanih pravic (C:\ da "Authenticated Users" spreminjanje),
rem      PREDEN se karkoli skopira ali prenese ----
if not exist "%KOREN%" mkdir "%KOREN%"
"%S32%\icacls.exe" "%KOREN%" /setowner *S-1-5-32-544 /Q >nul
if errorlevel 1 goto napaka
"%S32%\icacls.exe" "%KOREN%" /inheritance:r /grant:r *S-1-5-18:(OI)(CI)F *S-1-5-32-544:(OI)(CI)F "%USERDOMAIN%\%USERNAME%":(OI)(CI)F *S-1-5-32-545:RX /Q >nul
if errorlevel 1 goto napaka
if not exist "%CILJ%" goto ni_cilja
"%S32%\icacls.exe" "%CILJ%" /setowner *S-1-5-32-544 /Q >nul
if errorlevel 1 goto napaka
:ni_cilja

rem ---- vedno v C:\Evklid\lean-delavec (ne namizje, ne OneDrive) ----
if /i "%TU%"=="%CILJ%\" goto na_mestu
echo  Kopiram delavca v %CILJ% ...
call :ustavi
"%S32%\robocopy.exe" "%TU%." "%CILJ%" /E /XD orodja delo .lake /XF nastavitve.json stanje.json dnevnik.txt* /NFL /NDL /NJH /NJS /NP >nul
if errorlevel 8 goto napaka
call "%CILJ%\zazeni.bat"
exit /b

:povisaj
echo  Windows bo vprasal za dovoljenje (skrbnik). Klikni Da.
set "ZAZENI=%~f0"
"%PS%" -NoProfile -Command "Start-Process -FilePath $env:ZAZENI -Verb RunAs"
exit /b

:na_mestu
cd /d "%CILJ%"
echo.
echo  Evklid: namestitev delavca Lean (dokazuje matematicne trditve)
echo  Okno pusti odprto. Ne klikaj v okno (to ustavi izpis; ce se je ustavilo, pritisni Esc).
echo.
call :ustavi
if not exist "%ORODJA%" mkdir "%ORODJA%"

rem ---- Node (prenosna kopija v orodja\node) ----
if exist "%NODE%" goto imam_node
echo  Prenasam Node %NODE_RAZL% (okoli 35 MB) ...
call :prenesi "https://nodejs.org/dist/%NODE_RAZL%/%NODE_ZIP%" "%ORODJA%\%NODE_ZIP%" "%NODE_SHA%" "%ORODJA%\node" || goto napaka
:imam_node

rem ---- Git (lake z njim prenese Mathlib) ----
if exist "%GIT%" goto imam_git
echo  Prenasam Git (okoli 40 MB) ...
call :prenesi "%GIT_URL%" "%ORODJA%\%GIT_ZIP%" "%GIT_SHA%" "%ORODJA%\git" || goto napaka
:imam_git

rem ---- elan v4.4.0 in Lean (razlicica iz projekt\lean-toolchain) ----
if exist "%LAKE%" goto imam_elan
echo  Namescam elan v4.4.0 ...
call :prenesi "%ELAN_URL%" "%ORODJA%\elan.zip" "%ELAN_SHA%" "%ORODJA%\elan" || goto napaka
"%ORODJA%\elan\elan-init.exe" -y --default-toolchain none --no-modify-path
if errorlevel 1 goto napaka
:imam_elan

rem ---- prevedeni Mathlib: znova, ce se je spremenil lean-toolchain ali lake-manifest.json ----
copy /b /y "%CILJ%\projekt\lean-toolchain" + "%CILJ%\projekt\lake-manifest.json" "%ORODJA%\mathlib-zdaj.txt" >nul
if not exist "%CILJ%\projekt\.lake\packages\mathlib\.lake\build\lib\lean\Mathlib.olean" goto prenesi_mathlib
if not exist "%ORODJA%\mathlib-rev.txt" goto prenesi_mathlib
"%S32%\fc.exe" /b "%ORODJA%\mathlib-zdaj.txt" "%ORODJA%\mathlib-rev.txt" >nul
if errorlevel 1 goto prenesi_mathlib
goto imam_mathlib
:prenesi_mathlib
echo  Prenasam prevedeni Mathlib (prvic lahko traja ure; okno pusti odprto) ...
pushd "%CILJ%\projekt"
"%LAKE%" exe cache get
set "RC=%ERRORLEVEL%"
popd
if not "%RC%"=="0" goto napaka
move /y "%ORODJA%\mathlib-zdaj.txt" "%ORODJA%\mathlib-rev.txt" >nul
:imam_mathlib

rem ---- lean.json: pot do lean.exe in LEAN_PATH (delavec nato tece brez lake in git) ----
pushd "%CILJ%\projekt"
"%LAKE%" env "%NODE%" "%CILJ%\delavec.mjs" --shrani-lean "%ORODJA%\lean.json"
set "RC=%ERRORLEVEL%"
popd
if not "%RC%"=="0" goto napaka

rem ---- nastavitve.json z zetonom (prvic) ----
if not exist "%CILJ%\delo" mkdir "%CILJ%\delo"
"%NODE%" "%CILJ%\delavec.mjs" --pripravi
if not exist "%CILJ%\nastavitve.json" goto napaka

rem ---- uporabnik evklid-lean, pravice map, opravilo ob vklopu ----
echo  Pripravljam uporabnika %UPORABNIK% in opravilo "%OPRAVILO%" ...
"%PS%" -NoProfile -ExecutionPolicy Bypass -File "%CILJ%\uporabnik.ps1" -Mapa "%CILJ%" -Ime "%UPORABNIK%" -Opravilo "%OPRAVILO%" -LeanJson "%ORODJA%\lean.json"
if errorlevel 1 goto napaka
rem pokrov zaprt na polnilcu: ne naredi nic (prenosnik ne zaspi)
"%S32%\powercfg.exe" /setacvalueindex SCHEME_CURRENT SUB_BUTTONS LIDACTION 0 >nul 2>&1
"%S32%\powercfg.exe" /setactive SCHEME_CURRENT >nul 2>&1
"%S32%\schtasks.exe" /Run /TN "%OPRAVILO%" >nul
if errorlevel 1 goto napaka
echo.
echo  ============================================
echo   KONCANO. Delavec tece v ozadju kot uporabnik %UPORABNIK%
echo   (tudi po ponovnem zagonu, brez prijave). To okno lahko zapres.
echo   Stanje: %CILJ%\delo\stanje.json
echo   Dnevnik: %CILJ%\delo\dnevnik.txt
echo  ============================================
echo.
pause
exit /b 0

rem ================= delavec (opravilo, kot evklid-lean) =================
:delavec
cd /d "%TU%"
if not exist "%TU%delo\tmp" mkdir "%TU%delo\tmp"
set "TEMP=%TU%delo\tmp"
set "TMP=%TU%delo\tmp"
:zanka
"%NODE%" "%TU%delavec.mjs" --mapa "%TU%delo"
rem ce se kdaj konca, ga po 30 s znova zazenemo (ping: timeout.exe v opravilu brez konzole ne dela)
"%S32%\PING.EXE" -n 31 127.0.0.1 >nul
goto zanka

rem ---- ustavi opravilo in VSE procese uporabnika evklid-lean (schtasks /End konca samo cmd.exe; node.exe, Lean
rem      in PowerShell bi tekli naprej, po /Run pa bi tekla dva delavca) ----
:ustavi
rem izklop najprej: opravilo se ob napaki znova zazene (vsako minuto); uporabnik.ps1 ga na koncu spet vklopi
"%S32%\schtasks.exe" /Change /TN "%OPRAVILO%" /DISABLE >nul 2>&1
"%S32%\schtasks.exe" /End /TN "%OPRAVILO%" >nul 2>&1
"%S32%\taskkill.exe" /F /T /FI "USERNAME eq %UPORABNIK%" >nul 2>&1
exit /b 0

rem ---- prenos + SHA-256 + razpakiranje: %1 naslov, %2 datoteka, %3 sha256, %4 mapa ----
:prenesi
"%S32%\curl.exe" -L --fail --retry 5 -o "%~2" "%~1"
if errorlevel 1 exit /b 1
set "DPOT=%~2"
set "DSHA=%~3"
"%PS%" -NoProfile -ExecutionPolicy Bypass -Command "if ((Get-FileHash -Algorithm SHA256 -LiteralPath $env:DPOT).Hash -ne $env:DSHA) { exit 1 }"
if errorlevel 1 goto pokvarjeno
if not exist "%~4" mkdir "%~4"
"%S32%\tar.exe" -xf "%~2" -C "%~4"
if errorlevel 1 exit /b 1
del "%~2"
exit /b 0
:pokvarjeno
del "%~2"
echo  NAPAKA: prenesena datoteka je pokvarjena (SHA-256), izbrisana.
exit /b 1

:ni_razpakirano
echo.
echo  ============================================
echo   MAPA NI RAZPAKIRANA.
echo   Zapri to okno. Desni klik na datoteko .zip, izberi
echo   "Izvleci vse" in v razpakirani mapi lean-delavec
echo   znova dvakrat klikni zazeni.bat.
echo  ============================================
echo.
pause
exit /b 1

:napaka
echo.
echo  ============================================
echo   NAPAKA. Poslji Claudu sliko tega okna.
echo   Nato znova dvakrat klikni zazeni.bat.
echo  ============================================
echo.
pause
exit /b 1
