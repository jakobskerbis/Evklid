# Omejen uporabnik za Lean (docs/lean.md L5, odlocitev j 26. 11. 2026). Zazene ga zazeni.bat kot skrbnik.
# 1. lokalni standardni uporabnik evklid-lean (ni skrbnik, skrit na prijavnem zaslonu), novo nakljucno geslo ob
#    vsaki namestitvi; gesla nihce ne pozna in ni nikjer zapisano (shrani ga samo Razporejevalnik opravil);
# 2. pravice mape C:\Evklid\lean-delavec: brez dedovanja (C:\ sicer da "Authenticated Users" pravico spreminjanja),
#    SYSTEM, Administratorji in j polno, evklid-lean samo branje in zagon; pisanje samo v delo\;
# 3. opravilo ob vklopu racunalnika kot evklid-lean ("zazeni, ce je uporabnik prijavljen ali ne"), brez casovne
#    meje, tudi na bateriji, ob napaki znova vsako minuto.
# Lean (otrok delavca) tece kot evklid-lean, zato ne more brati C:\Users\<j> (tja ima dostop samo lastnik).
param(
  [Parameter(Mandatory = $true)][string]$Mapa,
  [Parameter(Mandatory = $true)][string]$Ime,
  [Parameter(Mandatory = $true)][string]$Opravilo
)
$ErrorActionPreference = 'Stop'

$bajti = New-Object byte[] 30
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bajti)
$geslo = [Convert]::ToBase64String($bajti) + 'aA1!'
$varno = ConvertTo-SecureString $geslo -AsPlainText -Force

if (Get-LocalUser -Name $Ime -ErrorAction SilentlyContinue) {
  Set-LocalUser -Name $Ime -Password $varno -PasswordNeverExpires $true
  Enable-LocalUser -Name $Ime
} else {
  New-LocalUser -Name $Ime -Password $varno -PasswordNeverExpires -UserMayNotChangePassword -Description 'Evklid: samo za Lean' | Out-Null
}
# Uporabniki (S-1-5-32-545) da, Administratorji (S-1-5-32-544) nikoli
Add-LocalGroupMember -SID 'S-1-5-32-545' -Member $Ime -ErrorAction SilentlyContinue
Remove-LocalGroupMember -SID 'S-1-5-32-544' -Member $Ime -ErrorAction SilentlyContinue
$k = 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\SpecialAccounts\UserList'
New-Item -Path $k -Force | Out-Null
New-ItemProperty -Path $k -Name $Ime -Value 0 -PropertyType DWord -Force | Out-Null

# Pravice. Brez /T: otroci podedujejo od mape (nobena datoteka nima svojih pravic).
$jaz = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$icacls = Join-Path $env:SystemRoot 'System32\icacls.exe'
& $icacls $Mapa /inheritance:r /grant:r '*S-1-5-18:(OI)(CI)F' '*S-1-5-32-544:(OI)(CI)F' "${jaz}:(OI)(CI)F" "${Ime}:(OI)(CI)RX" /Q | Out-Null
if ($LASTEXITCODE -ne 0) { throw "icacls $Mapa" }
$delo = Join-Path $Mapa 'delo'
New-Item -ItemType Directory -Path (Join-Path $delo 'tmp') -Force | Out-Null
& $icacls $delo /grant "${Ime}:(OI)(CI)M" /Q | Out-Null
if ($LASTEXITCODE -ne 0) { throw "icacls $delo" }

$bat = Join-Path $Mapa 'zazeni.bat'
$akcija = New-ScheduledTaskAction -Execute (Join-Path $env:SystemRoot 'System32\cmd.exe') -Argument "/d /c `"`"$bat`" delavec`"" -WorkingDirectory $Mapa
$sprozilec = New-ScheduledTaskTrigger -AtStartup
$nastavitve = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable `
  -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1) -MultipleInstances IgnoreNew
Register-ScheduledTask -TaskName $Opravilo -Action $akcija -Trigger $sprozilec -Settings $nastavitve `
  -User $Ime -Password $geslo -RunLevel Limited -Force | Out-Null
$geslo = $null
