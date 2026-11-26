# Zazene Lean v Job Object s trdo mejo pomnilnika (docs/lean.md L5). Klice ga delavec.mjs na Windows:
#   powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File omeji.ps1
# z okoljem EVKLID_MEJA_MB (meja v MB) in EVKLID_LEAN_UKAZ (JSON: [pot do lean.exe, argumenti...]); okolje namesto
# argumentov, ker PowerShell argumente z »-« (-M6144, --json) bere kot svoje parametre.
# 1. ustvari Job Object z JOB_OBJECT_LIMIT_PROCESS_MEMORY (zasedeni pomnilnik vsakega procesa najvec <MB>),
#    KILL_ON_JOB_CLOSE (ce ta PowerShell umre ali ga taskkill ubije, Windows ubije tudi Lean) in
#    DIE_ON_UNHANDLED_EXCEPTION (brez okna z napako);
# 2. ta proces (PowerShell) da v Job; Lean, ki ga nato zazene CreateProcess, je samodejno v istem Jobu;
# 3. Lean dobi isti stdout/stderr (cev do delavca), izhodna koda Leana je izhodna koda tega skripta.
# Ce Jobu ne more nastaviti meje, se Lean NE zazene (izhodna koda 125): brez meje ne tecemo.
$ErrorActionPreference = 'Stop'
$mb = [UInt64]$env:EVKLID_MEJA_MB
$deli = @($env:EVKLID_LEAN_UKAZ | ConvertFrom-Json)
if ($mb -lt 1024 -or $deli.Count -lt 2) { [Console]::Error.WriteLine('omeji.ps1: manjka EVKLID_MEJA_MB ali EVKLID_LEAN_UKAZ'); exit 125 }
$lean = [string]$deli[0]
if (-not [System.IO.Path]::IsPathRooted($lean)) { [Console]::Error.WriteLine('omeji.ps1: pot do Leana ni absolutna'); exit 125 }

Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public static class EvklidJob {
  [StructLayout(LayoutKind.Sequential)] struct BASIC {
    public long PerProcessUserTimeLimit; public long PerJobUserTimeLimit; public uint LimitFlags;
    public UIntPtr MinimumWorkingSetSize; public UIntPtr MaximumWorkingSetSize; public uint ActiveProcessLimit;
    public UIntPtr Affinity; public uint PriorityClass; public uint SchedulingClass; }
  [StructLayout(LayoutKind.Sequential)] struct IO {
    public ulong a; public ulong b; public ulong c; public ulong d; public ulong e; public ulong f; }
  [StructLayout(LayoutKind.Sequential)] struct EXTENDED {
    public BASIC Basic; public IO Io; public UIntPtr ProcessMemoryLimit; public UIntPtr JobMemoryLimit;
    public UIntPtr PeakProcessMemoryUsed; public UIntPtr PeakJobMemoryUsed; }
  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)] struct STARTUPINFO {
    public int cb; public string lpReserved; public string lpDesktop; public string lpTitle;
    public int dwX; public int dwY; public int dwXSize; public int dwYSize; public int dwXCountChars;
    public int dwYCountChars; public int dwFillAttribute; public int dwFlags; public short wShowWindow;
    public short cbReserved2; public IntPtr lpReserved2; public IntPtr hStdInput; public IntPtr hStdOutput;
    public IntPtr hStdError; }
  [StructLayout(LayoutKind.Sequential)] struct PROCINFO {
    public IntPtr hProcess; public IntPtr hThread; public int dwProcessId; public int dwThreadId; }
  [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)] static extern IntPtr CreateJobObject(IntPtr a, string n);
  [DllImport("kernel32.dll", SetLastError = true)] static extern bool SetInformationJobObject(IntPtr j, int c, ref EXTENDED i, uint n);
  [DllImport("kernel32.dll", SetLastError = true)] static extern bool AssignProcessToJobObject(IntPtr j, IntPtr p);
  [DllImport("kernel32.dll")] static extern IntPtr GetCurrentProcess();
  [DllImport("kernel32.dll")] static extern IntPtr GetStdHandle(int n);
  [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)] static extern bool CreateProcess(string app, string cmd,
    IntPtr pa, IntPtr ta, bool inherit, uint flags, IntPtr env, string dir, ref STARTUPINFO si, out PROCINFO pi);
  [DllImport("kernel32.dll")] static extern uint WaitForSingleObject(IntPtr h, uint ms);
  [DllImport("kernel32.dll")] static extern bool GetExitCodeProcess(IntPtr h, out uint c);
  const uint KILL_ON_JOB_CLOSE = 0x2000, DIE_ON_UNHANDLED_EXCEPTION = 0x400, PROCESS_MEMORY = 0x100;
  public static int Run(ulong mb, string app, string cmd) {
    IntPtr job = CreateJobObject(IntPtr.Zero, null);
    if (job == IntPtr.Zero) return 125;
    EXTENDED info = new EXTENDED();
    info.Basic.LimitFlags = KILL_ON_JOB_CLOSE | DIE_ON_UNHANDLED_EXCEPTION | PROCESS_MEMORY;
    info.ProcessMemoryLimit = new UIntPtr(mb * 1024UL * 1024UL);
    if (!SetInformationJobObject(job, 9, ref info, (uint)Marshal.SizeOf(typeof(EXTENDED)))) return 125;
    if (!AssignProcessToJobObject(job, GetCurrentProcess())) return 125;
    STARTUPINFO si = new STARTUPINFO();
    si.cb = Marshal.SizeOf(typeof(STARTUPINFO));
    si.dwFlags = 0x100; // STARTF_USESTDHANDLES
    si.hStdInput = GetStdHandle(-10); si.hStdOutput = GetStdHandle(-11); si.hStdError = GetStdHandle(-12);
    PROCINFO pi;
    if (!CreateProcess(app, cmd, IntPtr.Zero, IntPtr.Zero, true, 0x08000000, IntPtr.Zero, null, ref si, out pi)) return 126;
    WaitForSingleObject(pi.hProcess, 0xFFFFFFFF);
    uint koda; GetExitCodeProcess(pi.hProcess, out koda);
    return (int)koda;
  }
}
'@

# ukazna vrstica: vsak argument v narekovajih (poti delavca nimajo narekovajev; drugace zavrnemo)
foreach ($d in $deli) { if ($d.Contains('"')) { [Console]::Error.WriteLine('omeji.ps1: narekovaj v argumentu'); exit 125 } }
$ukaz = ($deli | ForEach-Object { '"' + $_ + '"' }) -join ' '
exit [EvklidJob]::Run($mb, $lean, $ukaz)
