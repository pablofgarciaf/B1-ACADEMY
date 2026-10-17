param(
  [Parameter(Mandatory = $true)][string]$Repo,
  [Parameter(Mandatory = $true)][string]$Directory,
  [Parameter(Mandatory = $true)][string]$KeyFile,
  [Parameter(Mandatory = $true)][string]$Node
)
$ErrorActionPreference = 'Stop'
$operationScript = Join-Path ([IO.Path]::GetFullPath($Repo)) 'operations\protect-data.cjs'
$environmentFile = Join-Path ([IO.Path]::GetFullPath($Repo)) '.env'
if (!(Test-Path -LiteralPath $operationScript -PathType Leaf)) { throw 'Protection tool is missing' }
# Task Scheduler hides the window. No provider response or personal data is logged.
& $Node $operationScript run --env $environmentFile --directory $Directory --key $KeyFile | Out-Null
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

