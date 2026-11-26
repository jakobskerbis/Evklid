@echo off
"%SystemRoot%\System32\chcp.com" 65001 >nul
rem Ustavi delavca Lean in ga izklopi ob vklopu (NAVODILA.md). Znova: dvoklik na zazeni.bat.
"%SystemRoot%\System32\net.exe" session >nul 2>&1
if errorlevel 1 goto povisaj
"%SystemRoot%\System32\schtasks.exe" /End /TN "Evklid Lean delavec"
"%SystemRoot%\System32\schtasks.exe" /Change /TN "Evklid Lean delavec" /DISABLE
echo  Delavec Lean je ustavljen. Znova ga zazenes z dvoklikom na zazeni.bat.
pause
exit /b
:povisaj
set "USTAVI=%~f0"
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -Command "Start-Process -FilePath $env:USTAVI -Verb RunAs"
