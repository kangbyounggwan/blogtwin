# 📱 BlogTwin 웹앱 페이지 상세 명세서

> 모든 페이지의 기능, 상태, API, 컴포넌트를 상세히 기록한 개발 참조 문서

---

## 📋 목차

1. [Splash Screen](#1-splash-screen)
2. [Onboarding Screen](#2-onboarding-screen)
3. [Login Screen](#3-login-screen)
4. [Blog Connection Screen](#4-blog-connection-screen)
5. [Dashboard (Home)](#5-dashboard-home)
6. [Category Post Create](#6-category-post-create)
7. [Photo Post Create](#7-photo-post-create)
8. [Post Editor](#8-post-editor)
9. [My Posts Screen](#9-my-posts-screen)
10. [Style Analysis Screen](#10-style-analysis-screen)
11. [Publish Settings Screen](#11-publish-settings-screen)
12. [Settings Screen](#12-settings-screen)

---

## 1. Splash Screen

### 📍 경로
`/` (루트)

### 🎯 목적
- 앱 브랜딩 표시
- 초기 로딩 처리
- 사용자 인증 상태 확인

### 🔧 기능
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 로고 애니메이션 | 앱 아이콘 + 로고 페이드인 | 🔴 High |
| 로딩 바 | 진행 상태 표시 | 🟡 Medium |
| 자동 리다이렉트 | 2초 후 자동 이동 | 🔴 High |
| 인증 상태 체크 | Supabase 세션 확인 | 🔴 High |

### 📊 상태 관리
```typescript
interface SplashState {
  loading: boolean;
  progress: number; // 0-100
  redirecting: boolean;
}
```

### 🔗 API 호출
- `supabase.auth.getSession()` - 사용자 세션 확인

### 🎨 컴포넌트 구조
```tsx
<SplashScreen>
  ├── <Logo> (animated)
  ├── <AppName>
  ├── <Tagline>
  └── <ProgressBar>
</SplashScreen>
```

### ↗️ 리다이렉트 로직
```typescript
if (session) {
  router.push('/dashboard');
} else {
  router.push('/onboarding');
}
```

### ✅ 완료 조건
- [x] 기본 UI 구현
- [ ] 인증 상태 체크
- [ ] 리다이렉트 로직
- [ ] 애니메이션

---

## 2. Onboarding Screen

### 📍 경로
`/onboarding`

### 🎯 목적
- 신규 사용자에게 앱 기능 소개
- 가입 유도

### 🔧 기능
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 캐러셀 | 3개 슬라이드 스와이프 | 🔴 High |
| Slide 1 | "블로그 스타일 학습" | 🔴 High |
| Slide 2 | "AI 자동 글 작성" | 🔴 High |
| Slide 3 | "빠른 포스팅" | 🔴 High |
| 건너뛰기 | 온보딩 스킵 | 🟡 Medium |
| 시작하기 버튼 | 로그인 화면 이동 | 🔴 High |

### 📊 상태 관리
```typescript
interface OnboardingState {
  currentSlide: number; // 0-2
  showSkipButton: boolean;
}
```

### 🎨 컴포넌트 구조
```tsx
<OnboardingScreen>
  <Carousel>
    <Slide index={0}>
      <Icon>📚</Icon>
      <Title>블로그 스타일 학습</Title>
      <Description>AI가 당신의 글쓰기 스타일을 분석합니다</Description>
    </Slide>
    {/* Slide 1, 2... */}
  </Carousel>
  <Indicator dots={3} current={currentSlide} />
  <Button>시작하기</Button>
  <TextButton>건너뛰기</TextButton>
</OnboardingScreen>
```

### ↗️ 리다이렉트
- "시작하기" → `/login`
- "건너뛰기" → `/login`

### ✅ 완료 조건
- [ ] 캐러셀 구현
- [ ] 3개 슬라이드 콘텐츠
- [ ] 터치 스와이프
- [ ] 인디케이터
- [ ] 버튼 액션

---

## 3. Login Screen

### 📍 경로
`/login`

### 🎯 목적
- 네이버 소셜 로그인

### 🔧 기능
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 네이버 로그인 버튼 | OAuth 플로우 시작 | 🔴 High |
| 로딩 상태 | 인증 진행 중 표시 | 🟡 Medium |
| 에러 처리 | 로그인 실패 시 메시지 | 🔴 High |

### 📊 상태 관리
```typescript
interface LoginState {
  loading: boolean;
  error: string | null;
}
```

### 🔗 API 호출
```typescript
// Supabase Auth with Naver OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'oauth_naver',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
});
```

### 🎨 컴포넌트 구조
```tsx
<LoginScreen>
  <Logo />
  <Heading>환영합니다!</Heading>
  <Subtitle>AI가 블로그 글을 작성합니다</Subtitle>

  <SocialButton
    provider="naver"
    icon={NaverIcon}
    onClick={handleNaverLogin}
  >
    네이버로 계속하기
  </SocialButton>

  {loading && <LoadingSpinner />}
  {error && <ErrorMessage>{error}</ErrorMessage>}
</LoginScreen>
```

### ↗️ 리다이렉트
- 로그인 성공 → `/blog-connect` (신규) 또는 `/dashboard` (기존)
- 로그인 실패 → 에러 메시지 표시

### ✅ 완료 조건
- [ ] 네이버 OAuth 연동
- [ ] Supabase Auth 설정
- [ ] Callback 핸들링
- [ ] 에러 처리
- [ ] 로딩 상태

---

## 4. Blog Connection Screen

### 📍 경로
`/blog-connect`

### 🎯 목적
- 블로그 플랫폼 연동
- 글 수집 및 분석

### 🔧 기능
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 플랫폼 선택 | 네이버/티스토리 선택 | 🔴 High |
| OAuth 연동 | 각 플랫폼 인증 | 🔴 High |
| 글 수집 | 최근 2개월 글 가져오기 | 🔴 High |
| 진행률 표시 | Progress bar | 🟡 Medium |
| 스타일 분석 | AI 분석 시작 | 🔴 High |
| 나중에 하기 | 건너뛰기 | 🟡 Medium |

### 📊 상태 관리
```typescript
interface BlogConnectionState {
  selectedPlatform: 'naver' | 'tistory' | null;
  connecting: boolean;
  fetchingPosts: boolean;
  fetchProgress: number; // 0-100
  posts: BlogPost[];
  analyzing: boolean;
  error: string | null;
}
```

### 🔗 API 호출
```typescript
// 1. OAuth 연동
POST /api/blog/connect
{
  platform: 'naver' | 'tistory',
  authCode: string
}

// 2. 글 목록 가져오기
GET /api/blog/posts?platform=naver&months=2

// 3. 스타일 분석 시작
POST /api/ai/analyze-style
{
  userId: string,
  posts: BlogPost[]
}
```

### 🎨 컴포넌트 구조
```tsx
<BlogConnectionScreen>
  <Header>
    <Title>블로그를 연동해주세요</Title>
    <HelpIcon />
  </Header>

  <PlatformList>
    <PlatformCard
      platform="tistory"
      icon="🅣"
      onClick={() => handleConnect('tistory')}
    />
    <PlatformCard
      platform="naver"
      icon="N"
      onClick={() => handleConnect('naver')}
    />
  </PlatformList>

  {fetchingPosts && (
    <ProgressSection>
      <ProgressBar value={fetchProgress} />
      <StatusText>글을 불러오는 중... {fetchProgress}%</StatusText>
    </ProgressSection>
  )}

  {analyzing && (
    <AnalyzingSection>
      <Spinner />
      <Text>AI가 스타일을 분석하고 있습니다...</Text>
    </AnalyzingSection>
  )}

  <SkipButton>나중에 하기</SkipButton>
</BlogConnectionScreen>
```

### 📝 프로세스
```
1. 플랫폼 선택 (티스토리/네이버)
   ↓
2. OAuth 팝업 열기
   ↓
3. 인증 완료 → authCode 받기
   ↓
4. 백엔드로 authCode 전송
   ↓
5. Access Token 저장 (Supabase)
   ↓
6. 글 목록 가져오기 (Progress 표시)
   ↓
7. 글 DB 저장
   ↓
8. AI 스타일 분석 시작
   ↓
9. 분석 완료 → Dashboard로 이동
```

### ✅ 완료 조건
- [ ] 플랫폼 선택 UI
- [ ] 네이버 OAuth
- [ ] 티스토리 OAuth
- [ ] 글 수집 API
- [ ] Progress bar
- [ ] AI 분석 트리거
- [ ] 에러 처리

---

## 5. Dashboard (Home)

### 📍 경로
`/dashboard`

### 🎯 목적
- 메인 허브 화면
- 주요 기능 접근
- 최근 작성 글 확인

### 🔧 기능
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 연동 정보 표시 | 블로그 플랫폼, 분석 통계 | 🔴 High |
| 동기화 버튼 | 최신 글 다시 가져오기 | 🟡 Medium |
| 카테고리 글 작성 버튼 | `/create/category`로 이동 | 🔴 High |
| 사진 포스팅 버튼 | `/create/photo`로 이동 | 🔴 High |
| 최근 작성 글 목록 | 임시저장/발행 글 표시 | 🔴 High |
| 하단 네비게이션 | 홈/내글/설정 탭 | 🟡 Medium |

### 📊 상태 관리
```typescript
interface DashboardState {
  user: User;
  blogInfo: {
    platform: string;
    analyzedPostCount: number;
    lastSyncAt: Date;
  };
  recentPosts: Post[];
  loading: boolean;
  syncing: boolean;
}
```

### 🔗 API 호출
```typescript
// 대시보드 데이터 로드
GET /api/dashboard
Response: {
  user: User,
  blogInfo: BlogInfo,
  recentPosts: Post[]
}

// 동기화
POST /api/blog/sync
```

### 🎨 컴포넌트 구조
```tsx
<DashboardScreen>
  <AppHeader>
    <MenuIcon />
    <Title>BlogTwin</Title>
    <NotificationIcon />
    <SettingsIcon />
  </AppHeader>

  <BlogInfoCard>
    <Text>연동된 블로그: {platform}</Text>
    <Text>📊 분석된 글: {count}개</Text>
    <Text>🕐 마지막 동기화: {lastSync}</Text>
    <SyncButton onClick={handleSync}>
      {syncing ? <Spinner /> : '🔄'}
    </SyncButton>
  </BlogInfoCard>

  <ActionCards>
    <ActionCard
      icon="✍️"
      title="카테고리별 글 작성"
      subtitle="주제를 입력하고 AI가 글을 작성합니다"
      onClick={() => router.push('/create/category')}
    />
    <ActionCard
      icon="📸"
      title="사진으로 포스팅"
      subtitle="사진만 올리면 자동으로 글이 작성됩니다"
      onClick={() => router.push('/create/photo')}
    />
  </ActionCards>

  <RecentPostsSection>
    <SectionTitle>최근 작성 글</SectionTitle>
    {recentPosts.map(post => (
      <PostListItem
        key={post.id}
        title={post.title}
        status={post.status} // 'draft' | 'published'
        createdAt={post.createdAt}
        onClick={() => router.push(`/editor/${post.id}`)}
      />
    ))}
  </RecentPostsSection>

  <BottomNav>
    <NavItem icon="🏠" label="홈" active />
    <NavItem icon="📄" label="내 글" />
    <NavItem icon="⚙️" label="설정" />
  </BottomNav>
</DashboardScreen>
```

### ✅ 완료 조건
- [ ] 대시보드 레이아웃
- [ ] 블로그 정보 카드
- [ ] 액션 카드 2개
- [ ] 최근 글 목록
- [ ] 동기화 기능
- [ ] 하단 네비게이션

---

## 6. Category Post Create

### 📍 경로
`/create/category`

### 🎯 목적
- 주제/키워드 기반 AI 글 생성

### 🔧 기능
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 카테고리 선택 | 드롭다운 (여행, 맛집, 일상 등) | 🔴 High |
| 주제 입력 | 텍스트 필드 | 🔴 High |
| 글자 수 슬라이더 | 500-3000자 범위 | 🟡 Medium |
| 스타일 강도 | 내 스타일 0-100% | 🟡 Medium |
| 옵션 체크박스 | 이모지, 해시태그 | 🟢 Low |
| 생성 버튼 | AI 글 작성 시작 | 🔴 High |
| 진행 상태 | 생성 단계별 표시 | 🟡 Medium |
| 미리보기 | 생성 완료 후 표시 | 🔴 High |

### 📊 상태 관리
```typescript
interface CategoryPostState {
  // 입력 폼
  category: string;
  topic: string;
  wordCount: number; // 500-3000
  styleStrength: number; // 0-100
  useEmoji: boolean;
  useHashtags: boolean;

  // 생성 상태
  generating: boolean;
  progress: number; // 0-100
  currentStep: string; // '주제 분석', '구조 생성', etc.

  // 결과
  generatedPost: {
    title: string;
    content: string;
    tags: string[];
  } | null;

  error: string | null;
}
```

### 🔗 API 호출
```typescript
// AI 글 생성
POST /api/ai/generate-post
{
  userId: string,
  category: string,
  topic: string,
  wordCount: number,
  styleStrength: number,
  useEmoji: boolean,
  useHashtags: boolean
}

Response: {
  title: string,
  content: string,
  tags: string[],
  wordCount: number
}
```

### 🎨 컴포넌트 구조
```tsx
<CategoryPostScreen>
  <Header>
    <BackButton />
    <Title>카테고리별 글 작성</Title>
    <MoreIcon />
  </Header>

  {!generating && !generatedPost && (
    <Form>
      <FormField>
        <Label>카테고리</Label>
        <Select value={category} onChange={setCategory}>
          <option value="travel">여행</option>
          <option value="food">맛집</option>
          <option value="daily">일상</option>
        </Select>
      </FormField>

      <FormField>
        <Label>주제/키워드</Label>
        <Input
          placeholder="예: 제주도 카페 투어"
          value={topic}
          onChange={setTopic}
        />
      </FormField>

      <FormField>
        <Label>목표 글자 수</Label>
        <Slider
          min={500}
          max={3000}
          step={100}
          value={wordCount}
          onChange={setWordCount}
        />
        <SliderLabels>
          <span>500</span>
          <span>1500</span>
          <span>3000</span>
        </SliderLabels>
      </FormField>

      <FormField>
        <Label>스타일 적용</Label>
        <Slider
          min={0}
          max={100}
          value={styleStrength}
          onChange={setStyleStrength}
        />
        <SliderText>내 스타일 {styleStrength}%</SliderText>
      </FormField>

      <FormField>
        <Label>추가 옵션</Label>
        <Checkbox checked={useEmoji} onChange={setUseEmoji}>
          이모지 사용
        </Checkbox>
        <Checkbox checked={useHashtags} onChange={setUseHashtags}>
          해시태그 자동 생성
        </Checkbox>
      </FormField>

      <Button
        onClick={handleGenerate}
        disabled={!topic}
      >
        AI 글 작성 시작
      </Button>
    </Form>
  )}

  {generating && (
    <GeneratingView>
      <Icon>🤖</Icon>
      <Title>AI가 글을 작성하고 있습니다</Title>

      <ProgressBar value={progress} />

      <StepsList>
        <StepItem completed>✅ 주제 분석 완료</StepItem>
        <StepItem completed>✅ 콘텐츠 구조 생성 완료</StepItem>
        <StepItem active>🔄 본문 작성 중...</StepItem>
        <StepItem>⏳ 스타일 적용 대기 중</StepItem>
      </StepsList>

      <EstimateTime>예상 완료 시간: 약 30초</EstimateTime>

      <CancelButton>취소</CancelButton>
    </GeneratingView>
  )}

  {generatedPost && (
    <PreviewView>
      <PreviewHeader>
        <Button onClick={() => router.push(`/editor/${postId}`)}>
          📝 편집
        </Button>
        <Button onClick={handleRegenerate}>
          🔄 재생성
        </Button>
        <Button onClick={() => router.push(`/publish/${postId}`)}>
          ✓ 발행
        </Button>
      </PreviewHeader>

      <PostPreview>
        <PostTitle>{generatedPost.title}</PostTitle>
        <Divider />
        <PostContent>{generatedPost.content}</PostContent>
        <Divider />
        <PostMeta>
          <MetaItem>카테고리: {category}</MetaItem>
          <MetaItem>태그: {generatedPost.tags.join(' ')}</MetaItem>
          <MetaItem>글자 수: {generatedPost.wordCount}자</MetaItem>
        </PostMeta>
      </PostPreview>
    </PreviewView>
  )}
</CategoryPostScreen>
```

### 📝 프로세스
```
1. 폼 입력 (카테고리, 주제, 설정)
   ↓
2. "AI 글 작성 시작" 클릭
   ↓
3. API 호출 (Streaming 응답)
   ↓
4. 진행 상태 업데이트
   - 주제 분석 (0-25%)
   - 구조 생성 (25-50%)
   - 본문 작성 (50-85%)
   - 스타일 적용 (85-100%)
   ↓
5. 생성 완료 → 미리보기 표시
   ↓
6. 사용자 선택:
   - 편집 → Editor
   - 재생성 → API 재호출
   - 발행 → Publish Settings
```

### ✅ 완료 조건
- [ ] 입력 폼 UI
- [ ] 카테고리 드롭다운
- [ ] 슬라이더 컴포넌트
- [ ] AI 생성 API 연동
- [ ] 진행 상태 UI
- [ ] 미리보기 화면
- [ ] 에러 처리

---

## 7. Photo Post Create

### 📍 경로
`/create/photo`

### 🎯 목적
- 사진 기반 AI 글 생성

### 🔧 기능
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 사진 선택 | 최대 10장 | 🔴 High |
| 사진 미리보기 | 썸네일 그리드 | 🔴 High |
| 사진 삭제 | 선택 취소 | 🟡 Medium |
| 설명 자동 생성 | GPT-4 Vision | 🔴 High |
| 카테고리 선택 | 드롭다운 | 🔴 High |
| 글 길이 선택 | 짧게/보통/길게 | 🟡 Medium |
| 추가 메모 | 선택사항 텍스트 | 🟢 Low |
| 생성 버튼 | AI 글 작성 시작 | 🔴 High |

### 📊 상태 관리
```typescript
interface PhotoPostState {
  selectedPhotos: File[]; // max 10
  category: string;
  length: 'short' | 'medium' | 'long'; // 300/1000/2000
  autoDescription: boolean;
  memo: string;

  uploading: boolean;
  uploadProgress: number;
  analyzing: boolean;
  generating: boolean;

  photoAnalysis: string[]; // 각 사진 설명
  generatedPost: {
    title: string;
    content: string;
  } | null;

  error: string | null;
}
```

### 🔗 API 호출
```typescript
// 1. 사진 업로드
POST /api/storage/upload
FormData: { photos: File[] }
Response: { urls: string[] }

// 2. 사진 분석 (GPT-4 Vision)
POST /api/ai/analyze-photos
{
  photoUrls: string[]
}
Response: { descriptions: string[] }

// 3. 글 생성
POST /api/ai/generate-photo-post
{
  userId: string,
  photoUrls: string[],
  descriptions: string[],
  category: string,
  length: string,
  memo: string
}
Response: {
  title: string,
  content: string
}
```

### 🎨 컴포넌트 구조
```tsx
<PhotoPostScreen>
  <Header>
    <BackButton />
    <Title>사진으로 포스팅</Title>
  </Header>

  <PhotoSection>
    <SectionTitle>사진 선택 (최대 10장)</SectionTitle>

    <PhotoGrid>
      {selectedPhotos.map((photo, i) => (
        <PhotoThumb key={i}>
          <Image src={URL.createObjectURL(photo)} />
          <RemoveButton onClick={() => removePhoto(i)}>
            ×
          </RemoveButton>
        </PhotoThumb>
      ))}

      {selectedPhotos.length < 10 && (
        <AddPhotoButton>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoSelect}
          />
          <Icon>📷</Icon>
          <Text>+</Text>
        </AddPhotoButton>
      )}
    </PhotoGrid>
  </PhotoSection>

  <FormSection>
    <FormField>
      <Label>사진 설명 자동 생성</Label>
      <RadioGroup value={autoDescription}>
        <Radio value={true}>켜기</Radio>
        <Radio value={false}>끄기</Radio>
      </RadioGroup>
    </FormField>

    <FormField>
      <Label>카테고리</Label>
      <Select value={category} onChange={setCategory}>
        <option value="daily">일상</option>
        <option value="travel">여행</option>
        <option value="food">맛집</option>
      </Select>
    </FormField>

    <FormField>
      <Label>글 길이</Label>
      <RadioGroup value={length}>
        <Radio value="short">
          짧게 <small>(300자)</small>
        </Radio>
        <Radio value="medium">
          보통 <small>(1000자)</small>
        </Radio>
        <Radio value="long">
          길게 <small>(2000자)</small>
        </Radio>
      </RadioGroup>
    </FormField>

    <FormField>
      <Label>추가 메모 (선택사항)</Label>
      <Textarea
        placeholder="오늘 날씨가 정말 좋았어요"
        value={memo}
        onChange={setMemo}
        rows={3}
      />
    </FormField>

    <Button
      onClick={handleGenerate}
      disabled={selectedPhotos.length === 0}
    >
      글 생성하기
    </Button>
  </FormSection>

  {(uploading || analyzing || generating) && (
    <LoadingOverlay>
      <Spinner />
      <LoadingText>
        {uploading && '사진을 업로드하는 중...'}
        {analyzing && 'AI가 사진을 분석하는 중...'}
        {generating && '글을 작성하는 중...'}
      </LoadingText>
      <ProgressBar value={uploadProgress} />
    </LoadingOverlay>
  )}
</PhotoPostScreen>
```

### 📝 프로세스
```
1. 사진 선택 (최대 10장)
   ↓
2. 설정 입력 (카테고리, 길이, 메모)
   ↓
3. "글 생성하기" 클릭
   ↓
4. 사진 업로드 (Supabase Storage)
   ↓
5. GPT-4 Vision으로 사진 분석
   ↓
6. 분석 결과 + 설정으로 글 생성
   ↓
7. 생성 완료 → Editor로 이동
```

### ✅ 완료 조건
- [ ] 사진 선택 UI
- [ ] 사진 그리드
- [ ] 파일 업로드
- [ ] GPT-4 Vision API
- [ ] 글 생성 API
- [ ] 로딩 상태
- [ ] 에러 처리

---

## 8. Post Editor

### 📍 경로
`/editor/[id]`

### 🎯 목적
- 생성된 글 편집
- AI 어시스턴트 활용

### 🔧 기능
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 제목 편집 | 텍스트 입력 | 🔴 High |
| 본문 편집 | 리치 에디터 | 🔴 High |
| 서식 도구 | Bold, Italic, Link, Image | 🟡 Medium |
| 이미지 삽입 | 업로드 + URL | 🟡 Medium |
| AI 어시스턴트 | 문장 다듬기, 문단 추가 등 | 🟡 Medium |
| 맞춤법 검사 | 오타 감지 | 🟢 Low |
| 태그 편집 | 해시태그 추가/삭제 | 🔴 High |
| 임시저장 | Draft 저장 | 🔴 High |
| 발행하기 | Publish 화면으로 | 🔴 High |

### 📊 상태 관리
```typescript
interface EditorState {
  postId: string;
  title: string;
  content: string;
  tags: string[];

  loading: boolean;
  saving: boolean;
  lastSavedAt: Date | null;

  aiAssisting: boolean;
  aiSuggestion: string | null;

  error: string | null;
}
```

### 🔗 API 호출
```typescript
// 글 불러오기
GET /api/posts/${id}

// 임시저장
PUT /api/posts/${id}
{
  title: string,
  content: string,
  tags: string[],
  status: 'draft'
}

// AI 어시스턴트
POST /api/ai/assist
{
  action: 'polish' | 'addParagraph' | 'checkGrammar',
  content: string
}
```

### 🎨 컴포넌트 구조
```tsx
<EditorScreen>
  <EditorHeader>
    <BackButton />
    <Title>편집</Title>
    <SaveButton onClick={handleSave}>
      {saving ? <Spinner /> : '저장'}
    </SaveButton>
  </EditorHeader>

  <Toolbar>
    <ToolButton icon="B" onClick={() => format('bold')} />
    <ToolButton icon="I" onClick={() => format('italic')} />
    <ToolButton icon="U" onClick={() => format('underline')} />
    <ToolButton icon="🔗" onClick={insertLink} />
    <ToolButton icon="📷" onClick={insertImage} />
    <ToolButton icon="⚙️" onClick={showSettings} />
  </Toolbar>

  <EditorContent>
    <TitleInput
      placeholder="제목"
      value={title}
      onChange={setTitle}
    />

    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="내용을 입력하세요..."
    />
  </EditorContent>

  <AIAssistant>
    <AssistantTitle>AI 어시스턴트</AssistantTitle>
    <AssistantButtons>
      <AssistButton onClick={() => aiAssist('polish')}>
        ✨ 문장 다듬기
      </AssistButton>
      <AssistButton onClick={() => aiAssist('addParagraph')}>
        ➕ 문단 추가
      </AssistButton>
      <AssistButton onClick={() => aiAssist('checkGrammar')}>
        ✓ 맞춤법 검사
      </AssistButton>
      <AssistButton onClick={() => aiAssist('improveExpression')}>
        🎨 표현 개선
      </AssistButton>
    </AssistantButtons>

    {aiSuggestion && (
      <SuggestionBox>
        <SuggestionText>{aiSuggestion}</SuggestionText>
        <SuggestionActions>
          <Button onClick={applySuggestion}>적용</Button>
          <Button onClick={dismissSuggestion}>무시</Button>
        </SuggestionActions>
      </SuggestionBox>
    )}
  </AIAssistant>

  <TagSection>
    <Label>태그</Label>
    <TagList>
      {tags.map(tag => (
        <Tag key={tag}>
          {tag}
          <RemoveButton onClick={() => removeTag(tag)}>
            ×
          </RemoveButton>
        </Tag>
      ))}
    </TagList>
    <AddTagInput
      placeholder="+ 태그 추가"
      onEnter={addTag}
    />
  </TagSection>

  <ActionButtons>
    <Button variant="outline" onClick={handleDraft}>
      임시저장
    </Button>
    <Button onClick={() => router.push(`/publish/${postId}`)}>
      발행하기
    </Button>
  </ActionButtons>

  {lastSavedAt && (
    <SaveStatus>
      마지막 저장: {formatTime(lastSavedAt)}
    </SaveStatus>
  )}
</EditorScreen>
```

### ✅ 완료 조건
- [ ] 리치 에디터 라이브러리 선택
- [ ] 제목/본문 편집
- [ ] 서식 도구
- [ ] 이미지 업로드
- [ ] AI 어시스턴트 API
- [ ] 태그 관리
- [ ] 자동 저장
- [ ] 발행 버튼

---

## 9. My Posts Screen

### 📍 경로
`/posts`

### 🎯 목적
- 작성한 글 목록 조회
- 글 상태 관리

### 🔧 기능
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 탭 필터 | 전체/임시저장/발행됨 | 🔴 High |
| 글 목록 | 제목, 날짜, 상태 표시 | 🔴 High |
| 검색 | 제목/내용 검색 | 🟡 Medium |
| 정렬 | 최신순/오래된순 | 🟡 Medium |
| 글 상세 | 클릭 시 Editor | 🔴 High |
| 삭제 | 스와이프 삭제 | 🟡 Medium |
| 무한 스크롤 | Pagination | 🟢 Low |

### 📊 상태 관리
```typescript
interface MyPostsState {
  posts: Post[];
  filter: 'all' | 'draft' | 'published';
  searchQuery: string;
  sortBy: 'latest' | 'oldest';

  loading: boolean;
  hasMore: boolean;
  page: number;
}
```

### 🔗 API 호출
```typescript
GET /api/posts?filter=all&page=1&limit=20
```

### 🎨 컴포넌트
```tsx
<MyPostsScreen>
  <Header>
    <Title>내 글</Title>
    <SearchIcon />
  </Header>

  <TabBar>
    <Tab active={filter === 'all'}>전체</Tab>
    <Tab active={filter === 'draft'}>임시저장</Tab>
    <Tab active={filter === 'published'}>발행됨</Tab>
  </TabBar>

  <PostList>
    {posts.map(post => (
      <PostCard
        key={post.id}
        title={post.title}
        status={post.status}
        createdAt={post.createdAt}
        onClick={() => router.push(`/editor/${post.id}`)}
        onDelete={() => handleDelete(post.id)}
      />
    ))}
  </PostList>
</MyPostsScreen>
```

### ✅ 완료 조건
- [ ] 탭 필터
- [ ] 글 목록 API
- [ ] 글 카드 UI
- [ ] 삭제 기능
- [ ] 검색 기능

---

## 10. Style Analysis Screen

### 📍 경로
`/analysis`

### 🎯 목적
- 스타일 분석 결과 조회
- 재분석 트리거

### 🔧 기능
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 동기화 버튼 | 블로그 최신 글 가져오기 | 🟡 Medium |
| 분석 통계 | 총 글 수, 평균 글자 수 등 | 🔴 High |
| 스타일 특징 | AI 분석 결과 표시 | 🔴 High |
| 카테고리 분포 | 차트 | 🟡 Medium |
| 자주 쓰는 표현 | 단어 클라우드 | 🟢 Low |
| 최근 분석 글 | 목록 | 🟡 Medium |

### 📊 상태 관리
```typescript
interface AnalysisState {
  profile: StyleProfile | null;
  loading: boolean;
  syncing: boolean;
}

interface StyleProfile {
  totalPosts: number;
  avgWordCount: number;
  postFrequency: number;
  characteristics: string[];
  categoryDistribution: { [key: string]: number };
  commonPhrases: string[];
  recentPosts: PostSummary[];
}
```

### 🔗 API 호출
```typescript
GET /api/analysis/profile

POST /api/blog/sync
```

### ✅ 완료 조건
- [ ] 분석 결과 UI
- [ ] 재동기화 기능
- [ ] 차트 표시

---

## 11. Publish Settings Screen

### 📍 경로
`/publish/[id]`

### 🎯 목적
- 발행 옵션 설정
- 블로그로 발행

### 🔧 기능
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 발행 시간 | 즉시/예약 | 🔴 High |
| 공개 설정 | 공개/비공개 | 🔴 High |
| 카테고리 선택 | 블로그 카테고리 | 🔴 High |
| 태그 | 해시태그 | 🔴 High |
| 댓글 허용 | ON/OFF | 🟡 Medium |
| 발행 버튼 | API 호출 | 🔴 High |

### 📊 상태 관리
```typescript
interface PublishState {
  postId: string;
  publishTime: 'now' | 'scheduled';
  scheduledAt: Date | null;
  visibility: 'public' | 'private';
  category: string;
  tags: string[];
  allowComments: boolean;

  publishing: boolean;
  success: boolean;
  publishedUrl: string | null;
  error: string | null;
}
```

### 🔗 API 호출
```typescript
POST /api/blog/publish
{
  postId: string,
  platform: 'naver' | 'tistory',
  publishTime: 'now' | Date,
  visibility: string,
  category: string,
  tags: string[],
  allowComments: boolean
}
```

### ✅ 완료 조건
- [ ] 발행 설정 폼
- [ ] 날짜/시간 피커
- [ ] 발행 API
- [ ] 성공/실패 처리

---

## 12. Settings Screen

### 📍 경로
`/settings`

### 🎯 목적
- 앱 설정 관리

### 🔧 기능
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 프로필 정보 | 닉네임, 이메일 | 🟡 Medium |
| 블로그 연동 관리 | 재연동, 연결 해제 | 🔴 High |
| AI 설정 | 기본 스타일 강도 등 | 🟢 Low |
| 알림 설정 | 푸시 알림 | 🟢 Low |
| 로그아웃 | 로그아웃 | 🔴 High |
| 회원 탈퇴 | 계정 삭제 | 🟢 Low |

### ✅ 완료 조건
- [ ] 설정 UI
- [ ] 블로그 연동 관리
- [ ] 로그아웃

---

## 📊 전체 진행 상황

| 화면 | UI | API | 기능 | 우선순위 |
|------|----|----|------|----------|
| Splash | ⏳ | ⬜ | ⬜ | 🔴 High |
| Onboarding | ⬜ | - | ⬜ | 🟡 Medium |
| Login | ⬜ | ⬜ | ⬜ | 🔴 High |
| Blog Connect | ⬜ | ⬜ | ⬜ | 🔴 High |
| Dashboard | ⬜ | ⬜ | ⬜ | 🔴 High |
| Category Post | ⬜ | ⬜ | ⬜ | 🔴 High |
| Photo Post | ⬜ | ⬜ | ⬜ | 🔴 High |
| Editor | ⬜ | ⬜ | ⬜ | 🔴 High |
| My Posts | ⬜ | ⬜ | ⬜ | 🟡 Medium |
| Analysis | ⬜ | ⬜ | ⬜ | 🟢 Low |
| Publish | ⬜ | ⬜ | ⬜ | 🔴 High |
| Settings | ⬜ | ⬜ | ⬜ | 🟡 Medium |

---

**작성일**: 2025-11-16
**최종 업데이트**: 매 작업 완료 시
