# 🛠️ BlogTwin Web 설정 가이드

## 1. Supabase 설정

### 1.1 Supabase 프로젝트 생성

1. https://supabase.com 접속
2. "New Project" 클릭
3. 프로젝트 이름: `BlogTwin`
4. 리전: `Northeast Asia (Seoul)`
5. 데이터베이스 비밀번호 설정

### 1.2 데이터베이스 스키마 생성

Supabase SQL Editor에서 실행:

```sql
-- 루트 폴더의 supabase-schema.sql 내용을 복사하여 실행
```

### 1.3 환경 변수 복사

Supabase Dashboard → Settings → API:
- `URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

`.env.local` 파일에 붙여넣기

---

## 2. 네이버 OAuth 설정

### 2.1 네이버 개발자센터 앱 등록

1. https://developers.naver.com/apps/ 접속
2. "애플리케이션 등록" 클릭
3. 정보 입력:
   - 애플리케이션 이름: `BlogTwin`
   - 사용 API: **네이버 로그인**
4. 서비스 URL: `http://localhost:3000`
5. Callback URL: `http://localhost:3000/auth/callback`

### 2.2 Client ID/Secret 복사

- `Client ID` → `NEXT_PUBLIC_NAVER_CLIENT_ID`
- `Client Secret` → `NAVER_CLIENT_SECRET`

---

## 3. OpenAI API 설정

### 3.1 API 키 발급

1. https://platform.openai.com/api-keys 접속
2. "Create new secret key" 클릭
3. 키 이름: `BlogTwin`
4. 생성된 키 복사

### 3.2 환경 변수 설정

```bash
OPENAI_API_KEY=sk-...
```

---

## 4. 개발 환경 실행

### 4.1 의존성 설치

```bash
cd web
npm install
```

### 4.2 개발 서버 시작

```bash
npm run dev
```

### 4.3 브라우저에서 확인

http://localhost:3000

---

## 5. 모바일에서 테스트

### 5.1 같은 네트워크에서 접근

```bash
# 로컬 IP 확인 (Windows)
ipconfig

# 예: 192.168.0.10:3000
```

모바일 브라우저에서: `http://192.168.0.10:3000`

### 5.2 PWA 설치 테스트

1. Chrome/Safari에서 "홈 화면에 추가"
2. 앱처럼 실행 확인

---

## 6. 프로덕션 배포 (Vercel)

### 6.1 Vercel 프로젝트 생성

```bash
npm i -g vercel
vercel
```

### 6.2 환경 변수 설정

Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`
- `NEXT_PUBLIC_APP_URL` (배포 URL)

### 6.3 네이버 OAuth Callback 업데이트

네이버 개발자센터에서:
- Callback URL 추가: `https://yourdomain.vercel.app/auth/callback`

---

## 7. 체크리스트

개발 시작 전 확인:

- [ ] Supabase 프로젝트 생성 완료
- [ ] 데이터베이스 스키마 실행 완료
- [ ] `.env.local` 파일 생성 및 모든 환경 변수 설정
- [ ] 네이버 OAuth 앱 등록 및 Callback URL 설정
- [ ] OpenAI API 키 발급
- [ ] `npm install` 실행
- [ ] `npm run dev` 정상 동작 확인

---

## 8. 문제 해결

### Cannot find module '@/...'

tsconfig.json의 paths 설정 확인:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Supabase CORS 에러

Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/**`

### 네이버 OAuth 에러

1. Client ID/Secret 확인
2. Callback URL이 정확한지 확인
3. 브라우저 개발자 도구 → Network 탭에서 에러 확인

---

**준비 완료! 🎉**
