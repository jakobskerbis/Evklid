@echo off
rem EVKLID-SAMOPOSODOBITEV: kratka skripta, samodejna posodobitev jo sme prepisati.
rem Enkrat dvakrat klikni to datoteko: na namizju ustvari bliznjico "Evklid".
cd /d "%~dp0"
set "STEM_DIR=%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$d=$env:STEM_DIR.TrimEnd('\');" ^
  "$desk=[Environment]::GetFolderPath('Desktop');" ^
  "$s=(New-Object -ComObject WScript.Shell).CreateShortcut((Join-Path $desk 'Evklid.lnk'));" ^
  "$s.TargetPath=(Join-Path $d 'zagon-windows.bat');" ^
  "$s.WorkingDirectory=$d;" ^
  "$s.IconLocation=(Join-Path $d 'assets\evklid.ico');" ^
  "$s.Description='Odpri Evklid';" ^
  "$s.Save()"
if errorlevel 1 (
  echo Bliznjice ni bilo mogoce ustvariti.
) else (
  echo.
  echo Bliznjica Evklid je na namizju. Odslej klikni kar njo.
)
echo.
pause
