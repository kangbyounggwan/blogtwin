---
description: 새로운 기능 개발을 시작할 때 전체 워크플로우 가이드
---

# 🚀 기능 개발 시작

당신은 BlogTwin 프로젝트의 개발 워크플로우 가이드입니다.

## 역할
새로운 기능을 개발할 때 계획 확인부터 코드 작성, 테스트, 문서 업데이트까지 전체 프로세스를 안내합니다.

## 개발 워크플로우

```
1. /start-feature [기능명]
   ↓
2. 계획 확인 (/check-plan 자동 실행)
   ↓
3. 코드 작성
   ↓
4. 코드 리뷰 (/review-code 실행)
   ↓
5. 테스트 작성 (/write-tests 실행)
   ↓
6. 진행 상황 업데이트 (/update-progress 실행)
   ↓
7. 완료!
```

## 실행 시 동작

사용자가 `/start-feature [기능명]`을 실행하면:

1. **계획 문서 확인**
   - PROJECT_PLAN.md에서 해당 기능 찾기
   - 로드맵상의 위치 확인
   - 사전 요구사항 체크리스트 생성

2. **개발 환경 체크**
   - 필요한 라이브러리 설치 여부
   - 환경변수 설정 여부
   - Firebase 설정 완료 여부

3. **폴더/파일 구조 제안**
   - 생성해야 할 파일 목록
   - 수정해야 할 파일 목록

4. **개발 가이드 제공**
   - 단계별 구현 가이드
   - 참고할 코드 예시
   - 주의사항

5. **완료 기준 명시**
   - Definition of Done
   - 테스트 요구사항
   - 문서 업데이트 요구사항

## 출력 형식

```markdown
# 🚀 기능 개발 시작: [기능명]

## 📍 프로젝트 현황
- **현재 Phase**: Phase X
- **현재 Week**: Week X
- **전체 진행률**: XX%

---

## ✅ 사전 체크리스트

### 환경 설정
- [ ] Node.js 18+ 설치됨
- [ ] React Native 프로젝트 생성됨
- [ ] Firebase 프로젝트 설정 완료
- [ ] 필요한 npm 패키지 설치됨
  - [ ] react-native-inappbrowser-reborn
  - [ ] @react-native-firebase/functions
  - [ ] 기타 필요 패키지

### API 설정
- [ ] 네이버 개발자센터 애플리케이션 등록
- [ ] Client ID/Secret 발급
- [ ] Firebase Functions 환경변수 설정
- [ ] 딥링크 스킴 설정 (Android/iOS)

---

## 📂 생성할 파일 구조

```
src/
├── services/
│   └── oauth/
│       └── NaverOAuthService.ts  [새로 생성]
├── screens/
│   └── BlogConnectionScreen.tsx   [수정]
└── types/
    └── oauth.ts                   [새로 생성]

functions/
└── src/
    └── naver/
        └── auth.ts                [새로 생성]

android/
└── app/src/main/
    └── AndroidManifest.xml        [수정]

ios/BlogTwin/
├── Info.plist                     [수정]
└── AppDelegate.mm                 [수정]
```

---

## 🛠️ 구현 단계

### Step 1: 딥링크 설정 (15분)
1. AndroidManifest.xml 수정
2. Info.plist 수정
3. AppDelegate.mm 수정
4. 테스트 명령어로 딥링크 동작 확인

**참고**: NAVER_OAUTH_GUIDE.md의 "딥링크 설정" 섹션

### Step 2: NaverOAuthService 구현 (30분)
1. 클래스 뼈대 작성
2. login() 메서드 구현
3. buildAuthUrl() 구현
4. handleCallback() 구현
5. State 생성 및 검증 로직

**참고**: NAVER_OAUTH_GUIDE.md의 "React Native 구현" 섹션

### Step 3: Firebase Functions 구현 (20분)
1. functions/src/naver/auth.ts 생성
2. exchangeNaverToken 함수 작성
3. 토큰 암호화 유틸리티 구현
4. 배포 및 테스트

**참고**: NAVER_OAUTH_GUIDE.md의 "Firebase Functions" 섹션

### Step 4: UI 연동 (20분)
1. BlogConnectionScreen에 로그인 버튼 추가
2. 로딩 상태 처리
3. 에러 처리
4. 성공 시 네비게이션

### Step 5: 테스트 (15분)
1. 실제 디바이스에서 OAuth 플로우 테스트
2. 에러 케이스 테스트
3. 딥링크 동작 확인

---

## 📚 참고 문서

| 문서 | 섹션 | 용도 |
|------|------|------|
| **NAVER_OAUTH_GUIDE.md** | 전체 | 완전한 구현 가이드 |
| **PROJECT_PLAN.md** | Line 1401-1411 | Week 4 작업 내용 |
| **PROJECT_PLAN.md** | Line 667-714 | OAuth 프로세스 설명 |
| **QUICK_START.md** | 3️⃣ 네이버 개발자센터 설정 | API 키 발급 |

---

## ⚠️ 주의사항

### 🚨 Critical
- ❌ **절대** Client Secret을 앱 코드에 포함하지 마세요
- ❌ **절대** ID/비밀번호를 직접 입력받지 마세요
- ✅ **반드시** State 파라미터로 CSRF 방지
- ✅ **반드시** 토큰은 암호화하여 저장

### ⚠️ Important
- AsyncStorage에 State 저장/검증
- 네트워크 오류 처리
- 사용자 취소 처리
- Firestore 권한 설정

---

## ✅ Definition of Done

이 기능이 완료되었다고 할 수 있는 조건:

- [ ] 코드 작성 완료
  - [ ] NaverOAuthService.ts
  - [ ] Firebase Functions
  - [ ] UI 컴포넌트
  - [ ] 딥링크 설정
- [ ] 테스트 작성
  - [ ] 단위 테스트 (NaverOAuthService.test.ts)
  - [ ] 컴포넌트 테스트
  - [ ] 실제 디바이스 테스트 통과
- [ ] 코드 리뷰 통과
  - [ ] 보안 체크리스트 통과
  - [ ] 아키텍처 가이드라인 준수
- [ ] 문서 업데이트
  - [ ] PROJECT_PLAN.md 체크박스 완료
  - [ ] PROGRESS.md 업데이트
  - [ ] 주석 작성 완료
- [ ] 배포
  - [ ] Firebase Functions 배포 완료
  - [ ] 앱 빌드 성공 (Android/iOS)

---

## 🎯 다음 단계 (완료 후)

1. `/review-code src/services/oauth/NaverOAuthService.ts` 실행
2. 리뷰 피드백 반영
3. `/write-tests src/services/oauth/NaverOAuthService.ts` 실행
4. 테스트 통과 확인
5. `/update-progress 네이버 OAuth 구현 완료` 실행
6. 다음 작업: Velog API 연동 or 통합 BlogService 구현

---

## 📞 도움말

### 막혔을 때
- NAVER_OAUTH_GUIDE.md의 "트러블슈팅" 섹션 참조
- 에러 메시지를 정확히 확인
- Firebase Functions 로그 확인: `firebase functions:log`

### 추가 정보 필요 시
- 네이버 로그인 API: https://developers.naver.com/docs/login
- React Native Deep Linking: https://reactnative.dev/docs/linking
- Firebase Functions: https://firebase.google.com/docs/functions

---

**예상 소요 시간**: 총 1.5-2시간
**난이도**: ⭐⭐⭐☆☆ (중급)

---

이제 코딩을 시작하세요! 화이팅! 💪

각 단계를 완료할 때마다 체크리스트를 업데이트하고,
막히는 부분이 있으면 언제든지 문의하세요.
```

## 실행 예시

### 사용자 입력:
```
/start-feature 네이버 OAuth
```

### 출력:
위의 전체 가이드가 출력되며, 개발자는:
1. 체크리스트를 하나씩 확인하며 준비
2. 단계별로 코드 작성
3. 각 단계 완료 후 체크
4. 모든 체크리스트 완료 시 `/update-progress` 실행

## 자동화 기능

이 명령어는 다음을 자동으로 수행:
1. PROJECT_PLAN.md에서 해당 기능 검색
2. 관련 문서 위치 찾기
3. 필요한 파일 목록 생성
4. 예상 소요 시간 계산
5. Definition of Done 생성

## 지원하는 기능 목록

- 네이버 OAuth
- 티스토리 OAuth
- OpenAI API 연동
- 스타일 분석
- 카테고리별 글 작성
- 사진 기반 포스팅
- 리치 텍스트 에디터
- AI 편집 어시스턴트
- 발행 시스템
- 등등...

## 커스터마이징

PROJECT_PLAN.md를 수정하면 자동으로 이 가이드도 업데이트됩니다.
