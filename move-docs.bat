@echo off
echo ========================================
echo Moving Documentation Files
echo ========================================
echo.

REM Create docs folder if it doesn't exist
if not exist docs mkdir docs
if not exist docs\.claude mkdir docs\.claude
if not exist docs\.claude\commands mkdir docs\.claude\commands

REM Move markdown files
echo Moving markdown documentation files...
if exist README.md move /Y README.md docs\README_PROJECT.md
if exist PROJECT_PLAN.md move /Y PROJECT_PLAN.md docs\
if exist NAVER_OAUTH_GUIDE.md move /Y NAVER_OAUTH_GUIDE.md docs\
if exist QUICK_START.md move /Y QUICK_START.md docs\
if exist DEVELOPMENT_WORKFLOW.md move /Y DEVELOPMENT_WORKFLOW.md docs\
if exist PROGRESS.md move /Y PROGRESS.md docs\

REM Move claude commands
echo Moving Claude command files...
if exist .claude\commands\*.md move /Y .claude\commands\*.md docs\.claude\commands\

echo.
echo ========================================
echo Documentation moved to docs/ folder!
echo ========================================
echo.
echo Original location: C:\Users\USER\BlogTwin\
echo New location: C:\Users\USER\BlogTwin\docs\
echo.
pause
