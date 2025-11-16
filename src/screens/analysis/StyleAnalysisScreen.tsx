/**
 * Style Analysis Screen
 * AI 스타일 분석 화면
 */

import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ScrollView, Alert} from 'react-native';
import {Screen, Text, Card, Button} from '@components/common';
import {Colors, Spacing} from '@constants';
import {StyleAnalysisService} from '@services/StyleAnalysisService';
import {useBlogStore} from '@stores/blogStore';
import {StyleProfile} from '@types/style';

export const StyleAnalysisScreen: React.FC = () => {
  const {naverConnection} = useBlogStore();
  const [profile, setProfile] = useState<StyleProfile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      // TODO: 실제 user_id 사용
      const savedProfile = await StyleAnalysisService.getUserStyleProfile('user-id');
      setProfile(savedProfile);
    } catch (error) {
      console.error('Load profile error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAnalysis = () => {
    Alert.alert(
      '스타일 분석',
      '현재 네이버 블로그 API는 글 목록 조회를 공식 지원하지 않습니다.\n\n실제 앱에서는 다음 방법을 사용할 수 있습니다:\n1. 사용자가 직접 글 내용 입력\n2. RSS 피드 활용\n3. 웹 크롤링 (주의 필요)\n\n데모를 위해 샘플 데이터로 분석을 시작할까요?',
      [
        {text: '취소', style: 'cancel'},
        {text: '샘플 분석 시작', onPress: startSampleAnalysis},
      ],
    );
  };

  const startSampleAnalysis = async () => {
    try {
      setIsAnalyzing(true);

      // 샘플 데이터
      const samplePosts = [
        {
          title: '제주도 여행 후기',
          content: `안녕하세요! 오늘은 제주도 3박4일 여행 후기를 공유해볼게요.

첫날엔 공항에서 렌터카를 빌려서 바로 성산일출봉으로 향했어요. 날씨가 정말 좋아서 경치가 너무 아름다웠답니다. 올라가는 길이 생각보다 힘들었지만, 정상에서 본 바다 풍경은 정말 환상적이었어요!

둘째 날엔 협재 해수욕장과 한림공원을 다녀왔는데요. 협재 해수욕장의 에메랄드빛 바다는 정말 인생 바다였어요. 사진으로 담기엔 아까울 정도로 예뻤답니다.

셋째 날엔 카페 투어를 하면서 여유롭게 보냈어요. 제주 곳곳의 예쁜 카페들에서 바다를 보며 커피를 마시는 게 이번 여행의 하이라이트였던 것 같아요.

마지막 날은 동문시장에서 쇼핑을 하고 공항으로 향했어요. 짧지만 정말 행복했던 제주 여행이었습니다!`,
          category: '여행',
        },
        {
          title: 'React Native 개발 팁',
          content: `React Native로 앱을 개발하면서 알게 된 유용한 팁들을 정리해봅니다.

첫 번째로, 성능 최적화를 위해서는 React.memo와 useMemo를 적극 활용하는 게 중요해요. 특히 리스트를 렌더링할 때는 FlatList의 최적화 옵션들을 잘 설정해주는 게 좋습니다.

두 번째로, 디버깅 시에는 Reactotron이 정말 유용했어요. 상태 관리와 네트워크 요청을 한눈에 볼 수 있어서 개발 속도가 훨씬 빨라졌답니다.

세 번째는 타입스크립트 활용인데요. 처음엔 귀찮게 느껴질 수 있지만, 나중에 유지보수할 때 정말 큰 도움이 됩니다.

이 외에도 많은 팁들이 있지만, 오늘은 이 정도로 정리해볼게요!`,
          category: '개발',
        },
        {
          title: '홈 카페 인테리어',
          content: `집에서 카페 분위기를 내는 인테리어 팁을 소개합니다.

먼저 조명이 정말 중요해요. 따뜻한 색온도의 조명을 사용하면 훨씬 분위기 있는 공간이 만들어집니다. 저는 무드등과 간접조명을 활용했어요.

두 번째는 소품 배치인데요. 작은 화분이나 책, 그림 등을 적절히 배치하면 공간이 훨씬 살아나요. 특히 초록색 식물은 공간에 생기를 더해줍니다.

세 번째로 편안한 의자와 테이블이 필수예요. 카페에서 가장 중요한 건 편안함이니까요. 저는 중고 가구를 활용해서 저렴하게 구성했답니다.

마지막으로 커피 머신과 그라인더를 준비하면 완벽해요. 집에서 직접 내린 커피 한 잔의 여유, 정말 최고랍니다!`,
          category: '인테리어',
        },
      ];

      // 분석 실행
      const result = await StyleAnalysisService.analyzeWritingStyle({
        userId: 'user-id',
        posts: samplePosts,
      });

      setProfile(result.profile);

      Alert.alert(
        '분석 완료!',
        '스타일 분석이 완료되었습니다.',
        [{text: '확인'}],
      );
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert(
        '분석 실패',
        error instanceof Error ? error.message : '스타일 분석에 실패했습니다.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <Screen padding>
        <View style={styles.centerContainer}>
          <Text variant="body1">프로파일 불러오는 중...</Text>
        </View>
      </Screen>
    );
  }

  if (!naverConnection.isConnected) {
    return (
      <Screen padding>
        <View style={styles.centerContainer}>
          <Text variant="h2" align="center" style={styles.emptyEmoji}>
            🔗
          </Text>
          <Text variant="h5" align="center" style={styles.emptyTitle}>
            블로그 연동이 필요합니다
          </Text>
          <Text variant="body2" color="secondary" align="center" style={styles.emptyDescription}>
            스타일 분석을 위해서는{'\n'}먼저 블로그를 연동해주세요
          </Text>
        </View>
      </Screen>
    );
  }

  if (!profile) {
    return (
      <Screen padding>
        <View style={styles.container}>
          <Card variant="elevated" padding="lg">
            <Text variant="h2" align="center" style={styles.icon}>
              🤖
            </Text>
            <Text variant="h4" align="center" style={styles.cardTitle}>
              AI 스타일 분석
            </Text>
            <Text variant="body2" color="secondary" align="center" style={styles.description}>
              블로그 글을 분석하여{'\n'}
              당신만의 글쓰기 스타일을 파악합니다
            </Text>
            <Button
              title={isAnalyzing ? '분석 중...' : '스타일 분석 시작'}
              variant="primary"
              size="large"
              fullWidth
              loading={isAnalyzing}
              onPress={handleStartAnalysis}
              style={styles.button}
            />
          </Card>

          <Card variant="outlined" padding="lg" style={styles.infoCard}>
            <Text variant="subtitle1" style={styles.infoTitle}>
              📌 분석 내용
            </Text>
            <View style={styles.infoList}>
              <InfoItem text="어조 및 문체 분석" />
              <InfoItem text="자주 사용하는 표현 패턴" />
              <InfoItem text="문장 길이 및 구조" />
              <InfoItem text="주제별 키워드 추출" />
              <InfoItem text="고유한 스타일 특징" />
            </View>
          </Card>
        </View>
      </Screen>
    );
  }

  // 분석 결과 화면
  return (
    <Screen padding={false}>
      <ScrollView style={styles.resultContainer} contentContainerStyle={styles.resultContent}>
        <View style={styles.header}>
          <Text variant="h3" style={styles.headerTitle}>
            스타일 분석 결과
          </Text>
          <Text variant="caption" color="secondary">
            분석일: {new Date(profile.analyzedAt).toLocaleDateString()}
          </Text>
        </View>

        {/* 전체 요약 */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text variant="h5" style={styles.sectionTitle}>
            📝 전체 스타일
          </Text>
          <Text variant="body1" style={styles.summaryText}>
            {profile.aiSummary.overallStyle}
          </Text>
        </Card>

        {/* 통계 */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text variant="h5" style={styles.sectionTitle}>
            📊 기본 통계
          </Text>
          <View style={styles.statsGrid}>
            <StatItem label="총 분석 글" value={`${profile.statistics.totalPosts}개`} />
            <StatItem label="평균 글 길이" value={`${profile.statistics.averagePostLength}단어`} />
            <StatItem label="평균 문장" value={`${profile.statistics.averageSentenceLength}단어`} />
            <StatItem label="평균 문단" value={`${profile.statistics.averageParagraphLength}단어`} />
          </View>
        </Card>

        {/* 어조 특성 */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text variant="h5" style={styles.sectionTitle}>
            🎨 어조 특성
          </Text>
          <ToneBar label="격식성" value={profile.tone.formality} />
          <ToneBar label="감성도" value={profile.tone.emotion} />
          <ToneBar label="활기" value={profile.tone.energy} />
          <ToneBar label="유머" value={profile.tone.humor} />
        </Card>

        {/* 문체 특징 */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text variant="h5" style={styles.sectionTitle}>
            ✍️ 문체 특징
          </Text>
          <StyleItem label="문장 구조" value={profile.writingStyle.sentenceStructure} />
          <StyleItem label="문단 스타일" value={profile.writingStyle.paragraphStyle} />
          <StyleItem label="어휘 수준" value={profile.writingStyle.vocabularyLevel} />
        </Card>

        {/* 고유한 특징 */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text variant="h5" style={styles.sectionTitle}>
            ⭐ 고유한 특징
          </Text>
          {profile.aiSummary.uniqueTraits.map((trait, index) => (
            <View key={index} style={styles.traitItem}>
              <Text variant="body2">• {trait}</Text>
            </View>
          ))}
        </Card>

        {/* 재분석 버튼 */}
        <Button
          title="다시 분석하기"
          variant="outline"
          size="medium"
          fullWidth
          onPress={handleStartAnalysis}
          style={styles.reanalyzeButton}
        />
      </ScrollView>
    </Screen>
  );
};

const InfoItem: React.FC<{text: string}> = ({text}) => (
  <View style={styles.infoItem}>
    <Text variant="body2" style={styles.infoBullet}>
      •
    </Text>
    <Text variant="body2" color="secondary">
      {text}
    </Text>
  </View>
);

const StatItem: React.FC<{label: string; value: string}> = ({label, value}) => (
  <View style={styles.statItem}>
    <Text variant="caption" color="secondary">
      {label}
    </Text>
    <Text variant="h6">{value}</Text>
  </View>
);

const ToneBar: React.FC<{label: string; value: number}> = ({label, value}) => (
  <View style={styles.toneBar}>
    <Text variant="body2" style={styles.toneLabel}>
      {label}
    </Text>
    <View style={styles.barContainer}>
      <View style={[styles.barFill, {width: `${value}%`}]} />
    </View>
    <Text variant="caption" color="secondary">
      {value}
    </Text>
  </View>
);

const StyleItem: React.FC<{label: string; value: string}> = ({label, value}) => (
  <View style={styles.styleItem}>
    <Text variant="body2" color="secondary">
      {label}
    </Text>
    <Text variant="subtitle1">{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  icon: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    marginBottom: Spacing.sm,
  },
  description: {
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  button: {
    marginTop: Spacing.base,
  },
  infoCard: {
    marginTop: Spacing.base,
  },
  infoTitle: {
    marginBottom: Spacing.base,
  },
  infoList: {
    gap: Spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoBullet: {
    marginRight: Spacing.sm,
    color: Colors.primary[500],
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    lineHeight: 22,
  },
  resultContainer: {
    flex: 1,
  },
  resultContent: {
    padding: Spacing.base,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    marginBottom: Spacing.xs,
  },
  card: {
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    marginBottom: Spacing.base,
  },
  summaryText: {
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.base,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.base,
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
  },
  toneBar: {
    marginBottom: Spacing.base,
  },
  toneLabel: {
    marginBottom: Spacing.xs,
  },
  barContainer: {
    height: 8,
    backgroundColor: Colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
  },
  styleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  traitItem: {
    marginBottom: Spacing.sm,
  },
  reanalyzeButton: {
    marginBottom: Spacing.xl,
  },
});
