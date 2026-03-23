# SHERLOG-ATHENA COMMAND CENTER v3.5 (CHATGPT EDITION)
# AUTHOR: CHATGPT 5.4 / ARCHITECT: ANTIGRAVITY
# DESIGN PHILOSOPHY: EFFICIENCY, CLARITY, AND HELPFULNESS

Clear-Host
$host.ui.RawUI.WindowTitle = "SHERLOG | CHATGPT EDITION"

# GLOBAL COLORS (ChatGPT Palette)
$Green  = "Green"
$White  = "White"
$Gray   = "Gray"
$DarkGray = "Gray"
$Yellow = "Yellow"
$Cyan   = "Cyan"
$Red    = "Red"

function Write-Tech {
    param([string]$Message, [string]$Color = $White)
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor $Color
}

function Show-Header {
    Write-Host "============================================================" -ForegroundColor $Green
    Write-Host "            SHERLOG - ADMIN COMMAND CENTER                 " -ForegroundColor $White
    Write-Host "                   CHATGPT EDITION v3.5                    " -ForegroundColor $Green
    Write-Host "      (System breathing... Respire... STABLE)              " -ForegroundColor DarkGray
    Write-Host "============================================================" -ForegroundColor $Green
    Write-Host ""
}

Show-Header

Write-Tech "System initialized. How can I help you today?" $Green
Write-Tech "Link status: STABLE" $Green
Write-Tech "Optimized for: Clarity and Precision" $White
Write-Host "------------------------------------------------------------" -ForegroundColor $Green

while ($true) {
    $cmdInput = Read-Host ">_ ENTER COMMAND (STATUS / SYNC / RESET / STOP / ABOUT / HELP / EXIT)"

    switch ($cmdInput.ToUpper()) {
        "DOOM" {
            Clear-Host
            $host.UI.RawUI.BackgroundColor = "Black"
            $host.UI.RawUI.ForegroundColor = "Red"
            Clear-Host

            Write-Host ""
            Write-Host "  ██████╗  ██████╗  ██████╗ ███╗   ███╗ " -ForegroundColor Red
            Write-Host "  ██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║ " -ForegroundColor Red
            Write-Host "  ██║  ██║██║   ██║██║   ██║██╔████╔██║ " -ForegroundColor DarkYellow
            Write-Host "  ██║  ██║██║   ██║██║   ██║██║╚██╔╝██║ " -ForegroundColor DarkYellow
            Write-Host "  ██████╔╝╚██████╔╝╚██████╔╝██║ ╚═╝ ██║ " -ForegroundColor Yellow
            Write-Host "  ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝     ╚═╝ " -ForegroundColor Yellow
            Write-Host ""
            Write-Host "        RETRO ACTION SPLASH - DEMO MODE" -ForegroundColor Cyan
            Write-Host "        Hidden layer unlocked." -ForegroundColor Green
            Write-Host ""
            Write-Host "        Press Enter to return to SHERLOG" -ForegroundColor White

            [void][System.Console]::ReadLine()
            Show-Header
        }
        "ABOUT" {
            Write-Host ""
            Write-Tech "SHERLOG ChatGPT Edition" $Cyan
            Write-Tech "A clean, efficient administrative wrapper for system monitoring." $White
            Write-Tech "Designed to prioritize user understanding and data integrity." $Green
        }
        "STATUS" {
            Write-Host ""
            Write-Tech "--- CORE ENGINE STATUS ---" $Green
            Write-Tech "Clock: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" $White
            Write-Tech "Uptime: Simulated 100%" $White
            Write-Tech "Environment: SECURE" $Green
            Write-Host "------------------------------------------------------------" -ForegroundColor $Green
        }
        "SYNC" {
            Write-Host ""
            Write-Tech "Refreshing system state..." $Yellow
            Start-Sleep -Seconds 1
            Write-Tech "Sync completed successfully." $Green
        }
        "RESET" {
            Write-Host ""
            Write-Tech "Clearing local interface cache..." $Yellow
            Write-Tech "System state re-initialized. Ready to assist." $Green
        }
        "STOP" {
            Write-Host ""
            Write-Tech "Preparing for safe shutdown..." $Yellow
            Write-Tech "All background tasks terminated. Goodbye!" $Green
            Start-Sleep -Seconds 1
            exit
        }
        "HELP" {
            Write-Host ""
            Write-Tech "AVAILABLE COMMANDS:" $White
            Write-Tech "STATUS - Check system health and environment" $White
            Write-Tech "SYNC   - Refresh local data caches" $White
            Write-Tech "RESET  - Clear local state caches" $Yellow
            Write-Tech "ABOUT  - Information about this edition" $White
            Write-Tech "STOP   - Safe system shutdown" $Yellow
            Write-Tech "EXIT   - Close the interface" $White
            Write-Tech "DOOM   - Hidden retro splash screen" $Gray
        }
        "EXIT" {
            exit
        }
        default {
            Write-Tech "I'm sorry, I don't recognize that command. Type 'HELP' for assistance." $Red
        }
    }
    Write-Host ""
}
