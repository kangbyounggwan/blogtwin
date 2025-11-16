/**
 * Category Post Screen
 * 카테고리별 글 작성 화면
 */

import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Alert} from 'react-native';
import {Screen, Text, Card, Button} from '@components/common';
import {Colors, Spacing} from '@constants';
import {ContentGenerationService} from '@services/ContentGenerationService';
import {GenerationOptions, GeneratedContent, GenerationProgress} from '@types/generation';
import {useAIStore} from '@stores/aiStore';
import {useNavigation} from '@react-navigation/native';

const CATEGORIES = ['여행', '음식', '개발', '일상', '리뷰', '취미', '기타'];
const LENGTHS = [
  {value: 'short' as const, label: '짧게', description: '800-1200단어'},
  {value: 'medium' as const, label: '보통', description: '1500-2000단어'},
  {value: 'long' as const, label: '길게', description: '2500-3500단어'},
];
const TONES = [
  {value: 'casual' as const, label: '친근한', icon: '😊'},
  {value: 'formal' as const, label: '격식있는', icon: '🎩'},
  {value: 'professional' as const, label: '전문적인', icon: '💼'},
  {value: 'friendly' as const, label: '다정한', icon: '🤗'},
];

export const CategoryPostScreen: React.FC = () => {
  const navigation = useNavigation();
  const {setGenerating, setCurrentPost, setProgress, addTokenUsage} = useAIStore();

  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState<string>('');
  const [keywords, setKeywords] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [tone, setTone] = useState<'formal' | 'casual' | 'professional' | 'friendly'>('casual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgressState] = useState<GenerationProgress | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      Alert.alert('주제 입력', '글 주제를 입력해주세요.');
      return;
    }

    try {
      setIsGenerating(true);
      setGenerating(true);

      const options: GenerationOptions = {
        topic: topic.trim(),
        category: category || undefined,
        keywords: keywords.trim() ? keywords.split(',').map(k => k.trim()) : undefined,
        length,
        tone,
        streaming: true,
      };

      // TODO: 실제 user_id 사용
      const result = await ContentGenerationService.generateWithUserStyle(
        'user-id',
        options,
        (progressUpdate) => {
          setProgressState(progressUpdate);
          setProgress(progressUpdate.message);
        },
      );

      // 생성 완료
      setCurrentPost({
        title: result.title,
        content: result.content,
        tags: result.tags,
        generatedAt: result.generatedAt,
        tokenUsage: result.tokenUsage,
      });

      addTokenUsage(result.tokenUsage.totalTokens, result.tokenUsage.estimatedCost);

      Alert.alert(
        '생성 완료!',
        `글이 성공적으로 생성되었습니다.\n\n비용: $${result.tokenUsage.estimatedCost.toFixed(4)}`,
        [
          {
            text: '확인',
            onPress: () => {
              // @ts-ignore
              navigation.navigate('PostEditor', {
                title: result.title,
                content: result.content,
              });
            },
          },
        ],
      );
    } catch (error) {
      console.error('Generation error:', error);
      Alert.alert(
        '생성 실패',
        error instanceof Error ? error.message : '글 생성에 실패했습니다.',
      );
    } finally {
      setIsGenerating(false);
      setGenerating(false);
      setProgressState(null);
    }
  };

  return (
    <Screen padding={false}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* 주제 입력 */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text variant="h6" style={styles.sectionTitle}>
            📝 글 주제
          </Text>
          <TextInput
            style={styles.input}
            placeholder="어떤 주제로 글을 쓸까요?"
            placeholderTextColor={Colors.gray[400]}
            value={topic}
            onChangeText={setTopic}
            multiline
            numberOfLines={3}
            editable={!isGenerating}
          />
          <Text variant="caption" color="secondary" style={styles.hint}>
            예: 제주도 3박4일 여행 후기, 리액트 네이티브 시작하기
          </Text>
        </Card>

        {/* 카테고리 선택 */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text variant="h6" style={styles.sectionTitle}>
            📂 카테고리
          </Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat && styles.categoryChipActive,
                ]}
                onPress={() => setCategory(cat === category ? '' : cat)}
                disabled={isGenerating}>
                <Text
                  variant="body2"
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextActive,
                  ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* 키워드 입력 */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text variant="h6" style={styles.sectionTitle}>
            🔑 키워드 (선택)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="키워드를 쉼표로 구분해서 입력하세요"
            placeholderTextColor={Colors.gray[400]}
            value={keywords}
            onChangeText={setKeywords}
            editable={!isGenerating}
          />
          <Text variant="caption" color="secondary" style={styles.hint}>
            예: 성산일출봉, 해변, 카페
          </Text>
        </Card>

        {/* 길이 선택 */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text variant="h6" style={styles.sectionTitle}>
            📏 글 길이
          </Text>
          <View style={styles.lengthButtons}>
            {LENGTHS.map((l) => (
              <TouchableOpacity
                key={l.value}
                style={[
                  styles.lengthButton,
                  length === l.value && styles.lengthButtonActive,
                ]}
                onPress={() => setLength(l.value)}
                disabled={isGenerating}>
                <Text
                  variant="subtitle1"
                  style={[
                    styles.lengthLabel,
                    length === l.value && styles.lengthLabelActive,
                  ]}>
                  {l.label}
                </Text>
                <Text
                  variant="caption"
                  style={[
                    styles.lengthDesc,
                    length === l.value && styles.lengthDescActive,
                  ]}>
                  {l.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* 어조 선택 */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text variant="h6" style={styles.sectionTitle}>
            🎨 어조
          </Text>
          <View style={styles.toneGrid}>
            {TONES.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={[
                  styles.toneChip,
                  tone === t.value && styles.toneChipActive,
                ]}
                onPress={() => setTone(t.value)}
                disabled={isGenerating}>
                <Text style={styles.toneIcon}>{t.icon}</Text>
                <Text
                  variant="body2"
                  style={[
                    styles.toneText,
                    tone === t.value && styles.toneTextActive,
                  ]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* 진행 상태 */}
        {isGenerating && progress && (
          <Card variant="elevated" padding="lg" style={styles.card}>
            <Text variant="h6" style={styles.sectionTitle}>
              ⏳ {progress.message}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${progress.percentage}%`},
                ]}
              />
            </View>
            <Text variant="caption" color="secondary" align="center" style={styles.progressText}>
              {progress.percentage}%
            </Text>
            {progress.currentText && (
              <View style={styles.previewContainer}>
                <Text variant="body2" numberOfLines={5}>
                  {progress.currentText}
                </Text>
              </View>
            )}
          </Card>
        )}

        {/* 생성 버튼 */}
        <Button
          title={isGenerating ? '생성 중...' : 'AI로 글 생성하기'}
          variant="primary"
          size="large"
          fullWidth
          loading={isGenerating}
          onPress={handleGenerate}
          style={styles.generateButton}
        />

        <View style={styles.infoBox}>
          <Text variant="caption" color="secondary" align="center">
            💡 사용자의 스타일 프로파일이 있다면 자동으로 적용됩니다
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.base,
  },
  card: {
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    marginBottom: Spacing.base,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: Spacing.base,
    fontSize: 16,
    color: Colors.light.text.primary,
    backgroundColor: Colors.common.white,
    textAlignVertical: 'top',
  },
  hint: {
    marginTop: Spacing.xs,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.common.white,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  categoryText: {
    color: Colors.gray[700],
  },
  categoryTextActive: {
    color: Colors.common.white,
  },
  lengthButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  lengthButton: {
    flex: 1,
    padding: Spacing.base,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.common.white,
    alignItems: 'center',
  },
  lengthButtonActive: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[500],
  },
  lengthLabel: {
    color: Colors.gray[700],
    marginBottom: Spacing.xs,
  },
  lengthLabelActive: {
    color: Colors.primary[700],
  },
  lengthDesc: {
    color: Colors.gray[500],
  },
  lengthDescActive: {
    color: Colors.primary[600],
  },
  toneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  toneChip: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.common.white,
  },
  toneChipActive: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[500],
  },
  toneIcon: {
    fontSize: 20,
  },
  toneText: {
    color: Colors.gray[700],
  },
  toneTextActive: {
    color: Colors.primary[700],
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
  },
  progressText: {
    marginBottom: Spacing.base,
  },
  previewContainer: {
    marginTop: Spacing.base,
    padding: Spacing.base,
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
  },
  generateButton: {
    marginBottom: Spacing.base,
  },
  infoBox: {
    padding: Spacing.base,
    marginBottom: Spacing.xl,
  },
});
