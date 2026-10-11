@echo off
setlocal EnableExtensions DisableDelayedExpansion
title Avexium Studio - Local Preview
cd /d "%~dp0"

rem These PATH changes are local to this launcher and its children only.
set "AVEXIUM_NODE="
if defined AVEXIUM_NODE_EXE if exist "%AVEXIUM_NODE_EXE%" set "AVEXIUM_NODE=%AVEXIUM_NODE_EXE%"
if not defined AVEXIUM_NODE if exist "%ProgramFiles%\nodejs\node.exe" set "AVEXIUM_NODE=%ProgramFiles%\nodejs\node.exe"
if not defined AVEXIUM_NODE if exist "%LocalAppData%\Programs\nodejs\node.exe" set "AVEXIUM_NODE=%LocalAppData%\Programs\nodejs\node.exe"
if not defined AVEXIUM_NODE if exist "C:\LocalAI-Platform\tools\node-v24.19.0-win-x64\node.exe" set "AVEXIUM_NODE=C:\LocalAI-Platform\tools\node-v24.19.0-win-x64\node.exe"
for /f "delims=" %%N in ('where.exe node 2^>nul') do if not defined AVEXIUM_NODE set "AVEXIUM_NODE=%%N"
if not defined AVEXIUM_NODE goto node_missing
"%AVEXIUM_NODE%" --version >nul 2>nul
if errorlevel 1 goto node_missing
for %%N in ("%AVEXIUM_NODE%") do set "PATH=%%~dpN;%PATH%"
if not exist "%~dp0preview-launcher.cjs" goto helper_missing
if /i "%~1"=="--check" goto check

echo Avexium Studio local preview
echo Node: "%AVEXIUM_NODE%"
echo Keep this window open while using the website.
echo.
"%AVEXIUM_NODE%" "%~dp0preview-launcher.cjs"
set "AVEXIUM_EXIT=%errorlevel%"
echo.
if not "%AVEXIUM_EXIT%"=="0" echo The preview could not start. Read the error above.
pause
exit /b %AVEXIUM_EXIT%

:check
"%AVEXIUM_NODE%" "%~dp0preview-launcher.cjs" --check
exit /b %errorlevel%

:node_missing
echo A working Node.js installation was not found.
echo Your old F: drive installation is not needed by this launcher.
echo If you moved Node, set AVEXIUM_NODE_EXE to its full node.exe path.
pause
exit /b 1

:helper_missing
echo preview-launcher.cjs is missing from this project folder.
echo Keep it beside START-PREVIEW.cmd and try again.
pause
exit /b 1
