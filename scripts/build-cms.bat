@echo off
echo ========================================
echo Building CMS and deploying to public/cms
echo ========================================
echo.

echo [1/4] Building Sanity Studio...
cd sanity
call npm run build
if %errorlevel% neq 0 (
    echo Error: Sanity build failed
    cd ..
    exit /b 1
)
cd ..

echo [2/4] Fixing static resource paths...
call node scripts\fix-cms-paths.js
if %errorlevel% neq 0 (
    echo Error: Path fixing failed
    exit /b 1
)

echo [3/4] Copying to public/cms...
if exist public\cms (
    rmdir /s /q public\cms
)
xcopy /E /I /Y sanity\dist public\cms
if %errorlevel% neq 0 (
    echo Error: File copy failed
    exit /b 1
)

echo [4/4] Cleaning up temporary files...
rmdir /s /q sanity\dist

echo.
echo ========================================
echo CMS build completed!
echo ========================================
echo.
echo Visit: http://localhost:4321/cms
echo.
