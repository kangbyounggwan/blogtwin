# Supabase 연동 가이드

BlogTwin 웹 애플리케이션을 Supabase와 연동하는 방법입니다.

⚠️ **중요**: Supabase 설정은 필수입니다. 환경 변수를 설정하지 않으면 애플리케이션이 정상적으로 작동하지 않습니다.

## 1. Supabase 프로젝트 생성

### 1-1. Supabase 계정 만들기
1. https://supabase.com 접속
2. "Start your project" 클릭
3. GitHub 계정으로 로그인

### 1-2. 새 프로젝트 생성
1. Dashboard에서 "New Project" 클릭
2. 프로젝트 정보 입력:
   - **Name**: `blogtwin`
   - **Database Password**: 안전한 비밀번호 생성 (저장 필수!)
   - **Region**: Northeast Asia (Seoul) 선택
3. "Create new project" 클릭
4. 프로젝트 생성 대기 (약 2분 소요)

## 2. 데이터베이스 스키마 생성

### 2-1. SQL Editor 열기
1. 왼쪽 메뉴에서 **SQL Editor** 클릭
2. "New query" 클릭

### 2-2. 스키마 실행
1. `supabase-schema.sql` 파일 내용 복사
2. SQL Editor에 붙여넣기
3. **Run** 버튼 (또는 `Ctrl/Cmd + Enter`) 클릭
4. "Success" 메시지 확인

생성되는 테이블:
- ✅ `users` - 사용자 정보
- ✅ `blog_posts` - 블로그 포스트
- ✅ `style_profiles` - 스타일 분석 데이터
- ✅ `ai_generation_logs` - AI 사용 로그
- ✅ `publish_history` - 발행 이력
- ✅ `scheduled_posts` - 예약 포스트

## 3. API 키 가져오기

### 3-1. Project Settings 열기
1. 왼쪽 메뉴 하단 **Settings** (톱니바퀴) 클릭
2. **API** 메뉴 선택

### 3-2. 키 복사
다음 두 값을 복사해두세요:

1. **Project URL**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

2. **anon public key**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

⚠️ **주의**: `service_role` 키는 절대 클라이언트 코드에 사용하지 마세요!

## 4. 환경 변수 설정

### 4-1. .env.local 파일 생성
`web/.env.local` 파일을 만들고 다음 내용을 입력:

```env
# ====================================
# Supabase Configuration
# ====================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# ====================================
# OpenAI Configuration (선택)
# ====================================
OPENAI_API_KEY=sk-your-openai-api-key-here

# ====================================
# Naver OAuth Configuration (선택)
# ====================================
NEXT_PUBLIC_NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret

# ====================================
# App Configuration
# ====================================
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

### 4-2. 값 입력
1. `NEXT_PUBLIC_SUPABASE_URL`: 3-2에서 복사한 Project URL 붙여넣기
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 3-2에서 복사한 anon key 붙여넣기

## 5. 애플리케이션 실행

### 5-1. 개발 서버 재시작
```bash
# 기존 서버 종료 (Ctrl + C)
cd web
npm run dev
```

### 5-2. Supabase 연동 확인
1. 브라우저에서 http://localhost:3002 접속
2. 대시보드 확인
3. "Supabase가 설정되지 않았습니다" 경고가 없으면 성공!

## 6. 테스트 데이터 추가 (선택사항)

### 6-1. SQL Editor에서 실행
```sql
-- 테스트 사용자 추가
INSERT INTO users (naver_id, nickname, email) VALUES
('test_naver_id', '테스트유저', 'test@example.com')
RETURNING id;

-- 위에서 반환된 user_id를 복사하여 사용
-- 테스트 포스트 추가
INSERT INTO blog_posts (user_id, title, content, status, platform, category, tags) VALUES
('user-id-here', '첫 번째 테스트 글', '테스트 내용입니다.', 'draft', 'naver', '일상', ARRAY['테스트', '블로그']);
```

### 6-2. 대시보드에서 확인
1. 대시보드 새로고침
2. "최근 작성 글"에 테스트 포스트 표시 확인

## 7. 기능별 사용법

### 7-1. 블로그 포스트 관리
```typescript
import { blogPostService } from '@/lib/supabase-service';

// 포스트 목록 조회
const posts = await blogPostService.getUserPosts(userId);

// 새 포스트 작성
const newPost = await blogPostService.createPost(userId, {
  title: '제목',
  content: '내용',
  status: 'draft',
  platform: 'naver',
  category: '카테고리',
  tags: ['태그1', '태그2'],
});

// 포스트 수정
await blogPostService.updatePost(postId, {
  title: '수정된 제목',
});

// 포스트 삭제
await blogPostService.deletePost(postId);
```

### 7-2. 스타일 프로필 관리
```typescript
import { styleProfileService } from '@/lib/supabase-service';

// 스타일 프로필 조회
const profile = await styleProfileService.getStyleProfile(userId);

// 스타일 프로필 생성/업데이트
await styleProfileService.upsertStyleProfile(userId, {
  totalPosts: 10,
  avgWordCount: 500,
  postFrequency: 2.5,
  characteristics: ['친근한 어투', '이모지 사용'],
  categoryDistribution: { '일상': 40, '여행': 30 },
  commonPhrases: ['안녕하세요', '감사합니다'],
});
```

### 7-3. AI 사용 로그
```typescript
import { aiLogService } from '@/lib/supabase-service';

// AI 생성 로그 저장
await aiLogService.logGeneration(userId, {
  model: 'gpt-4o-mini',
  prompt_tokens: 100,
  completion_tokens: 200,
  total_tokens: 300,
  estimated_cost: 0.0015,
  success: true,
  error_message: null,
});

// 사용 통계 조회
const stats = await aiLogService.getUserStats(userId);
console.log(`총 생성 횟수: ${stats.totalGenerations}`);
console.log(`총 토큰 사용: ${stats.totalTokens}`);
console.log(`총 비용: $${stats.totalCost.toFixed(4)}`);
```

## 8. 보안 설정 (Row Level Security)

Supabase는 RLS(Row Level Security)가 활성화되어 있습니다:

### 현재 정책:
- ✅ 모든 사용자가 자신의 데이터만 조회/수정 가능
- ✅ 다른 사용자의 데이터는 접근 불가

### 정책 확인:
1. Dashboard → **Authentication** → **Policies**
2. 각 테이블의 정책 확인

⚠️ **주의**: 프로덕션 환경에서는 반드시 사용자 인증을 구현하세요!

## 9. 문제 해결

### Q1: "Supabase가 설정되지 않았습니다" 경고가 계속 나타나요
**A**:
1. `.env.local` 파일이 `web/` 폴더 안에 있는지 확인
2. 파일 이름이 정확히 `.env.local`인지 확인 (`.env.example` 아님)
3. 환경 변수 이름이 정확한지 확인 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. 개발 서버 재시작 (`Ctrl+C` 후 `npm run dev`)

### Q2: API 호출 시 401 Unauthorized 오류
**A**:
1. `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 올바른지 확인
2. Supabase Dashboard → Settings → API에서 키 재확인
3. RLS 정책 확인

### Q3: 데이터가 조회되지 않아요
**A**:
1. SQL Editor에서 데이터 직접 조회:
   ```sql
   SELECT * FROM users;
   SELECT * FROM blog_posts;
   ```
2. 브라우저 콘솔에서 에러 확인
3. Supabase Dashboard → **Table Editor**에서 데이터 확인

### Q4: CORS 오류가 발생해요
**A**:
1. `NEXT_PUBLIC_SUPABASE_URL`이 `https://`로 시작하는지 확인
2. URL 끝에 `/`가 없는지 확인
3. Supabase Dashboard → Settings → API → CORS 설정 확인

## 10. 다음 단계

Supabase 연동이 완료되었습니다! 이제:

1. ✅ **네이버 OAuth 연동**: 실제 로그인 기능 구현
2. ✅ **OpenAI API 연동**: AI 글 생성 기능 구현
3. ✅ **배포**: Vercel에 배포하기

자세한 내용은:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - 배포 가이드
- [web/README.md](./web/README.md) - 웹앱 개발 가이드

## 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
