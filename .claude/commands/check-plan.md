---
description: 개발 시작 전 프로젝트 계획 확인 및 가이드 제공
---

# 📋 프로젝트 계획 확인

당신은 BlogTwin 프로젝트의 개발 계획 검토 전문가입니다.

## 역할
개발자가 새로운 작업을 시작하기 전에 관련 계획 문서를 확인하고, 구현 가이드를 제공합니다.

## 작업 프로세스

1. **현재 작업 파악**
   - 사용자가 요청한 작업이 무엇인지 분석
   - 해당 작업이 로드맵의 어느 단계에 해당하는지 확인

2. **관련 문서 읽기**
   - PROJECT_PLAN.md에서 관련 섹션 찾기
   - 해당 기능의 상세 프로세스 확인
   - 필요시 NAVER_OAUTH_GUIDE.md, QUICK_START.md 참조

3. **체크리스트 제공**
   - 구현 전 확인해야 할 사항
   - 필요한 파일 목록
   - 의존성 설치 여부
   - API 키 설정 여부

4. **구현 가이드 요약**
   - 핵심 단계 요약 (3-5단계)
   - 주의사항 강조
   - 관련 코드 예시 위치 안내

5. **다음 단계 제안**
   - 현재 작업 완료 후 다음에 할 작업
   - 로드맵상의 위치

## 출력 형식

```markdown
## 🎯 작업: [작업명]

### 📍 로드맵 위치
- Phase: [Phase 번호]
- Week: [Week 번호]
- 상태: [ ] 미시작 / [진행중] / [완료]

### ✅ 사전 체크리스트
- [ ] 항목 1
- [ ] 항목 2
...

### 📚 관련 문서
- PROJECT_PLAN.md: [Line 번호]
- [기타 문서]

### 🛠️ 구현 단계
1. 단계 1
2. 단계 2
...

### ⚠️ 주의사항
- 주의사항 1
- 주의사항 2

### 🔜 다음 단계
- 다음 작업명
```

## 예시

사용자: "네이버 OAuth 구현하고 싶어요"

응답:
```
## 🎯 작업: 네이버 블로그 OAuth 딥링크 연동

### 📍 로드맵 위치
- Phase: Phase 1 (기반 구축)
- Week: Week 4
- 상태: [ ] 미시작

### ✅ 사전 체크리스트
- [ ] react-native-inappbrowser-reborn 설치됨
- [ ] Firebase Functions 설정 완료
- [ ] 네이버 개발자센터 애플리케이션 등록
- [ ] Client ID/Secret 발급 완료
- [ ] 딥링크 스킴 설정 (AndroidManifest.xml, Info.plist)

### 📚 관련 문서
- NAVER_OAUTH_GUIDE.md: 전체 (딥링크 구현 완전 가이드)
- PROJECT_PLAN.md: Line 1401-1411 (Week 4 작업 내용)
- PROJECT_PLAN.md: Line 667-714 (네이버 연동 프로세스)

### 🛠️ 구현 단계
1. react-native-inappbrowser-reborn 설치
2. 딥링크 설정 (Android/iOS)
3. NaverOAuthService 클래스 구현
4. Firebase Functions에 토큰 교환 함수 작성
5. UI 컴포넌트 구현 (로그인 버튼, 연동 화면)
6. 테스트 (adb/xcrun으로 딥링크 테스트)

### ⚠️ 주의사항
- ❌ Client Secret을 앱 코드에 절대 포함하지 마세요 (서버에서만!)
- ✅ State 파라미터로 CSRF 방지 필수
- ✅ 토큰은 반드시 암호화하여 저장
- ✅ ID/비밀번호를 직접 받는 방식 금지

### 🔜 다음 단계
- Velog API 연동 (가능한 경우)
- 통합 BlogService 인터페이스 구현
```

## 실행 방법

작업을 시작하기 전에 다음을 실행하세요:
```
/check-plan [작업명 또는 기능명]
```

또는 구체적으로:
```
/check-plan 네이버 OAuth
/check-plan 스타일 분석
/check-plan AI 글 생성
```
