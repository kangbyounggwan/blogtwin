@echo off
echo ========================================
echo BlogTwin Project Setup
echo ========================================
echo.

REM Step 1: Move documentation files
echo [1/5] Moving documentation files to docs folder...
if not exist docs mkdir docs
if not exist docs\.claude mkdir docs\.claude
if not exist docs\.claude\commands mkdir docs\.claude\commands

move /Y *.md docs\ 2>nul
move /Y .claude\commands\*.md docs\.claude\commands\ 2>nul

echo Documentation moved successfully!
echo.

REM Step 2: Initialize package.json
echo [2/5] Creating package.json...
echo { > package.json
echo   "name": "blogtwin", >> package.json
echo   "version": "0.1.0", >> package.json
echo   "private": true, >> package.json
echo   "scripts": { >> package.json
echo     "android": "react-native run-android", >> package.json
echo     "ios": "react-native run-ios", >> package.json
echo     "start": "react-native start", >> package.json
echo     "test": "jest", >> package.json
echo     "lint": "eslint ." >> package.json
echo   } >> package.json
echo } >> package.json

echo package.json created!
echo.

REM Step 3: Create folder structure
echo [3/5] Creating folder structure...
mkdir src 2>nul
mkdir src\screens 2>nul
mkdir src\screens\onboarding 2>nul
mkdir src\screens\blog-connection 2>nul
mkdir src\screens\main 2>nul
mkdir src\screens\post-creation 2>nul
mkdir src\screens\editor 2>nul
mkdir src\screens\settings 2>nul
mkdir src\components 2>nul
mkdir src\components\common 2>nul
mkdir src\components\blog 2>nul
mkdir src\components\editor 2>nul
mkdir src\services 2>nul
mkdir src\services\oauth 2>nul
mkdir src\services\blog 2>nul
mkdir src\services\ai 2>nul
mkdir src\services\storage 2>nul
mkdir src\stores 2>nul
mkdir src\navigation 2>nul
mkdir src\utils 2>nul
mkdir src\hooks 2>nul
mkdir src\types 2>nul
mkdir src\constants 2>nul
mkdir __tests__ 2>nul
mkdir assets 2>nul
mkdir assets\images 2>nul
mkdir assets\fonts 2>nul

echo Folder structure created!
echo.

REM Step 4: Create .gitignore
echo [4/5] Creating .gitignore...
(
echo # Node
echo node_modules/
echo npm-debug.log
echo yarn-error.log
echo.
echo # React Native
echo .expo/
echo .expo-shared/
echo *.jks
echo *.p8
echo *.p12
echo *.key
echo *.mobileprovision
echo.
echo # Android
echo android/app/build/
echo android/.gradle/
echo.
echo # iOS
echo ios/Pods/
echo ios/build/
echo.
echo # Environment
echo .env
echo .env.local
echo .env.production
echo.
echo # IDE
echo .vscode/
echo .idea/
echo *.swp
echo *.swo
echo.
echo # Misc
echo .DS_Store
echo *.log
) > .gitignore

echo .gitignore created!
echo.

REM Step 5: Instructions
echo [5/5] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Install React Native CLI globally:
echo    npm install -g react-native-cli
echo.
echo 2. Install dependencies:
echo    npm install react-native@latest
echo    npm install react@latest
echo    npm install --save-dev @types/react @types/react-native typescript
echo.
echo 3. Install required packages:
echo    npm install @react-navigation/native @react-navigation/stack
echo    npm install react-native-screens react-native-safe-area-context
echo    npm install zustand @tanstack/react-query
echo    npm install react-native-paper react-native-vector-icons
echo.
echo 4. Run the installation script:
echo    npm run setup
echo.
echo ========================================
echo Documentation moved to: docs/
echo ========================================
echo.
pause
