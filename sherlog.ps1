# SHERLOG-ATHENA COMMAND CENTER v3.5 (DEMO MODE)
# ADMIN CLI INTERFACE FOR SYSTEM MONITORING (MVP)

Clear-Host
$host.ui.RawUI.WindowTitle = "SHERLOG | ADMIN COMMAND CENTER"

# GLOBAL COLORS
$Green = "Green"
$Cyan = "Cyan"
$Yellow = "Yellow"
$Red = "Red"
$White = "White"

# SESSION STATE (DEMO DATA)
$Script:LastRefresh = "None"
$Script:LastDuration = 0
$Script:TotalRecords = 12400
$Script:TopCategory = "Monitoring"
$Script:LastStatus = "Ready"

function Write-Tech {
    param([string]$Message, [string]$Color = $White)
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor $Color
}

function Show-Header {
    Write-Host "############################################################" -ForegroundColor $Cyan
    Write-Host "#                                                          #" -ForegroundColor $Cyan
    Write-Host "#           SHERLOG.OS - DEMO ADMIN INTERFACE v3.5         #" -ForegroundColor $Cyan
    Write-Host "#                                                          #" -ForegroundColor $Cyan
    Write-Host "############################################################" -ForegroundColor $Cyan
    Write-Host ""
}

Show-Header

Write-Tech "System initialized (DEMO MODE)..." $Green
Write-Tech "Athena Data link: ACTIVE" $Green
Write-Tech "Environment: Grounded MVP / Mock Data" $Yellow
Write-Host "------------------------------------------------------------" -ForegroundColor $White

while ($true) {
    $cmdInput = Read-Host ">_ ENTER COMMAND (STATUS / SYNC / RESET / STOP / EXIT)"

    switch ($cmdInput.ToUpper()) {
        "STATUS" {
            Write-Host ""
            Write-Tech "--- ENVIRONMENT METADATA ---" $Cyan
            Write-Tech "Mode: Demo MVP" $White
            Write-Tech "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" $White
            Write-Tech "User: $env:USERNAME" $White
            Write-Tech "Machine: $env:COMPUTERNAME" $White
            Write-Tech "PS Version: $($PSVersionTable.PSVersion)" $White
            Write-Tech "Working Dir: $PWD" $White
            Write-Tech "Script Path: $PSCommandPath" $White
            
            Write-Host ""
            Write-Tech "--- DATASET SUMMARY ---" $Cyan
            Write-Tech "Data Source: Demo Data (Simulated)" $White
            Write-Tech "Last Refresh: $Script:LastRefresh" $White
            Write-Tech "Last Duration: $Script:LastDuration ms" $White
            Write-Tech "Total Records: $Script:TotalRecords" $White
            Write-Tech "Top Category: $Script:TopCategory" $White
            Write-Tech "CLI State: $Script:LastStatus" $Green
            Write-Host "------------------------------------------------------------" -ForegroundColor $White
        }
        "SYNC" {
            Write-Host ""
            Write-Tech "INITIATING DATA REFRESH ACTION..." $Yellow
            Write-Tech "Sync Start: $(Get-Date -Format 'HH:mm:ss')" $White
            Write-Tech "Source Type: Demo Data" $White
            
            $startTime = Get-Date
            Start-Sleep -Seconds 2 # Simulate network/processing latency
            
            # Update Session State
            $Script:LastDuration = [math]::Round(((Get-Date) - $startTime).TotalMilliseconds)
            $Script:LastRefresh = Get-Date -Format 'HH:mm:ss'
            $newRecords = 10 + (Get-Random -Maximum 6)
            $Script:TotalRecords += $newRecords
            $Script:TopCategory = @("Monitoring", "Sync", "Auth", "IO", "AI") | Get-Random
            $Script:LastStatus = "Success"
            
            Write-Tech "Refresh coordinated with UI Sync Engine (SPLASH)." $Cyan
            Write-Tech "SYNC RESULT: SUCCESS" $Green
            Write-Tech "Records Loaded: $newRecords" $White
            Write-Tech "New Top Category: $Script:TopCategory" $White
            Write-Tech "Sync duration: $Script:LastDuration ms" $Green
            Write-Host "------------------------------------------------------------" -ForegroundColor $White
        }
        "RESET" {
            Write-Host ""
            Write-Tech "INITIATING LOCAL INTERFACE RESET..." $Yellow
            Write-Tech "Action: Clearing local cache, rebooting UI components..." $Cyan
            $Script:LastStatus = "Resetting"
            Start-Sleep -Seconds 1
            Write-Tech "LOCAL INTERFACE RESET COMPLETE." $White
            $Script:LastStatus = "Idle (Post-Reset)"
        }
        "STOP" {
            Write-Host ""
            Write-Tech "EMERGENCY STOP TRIGGERED (Safe Shutdown Path)." $Red
            Write-Tech "Action: Terminating local maintenance tasks and exiting..." $Yellow
            Start-Sleep -Seconds 1
            Write-Tech "LOCAL ADMIN STOP COMPLETE." $White
            Start-Sleep -Seconds 1
            exit
        }
        "EXIT" {
            exit
        }
        "HELP" {
            Write-Host ""
            Write-Tech "AVAILABLE COMMANDS:" $Cyan
            Write-Tech "STATUS - Show environment and current dataset metrics" $White
            Write-Tech "SYNC   - Execute a simulated data refresh and measure duration" $White
            Write-Tech "RESET  - Re-initialize the local interface state" $White
            Write-Tech "STOP   - Safe shutdown of the CLI environment" $White
            Write-Tech "EXIT   - Quit the CLI" $White
        }
        default {
            Write-Tech "ERROR: UNKNOWN COMMAND. TYPE 'HELP' FOR LIST." $Red
        }
    }
    Write-Host ""
}
