# 🌐 BlogTwin Web App

> React Native 앱을 Next.js 웹앱으로 완전히 이식한 버전

## 🚀 빠른 시작

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 값들을 설정하세요:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# OpenAI
OPENAI_API_KEY=sk-...

# Naver OAuth
NEXT_PUBLIC_NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열어주세요.

---

## 📱 구현된 화면

### ✅ 완료된 페이지

- [x] **Splash Screen** (`/`) - 로딩 및 인증 확인
- [x] **Login** (`/login`) - 네이버 소셜 로그인
- [x] **Dashboard** (`/dashboard`) - 메인 허브 화면
- [x] **Blog Connection** (`/blog-connect`) - 블로그 연동
- [x] **Category Post Create** (`/create/category`) - 주제 기반 글 작성

### ⏳ 구현 예정

- [ ] Photo Post Create (`/create/photo`)
- [ ] Post Editor (`/editor/[id]`)
- [ ] My Posts (`/posts`)
- [ ] Style Analysis (`/analysis`)
- [ ] Publish Settings (`/publish/[id]`)
- [ ] Settings (`/settings`)

---

## 🎨 UI 컴포넌트

### 공통 컴포넌트 (`src/components/ui/`)

- `Button` - 4가지 variant (primary, secondary, outline, ghost)
- `Card` - 3가지 variant (default, elevated, outlined)
- `Input` / `Textarea` - 폼 입력
- `LoadingSpinner` / `LoadingOverlay` - 로딩 상태

### 레이아웃 컴포넌트 (`src/components/layout/`)

- `AppHeader` - 앱 상단 헤더
- `BottomNav` - 하단 네비게이션

---

## 🏗️ 프로젝트 구조

```
web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Splash screen
│   │   ├── login/              # 로그인
│   │   ├── dashboard/          # 대시보드
│   │   ├── blog-connect/       # 블로그 연동
│   │   ├── create/
│   │   │   ├── category/       # 카테고리 글 작성
│   │   │   └── photo/          # 사진 포스팅
│   │   ├── editor/[id]/        # 글 편집기
│   │   ├── posts/              # 내 글 목록
│   │   └── api/                # API Routes
│   ├── components/
│   │   ├── ui/                 # UI 컴포넌트
│   │   └── layout/             # 레이아웃 컴포넌트
│   ├── lib/
│   │   └── supabase.ts         # Supabase 클라이언트
│   └── styles/
│       └── globals.css         # 전역 스타일
├── public/
│   └── manifest.json           # PWA manifest
├── .env.local                  # 환경 변수 (git 제외)
├── .env.example                # 환경 변수 예시
├── WEB_MIGRATION_PLAN.md       # 이식 계획서
└── PAGES_SPECIFICATION.md      # 페이지 상세 명세
```

---

## 📚 문서

- **[WEB_MIGRATION_PLAN.md](./WEB_MIGRATION_PLAN.md)** - 웹앱 이식 계획 및 진행 상황
- **[PAGES_SPECIFICATION.md](./PAGES_SPECIFICATION.md)** - 모든 페이지의 기능 상세 명세

---

## 🔧 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Auth**: Supabase Auth + Naver OAuth
- **AI**: OpenAI GPT-4

---

## 🎯 디자인 시스템

### Colors

- Primary: `#2196F3` (파랑)
- Secondary: `#E91E63` (분홍)
- Success: `#4CAF50` (초록)
- Error: `#F44336` (빨강)
- Naver: `#03C75A`
- Tistory: `#FF6B00`

### 모바일 우선

- 최대 폭: 480px
- 네이티브 앱처럼 보이는 UI
- 터치 인터랙션 최적화
- PWA 지원

---

## 🔐 인증 플로우

1. 사용자가 `/login`에서 "네이버로 계속하기" 클릭
2. 네이버 OAuth 페이지로 리다이렉트
3. 사용자 인증 후 `/auth/callback`으로 돌아옴
4. 백엔드 API에서 토큰 교환 및 사용자 정보 저장
5. 신규 사용자 → `/blog-connect`, 기존 사용자 → `/dashboard`

---

## 📝 TODO

### Phase 1: MVP (완료)
- [x] 프로젝트 구조 설정
- [x] Supabase 연결
- [x] 공통 컴포넌트
- [x] 주요 화면 5개

### Phase 2: 글 작성 기능
- [ ] Photo Post 화면
- [ ] Post Editor (TipTap)
- [ ] AI API 연동

### Phase 3: 부가 기능
- [ ] My Posts 목록
- [ ] Style Analysis
- [ ] Publish Settings
- [ ] Settings

### Phase 4: 최적화
- [ ] PWA 완성
- [ ] 이미지 최적화
- [ ] 성능 개선
- [ ] 모바일 테스트

---

## 🚀 배포

### Vercel (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

환경 변수는 Vercel Dashboard에서 설정하세요.

---

## 🐛 문제 해결

### Supabase 연결 오류

`.env.local` 파일의 `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 확인하세요.

### OAuth 콜백 에러

네이버/티스토리 개발자센터에서 Callback URL이 올바르게 설정되었는지 확인하세요:
- Development: `http://localhost:3000/auth/callback`
- Production: `https://yourdomain.com/auth/callback`

---

## 📞 도움말

- [Next.js 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Made with ❤️ - BlogTwin Web Team**
