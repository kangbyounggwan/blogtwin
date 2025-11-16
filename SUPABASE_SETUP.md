# Supabase 설정 가이드

BlogTwin 앱에서 Supabase를 백엔드 데이터베이스로 사용하기 위한 설정 가이드입니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 로그인
2. 새 프로젝트 생성
3. 프로젝트 설정에서 API 키 확인

## 2. 환경변수 설정

`.env` 파일에 다음 정보를 입력합니다:

```env
SUPABASE_URL=https://edlqwiecjvleutrbaivs.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. 데이터베이스 테이블 생성

1. Supabase Dashboard → SQL Editor 이동
2. `supabase-schema.sql` 파일의 내용을 복사
3. SQL Editor에 붙여넣기
4. "Run" 버튼 클릭하여 실행

## 4. 생성되는 테이블

### `users` 테이블
사용자 정보 저장

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| created_at | Timestamp | 생성 일시 |
| naver_id | Text | 네이버 사용자 ID (Unique) |
| nickname | Text | 사용자 닉네임 |
| email | Text | 이메일 |
| profile_image | Text | 프로필 이미지 URL |

### `blog_posts` 테이블
블로그 포스트 저장

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| user_id | UUID | 사용자 ID (Foreign Key) |
| title | Text | 글 제목 |
| content | Text | 글 내용 |
| status | Text | 상태 (draft/published) |
| platform | Text | 플랫폼 (naver) |
| category | Text | 카테고리 (nullable) |
| tags | Text[] | 태그 배열 (nullable) |
| created_at | Timestamp | 생성 일시 |
| updated_at | Timestamp | 수정 일시 |
| published_at | Timestamp | 발행 일시 (nullable) |

### `style_profiles` 테이블
AI 스타일 분석 결과 저장

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| user_id | UUID | 사용자 ID (Foreign Key, Unique) |
| analysis_data | JSONB | 분석 결과 JSON |
| created_at | Timestamp | 생성 일시 |
| updated_at | Timestamp | 수정 일시 |

## 5. Row Level Security (RLS)

모든 테이블에 RLS가 활성화되어 있습니다:
- 사용자는 자신의 데이터만 접근 가능
- 현재는 개발 단계이므로 모든 사용자가 조회 가능하도록 설정
- 프로덕션 배포 시 적절한 정책으로 수정 필요

## 6. 서비스 사용 방법

### UserService
```typescript
import {UserService} from '@services/UserService';
import {NaverOAuthService} from '@services/NaverOAuthService';

// 네이버 로그인 후 사용자 생성/업데이트
const profile = await NaverOAuthService.getProfile();
const user = await UserService.upsertUserFromNaver(profile);
```

### PostService
```typescript
import {PostService} from '@services/PostService';

// 새 포스트 생성
const post = await PostService.createPost(userId, {
  title: '제목',
  content: '내용',
  category: '카테고리',
  tags: ['태그1', '태그2'],
});

// 사용자의 모든 포스트 조회
const posts = await PostService.getUserPosts(userId);

// 초안만 조회
const drafts = await PostService.getUserPosts(userId, 'draft');

// 포스트 발행
await PostService.publishPost(postId);
```

## 7. 데이터베이스 접근

코드에서 Supabase 클라이언트 직접 사용:

```typescript
import {supabase} from '@/lib/supabase';

// 직접 쿼리
const {data, error} = await supabase
  .from('users')
  .select('*')
  .eq('naver_id', 'some_id')
  .single();
```

## 8. 타입 안전성

`src/lib/supabase.ts`에 데이터베이스 타입이 정의되어 있습니다.
Supabase CLI를 사용하면 자동으로 타입을 생성할 수 있습니다:

```bash
# Supabase CLI 설치
npm install -g supabase

# 타입 생성
supabase gen types typescript --project-id edlqwiecjvleutrbaivs > src/types/supabase.ts
```

## 9. 주의사항

- 환경변수 파일(.env)은 Git에 커밋되지 않도록 주의
- SUPABASE_ANON_KEY는 클라이언트에서 사용 가능한 공개 키
- 민감한 작업은 Supabase Functions(Edge Functions)를 통해 처리
- RLS 정책을 프로덕션 환경에 맞게 수정 필요

## 10. 다음 단계

1. Supabase Storage 설정 (이미지 업로드용)
2. Supabase Edge Functions 설정 (서버리스 함수)
3. Realtime Subscriptions 활용 (실시간 동기화)
