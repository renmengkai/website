@echo off
echo Installing Sanity CMS dependencies...
cd sanity
call npm install
if %errorlevel% neq 0 (
    echo Error: npm install failed
    exit /b 1
)
echo.
echo Dependencies installed!
cd ..
echo.
echo Now you can run: npm run build-cms
