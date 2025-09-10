@echo off
setlocal
cd /d %~dp0

REM Run environment-only sanitization (skip huge collection)
C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0sanitize-postman.ps1" -InputCollection "NO.json"
if errorlevel 1 (
  echo Sanitizer failed. Press any key to view error and exit...
  pause
  exit /b 1
)

echo Sanitized files written to "%~dp0sanitized".
if exist "%~dp0sanitized" start "" "%~dp0sanitized"

endlocal
exit /b 0
