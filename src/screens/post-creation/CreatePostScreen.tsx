/**
 * Create Post Screen
 * 글 작성 방식 선택 화면
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Screen, Text, Card, Button} from '@components/common';
import {Spacing} from '@constants';
import {RootStackNavigationProp} from '@types/navigation';

export const CreatePostScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  return (
    <Screen scroll padding>
      <View style={styles.container}>
        <Text variant="h3" style={styles.title}>
          어떤 방식으로 작성하시겠어요?
        </Text>

        {/* Category Post */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text variant="h2" align="center" style={styles.emoji}>
            ✍️
          </Text>
          <Text variant="h5" align="center" style={styles.cardTitle}>
            카테고리별 글 작성
          </Text>
          <Text variant="body2" color="secondary" align="center" style={styles.description}>
            주제와 카테고리를 선택하면{'\n'}
            AI가 당신의 스타일로 글을 작성합니다
          </Text>
          <Button
            title="시작하기"
            variant="primary"
            size="medium"
            fullWidth
            onPress={() => navigation.navigate('CategoryPost')}
            style={styles.button}
          />
        </Card>

        {/* Photo Post */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text variant="h2" align="center" style={styles.emoji}>
            📸
          </Text>
          <Text variant="h5" align="center" style={styles.cardTitle}>
            사진으로 포스팅
          </Text>
          <Text variant="body2" color="secondary" align="center" style={styles.description}>
            사진만 올리면{'\n'}
            AI가 자동으로 스토리텔링을 만들어드립니다
          </Text>
          <Button
            title="시작하기"
            variant="primary"
            size="medium"
            fullWidth
            onPress={() => navigation.navigate('PhotoPost')}
            style={styles.button}
          />
        </Card>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: Spacing.xl,
  },
  card: {
    marginBottom: Spacing.base,
  },
  emoji: {
    fontSize: 60,
    marginBottom: Spacing.base,
  },
  cardTitle: {
    marginBottom: Spacing.sm,
  },
  description: {
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  button: {
    marginTop: Spacing.base,
  },
});
