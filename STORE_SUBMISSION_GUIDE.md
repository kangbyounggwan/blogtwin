# BlogTwin 스토어 등록 가이드

**업데이트**: 2025-11-16

---

## 📱 개요

이 문서는 BlogTwin 앱을 Google Play Store와 Apple App Store에 등록하는 전체 과정을 설명합니다.

---

## 목차

1. [사전 준비](#사전-준비)
2. [Google Play Console 등록](#google-play-console-등록)
3. [App Store Connect 등록](#app-store-connect-등록)
4. [심사 준비](#심사-준비)
5. [출시 후 관리](#출시-후-관리)

---

## 사전 준비

### 공통 준비 사항

- [ ] 개발자 계정 등록
  - Google Play: $25 (1회 결제)
  - Apple Developer Program: $99/년
- [ ] 앱 아이콘 (1024x1024px)
- [ ] 스크린샷 (각 플랫폼 요구사항에 맞게)
- [ ] 앱 설명 (APP_STORE_LISTING.md 참고)
- [ ] 개인정보 처리방침 URL (PRIVACY_POLICY.md 웹 게시)
- [ ] 이용약관 URL (TERMS_OF_SERVICE.md 웹 게시)
- [ ] 지원 이메일 및 웹사이트
- [ ] 서명 키 (Keystore/Certificate)

---

## Google Play Console 등록

### 1단계: Google Play Console 계정 생성

#### 1.1 개발자 등록
```
1. https://play.google.com/console 접속
2. Google 계정으로 로그인
3. "시작하기" 클릭
4. 개발자 계정 유형 선택:
   - 개인 또는 조직(회사)
5. 계정 정보 입력
6. $25 등록 수수료 결제
7. Google Play 개발자 배포 계약 동의
```

#### 1.2 개발자 프로필 설정
```
- 개발자 이름: BlogTwin 또는 개인/회사명
- 이메일 주소: support@blogtwin.app
- 웹사이트: https://blogtwin.app
- 전화번호: +82-00-0000-0000
```

### 2단계: 앱 생성

#### 2.1 새 앱 만들기
```
1. Google Play Console 대시보드에서 "앱 만들기" 클릭
2. 앱 정보 입력:
   - 앱 이름: BlogTwin - AI 블로그 작성 도우미
   - 기본 언어: 한국어 (한국)
   - 앱 또는 게임: 앱
   - 무료 또는 유료: 무료
3. 선언 체크박스:
   - ✅ Google Play 개발자 프로그램 정책 준수
   - ✅ 미국 수출 법규 준수
4. "앱 만들기" 클릭
```

### 3단계: 앱 설정

#### 3.1 대시보드 완성도 확인
Google Play Console은 대시보드에 필수 작업 목록을 표시합니다:

**필수 작업:**
- [ ] 앱 액세스
- [ ] 광고
- [ ] 콘텐츠 등급
- [ ] 타겟층 및 콘텐츠
- [ ] 데이터 보안
- [ ] 앱 카테고리 및 연락처 세부정보

#### 3.2 앱 액세스 설정
```
메뉴: 앱 콘텐츠 > 앱 액세스

설정:
- 모든 기능에 제한 없이 액세스 가능 선택
- (또는) 로그인 필요 시 테스트 계정 제공
```

#### 3.3 광고 설정
```
메뉴: 앱 콘텐츠 > 광고

설정:
- 앱에 광고 포함 여부: 아니요 (현재 광고 없음)
```

#### 3.4 콘텐츠 등급
```
메뉴: 앱 콘텐츠 > 콘텐츠 등급

절차:
1. "설문조사 시작" 클릭
2. 이메일 주소 입력
3. 카테고리 선택: 유틸리티, 생산성, 커뮤니케이션 또는 기타
4. 설문조사 응답:
   - 폭력성: 없음
   - 성적 콘텐츠: 없음
   - 불법 행위: 없음
   - 약물 사용: 없음
   - 언어: 없음
   - 기타 주제: 없음
5. "등급 받기" 클릭
6. 예상 등급: 전체 이용가
```

#### 3.5 타겟층 설정
```
메뉴: 앱 콘텐츠 > 타겟층 및 콘텐츠

설정:
- 타겟 연령대: 18세 이상
- 어린이 관련 앱 여부: 아니요
```

#### 3.6 데이터 보안
```
메뉴: 앱 콘텐츠 > 데이터 보안

입력 사항:
1. 데이터 수집 및 보안
   - 앱이 필수 또는 선택적 사용자 데이터를 수집하거나 공유하나요?
     → 예

2. 수집하는 데이터 유형:
   ✅ 위치: 아니요
   ✅ 개인 정보: 예 (이메일, 이름)
   ✅ 금융 정보: 아니요
   ✅ 사진 및 동영상: 예 (선택사항)
   ✅ 오디오 파일: 아니요
   ✅ 저장공간의 파일: 아니요
   ✅ 캘린더: 아니요
   ✅ 주소록: 아니요
   ✅ 앱 활동: 예 (사용 통계)
   ✅ 앱 정보 및 성능: 예 (크래시 로그)
   ✅ 기기 또는 기타 ID: 예 (기기 ID)

3. 각 데이터 유형별 상세 정보:
   - 수집 목적: 앱 기능, 분석, 개인 맞춤 설정
   - 공유 여부: 제3자와 공유 (OpenAI, Supabase)
   - 임시 처리 여부: 아니요
   - 암호화 여부: 예
   - 사용자가 삭제 요청 가능 여부: 예

4. 개인정보 처리방침 URL:
   https://blogtwin.app/privacy
```

#### 3.7 앱 카테고리
```
메뉴: 앱 콘텐츠 > 앱 카테고리

설정:
- 앱 카테고리: 생산성
- 태그: 블로그, AI, 글쓰기
```

#### 3.8 연락처 세부정보
```
메뉴: 앱 콘텐츠 > 연락처 세부정보

입력:
- 웹사이트: https://blogtwin.app
- 이메일: support@blogtwin.app
- 전화번호: +82-00-0000-0000 (선택사항)
```

### 4단계: 스토어 등록정보

#### 4.1 기본 스토어 등록정보
```
메뉴: 기본 스토어 등록정보

입력 사항:
1. 앱 이름: BlogTwin - AI 블로그 작성 도우미 (50자)
2. 간단한 설명: (80자)
   "AI가 당신의 글쓰기 스타일을 학습하여 네이버 블로그 포스팅을 자동으로 작성해드립니다."

3. 전체 설명: (4000자)
   → APP_STORE_LISTING.md의 Google Play Store 설명 사용

4. 앱 아이콘:
   - 크기: 512x512px
   - 형식: PNG (32비트)
   - 투명 배경 가능

5. 기능 그래픽:
   - 크기: 1024x500px
   - 형식: PNG 또는 JPG
   - 내용: 앱의 주요 기능 시각화

6. 스크린샷:
   - 최소 2장, 권장 4-8장
   - 크기: 16:9 비율 또는 9:16 비율
   - 해상도: 1080x1920 이상
   → APP_STORE_LISTING.md의 스크린샷 가이드 참고
```

### 5단계: 프로덕션 릴리스

#### 5.1 Release 트랙 선택
```
메뉴: 프로덕션 > 새 릴리스 만들기

옵션:
1. 내부 테스트: 내부 팀원만 테스트
2. 비공개 테스트: 초대된 사용자만 테스트
3. 공개 테스트: 누구나 테스트 참여 가능
4. 프로덕션: 정식 출시

권장: 비공개 테스트 → 공개 테스트 → 프로덕션 순서
```

#### 5.2 APK/AAB 업로드
```
1. Android Studio에서 AAB 빌드:
   cd android
   ./gradlew bundleRelease

2. 생성 위치:
   android/app/build/outputs/bundle/release/app-release.aab

3. 서명:
   - keystore 파일 준비
   - android/app/build.gradle에 서명 설정 추가

   signingConfigs {
       release {
           storeFile file("blogtwin-release-key.keystore")
           storePassword "your-keystore-password"
           keyAlias "blogtwin"
           keyPassword "your-key-password"
       }
   }

   buildTypes {
       release {
           signingConfig signingConfigs.release
           ...
       }
   }

4. Google Play Console에서 AAB 업로드
```

#### 5.3 릴리스 노트 작성
```
릴리스 이름: v1.0.0 (1)

새로운 기능 (ko-KR):
- 🎉 BlogTwin 첫 출시!
- 🤖 AI 기반 블로그 글쓰기 스타일 학습
- ✍️ GPT-4로 자동 콘텐츠 생성
- 📸 사진 기반 포스팅
- 🛠️ 리치 텍스트 에디터
- 🤝 AI 어시스턴트 (문장 다듬기, 맞춤법 검사)
- 📤 네이버 블로그 연동
```

### 6단계: 심사 제출

```
1. 모든 필수 항목 완료 확인
2. "검토" 탭에서 문제 없는지 확인
3. "심사를 위해 제출" 클릭
4. 심사 대기 (보통 1-7일)
```

---

## App Store Connect 등록

### 1단계: Apple Developer Program 가입

#### 1.1 개발자 등록
```
1. https://developer.apple.com 접속
2. Apple ID로 로그인
3. "Account" > "Enroll" 클릭
4. 개인 또는 조직 선택
5. 정보 입력 및 동의
6. $99/년 결제
7. 승인 대기 (1-2일)
```

### 2단계: App ID 생성

#### 2.1 Certificates, Identifiers & Profiles
```
1. https://developer.apple.com/account 접속
2. "Certificates, Identifiers & Profiles" 선택
3. "Identifiers" > "+" 버튼 클릭
4. App IDs 선택
5. 설정:
   - Description: BlogTwin
   - Bundle ID: com.byeonggwan.blogtwin
   - Capabilities:
     ✅ Push Notifications (향후 사용)
     ✅ Associated Domains (Deep Link)
6. "Continue" > "Register" 클릭
```

### 3단계: App Store Connect에서 앱 생성

#### 3.1 새 앱 추가
```
1. https://appstoreconnect.apple.com 접속
2. "나의 앱" > "+" > "신규 앱" 클릭
3. 앱 정보 입력:
   - 플랫폼: iOS
   - 이름: BlogTwin
   - 기본 언어: 한국어
   - 번들 ID: com.byeonggwan.blogtwin (위에서 생성한 것 선택)
   - SKU: blogtwin-ios-001 (고유 식별자)
   - 사용자 액세스: 전체 액세스
4. "생성" 클릭
```

### 4단계: 앱 정보 입력

#### 4.1 앱 정보
```
메뉴: 앱 정보

입력:
1. 이름: BlogTwin
2. 부제목: (30자)
   "AI가 당신의 스타일로 글을 작성"

3. 개인정보 보호정책 URL:
   https://blogtwin.app/privacy

4. 카테고리:
   - 기본 카테고리: 생산성
   - 보조 카테고리: 비즈니스 (선택사항)

5. 라이선스 계약:
   - 기본 Apple 표준 라이선스 사용

6. 연령 등급:
   - "연령 등급 편집" 클릭
   - 설문조사 응답 (모두 "없음" 선택)
   - 등급: 4+
```

#### 4.2 가격 및 사용 가능 여부
```
메뉴: 가격 및 사용 가능 여부

설정:
1. 가격:
   - 무료
   (향후 In-App Purchase 추가 가능)

2. 사용 가능 국가 또는 지역:
   - 모든 국가/지역 또는
   - 대한민국 우선 출시 후 확대
```

#### 4.3 App Store 정보
```
메뉴: 1.0 버전 준비 중 > App Store

입력:
1. 스크린샷:
   - 6.5" 디스플레이: 1284x2778 (iPhone 13 Pro Max)
     최소 1장, 최대 10장
   - 5.5" 디스플레이: 1242x2208 (iPhone 8 Plus)
     필수는 아니지만 권장
   → APP_STORE_LISTING.md 스크린샷 가이드 참고

2. 프로모션 텍스트: (170자, 선택사항)
   "AI가 학습한 당신의 글쓰기 스타일로 네이버 블로그 포스팅을 3분 만에 완성하세요."

3. 설명: (4000자)
   → APP_STORE_LISTING.md의 App Store 설명 사용

4. 키워드: (100자)
   "블로그,AI,글쓰기,네이버블로그,자동작성,GPT,포스팅,콘텐츠제작,블로거,작성도구"

5. 지원 URL:
   https://blogtwin.app/support

6. 마케팅 URL: (선택사항)
   https://blogtwin.app

7. 버전: 1.0.0

8. 저작권:
   2025 BlogTwin
```

#### 4.4 앱 미리보기 및 스크린샷
```
요구사항:
- 6.7" Display (iPhone 14 Pro Max): 1290x2796
- 6.5" Display (iPhone 13 Pro Max): 1284x2778
- 5.5" Display (iPhone 8 Plus): 1242x2208

최소 1개 크기 필수, 3개 모두 제공 권장
```

### 5단계: 빌드 업로드

#### 5.1 Xcode에서 아카이브
```
1. Xcode에서 프로젝트 열기:
   cd ios
   open BlogTwin.xcworkspace

2. 기기 선택: Any iOS Device (arm64)

3. 버전 및 빌드 번호 설정:
   - Version: 1.0.0
   - Build: 1

4. 서명 설정:
   - Signing & Capabilities
   - Team 선택
   - Provisioning Profile: Automatic

5. Product > Archive

6. Organizer에서:
   - "Distribute App" 클릭
   - "App Store Connect" 선택
   - "Upload" 선택
   - 옵션 확인
   - "Upload" 클릭

7. 업로드 완료 대기 (5-30분)
```

#### 5.2 빌드 선택
```
1. App Store Connect에서:
   메뉴: 1.0 버전 준비 중 > 빌드

2. "+" 버튼 클릭 또는 업로드된 빌드 선택

3. 빌드가 보이지 않으면:
   - 업로드 후 처리 시간 필요 (최대 30분)
   - 이메일 확인 (처리 완료 알림)

4. 수출 규정 준수 정보:
   - 앱이 암호화를 사용하나요? 예
   - 면제 대상인가요? 예 (HTTPS만 사용)
```

### 6단계: 추가 정보

#### 6.1 일반 정보
```
메뉴: 일반 앱 정보

입력:
1. 앱 아이콘:
   - 자동으로 빌드에서 가져옴

2. 연령 등급:
   - 위에서 설정한 4+ 확인

3. 저작권:
   2025 BlogTwin
```

#### 6.2 App 개인정보 보호
```
메뉴: App 개인정보 보호

설정:
1. "개인정보 보호 관행" 편집
2. 데이터 수집 여부: 예
3. 수집하는 데이터 유형:

   연락처 정보:
   - ✅ 이메일 주소 (네이버 OAuth)
   - ✅ 이름 (네이버 프로필)

   사용자 콘텐츠:
   - ✅ 사진 또는 비디오 (사진 포스팅)
   - ✅ 기타 사용자 콘텐츠 (블로그 글)

   사용 데이터:
   - ✅ 제품 상호 작용 (앱 사용 통계)

   진단:
   - ✅ 크래시 데이터
   - ✅ 성능 데이터

4. 각 데이터 유형별 상세:
   - 데이터 사용 목적:
     ✅ 앱 기능
     ✅ 분석
     ✅ 제품 개인 맞춤 설정

   - 추적 여부: 아니요

   - 사용자 계정에 연결: 예

   - 추적 목적 설정: 해당 없음
```

### 7단계: 심사 제출

#### 7.1 심사 정보
```
메뉴: 버전 출시

입력:
1. 연락처 정보:
   - 성명: 김병관
   - 전화번호: +82-00-0000-0000
   - 이메일: support@blogtwin.app

2. 데모 계정 (로그인 필요 시):
   - 사용자 이름: demo@blogtwin.app
   - 비밀번호: [테스트 비밀번호]
   - 참고 사항: "네이버 OAuth 로그인 사용"

3. 참고 사항:
   """
   BlogTwin은 AI 기반 블로그 작성 도우미입니다.

   테스트를 위해:
   1. 네이버 계정으로 로그인
   2. OpenAI API 키 입력 필요 (테스트 키 제공 가능)
   3. 스타일 학습 및 콘텐츠 생성 기능 확인

   문의사항: support@blogtwin.app
   """

4. 첨부 파일 (선택사항):
   - 로그인 과정 설명서
   - 기능 데모 영상
```

#### 7.2 버전 출시
```
1. 모든 필수 정보 입력 확인
2. "심사를 위해 제출" 클릭
3. 최종 확인 팝업에서 "제출" 클릭
4. 상태 변경:
   - "검토 대기 중" → "심사 중" → "판매 준비 완료"
5. 심사 기간: 보통 1-3일 (최대 7일)
```

---

## 심사 준비

### 심사 통과를 위한 체크리스트

#### 공통
- [ ] 앱이 충돌 없이 안정적으로 작동
- [ ] 모든 기능이 정상 작동
- [ ] 개인정보 처리방침 및 이용약관 접근 가능
- [ ] 사용자 데이터 암호화 및 보안 조치
- [ ] 광고 없음 명시 (현재 무료 버전)

#### Google Play 특이사항
- [ ] 타겟 API 레벨 최신 버전 사용
- [ ] AAB(Android App Bundle) 형식 업로드
- [ ] 64비트 아키텍처 지원
- [ ] 데이터 보안 섹션 정확히 작성

#### App Store 특이사항
- [ ] App Store 리뷰 가이드라인 준수
- [ ] UI가 Apple Human Interface Guidelines 준수
- [ ] 네이버 로그인 기능 정상 작동
- [ ] 개인정보 보호 관행 정확히 선언
- [ ] 데모 계정 제공 (로그인 필요 시)

### 흔한 거절 사유 및 대응

#### 1. 메타데이터 거절
**사유**: 스크린샷이나 설명이 실제 앱과 다름
**대응**: 최신 앱 화면으로 스크린샷 업데이트, 정확한 설명 작성

#### 2. 개인정보 정책 문제
**사유**: 개인정보 처리방침이 불충분하거나 접근 불가
**대응**: PRIVACY_POLICY.md를 웹에 게시하고 URL 제공

#### 3. 기능 불완전
**사유**: 주요 기능이 작동하지 않음
**대응**: 철저한 테스트, OpenAI API 키 유효성 확인

#### 4. 로그인 문제 (iOS)
**사유**: 심사자가 앱에 로그인할 수 없음
**대응**: 유효한 데모 계정 제공 또는 상세한 로그인 가이드 제공

---

## 출시 후 관리

### 모니터링

#### 1. 크래시 및 오류
```
Google Play:
- Android Vitals
- Firebase Crashlytics (권장)

App Store:
- Xcode Organizer > Crashes
- Firebase Crashlytics (권장)
```

#### 2. 사용자 리뷰
```
- 매일 리뷰 확인
- 부정적 리뷰에 신속하고 친절하게 응대
- 피드백 반영하여 업데이트
```

#### 3. 통계
```
Google Play Console:
- 설치 수, 제거 수
- 사용자 평점 및 리뷰
- 국가별 통계

App Store Connect:
- 다운로드 수
- 매출 (IAP 시)
- 사용자 평점 및 리뷰
```

### 업데이트

#### 버전 관리
```
버전 번호 규칙: MAJOR.MINOR.PATCH

예시:
- 1.0.0: 첫 출시
- 1.0.1: 버그 수정
- 1.1.0: 새 기능 추가
- 2.0.0: 주요 변경사항
```

#### 업데이트 절차
```
1. 코드 수정 및 테스트
2. package.json 버전 업데이트
3. CHANGELOG.md 작성
4. 새 빌드 생성 (AAB/IPA)
5. Google Play/App Store에 업로드
6. 릴리스 노트 작성
7. 심사 제출
8. 승인 후 단계적 출시 (선택)
```

### 단계적 출시 (Staged Rollout)

#### Google Play
```
1. 프로덕션 릴리스 생성
2. "단계적 출시" 선택
3. 비율 설정:
   - 5% → 10% → 20% → 50% → 100%
4. 각 단계에서 크래시, 리뷰 모니터링
5. 문제 없으면 다음 단계로 확대
```

#### App Store
```
1. "버전 출시" 섹션에서
2. "수동 출시" 선택 (심사 후 자동 출시 방지)
3. 심사 통과 후:
   - "단계별 출시" 클릭
   - 1일차: 1%
   - 3일차: 5%
   - 7일차: 10%
   - 문제 없으면: 100%
```

---

## 추가 리소스

### 공식 문서

**Google Play:**
- https://developer.android.com/distribute
- https://support.google.com/googleplay/android-developer

**App Store:**
- https://developer.apple.com/app-store/
- https://developer.apple.com/app-store/review/guidelines/

### 도구 및 서비스

**분석:**
- Google Analytics for Firebase
- Mixpanel
- Amplitude

**크래시 리포팅:**
- Firebase Crashlytics
- Sentry

**A/B 테스팅:**
- Firebase Remote Config
- Optimizely

**푸시 알림:**
- Firebase Cloud Messaging (FCM)
- Apple Push Notification service (APNs)

---

## 문의

스토어 등록 관련 문의:
- 이메일: support@blogtwin.app
- 전화: 000-0000-0000

---

**다음 단계**: 출시 체크리스트 작성 (LAUNCH_CHECKLIST.md)
