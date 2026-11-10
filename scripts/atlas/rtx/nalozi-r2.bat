@echo off
chcp 65001 >nul
setlocal EnableExtensions
rem Naloži podatke »Pravi prerez telesa« iz izhod\rezine v vedro Cloudflare R2 (EU). Zažene ga j z dvoklikom v mapi peka-rtx.
rem Brez namestitve in brez skrbniških pravic: prenosni rclone se prenese z uradne strani v to mapo in preveri (SHA-256).
rem Ključa vtipkaš tukaj v okno; nikamor se ne shranita in nikoli ju ne vpisuj v klepet.
rem Datoteke gredo v mapo različice (v1/); stara različica ostane, zato imajo datoteke dolgo predpomnjenje (immutable).
cd /d "%~dp0"
set "RV=v1.68.2"
set "RZIP=rclone-%RV%-windows-amd64.zip"
set "RSHA=812bf76cc02c04cf6327f3683f3d5a88e47d36c39db84c1a745777496be7d993"
set "RC=%~dp0rclone\rclone-%RV%-windows-amd64\rclone.exe"
if not exist "izhod\rezine" echo  V mapi izhod\rezine ni podatkov (obdelava se ni koncana). & pause & exit /b 1
if exist "%RC%" goto imam
if not exist rclone mkdir rclone
echo  Prenasam rclone %RV% z downloads.rclone.org ...
curl -L --fail --retry 5 -o "rclone\%RZIP%" "https://downloads.rclone.org/%RV%/%RZIP%"
if errorlevel 1 echo  NAPAKA: prenos ni uspel. & pause & exit /b 1
powershell -NoProfile -Command "if ((Get-FileHash -Algorithm SHA256 -LiteralPath 'rclone\%RZIP%').Hash -ne '%RSHA%') { exit 1 }"
if errorlevel 1 del "rclone\%RZIP%" & echo  NAPAKA: preneseni rclone se ne ujema s preverjeno razlicico, izbrisan. & pause & exit /b 1
tar -xf "rclone\%RZIP%" -C rclone
del "rclone\%RZIP%"
:imam
echo.
echo  Podatke najdes v Cloudflare: R2 ^> Manage API tokens (zeton samo za vedro, pravica Object Read ^& Write).
set /p "R2_RACUN=  ID racuna (Account ID): "
set /p "R2_VEDRO=  Ime vedra (npr. evklid-rezine): "
set /p "RCLONE_CONFIG_R2_ACCESS_KEY_ID=  Access Key ID: "
set /p "RCLONE_CONFIG_R2_SECRET_ACCESS_KEY=  Secret Access Key: "
set "RCLONE_CONFIG_R2_TYPE=s3"
set "RCLONE_CONFIG_R2_PROVIDER=Cloudflare"
set "RCLONE_CONFIG_R2_ENDPOINT=https://%R2_RACUN%.eu.r2.cloudflarestorage.com"
set "RCLONE_CONFIG_R2_NO_CHECK_BUCKET=true"
set "RAZL=v1"
echo.
echo  Nalagam izhod\rezine v %R2_VEDRO%/%RAZL%/ (lahko traja vec ur; ob prekinitvi zazeni znova, nadaljuje) ...
"%RC%" copy "izhod\rezine" "r2:%R2_VEDRO%/%RAZL%" --exclude "predogled.webp" --exclude "poravnava.webp" --transfers 16 --checkers 32 --s3-upload-concurrency 4 --header-upload "Cache-Control: public, max-age=31536000, immutable" --progress --stats 30s
if errorlevel 1 echo  NAPAKA pri nalaganju. Zazeni znova (nadaljuje, kjer je ostalo). & pause & exit /b 1
echo.
echo  KONCANO. Sporoci Claudu, da je nalaganje koncano (kljucev mu ne posiljaj).
pause
