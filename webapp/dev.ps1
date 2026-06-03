# Run webapp scripts without changing PowerShell execution policy (npm.ps1 is blocked by default).
# Usage: .\dev.ps1  or  .\dev.ps1 dev-server
param(
    [Parameter(Position = 0)]
    [string]$Script = 'dev-server'
)

Set-Location $PSScriptRoot
& npm.cmd run $Script @args
