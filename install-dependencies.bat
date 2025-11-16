@echo off
echo ========================================
echo Installing BlogTwin Dependencies
echo ========================================
echo.

echo [1/8] Installing React Native core...
call npm install react-native@latest react@latest

echo.
echo [2/8] Installing TypeScript...
call npm install --save-dev typescript @types/react @types/react-native @tsconfig/react-native

echo.
echo [3/8] Installing Navigation...
call npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
call npm install react-native-screens react-native-safe-area-context react-native-gesture-handler

echo.
echo [4/8] Installing State Management...
call npm install zustand @tanstack/react-query

echo.
echo [5/8] Installing UI Components...
call npm install react-native-paper react-native-vector-icons

echo.
echo [6/8] Installing Forms...
call npm install react-hook-form

echo.
echo [7/8] Installing Utilities...
call npm install axios date-fns

echo.
echo [8/8] Installing Dev Tools...
call npm install --save-dev @react-native/eslint-config @react-native/metro-config jest @testing-library/react-native

echo.
echo ========================================
echo Dependencies installed successfully!
echo ========================================
echo.
echo Next: Run 'npm run init-project' to create initial files
echo.
pause
