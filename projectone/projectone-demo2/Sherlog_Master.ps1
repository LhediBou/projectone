# SHERLOG MASTER LAUNCHER
# COORDINATOR: ANTIGRAVITY
# THEME: RESPIRE (BREATHE)

Clear-Host
$host.ui.RawUI.WindowTitle = "SHERLOG | MASTER GATEWAY"

# COLORS
$Cyan    = "Cyan"
$Magenta = "Magenta"
$Green   = "Green"
$White   = "White"
$Yellow  = "Yellow"

function Show-Menu {
    Clear-Host
    Write-Host "############################################################" -ForegroundColor $Cyan
    Write-Host "#                                                          #" -ForegroundColor $Cyan
    Write-Host "#             SHERLOG SYSTEM MASTER GATEWAY                #" -ForegroundColor $Cyan
    Write-Host "#               [ THEME: RESPIRE / BREATHE ]               #" -ForegroundColor $White
    Write-Host "#                                                          #" -ForegroundColor $Cyan
    Write-Host "############################################################" -ForegroundColor $Cyan
    Write-Host ""
    Write-Host "  [1] ATHENA  - CHATGPT EDITION (HELPFUL)" -ForegroundColor $Green
    Write-Host "  [2] SHERLOCK - ANTIGRAVITY EDITION (TACTICAL)" -ForegroundColor $Magenta
    Write-Host "  [3] EXIT" -ForegroundColor $Yellow
    Write-Host ""
    Write-Host " (System pulsing... Respire...)" -ForegroundColor DarkGray
    Write-Host ""
}

while ($true) {
    Show-Menu
    $choice = Read-Host "SELECT SYSTEM LAYER [1-3]"

    switch ($choice) {
        "1" { powershell.exe -ExecutionPolicy Bypass -File "Sherlog_ChatGPT.ps1" }
        "2" { powershell.exe -ExecutionPolicy Bypass -File "Sherlock_Antigravity.ps1" }
        "3" { exit }
        default { Write-Host "INVALID SELECTION. RE-CALIBRATING..." -ForegroundColor Red; Start-Sleep -Seconds 1 }
    }
}
