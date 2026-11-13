@echo off
rem EVKLID-SAMOPOSODOBITEV: kratka skripta, samodejna posodobitev jo sme prepisati.
setlocal
rem Enkrat dvakrat klikni: Evklid za telefon se odslej zazene sam, ko prizges racunalnik
rem (okno se odpre pomanjsano). Ce ga zazenes se enkrat, samodejni zagon izklopis.
cd /d "%~dp0"
set "STEM_DIR=%~dp0"
set "LINK=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\Evklid za telefon.lnk"

if exist "%LINK%" (
  choice /c DN /m "Samodejni zagon je ze vklopljen. Ga izklopim"
  if errorlevel 2 goto konec
  del "%LINK%"
  echo Samodejni zagon je izklopljen.
  goto konec
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$d=$env:STEM_DIR.TrimEnd('\');" ^
  "$s=(New-Object -ComObject WScript.Shell).CreateShortcut($env:LINK);" ^
  "$s.TargetPath=(Join-Path $d 'telefon-windows.bat');" ^
  "$s.WorkingDirectory=$d;" ^
  "$s.WindowStyle=7;" ^
  "$s.IconLocation=(Join-Path $d 'assets\evklid.ico');" ^
  "$s.Description='Evklid za telefon';" ^
  "$s.Save()"
if errorlevel 1 (
  echo Samodejnega zagona ni bilo mogoce vklopiti.
  goto konec
)
echo Samodejni zagon je vklopljen: Evklid za telefon se zazene ob vsakem prizigu racunalnika.
echo.
choice /c DN /m "Naj racunalnik ne zaspi, ko je prikljucen na elektriko (sicer povezava ugasne)"
if errorlevel 2 goto konec
powercfg /change standby-timeout-ac 0
echo Racunalnik na elektriki ne bo vec zaspal. Zaslon se se vedno ugasne kot prej.

:konec
echo.
pause
