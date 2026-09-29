@echo off
setlocal
cd /d "%~dp0"
if errorlevel 1 goto failed

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is missing. Install Node.js 20.9 or newer, then try again.
  goto failed
)
where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo npm is missing. Reinstall Node.js, then try again.
  goto failed
)
if not exist "node_modules\next\dist\bin\next" (
  echo Installing the project's locked dependencies...
  call npm.cmd ci
  if errorlevel 1 goto failed
)

echo Starting DART from %CD%
echo Open http://127.0.0.1:3000 after the Ready message.
echo Keep this window open while using the site. Press Ctrl+C to stop.
call npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
if errorlevel 1 goto failed
exit /b 0

:failed
echo.
echo DART could not start. Check the error above.
echo If port 3000 is already in use, open http://127.0.0.1:3000 first.
pause
exit /b 1
