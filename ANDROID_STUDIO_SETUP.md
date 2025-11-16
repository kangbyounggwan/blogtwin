# Android Studio 설정 가이드

## 1. Android Studio에서 프로젝트 열기

1. Android Studio 실행
2. **Open** 클릭
3. `C:\Users\USER\BlogTwin\android` 폴더 선택
4. **OK** 클릭

## 2. 초기 설정 확인

프로젝트가 열리면 Android Studio가 자동으로:
- Gradle 동기화 시작
- 필요한 SDK 다운로드 제안
- 빌드 도구 설치 제안

### 필요한 항목들:
- ✅ Android SDK Platform 35
- ✅ Android SDK Build-Tools 35.0.0
- ✅ NDK 25.1.8937393
- ✅ JDK 17 (Android Studio에 포함됨)

## 3. Gradle 동기화

1. 상단 메뉴: **File** → **Sync Project with Gradle Files**
2. 또는 나타나는 배너에서 **Sync Now** 클릭

## 4. 에뮬레이터 설정 (선택사항)

### 에뮬레이터 생성:
1. 상단 도구 모음: **Device Manager** 아이콘 클릭 (폰 모양)
2. **Create Device** 클릭
3. 디바이스 선택 (예: Pixel 5)
4. 시스템 이미지 선택:
   - **Release Name**: Tiramisu (API 33) 추천
   - 다운로드 필요시 **Download** 클릭
5. **Finish** 클릭

## 5. 실제 디바이스 연결 (USB 디버깅)

### Android 기기 설정:
1. **설정** → **휴대전화 정보** → **소프트웨어 정보**
2. **빌드 번호** 7번 탭 (개발자 모드 활성화)
3. **설정** → **개발자 옵션**
4. **USB 디버깅** 활성화
5. USB 케이블로 PC와 연결

### Android Studio에서 확인:
- 상단 도구 모음의 디바이스 선택 드롭다운에서 연결된 기기 확인

## 6. 앱 실행

### 방법 1: Android Studio에서 직접 실행
1. 상단 도구 모음에서 디바이스 선택 (에뮬레이터 또는 실제 기기)
2. **Run** 버튼 (▶️ 녹색 재생 버튼) 클릭
3. 또는 **Shift + F10** 단축키

### 방법 2: 터미널에서 실행
프로젝트 루트 폴더에서:
```bash
npm run android
```

## 7. Metro Bundler 시작

앱이 실행되기 전에 Metro Bundler가 시작되어야 합니다:

**새 터미널 창에서:**
```bash
cd C:\Users\USER\BlogTwin
npm start
```

**또는 Metro를 리셋하면서 시작:**
```bash
npm start -- --reset-cache
```

## 8. 전체 실행 순서 (권장)

1. **터미널 1**: Metro Bundler 시작
   ```bash
   cd C:\Users\USER\BlogTwin
   npm start
   ```

2. **터미널 2**: Android 앱 실행
   ```bash
   npm run android
   ```

   또는 Android Studio에서 Run 버튼 클릭

## 9. 웹 서버 시작 (필수)

이 앱은 WebView 앱이므로 Next.js 웹 서버가 실행되어야 합니다:

**터미널 3**:
```bash
cd C:\Users\USER\BlogTwin\web
npm run dev
```

웹 서버는 기본적으로 `http://localhost:3002`에서 실행됩니다.

## 10. 전체 개발 환경 실행 순서

```bash
# 터미널 1: Metro Bundler
npm start

# 터미널 2: 웹 서버
cd web
npm run dev

# 터미널 3: Android 앱
npm run android
```

## 11. 문제 해결

### Gradle 빌드 실패
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Metro Bundler 오류
```bash
npm start -- --reset-cache
```

### 웹 서버 포트 충돌
[App.tsx](../App.tsx)에서 포트 변경:
```typescript
const WEB_APP_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:3002' // 포트 번호 변경
    : 'http://localhost:3002'
  : 'https://your-deployed-url.vercel.app';
```

## 12. 유용한 Android Studio 단축키

- **Sync Gradle**: `Ctrl + Alt + Y` (Windows)
- **Run**: `Shift + F10`
- **Debug**: `Shift + F9`
- **Clean Project**: **Build** → **Clean Project**
- **Rebuild Project**: **Build** → **Rebuild Project**

## 13. 로그 확인

### Logcat (Android Studio):
1. 하단 **Logcat** 탭 클릭
2. 필터에 "BlogTwin" 입력하여 앱 로그만 보기

### Chrome DevTools (WebView 디버깅):
1. Chrome 브라우저 열기
2. 주소창에 `chrome://inspect` 입력
3. 연결된 디바이스에서 WebView 선택
4. **inspect** 클릭

## 14. 프로덕션 빌드

### Debug APK 생성:
```bash
cd android
./gradlew assembleDebug
```
APK 위치: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK 생성 (서명 필요):
```bash
cd android
./gradlew assembleRelease
```

## 참고사항

- 이 프로젝트는 **React Native WebView** 앱입니다
- 실제 기능은 Next.js 웹 애플리케이션에서 동작합니다
- 개발 시 반드시 웹 서버(`npm run dev`)가 실행되어 있어야 합니다
