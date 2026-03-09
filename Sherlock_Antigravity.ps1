# SHERLOCK COMMAND CENTER v4.0 (ANTIGRAVITY EDITION)
# AUTHOR: ANTIGRAVITY / SOVEREIGN PROTOCOL
# DESIGN PHILOSOPHY: TACTICAL PRECISION, SOVEREIGNTY, AND DEPTH

Clear-Host
$host.ui.RawUI.WindowTitle = "SHERLOCK | ANTIGRAVITY COMMAND"

# GLOBAL COLORS (Tactical Palette)
$Cyan    = "Cyan"
$Magenta = "Magenta"
$DarkGray = "DarkGray"
$Gray    = "Gray"
$White   = "White"
$Red     = "Red"
$Yellow  = "Yellow"
$Green   = "Green"

function Write-Tech {
    param([string]$Message, [string]$Color = $White)
    Write-Host "[$(Get-Date -Format 'HH:mm:ss.ffffff')] $Message" -ForegroundColor $Color
}

function Show-Header {
    Write-Host "[[--------------------------------------------------------]]" -ForegroundColor $Magenta
    Write-Host "            SHERLOCK | ANTIGRAVITY SOVEREIGN               " -ForegroundColor $Cyan
    Write-Host "                   OPERATIONAL LAYER v4.0                  " -ForegroundColor $Magenta
    Write-Host "      [ TACTICAL PULSE: RESPIRE | AUTHORITY: ALPHA ]       " -ForegroundColor DarkGray
    Write-Host "[[--------------------------------------------------------]]" -ForegroundColor $Magenta
    Write-Host ""
}

Show-Header

Write-Tech "Tactical layer initialized." $Cyan
Write-Tech "Satellite link: SECURE (Encrypted)" $Magenta
Write-Tech "Protocol: Antigravity-Alpha" $DarkGray
Write-Host "------------------------------------------------------------" -ForegroundColor $DarkGray

while ($true) {
    $cmdInput = Read-Host ">_ (Sovereign) ENTER COMMAND (STATUS / SYNC / RESET / STOP / ABOUT / HELP / EXIT)"

    switch ($cmdInput.ToUpper()) {
        "DOOM" {
            Clear-Host
            $host.UI.RawUI.BackgroundColor = "DarkBlue"
            $host.UI.RawUI.ForegroundColor = "Cyan"
            Clear-Host

            Write-Host ""
            Write-Host "     .--------.  .--------.  .--------. .-.      .-." -ForegroundColor Cyan
            Write-Host "     |   __   |  |   __   |  |   __   | | |      | |" -ForegroundColor Cyan
            Write-Host "     |  |  |  |  |  |  |  |  |  |  |  | | |      | |" -ForegroundColor Magenta
            Write-Host "     |  |  |  |  |  |  |  |  |  |  |  | | |      | |" -ForegroundColor Magenta
            Write-Host "     |  |__|  |  |  |__|  |  |  |__|  | | |______| |" -ForegroundColor Cyan
            Write-Host "     |________|  |________|  |________| |__________|" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "        ANTIGRAVITY TACTICAL OVERLAY - VOID SPACE" -ForegroundColor Magenta
            Write-Host "        Rip through the simulation." -ForegroundColor White
            Write-Host ""
            Write-Host "        Press Enter to collapse the layer" -ForegroundColor Gray

            [void][System.Console]::ReadLine()
            Show-Header
        }
        "ABOUT" {
            Write-Host ""
            Write-Tech "SHERLOCK Antigravity Edition" $Magenta
            Write-Tech "A high-precision tactical interface for sovereign operators." $Cyan
            Write-Tech "Built to transcend standard monitoring limitations." $White
        }
        "STATUS" {
            Write-Host ""
            Write-Tech "--- SOVEREIGN METRICS ---" $Magenta
            Write-Tech "Temporal Sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss.fff')" $Cyan
            Write-Tech "Void State: TERMINAL" $DarkGray
            Write-Tech "Authority: MASTER ACCESSED" $Green
            Write-Host "------------------------------------------------------------" -ForegroundColor $DarkGray
        }
        "SYNC" {
            Write-Host ""
            Write-Tech "Synchronizing with spatial nodes..." $Cyan
            Start-Sleep -Milliseconds 800
            Write-Tech "Uplink stabilized. Data integrated." $Magenta
        }
        "RESET" {
            Write-Host ""
            Write-Tech "RE-INITIALIZING TACTICAL LAYER..." $Yellow
            Write-Tech "Clearing spatial caches and re-calibrating..." $Magenta
            Start-Sleep -Milliseconds 800
            Write-Tech "PROTOCOL RE-STABILIZED." $Cyan
        }
        "STOP" {
            Write-Host ""
            Write-Tech "EMERGENCY SHUTDOWN INITIATED." $Red
            Write-Tech "Collapsing spatial link and securing local data..." $Magenta
            Start-Sleep -Seconds 1
            Write-Tech "TACTICAL DISCONNECT COMPLETE." $White
            Start-Sleep -Seconds 1
            exit
        }
        "HELP" {
            Write-Host ""
            Write-Tech "OPERATIONAL COMMANDS:" $White
            Write-Tech "STATUS - Analyze sovereign metrics" $Cyan
            Write-Tech "SYNC   - Calibrate spatial sensors" $Magenta
            Write-Tech "RESET  - Re-initialize layer caches" $Yellow
            Write-Tech "ABOUT  - Origin parameters" $White
            Write-Tech "STOP   - Safe tactical disconnect" $Red
            Write-Tech "EXIT   - Hard disconnect" $Red
            Write-Tech "DOOM   - The Void Overlay" $DarkGray
        }
        "EXIT" {
            exit
        }
        default {
            Write-Tech "Invalid directive. Re-evaluating..." $Red
        }
    }
    Write-Host ""
}
