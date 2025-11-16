# BlogTwin 배포 가이드

## 개요
BlogTwin은 WebView 기반 앱으로, **웹 애플리케이션만 서버에 배포**하면 됩니다.

## 배포 구조

```
사용자 Android 기기
        ↓
    WebView 앱 설치
        ↓
    배포된 웹사이트 로드
    (https://your-app.vercel.app)
```

## 1. 웹 애플리케이션 배포 (Vercel)

### Vercel 배포 (권장)

1. **Vercel 계정 생성**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **프로젝트 임포트**
   ```bash
   # Vercel CLI 설치
   npm i -g vercel

   # web 폴더로 이동
   cd web

   # Vercel에 배포
   vercel
   ```

3. **설정 확인**
   - Root Directory: `web`
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **환경 변수 설정**
   Vercel 대시보드에서 다음 환경 변수 추가:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_NAVER_CLIENT_ID=your-naver-client-id
   NEXT_PUBLIC_NAVER_CLIENT_SECRET=your-naver-client-secret
   OPENAI_API_KEY=your-openai-api-key
   ```

5. **배포 URL 확인**
   - 배포 완료 후 URL 복사 (예: https://blogtwin.vercel.app)

### 다른 배포 옵션

#### AWS Amplify
```bash
# Amplify CLI 설치
npm install -g @aws-amplify/cli

# 초기화
amplify init

# 호스팅 추가
amplify add hosting

# 배포
amplify publish
```

#### Netlify
```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 배포
cd web
netlify deploy --prod
```

## 2. Android 앱 설정

### App.tsx URL 변경

배포 후 [App.tsx](../App.tsx) 파일의 URL을 업데이트:

```typescript
const WEB_APP_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:3002'      // 개발: 로컬 서버
    : 'http://localhost:3002'
  : 'https://blogtwin.vercel.app'; // 👈 배포된 URL로 변경
```

## 3. Android APK 빌드

### Debug APK (테스트용)
```bash
cd android
./gradlew assembleDebug
```
APK 위치: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (배포용)

1. **키스토어 생성** (처음 한 번만)
   ```bash
   cd android/app
   keytool -genkeypair -v -storetype PKCS12 -keystore blogtwin-release.keystore -alias blogtwin -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **gradle.properties 설정**
   ```properties
   BLOGTWIN_UPLOAD_STORE_FILE=blogtwin-release.keystore
   BLOGTWIN_UPLOAD_KEY_ALIAS=blogtwin
   BLOGTWIN_UPLOAD_STORE_PASSWORD=your-password
   BLOGTWIN_UPLOAD_KEY_PASSWORD=your-password
   ```

3. **build.gradle 설정**
   `android/app/build.gradle`에 추가:
   ```gradle
   android {
       signingConfigs {
           release {
               storeFile file(BLOGTWIN_UPLOAD_STORE_FILE)
               storePassword BLOGTWIN_UPLOAD_STORE_PASSWORD
               keyAlias BLOGTWIN_UPLOAD_KEY_ALIAS
               keyPassword BLOGTWIN_UPLOAD_KEY_PASSWORD
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled false
               proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

4. **Release APK 빌드**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   APK 위치: `android/app/build/outputs/apk/release/app-release.apk`

## 4. Google Play Store 배포

### AAB (Android App Bundle) 생성
```bash
cd android
./gradlew bundleRelease
```
AAB 위치: `android/app/build/outputs/bundle/release/app-release.aab`

### Play Console에 업로드
1. https://play.google.com/console 접속
2. 앱 만들기
3. AAB 파일 업로드
4. 스토어 등록 정보 작성 ([APP_STORE_LISTING.md](../APP_STORE_LISTING.md) 참고)
5. 심사 제출

## 5. 배포 후 업데이트

### 웹 앱 업데이트 (즉시 반영)
```bash
cd web
# 코드 수정 후
git add .
git commit -m "Update feature"
git push

# Vercel이 자동으로 배포
```

**장점**: Android 앱 업데이트 없이 모든 사용자에게 즉시 반영됨!

### Android 앱 업데이트 (필요 시)
- 네이티브 기능 변경 시에만 필요
- Play Store에 새 버전 업로드

## 6. 모니터링

### Vercel Analytics
- Vercel 대시보드에서 자동 제공
- 방문자 수, 페이지 로드 시간 등 확인

### Sentry (오류 추적)
```bash
npm install @sentry/nextjs
```

### Google Analytics
```typescript
// web/src/app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  )
}
```

## 7. 비용 예상

### Vercel (웹 호스팅)
- Hobby (무료): 월 100GB 대역폭
- Pro ($20/월): 무제한 대역폭

### Supabase (데이터베이스)
- Free: 500MB 데이터베이스, 2GB 파일 저장소
- Pro ($25/월): 8GB 데이터베이스, 100GB 파일 저장소

### OpenAI API
- 사용량 기반 과금
- GPT-4o-mini 추천 (저렴)

## 8. 체크리스트

배포 전 확인사항:

- [ ] 환경 변수 설정 완료
- [ ] Supabase 데이터베이스 설정 완료
- [ ] Naver API 키 발급 완료
- [ ] OpenAI API 키 발급 완료
- [ ] 웹 앱 Vercel 배포 완료
- [ ] App.tsx URL 업데이트 완료
- [ ] Release APK 빌드 완료
- [ ] 앱 아이콘 및 스플래시 스크린 설정 완료
- [ ] 개인정보처리방침 및 이용약관 작성 완료
- [ ] Google Play Console 개발자 계정 생성 완료

## 참고 문서

- [프로젝트 계획](PROJECT_PLAN.md)
- [Supabase 설정](SUPABASE_SETUP.md)
- [앱스토어 등록](APP_STORE_LISTING.md)
- [Android Studio 설정](ANDROID_STUDIO_SETUP.md)
