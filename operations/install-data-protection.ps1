param(
  [Parameter(Mandatory = $true)][string]$Directory,
  [Parameter(Mandatory = $true)][string]$KeyFile
)
$ErrorActionPreference = 'Stop'
$protectionRepo = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$protectionDirectory = [IO.Path]::GetFullPath($Directory)
$protectionKey = [IO.Path]::GetFullPath($KeyFile)
foreach ($protectionPath in @($protectionDirectory, $protectionKey)) {
  if ($protectionPath.StartsWith($protectionRepo + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Private backup storage must be outside the repository' }
}
if (!(Test-Path -LiteralPath $protectionKey -PathType Leaf) -or (Get-Item -LiteralPath $protectionKey).Length -ne 32) { throw 'A private 32-byte encryption key is required' }
$protectionNode = (Get-Command node.exe -ErrorAction Stop).Source
$protectionRunner = Join-Path $PSScriptRoot 'run-data-protection.ps1'
foreach ($protectionArgument in @($protectionRunner, $protectionRepo, $protectionDirectory, $protectionKey, $protectionNode)) {
  if ($protectionArgument.Contains('"')) { throw 'Invalid path' }
}
$protectionArgs = '-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File "{0}" -Repo "{1}" -Directory "{2}" -KeyFile "{3}" -Node "{4}"' -f $protectionRunner, $protectionRepo, $protectionDirectory, $protectionKey, $protectionNode
$protectionAction = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $protectionArgs
$protectionTrigger = New-ScheduledTaskTrigger -Daily -At '03:10'
$protectionSettings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Hours 2)
$protectionIdentity = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$protectionPrincipal = New-ScheduledTaskPrincipal -UserId $protectionIdentity -LogonType Interactive -RunLevel Limited
$protectionTask = New-ScheduledTask -Action $protectionAction -Trigger $protectionTrigger -Settings $protectionSettings -Principal $protectionPrincipal -Description 'Respaldo diario cifrado y verificado antes de limpiar registros temporales vencidos. Requiere sesión de Windows iniciada.'
Register-ScheduledTask -TaskName 'B1 Academy - Proteccion diaria de datos' -InputObject $protectionTask -Force | Select-Object TaskName, State
