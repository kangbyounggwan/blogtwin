# 🌐 BlogTwin 웹앱 이식 계획서

## 📋 목차
1. [개요](#개요)
2. [디자인 시스템 매핑](#디자인-시스템-매핑)
3. [컴포넌트 매핑](#컴포넌트-매핑)
4. [화면 이식 순서](#화면-이식-순서)
5. [기술 스택 차이](#기술-스택-차이)
6. [구현 체크리스트](#구현-체크리스트)

---

## 개요

### 목표
React Native 앱의 UI/UX를 **그대로** 웹으로 이식하되, 네이티브 앱처럼 보이는 PWA 구현

### 핵심 원칙
- ✅ 기존 디자인 시스템 100% 재현
- ✅ 모바일 우선 (Mobile First)
- ✅ 480px 최대 폭 컨테이너 (네이티브 앱처럼)
- ✅ 터치 인터랙션 완벽 구현
- ✅ 오프라인 지원 (PWA)

---

## 디자인 시스템 매핑

### ✅ Colors (완료)
| React Native | Web (Tailwind) | 상태 |
|--------------|----------------|------|
| `Colors.primary[500]` | `bg-primary-500` | ✅ |
| `Colors.secondary[500]` | `bg-secondary-500` | ✅ |
| `Colors.naver` | `bg-[#03C75A]` | ✅ |
| `Colors.tistory` | `bg-[#FF6B00]` | ✅ |
| `Colors.light.text.primary` | `text-gray-900` | ✅ |

### ✅ Typography (완료)
| React Native | Web (CSS) | 상태 |
|--------------|-----------|------|
| `Typography.h1` | `text-4xl font-bold` | ✅ |
| `Typography.h2` | `text-3xl font-bold` | ✅ |
| `Typography.body1` | `text-base` | ✅ |
| `Typography.caption` | `text-xs` | ✅ |

### ✅ Spacing (완료)
| React Native | Web (Tailwind) | 상태 |
|--------------|----------------|------|
| `Spacing.xs` (4) | `p-1` / `gap-1` | ✅ |
| `Spacing.base` (16) | `p-4` / `gap-4` | ✅ |
| `Spacing.xl` (24) | `p-6` / `gap-6` | ✅ |

### ✅ Shadows (완료)
| React Native | Web (Tailwind) | 상태 |
|--------------|----------------|------|
| `Shadows.sm` | `shadow-sm` | ✅ |
| `Shadows.md` | `shadow-md` | ✅ |
| `Shadows.lg` | `shadow-lg` | ✅ |

---

## 컴포넌트 매핑

### 공통 컴포넌트

| React Native 컴포넌트 | Web 구현 | 우선순위 |
|----------------------|----------|----------|
| `<Button>` | `<button>` + Tailwind | 🔴 High |
| `<Card>` | `<div>` + card styles | 🔴 High |
| `<Text>` | `<p>` / `<span>` | 🔴 High |
| `<Screen>` | Layout wrapper | 🔴 High |
| `<LoadingSpinner>` | CSS animation | 🟡 Medium |
| `<Toast>` | Toast library or custom | 🟡 Medium |
| `<EmptyState>` | Custom component | 🟢 Low |
| `<ErrorBoundary>` | React Error Boundary | 🟢 Low |

### React Native → Web 변환 규칙

```typescript
// React Native
<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
  <TouchableOpacity onPress={handlePress}>
    <Text>Click me</Text>
  </TouchableOpacity>
</View>

// Web (Next.js + Tailwind)
<div className="flex flex-col gap-4 p-4">
  <h1 className="text-2xl font-bold">Title</h1>
  <button
    onClick={handlePress}
    className="btn-primary active:scale-95"
  >
    Click me
  </button>
</div>
```

---

## 화면 이식 순서

### Phase 1: 기본 화면 (1-2일)
- [x] Layout 구조
- [x] Splash Screen
- [ ] Dashboard (HomeScreen)
- [ ] 로그인 화면

**구현 파일**:
```
web/src/app/
├── layout.tsx          ✅
├── page.tsx            ✅ (Splash)
├── dashboard/
│   └── page.tsx        ⬜
└── login/
    └── page.tsx        ⬜
```

### Phase 2: 블로그 연동 (1일)
- [ ] BlogConnectionScreen
- [ ] 네이버 OAuth 플로우

**구현 파일**:
```
web/src/app/
└── blog-connect/
    └── page.tsx        ⬜
```

### Phase 3: 글 작성 (2-3일)
- [ ] CategoryPostScreen
- [ ] PhotoPostScreen
- [ ] PostEditorScreen

**구현 파일**:
```
web/src/app/
├── create/
│   ├── category/
│   │   └── page.tsx    ⬜
│   └── photo/
│       └── page.tsx    ⬜
└── editor/
    └── [id]/
        └── page.tsx    ⬜
```

### Phase 4: 부가 기능 (1-2일)
- [ ] MyPostsScreen
- [ ] SettingsScreen
- [ ] PublishSettingsScreen

---

## 기술 스택 차이

### Navigation

| React Native | Web |
|--------------|-----|
| `@react-navigation/native` | Next.js App Router |
| `navigation.navigate()` | `router.push()` |
| Stack Navigator | File-based routing |

```typescript
// React Native
navigation.navigate('Dashboard');

// Web
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/dashboard');
```

### State Management

| React Native | Web |
|--------------|-----|
| Zustand | Zustand (동일) ✅ |

### Storage

| React Native | Web |
|--------------|-----|
| AsyncStorage | localStorage / Supabase |
| @react-native-firebase | Supabase ✅ |

### Image Handling

| React Native | Web |
|--------------|-----|
| `react-native-image-picker` | `<input type="file">` |
| `FastImage` | Next.js `<Image>` |

### Gestures

| React Native | Web |
|--------------|-----|
| `TouchableOpacity` | `<button>` + `active:` |
| `onPress` | `onClick` |
| Gesture Handler | CSS transforms |

---

## 구현 체크리스트

### Setup
- [x] Next.js 프로젝트 생성
- [x] Tailwind CSS 설정
- [x] 디자인 시스템 이식
- [x] 모바일 컨테이너 스타일
- [ ] Supabase 연결
- [ ] 환경 변수 설정
- [ ] PWA manifest

### 공통 컴포넌트
- [ ] Button (primary, secondary, outline)
- [ ] Card (elevated, outlined)
- [ ] Text (variants)
- [ ] Input
- [ ] LoadingSpinner
- [ ] Toast
- [ ] Modal
- [ ] BottomNav

### 화면 (총 12개)
- [x] Splash ✅
- [ ] Dashboard
- [ ] Login
- [ ] BlogConnection
- [ ] CategoryPost
- [ ] PhotoPost
- [ ] PostEditor
- [ ] MyPosts
- [ ] Settings
- [ ] StyleAnalysis
- [ ] PublishSettings
- [ ] Onboarding

### 기능
- [ ] Supabase 인증
- [ ] 네이버 OAuth (웹용)
- [ ] AI 글 생성 API
- [ ] 이미지 업로드
- [ ] 블로그 발행
- [ ] 오프라인 지원 (PWA)

### 최적화
- [ ] 이미지 최적화
- [ ] 코드 스플리팅
- [ ] 성능 측정
- [ ] 모바일 테스트
- [ ] PWA 설치 테스트

---

## 예상 일정

| Phase | 작업 | 예상 시간 |
|-------|------|-----------|
| 1 | Setup + 기본 화면 | 1-2일 |
| 2 | 공통 컴포넌트 | 1일 |
| 3 | 블로그 연동 | 1일 |
| 4 | 글 작성 기능 | 2-3일 |
| 5 | 부가 기능 | 1-2일 |
| 6 | 테스트 & 최적화 | 1일 |
| **총** | | **7-10일** |

---

## 다음 단계

### 즉시 시작
1. ✅ 프로젝트 구조 생성
2. ✅ 디자인 시스템 설정
3. ⬜ Supabase 연결
4. ⬜ 공통 컴포넌트 구현
5. ⬜ Dashboard 화면 구현

### 지금 실행할 명령어
```bash
cd web
npm run dev
# http://localhost:3000에서 확인
```

---

**작성일**: 2025-11-16
**업데이트**: 매 작업 완료 시
