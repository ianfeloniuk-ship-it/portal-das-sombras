@echo off
cd /d "%~dp0"
powershell -NoProfile -Command "try{Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8770/index.html -TimeoutSec 1 | Out-Null}catch{Start-Process -WindowStyle Hidden py -ArgumentList '-m','http.server','8770','--bind','127.0.0.1'; Start-Sleep 1}"
start "" msedge --app=http://127.0.0.1:8770/index.html --start-maximized
