/**
 * Root Navigator
 * 앱의 최상위 네비게이션
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '@types/navigation';

// Screens
import {SplashScreen} from '@screens/onboarding/SplashScreen';
import {OnboardingScreen} from '@screens/onboarding/OnboardingScreen';
import {BlogConnectionScreen} from '@screens/blog-connection/BlogConnectionScreen';
import {StyleAnalysisScreen} from '@screens/analysis/StyleAnalysisScreen';
import {CategoryPostScreen} from '@screens/post-creation/CategoryPostScreen';
import {PhotoPostScreen} from '@screens/post-creation/PhotoPostScreen';
import {PostEditorScreen} from '@screens/editor/PostEditorScreen';
import {PublishSettingsScreen} from '@screens/publish/PublishSettingsScreen';
import {MainNavigator} from './MainNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: 'white'},
      }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={MainNavigator} />
      <Stack.Screen
        name="BlogConnection"
        component={BlogConnectionScreen}
        options={{
          headerShown: true,
          title: '블로그 연동',
        }}
      />
      <Stack.Screen
        name="StyleAnalysis"
        component={StyleAnalysisScreen}
        options={{
          headerShown: true,
          title: 'AI 스타일 분석',
        }}
      />
      <Stack.Screen
        name="CategoryPost"
        component={CategoryPostScreen}
        options={{
          headerShown: true,
          title: '카테고리별 글 작성',
        }}
      />
      <Stack.Screen
        name="PhotoPost"
        component={PhotoPostScreen}
        options={{
          headerShown: true,
          title: '사진으로 포스팅',
        }}
      />
      <Stack.Screen
        name="PostEditor"
        component={PostEditorScreen}
        options={{
          headerShown: true,
          title: '글 편집',
        }}
      />
      <Stack.Screen
        name="PublishSettings"
        component={PublishSettingsScreen}
        options={{
          headerShown: true,
          title: '발행 설정',
        }}
      />
    </Stack.Navigator>
  );
};
