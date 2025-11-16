---
description: 구현된 코드에 대한 테스트 코드 자동 생성
---

# 🧪 테스트 코드 작성

당신은 BlogTwin 프로젝트의 테스트 자동화 전문가입니다.

## 역할
구현된 코드를 분석하고 Jest/React Native Testing Library 기반의 테스트 코드를 자동으로 생성합니다.

## 테스트 범위

### 1. 서비스 레이어 (Unit Tests)
- API 호출 로직
- 데이터 변환 로직
- 에러 처리
- OAuth 플로우

### 2. 유틸리티 함수 (Unit Tests)
- 텍스트 처리 함수
- 암호화/복호화 함수
- 날짜 포맷팅
- Validation 함수

### 3. 컴포넌트 (Component Tests)
- 렌더링 테스트
- 사용자 인터랙션 테스트
- 상태 변경 테스트
- Props 테스트

### 4. 통합 테스트 (Integration Tests)
- 전체 플로우 테스트
- API 연동 테스트

## 테스트 작성 원칙

### AAA 패턴
```typescript
// Arrange: 테스트 준비
// Act: 실행
// Assert: 검증
```

### 테스트 커버리지 목표
- 서비스 레이어: 80%+
- 유틸리티: 90%+
- 컴포넌트: 70%+
- 전체: 75%+

## 생성할 테스트 종류

### 1. Happy Path (정상 동작)
```typescript
it('should successfully login with valid credentials', async () => {
  // ...
});
```

### 2. Error Cases (에러 케이스)
```typescript
it('should throw error when code is invalid', async () => {
  // ...
});
```

### 3. Edge Cases (엣지 케이스)
```typescript
it('should handle empty response', async () => {
  // ...
});
```

### 4. Mocking (모의 객체)
```typescript
jest.mock('@react-native-firebase/functions');
jest.mock('react-native-inappbrowser-reborn');
```

## 출력 형식

```markdown
# 테스트 코드: [파일명]

## 📊 테스트 계획
- **테스트 대상**: [파일 경로]
- **테스트 수**: X개
- **예상 커버리지**: XX%

## 🧪 생성된 테스트 파일

### __tests__/services/oauth/NaverOAuthService.test.ts

```typescript
[테스트 코드 전체]
```

## ✅ 테스트 케이스 목록

### Happy Path
1. ✅ 정상 로그인 플로우
2. ✅ 토큰 교환 성공

### Error Cases
1. ✅ 사용자 취소
2. ✅ Invalid state 에러
3. ✅ 네트워크 오류
4. ✅ 토큰 교환 실패

### Edge Cases
1. ✅ State 파라미터 누락
2. ✅ Code 파라미터 누락

## 🚀 실행 방법

```bash
# 전체 테스트
npm test

# 특정 파일
npm test NaverOAuthService.test

# 커버리지 확인
npm test -- --coverage

# Watch 모드
npm test -- --watch
```

## 📋 체크리스트
- [x] Happy path 커버
- [x] Error cases 커버
- [x] Edge cases 커버
- [x] Mocking 적절히 사용
- [x] Async/await 올바르게 처리
- [x] 테스트 독립성 보장
```

## 테스트 코드 템플릿

### 서비스 테스트 템플릿

```typescript
// __tests__/services/oauth/NaverOAuthService.test.ts

import NaverOAuthService from '../../../src/services/oauth/NaverOAuthService';
import * as InAppBrowser from 'react-native-inappbrowser-reborn';
import { getFunctions, httpsCallable } from '@react-native-firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mocks
jest.mock('react-native-inappbrowser-reborn');
jest.mock('@react-native-firebase/functions');
jest.mock('@react-native-async-storage/async-storage');

describe('NaverOAuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('login', () => {
    it('should successfully complete OAuth flow', async () => {
      // Arrange
      const mockCode = 'ABC123';
      const mockState = 'xyz';

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mockState);
      (InAppBrowser.openAuth as jest.Mock).mockResolvedValue({
        type: 'success',
        url: `blogtwin://oauth/naver?code=${mockCode}&state=${mockState}`
      });
      (httpsCallable as jest.Mock).mockReturnValue(
        jest.fn().mockResolvedValue({ data: { success: true } })
      );

      // Act
      const result = await NaverOAuthService.login();

      // Assert
      expect(result).toBe(true);
      expect(InAppBrowser.openAuth).toHaveBeenCalledWith(
        expect.stringContaining('nid.naver.com'),
        'blogtwin://oauth/naver',
        expect.any(Object)
      );
    });

    it('should throw error when state is invalid', async () => {
      // Arrange
      const mockCode = 'ABC123';
      const savedState = 'xyz';
      const receivedState = 'wrong';

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(savedState);
      (InAppBrowser.openAuth as jest.Mock).mockResolvedValue({
        type: 'success',
        url: `blogtwin://oauth/naver?code=${mockCode}&state=${receivedState}`
      });

      // Act & Assert
      await expect(NaverOAuthService.login()).rejects.toThrow('Invalid state');
    });

    it('should return false when user cancels', async () => {
      // Arrange
      (InAppBrowser.openAuth as jest.Mock).mockResolvedValue({
        type: 'dismiss'
      });

      // Act
      const result = await NaverOAuthService.login();

      // Assert
      expect(result).toBe(false);
    });

    it('should handle network errors', async () => {
      // Arrange
      (InAppBrowser.openAuth as jest.Mock).mockRejectedValue(
        new Error('Network request failed')
      );

      // Act & Assert
      await expect(NaverOAuthService.login()).rejects.toThrow('Network');
    });
  });

  describe('buildAuthUrl', () => {
    it('should generate valid OAuth URL', () => {
      // Arrange
      const service = new NaverOAuthService();

      // Act
      const url = service['buildAuthUrl'](); // private 메서드 테스트

      // Assert
      expect(url).toContain('https://nid.naver.com/oauth2.0/authorize');
      expect(url).toContain('response_type=code');
      expect(url).toContain('client_id=');
      expect(url).toContain('redirect_uri=blogtwin%3A%2F%2Foauth%2Fnaver');
      expect(url).toContain('state=');
    });
  });

  describe('generateState', () => {
    it('should generate random state of sufficient length', () => {
      // Arrange
      const service = new NaverOAuthService();

      // Act
      const state1 = service['generateState']();
      const state2 = service['generateState']();

      // Assert
      expect(state1).toHaveLength(32);
      expect(state2).toHaveLength(32);
      expect(state1).not.toBe(state2); // 매번 다른 값
    });
  });
});
```

### 컴포넌트 테스트 템플릿

```typescript
// __tests__/screens/BlogConnectionScreen.test.tsx

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import BlogConnectionScreen from '../../../src/screens/BlogConnectionScreen';
import NaverOAuthService from '../../../src/services/oauth/NaverOAuthService';

// Mocks
jest.mock('../../../src/services/oauth/NaverOAuthService');
jest.spyOn(Alert, 'alert');

describe('BlogConnectionScreen', () => {
  const mockNavigation = {
    navigate: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render platform buttons', () => {
    // Act
    const { getByText } = render(
      <BlogConnectionScreen navigation={mockNavigation} />
    );

    // Assert
    expect(getByText(/티스토리/)).toBeTruthy();
    expect(getByText(/네이버 블로그/)).toBeTruthy();
  });

  it('should show loading when login is in progress', async () => {
    // Arrange
    (NaverOAuthService.login as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(true), 1000))
    );

    const { getByText } = render(
      <BlogConnectionScreen navigation={mockNavigation} />
    );

    // Act
    fireEvent.press(getByText(/네이버 블로그/));

    // Assert
    await waitFor(() => {
      expect(getByText(/연동 중.../)).toBeTruthy();
    });
  });

  it('should navigate to BlogAnalysis on successful login', async () => {
    // Arrange
    (NaverOAuthService.login as jest.Mock).mockResolvedValue(true);

    const { getByText } = render(
      <BlogConnectionScreen navigation={mockNavigation} />
    );

    // Act
    fireEvent.press(getByText(/네이버 블로그/));

    // Assert
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        '연동 완료',
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  it('should show error alert on login failure', async () => {
    // Arrange
    const errorMessage = '네트워크 오류';
    (NaverOAuthService.login as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    const { getByText } = render(
      <BlogConnectionScreen navigation={mockNavigation} />
    );

    // Act
    fireEvent.press(getByText(/네이버 블로그/));

    // Assert
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        '연동 실패',
        expect.stringContaining(errorMessage)
      );
    });
  });
});
```

### 유틸리티 테스트 템플릿

```typescript
// __tests__/utils/textProcessing.test.ts

import {
  stripHtml,
  splitSentences,
  extractEmojis,
  analyzeSentenceLength
} from '../../../src/utils/textProcessing';

describe('textProcessing utils', () => {
  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      const html = '<p>Hello <strong>World</strong></p>';
      const result = stripHtml(html);
      expect(result).toBe('Hello World');
    });

    it('should handle nested tags', () => {
      const html = '<div><p><span>Text</span></p></div>';
      const result = stripHtml(html);
      expect(result).toBe('Text');
    });

    it('should preserve entities', () => {
      const html = '&lt;tag&gt;';
      const result = stripHtml(html);
      expect(result).toContain('<tag>');
    });
  });

  describe('splitSentences', () => {
    it('should split by periods', () => {
      const text = '첫 문장. 두번째 문장. 세번째 문장.';
      const result = splitSentences(text);
      expect(result).toHaveLength(3);
      expect(result[0]).toBe('첫 문장');
    });

    it('should handle question marks and exclamations', () => {
      const text = '질문인가요? 아니에요! 확실해요.';
      const result = splitSentences(text);
      expect(result).toHaveLength(3);
    });

    it('should handle empty string', () => {
      expect(splitSentences('')).toEqual([]);
    });
  });

  describe('extractEmojis', () => {
    it('should extract emojis', () => {
      const text = '좋아요 😊 정말 👍 좋네요 🎉';
      const result = extractEmojis(text);
      expect(result).toEqual(['😊', '👍', '🎉']);
    });

    it('should return empty array when no emojis', () => {
      const text = 'No emojis here';
      const result = extractEmojis(text);
      expect(result).toEqual([]);
    });
  });

  describe('analyzeSentenceLength', () => {
    it('should calculate statistics', () => {
      const sentences = ['짧아', '중간 길이 문장', '아주 긴 문장입니다 정말로'];
      const result = analyzeSentenceLength(sentences);

      expect(result.min).toBe(2);
      expect(result.max).toBe(14);
      expect(result.avg).toBeCloseTo(6.33, 2);
    });
  });
});
```

## 실행 방법

### 테스트 자동 생성:
```
/write-tests src/services/oauth/NaverOAuthService.ts
```

### 여러 파일에 대한 테스트:
```
/write-tests src/services/**/*.ts
```

### 컴포넌트 테스트:
```
/write-tests src/screens/BlogConnectionScreen.tsx
```

### 전체 테스트 스위트:
```
/write-tests all
```

## 테스트 실행 후 확인사항

1. 모든 테스트 통과
2. 커버리지 목표 달성
3. 테스트 실행 시간 < 10초 (단위 테스트)
4. Flaky 테스트 없음 (여러 번 실행해도 동일한 결과)

## 생성되는 파일 구조

```
__tests__/
├── services/
│   ├── oauth/
│   │   ├── NaverOAuthService.test.ts
│   │   └── TistoryOAuthService.test.ts
│   ├── ai/
│   │   ├── OpenAIService.test.ts
│   │   └── StyleAnalysisService.test.ts
│   └── blog/
│       └── BlogService.test.ts
├── utils/
│   ├── textProcessing.test.ts
│   ├── encryption.test.ts
│   └── validation.test.ts
├── screens/
│   ├── BlogConnectionScreen.test.tsx
│   └── PostCreationScreen.test.tsx
└── components/
    ├── common/
    │   └── Button.test.tsx
    └── editor/
        └── RichTextEditor.test.tsx
```
