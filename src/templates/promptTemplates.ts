/**
 * Prompt Templates
 * AI 글 생성을 위한 프롬프트 템플릿
 */

export interface PromptVariables {
  category?: string;
  topic?: string;
  keywords?: string[];
  tone?: string;
  length?: 'short' | 'medium' | 'long';
  style?: string; // 사용자 스타일 프로파일
  additionalInstructions?: string;
}

export class PromptTemplates {
  /**
   * 시스템 프롬프트 생성
   */
  static getSystemPrompt(userStyle?: string): string {
    const basePrompt = `당신은 전문 블로그 작가입니다. 독자의 관심을 끌고 유익한 정보를 제공하는 고품질 블로그 글을 작성합니다.`;

    if (userStyle) {
      return `${basePrompt}\n\n다음은 사용자의 글쓰기 스타일입니다. 이 스타일을 완벽하게 모방하여 글을 작성해주세요:\n\n${userStyle}`;
    }

    return basePrompt;
  }

  /**
   * 카테고리별 글 생성 프롬프트
   */
  static getCategoryPostPrompt(variables: PromptVariables): string {
    const {category, topic, keywords, tone, length} = variables;

    const lengthGuide = {
      short: '800-1200단어 내외의 간결한 글',
      medium: '1500-2000단어 내외의 적당한 길이의 글',
      long: '2500-3500단어 내외의 상세한 글',
    };

    const toneGuide = tone || '친근하고 자연스러운';
    const targetLength = lengthGuide[length || 'medium'];

    let prompt = `주제: ${topic}\n`;
    if (category) prompt += `카테고리: ${category}\n`;
    if (keywords && keywords.length > 0) {
      prompt += `핵심 키워드: ${keywords.join(', ')}\n`;
    }

    prompt += `\n요구사항:
1. ${targetLength}로 작성해주세요
2. ${toneGuide} 어조로 작성해주세요
3. 독자의 관심을 끄는 매력적인 제목을 만들어주세요
4. 자연스러운 도입부로 시작하세요
5. 구체적이고 유용한 정보를 포함하세요
6. 적절한 문단 구분으로 가독성을 높여주세요
7. 공감을 이끌어내는 마무리로 끝내주세요
8. 관련 해시태그 5-7개를 제안해주세요

다음 JSON 형식으로 응답해주세요:
{
  "title": "매력적인 제목",
  "content": "본문 내용 (마크다운 형식)",
  "tags": ["태그1", "태그2", "태그3", "태그4", "태그5"]
}`;

    if (variables.additionalInstructions) {
      prompt += `\n\n추가 지시사항:\n${variables.additionalInstructions}`;
    }

    return prompt;
  }

  /**
   * 제목 개선 프롬프트
   */
  static getTitleImprovementPrompt(originalTitle: string, content: string): string {
    return `다음 블로그 글의 제목을 더 매력적으로 개선해주세요.

원래 제목: "${originalTitle}"

글 내용 요약:
${content.substring(0, 500)}...

요구사항:
1. 클릭을 유도하는 매력적인 제목
2. 검색 최적화를 고려
3. 너무 자극적이지 않으면서도 흥미로운 제목
4. 30자 이내로 작성

3-5개의 제목 후보를 JSON 형식으로 제안해주세요:
{
  "titles": [
    {"title": "제목1", "reason": "선택 이유"},
    {"title": "제목2", "reason": "선택 이유"}
  ]
}`;
  }

  /**
   * 해시태그 생성 프롬프트
   */
  static getHashtagPrompt(title: string, content: string, count: number = 7): string {
    return `다음 블로그 글에 적합한 해시태그를 생성해주세요.

제목: ${title}

내용:
${content.substring(0, 800)}...

요구사항:
1. 총 ${count}개의 해시태그
2. 일반적인 태그 3-4개 (검색용)
3. 구체적인 태그 2-3개 (니치 타겟팅)
4. 트렌드 태그 1-2개 (있다면)
5. 한글 태그 우선, 필요시 영문 혼용

JSON 형식으로 응답해주세요:
{
  "tags": ["태그1", "태그2", "태그3", "태그4", "태그5", "태그6", "태그7"]
}`;
  }

  /**
   * 내용 확장 프롬프트
   */
  static getContentExpansionPrompt(
    currentContent: string,
    section: string,
  ): string {
    return `다음 블로그 글의 "${section}" 부분을 더 상세하게 확장해주세요.

현재 내용:
${currentContent}

요구사항:
1. 기존 내용의 맥락을 유지
2. 구체적인 예시나 설명 추가
3. 자연스러운 흐름 유지
4. 200-300단어 정도로 확장

확장된 내용만 작성해주세요.`;
  }

  /**
   * 톤 조정 프롬프트
   */
  static getToneAdjustmentPrompt(
    content: string,
    targetTone: 'formal' | 'casual' | 'professional' | 'friendly',
  ): string {
    const toneDescriptions = {
      formal: '격식 있는 존댓말 체',
      casual: '친근한 반말 체',
      professional: '전문적이고 객관적인 어투',
      friendly: '다정하고 공감적인 어조',
    };

    return `다음 블로그 글의 어조를 "${toneDescriptions[targetTone]}"로 변경해주세요.

원본 내용:
${content}

요구사항:
1. 내용의 핵심은 유지
2. 어조만 자연스럽게 변경
3. 전체적인 구조 유지

변경된 전체 내용을 작성해주세요.`;
  }

  /**
   * 요약 프롬프트
   */
  static getSummaryPrompt(content: string, maxLength: number = 150): string {
    return `다음 블로그 글을 ${maxLength}자 이내로 요약해주세요.

내용:
${content}

요구사항:
1. 핵심 내용만 포함
2. 독자의 흥미를 유발
3. ${maxLength}자 이내
4. 자연스러운 문장

요약문만 작성해주세요.`;
  }

  /**
   * 서론 생성 프롬프트
   */
  static getIntroductionPrompt(topic: string, style?: string): string {
    return `다음 주제로 블로그 글의 서론을 작성해주세요.

주제: ${topic}

요구사항:
1. 독자의 관심을 즉시 끄는 첫 문장
2. 이 글을 읽어야 하는 이유 제시
3. 간단한 글의 전체 개요
4. 150-200단어 정도

${style ? `작성 스타일:\n${style}\n` : ''}

서론만 작성해주세요.`;
  }

  /**
   * 결론 생성 프롬프트
   */
  static getConclusionPrompt(content: string, style?: string): string {
    return `다음 블로그 글의 결론을 작성해주세요.

본문 내용:
${content.substring(0, 1000)}...

요구사항:
1. 핵심 내용 재강조
2. 독자에게 남길 메시지
3. 행동 유도 (Call-to-Action)
4. 100-150단어 정도

${style ? `작성 스타일:\n${style}\n` : ''}

결론만 작성해주세요.`;
  }

  /**
   * SEO 최적화 프롬프트
   */
  static getSEOOptimizationPrompt(title: string, content: string): string {
    return `다음 블로그 글의 SEO를 개선해주세요.

제목: ${title}

내용:
${content.substring(0, 1000)}...

다음 정보를 JSON 형식으로 제공해주세요:
{
  "metaTitle": "검색 최적화된 제목 (60자 이내)",
  "metaDescription": "검색 결과에 표시될 설명 (160자 이내)",
  "keywords": ["키워드1", "키워드2", "키워드3"],
  "suggestions": ["개선 제안1", "개선 제안2"]
}`;
  }

  /**
   * 카테고리별 맞춤 프롬프트
   */
  static getCategorySpecificPrompt(category: string): string {
    const categoryGuides: Record<string, string> = {
      여행: `여행 블로그 작성 가이드:
- 구체적인 장소명과 위치 정보 포함
- 실용적인 팁과 비용 정보 제공
- 개인적인 경험과 느낌 공유
- 사진이 들어갈 위치 표시 [사진: 설명]`,

      음식: `맛집/요리 블로그 작성 가이드:
- 맛에 대한 구체적인 표현
- 메뉴, 가격, 위치 정보
- 분위기와 서비스 설명
- 추천 메뉴와 팁`,

      개발: `개발 블로그 작성 가이드:
- 기술적으로 정확한 정보
- 코드 예시 포함 (마크다운 코드블록)
- 단계별 설명
- 주의사항과 트러블슈팅`,

      일상: `일상 블로그 작성 가이드:
- 진솔한 감정 표현
- 스토리텔링 기법 활용
- 공감 요소 포함
- 자연스러운 대화체`,

      리뷰: `리뷰 블로그 작성 가이드:
- 객관적인 장단점 분석
- 구체적인 사용 경험
- 비교 정보 제공
- 구매 가이드 포함`,
    };

    return categoryGuides[category] || '주제에 맞는 구체적이고 유용한 정보를 제공해주세요.';
  }
}
