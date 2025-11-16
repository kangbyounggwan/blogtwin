/**
 * Onboarding Component
 * 앱 첫 실행 시 사용법을 안내하는 온보딩 화면
 */

import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  ViewToken,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {Text} from './Text';
import {Button} from './Button';
import {Colors, Spacing, BorderRadius} from '@constants';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image?: ImageSourcePropType;
  icon?: string;
  backgroundColor?: string;
}

interface OnboardingProps {
  slides: OnboardingSlide[];
  onComplete: () => void;
  onSkip?: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({
  slides,
  onComplete,
  onSkip,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onSkip?.() || onComplete();
  };

  const renderSlide = ({item}: {item: OnboardingSlide}) => (
    <View
      style={[
        styles.slide,
        {backgroundColor: item.backgroundColor || Colors.common.white},
      ]}>
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        ) : (
          <Text style={styles.icon}>{item.icon || '👋'}</Text>
        )}
      </View>

      <View style={styles.textContainer}>
        <Text variant="h4" style={styles.title}>
          {item.title}
        </Text>
        <Text variant="body1" color="secondary" style={styles.description}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex && styles.dotActive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {renderPagination()}

      <View style={styles.footer}>
        {currentIndex < slides.length - 1 && onSkip && (
          <Button
            title="건너뛰기"
            variant="text"
            onPress={handleSkip}
            style={styles.skipButton}
          />
        )}

        <Button
          title={currentIndex === slides.length - 1 ? '시작하기' : '다음'}
          variant="primary"
          onPress={handleNext}
          style={styles.nextButton}
        />
      </View>
    </View>
  );
};

/**
 * Default Onboarding Slides for BlogTwin
 */
export const defaultOnboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    icon: '👋',
    title: 'BlogTwin에 오신 것을 환영합니다!',
    description: 'AI가 당신의 블로그 글쓰기 스타일을 학습하여\n자동으로 글을 작성해드립니다.',
    backgroundColor: Colors.primary[50],
  },
  {
    id: '2',
    icon: '🔗',
    title: '블로그 연동하기',
    description: '네이버 블로그를 연동하면\nAI가 기존 글을 분석하여 당신만의 스타일을 학습합니다.',
    backgroundColor: Colors.success[50],
  },
  {
    id: '3',
    icon: '🤖',
    title: 'AI 글 작성',
    description: '카테고리를 선택하거나 사진을 업로드하면\nAI가 자동으로 블로그 글을 작성해드립니다.',
    backgroundColor: Colors.info[50],
  },
  {
    id: '4',
    icon: '✨',
    title: '편집 & 발행',
    description: 'AI가 작성한 글을 편집하고\n바로 블로그에 발행할 수 있습니다.',
    backgroundColor: Colors.warning[50],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.common.white,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing['2xl'],
  },
  image: {
    width: 250,
    height: 250,
  },
  icon: {
    fontSize: 120,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.base,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.grey[300],
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary.main,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  skipButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
    marginLeft: Spacing.base,
  },
});
