/**
 * Onboarding Screen
 * 앱 사용 방법을 안내하는 화면
 */

import React, {useState, useRef} from 'react';
import {StyleSheet, View, FlatList, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Screen, Text, Button, Card} from '@components/common';
import {Colors, Spacing} from '@constants';
import {OnboardingScreenNavigationProp} from '@types/navigation';

const {width} = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    emoji: '🤖',
    title: '당신의 블로그 스타일을 학습합니다',
    description: '최근 2개월 간의 블로그 글을 분석하여\n당신만의 어투와 스타일을 완벽하게 학습합니다.',
  },
  {
    id: '2',
    emoji: '✍️',
    title: '사진과 주제만으로 글을 작성합니다',
    description: '주제를 입력하거나 사진만 올리면\nAI가 자동으로 당신의 스타일로 글을 작성해드립니다.',
  },
  {
    id: '3',
    emoji: '🚀',
    title: '언제 어디서나 빠른 포스팅',
    description: '모바일에서 간편하게 글을 작성하고\n바로 블로그에 발행할 수 있습니다.',
  },
];

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
      setCurrentIndex(nextIndex);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    // TODO: AsyncStorage에 온보딩 완료 표시
    navigation.replace('Main');
  };

  const renderSlide = ({item}: {item: OnboardingSlide}) => (
    <View style={styles.slide}>
      <View style={styles.slideContent}>
        <Text variant="h1" align="center" style={styles.emoji}>
          {item.emoji}
        </Text>
        <Text variant="h3" align="center" style={styles.title}>
          {item.title}
        </Text>
        <Text variant="body1" color="secondary" align="center" style={styles.description}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <Screen padding={false}>
      <View style={styles.container}>
        {/* Skip Button */}
        {currentIndex < slides.length - 1 && (
          <View style={styles.skipContainer}>
            <Button title="건너뛰기" variant="ghost" size="small" onPress={handleSkip} />
          </View>
        )}

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={event => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          keyExtractor={item => item.id}
        />

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex && styles.dotActive]}
            />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={currentIndex === slides.length - 1 ? '시작하기' : '다음'}
            variant="primary"
            size="large"
            fullWidth
            onPress={handleNext}
          />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    alignItems: 'flex-end',
    paddingRight: Spacing.base,
    paddingTop: Spacing.base,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  slideContent: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 100,
    marginBottom: Spacing['2xl'],
  },
  title: {
    marginBottom: Spacing.base,
  },
  description: {
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray[300],
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary[500],
  },
  buttonContainer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
});
