# 🤖 BlogTwin

> AI가 당신의 블로그 스타일을 학습하고, 사진과 주제만으로 자동으로 글을 작성해주는 WebView 하이브리드 앱

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.73-61DAFB?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?logo=supabase)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?logo=openai)](https://openai.com/)

---

## 📖 프로젝트 개요

**BlogTwin**은 당신의 블로그 글쓰기 스타일을 AI가 학습하고, 주제나 사진만 제공하면 자동으로 당신의 스타일에 맞는 블로그 글을 작성해주는 혁신적인 모바일 애플리케이션입니다.

### 🎯 핵심 기능

- **📚 스타일 학습**: 최근 2개월 간의 블로그 글을 분석하여 당신만의 어투와 스타일을 학습
- **✍️ 카테고리별 글 작성**: 주제만 입력하면 학습된 스타일로 완성도 높은 글 자동 생성
- **📸 사진 기반 포스팅**: 사진만 올리면 GPT-4 Vision이 분석하고 스토리텔링 생성
- **🔗 블로그 연동**: 티스토리, 네이버 블로그 원클릭 연동 및 자동 발행
- **🎨 AI 편집 어시스턴트**: 글 작성 후 AI가 문장 다듬기, 맞춤법 검사 등 지원

---

## 🗂️ 문서 구조

### 📄 주요 문서

| 문서 | 설명 |
|------|------|
| **[📱 WEBVIEW_GUIDE.md](./WEBVIEW_GUIDE.md)** | WebView 하이브리드 앱 실행 가이드 (필독!) |
| **[🚀 web/README.md](./web/README.md)** | Next.js 웹앱 개발 가이드 |
| **[📋 PROJECT_PLAN.md](./PROJECT_PLAN.md)** | 전체 프로젝트 계획서 (참고용) |
| **[🔧 SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** | Supabase 백엔드 설정 가이드 |
| **[📊 PROGRESS.md](./PROGRESS.md)** | 개발 진행 상황 추적 |
| **[🏪 STORE_SUBMISSION_GUIDE.md](./STORE_SUBMISSION_GUIDE.md)** | 앱스토어 제출 가이드 |

### 📋 프로젝트 계획서 내용

- ✅ 화면 기획 (9개 주요 화면)
- ✅ 기술 스택 상세
- ✅ 시스템 아키텍처 & 데이터 흐름
- ✅ 세부 개발 프로세스 (코드 예시 포함)
- ✅ 16주 개발 로드맵
- ✅ API 명세
- ✅ 데이터베이스 설계
- ✅ 보안 가이드
- ✅ 배포 전략

---

## 🛠️ 기술 스택

### 🌐 WebView 하이브리드 아키텍처

```
┌─────────────────────────────────┐
│   React Native App (Wrapper)   │  ← Android/iOS 네이티브 앱
│  ┌──────────────────────────┐   │
│  │     WebView              │   │
│  │  ┌──────────────────┐    │   │
│  │  │   Next.js Web    │    │   │  ← 실제 웹앱
│  │  │   (Port 3002)    │    │   │
│  │  └──────────────────┘    │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

### Frontend (웹앱)
- **Next.js 16** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS 3.4** - 유틸리티 CSS
- **React Hooks** - 상태 관리

### Mobile (배포용)
- **React Native** - Android WebView 래퍼 (배포 시에만 사용)

### Backend & Services
- **Supabase**
  - Authentication (선택사항)
  - PostgreSQL Database (선택사항)
  - Storage (선택사항)
- **OpenAI API**
  - GPT-4 Turbo (텍스트 생성)
  - GPT-4 Vision (이미지 분석)

### 블로그 API
- **티스토리 API** (OAuth 2.0)
- **네이버 블로그 API** (OAuth 2.0)

### 배포
- **Vercel** - 웹앱 호스팅
- **Google Play Store** - Android 앱
- **App Store** - iOS 앱 (선택)

---

## 🏗️ 프로젝트 구조

```
BlogTwin/
├── web/                      # ⭐ Next.js 웹앱 (메인 애플리케이션)
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   │   ├── page.tsx                    # Splash
│   │   │   ├── onboarding/page.tsx         # 온보딩
│   │   │   ├── login/page.tsx              # 로그인
│   │   │   ├── dashboard/page.tsx          # 대시보드
│   │   │   ├── blog-connect/page.tsx       # 블로그 연동
│   │   │   ├── create/
│   │   │   │   ├── category/page.tsx       # 카테고리 글 작성
│   │   │   │   └── photo/page.tsx          # 사진 포스팅
│   │   │   ├── editor/[id]/page.tsx        # 편집기
│   │   │   ├── posts/page.tsx              # 내 글 목록
│   │   │   ├── publish/[id]/page.tsx       # 발행 설정
│   │   │   ├── analysis/page.tsx           # 스타일 분석
│   │   │   └── settings/page.tsx           # 설정
│   │   ├── components/
│   │   │   ├── ui/           # UI 컴포넌트
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   └── LoadingSpinner.tsx
│   │   │   └── layout/       # 레이아웃 컴포넌트
│   │   │       ├── AppHeader.tsx
│   │   │       └── BottomNav.tsx
│   │   └── lib/              # 유틸리티
│   │       └── supabase.ts
│   ├── public/               # 정적 파일
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
│
├── App.tsx                   # ⭐ React Native WebView 래퍼
├── android/                  # Android 네이티브 코드
│   ├── app/
│   │   └── src/main/
│   │       └── AndroidManifest.xml
│   └── build.gradle
├── ios/                      # iOS 네이티브 코드 (선택)
│
├── src/                      # 기존 React Native 코드 (백업)
│   ├── screens/
│   ├── components/
│   ├── navigation/
│   └── services/
│
├── WEBVIEW_GUIDE.md         # WebView 실행 가이드
├── PROJECT_PLAN.md
├── NAVER_OAUTH_GUIDE.md
├── package.json
└── README.md
```

---

## 🔄 개발 워크플로우

### WebView 앱 개발 흐름

```
1. 웹앱 개발 (web/ 디렉토리)
   ↓
2. 브라우저에서 테스트 (localhost:3002)
   ↓
3. Android 에뮬레이터에서 테스트
   ↓
4. 웹앱 배포 (Vercel)
   ↓
5. Android APK 빌드 및 배포
```

### 빠른 시작

```bash
# 개발 환경 - 웹 개발만
cd web
npm install
npm run dev

# 브라우저에서 테스트
# http://localhost:3002

# 또는 루트에서 실행
npm run dev
```

👉 배포 가이드: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🚀 개발 로드맵

### Phase 1: 기반 구축 (4주)
- Week 1-2: 프로젝트 초기화 & UI 개발
- Week 3: 티스토리 API 연동
- Week 4: 네이버 블로그 OAuth 연동 (딥링크)

### Phase 2: AI 핵심 기능 (4주)
- Week 5: OpenAI API 통합
- Week 6: 스타일 분석 시스템
- Week 7: 카테고리별 글 생성
- Week 8: 사진 기반 포스팅

### Phase 3: 편집 & 발행 (3주)
- Week 9-10: 리치 텍스트 에디터 + AI 어시스턴트
- Week 11: 발행 시스템

### Phase 4: 고도화 & 최적화 (3주)
- Week 12: 성능 최적화
- Week 13: UX 개선
- Week 14: 테스트 & 버그 수정

### Phase 5: 출시 준비 (2주)
- Week 15-16: 스토어 등록 및 출시

**총 예상 기간**: 16주 (약 4개월)

---

## 💡 주요 기능 구현

### 1. WebView 하이브리드 앱

```typescript
// App.tsx - React Native WebView
const WEB_APP_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:3002'     // Android 에뮬레이터
    : 'http://localhost:3002'     // iOS 시뮬레이터
  : 'https://blogtwin.vercel.app' // 프로덕션

<WebView source={{uri: WEB_APP_URL}} />
```

### 2. Next.js 웹앱 (12개 화면)

```typescript
// web/src/app/ - Next.js App Router
- page.tsx              // Splash
- onboarding/page.tsx   // 온보딩
- dashboard/page.tsx    // 메인 대시보드
- create/category/      // AI 글 작성
- editor/[id]/         // 에디터
// ... 총 12개 화면
```

### 3. 데모 모드

```typescript
// 백엔드 없이도 작동
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Mock 데이터 사용
const posts = isSupabaseConfigured()
  ? await fetchFromSupabase()
  : getMockPosts();
```

---

## 📱 지원 플랫폼

- ✅ iOS 14.0+
- ✅ Android 6.0+ (API Level 23+)

---

## 🔒 보안

- **토큰 암호화**: AES-256으로 OAuth 토큰 암호화 저장
- **HTTPS 통신**: 모든 API 통신 암호화
- **CSRF 방지**: OAuth State 파라미터 검증
- **Client Secret 보호**: 서버(Firebase Functions)에서만 사용

---

## 📊 예상 비용

### 개발 단계
- OpenAI API: $50-200/월
- Firebase: Free tier
- Apple Developer: $99/년
- Google Play: $25 (일회성)

### 운영 단계 (사용자 1000명 기준)
- OpenAI API: $500-1000/월
- Firebase: $200-500/월
- Sentry: $50/월
- **총 예상**: $750-1550/월

---

## 🎯 성공 지표

### 론칭 후 3개월
- 다운로드 1,000건
- MAU (Monthly Active Users) 500명
- 글 생성 완료율 80%+
- 발행 성공률 95%+

### 론칭 후 6개월
- 다운로드 5,000건
- MAU 2,000명
- D30 리텐션 30%+

---

## 🤝 기여

이 프로젝트는 현재 개발 단계입니다.

---

## 📄 라이선스

TBD

---

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**Made with ❤️ using React Native & OpenAI GPT-4**

---

## 🗓️ 변경 이력

### v0.2.0 (2025-11-16) - WebView 하이브리드 전환 완료 ✅
- ✅ Next.js 16 웹앱 개발 완료 (12개 전체 화면)
- ✅ React Native WebView 래퍼 구현
- ✅ 데모 모드 구현 (백엔드 없이 테스트 가능)
- ✅ Tailwind CSS 디자인 시스템
- ✅ 모바일 최적화 UI (480px max-width)
- ✅ 실행 가이드 문서 작성 (WEBVIEW_GUIDE.md)

**구현된 화면**: Splash, Onboarding, Login, Dashboard, Blog Connection, Category Post, Photo Post, Editor, My Posts, Publish Settings, Style Analysis, Settings

### v0.1.0 (Planning Phase)
- 프로젝트 계획 수립
- 기술 스택 선정
- 화면 기획 완료
- 네이버 OAuth 가이드 작성
