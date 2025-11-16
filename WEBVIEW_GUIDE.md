# 📱 WebView 하이브리드 앱 가이드

BlogTwin이 WebView 기반 하이브리드 앱으로 전환되었습니다!

## 🎯 구조

```
BlogTwin/
├── web/                    # Next.js 웹앱 (포트 3002)
└── App.tsx                 # WebView 래퍼
```

## 🚀 실행 방법

### 1단계: 웹앱 서버 실행

```bash
cd web
npm run dev
```

웹앱이 `http://localhost:3002`에서 실행됩니다.

### 2단계: Android 앱 실행

새 터미널에서:

```bash
# Metro 번들러 시작
npm start

# 다른 터미널에서 Android 실행
npm run android
```

## 📱 작동 방식

### App.tsx 구조

```typescript
const WEB_APP_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:3002'     // Android 에뮬레이터
    : 'http://localhost:3002'     // iOS 시뮬레이터
  : 'https://your-app.vercel.app' // 프로덕션
```

- **개발 환경**: 로컬 서버 (localhost:3002)
- **프로덕션**: 배포된 웹앱 URL

### Android 에뮬레이터 네트워크

Android 에뮬레이터는 `10.0.2.2`를 호스트 머신의 `localhost`로 매핑합니다.

## 🔧 설정

### 이미 적용된 설정

✅ **AndroidManifest.xml**
```xml
<application
  android:usesCleartextTraffic="true">
```
→ HTTP 로컬 서버 접속 허용

✅ **react-native-webview 설치됨**
```json
"react-native-webview": "^13.16.0"
```

## 🌐 배포 시 변경사항

### 1. 웹앱 배포 (Vercel 추천)

```bash
cd web
npm run build

# Vercel CLI로 배포
vercel --prod
```

배포 URL 예시: `https://blogtwin.vercel.app`

### 2. App.tsx 수정

```typescript
const WEB_APP_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:3002'
    : 'http://localhost:3002'
  : 'https://blogtwin.vercel.app'; // 👈 실제 배포 URL로 변경
```

### 3. Android APK 빌드

```bash
cd android
./gradlew assembleRelease

# APK 위치:
# android/app/build/outputs/apk/release/app-release.apk
```

## 📋 장점

### ✅ WebView 하이브리드 앱

1. **빠른 개발**: 웹 기술로 개발, 네이티브 앱으로 패키징
2. **쉬운 업데이트**: 웹앱만 업데이트하면 앱스토어 심사 없이 즉시 반영
3. **단일 코드베이스**: Next.js 코드 하나로 웹/앱 모두 지원
4. **네이티브 기능**: 필요시 WebView와 React Native 브릿지 사용 가능

## 🐛 트러블슈팅

### 문제: WebView가 빈 화면

**해결 방법:**
1. 웹앱 서버가 실행 중인지 확인
   ```bash
   cd web && npm run dev
   ```
2. 올바른 포트 확인 (3002)
3. Android 에뮬레이터 재시작

### 문제: "Unable to resolve module"

**해결 방법:**
```bash
npm start -- --reset-cache
```

### 문제: Android Gradle 오류

**해결 방법:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

## 📱 테스트 방법

### 1. 웹 브라우저 테스트
```
http://localhost:3002
```

### 2. Android 에뮬레이터 테스트
```bash
npm run android
```

### 3. 실제 Android 기기 테스트

1. USB 디버깅 활성화
2. PC와 연결
3. `npm run android` 실행
4. 웹앱 서버를 PC의 IP 주소로 변경:
   ```typescript
   const WEB_APP_URL = 'http://192.168.x.x:3002';
   ```

## 🔄 이전 React Native 코드

기존 React Native 네비게이션 코드는 백업되어 있습니다:
- `src/navigation/`
- `src/screens/`
- `src/components/`

필요시 복원 가능합니다.

## 📚 다음 단계

1. ✅ 웹앱 개발 완료
2. ✅ WebView 통합 완료
3. ⏳ 웹앱 배포 (Vercel)
4. ⏳ Android APK 빌드
5. ⏳ Google Play 스토어 업로드

---

**작성일**: 2025-11-16
**업데이트**: WebView 하이브리드 앱 전환 완료
