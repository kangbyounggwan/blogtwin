/**
 * Navigation Type Definitions
 */

import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';

/**
 * Root Stack Navigator
 */
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;
  BlogConnection: undefined;
  StyleAnalysis: undefined;
  CategoryPost: undefined;
  PhotoPost: undefined;
  PostEditor: {postId?: string; title?: string; content?: string};
  PublishSettings: {postId: string; title: string; content: string};
};

/**
 * Main Tab Navigator
 */
export type MainTabParamList = {
  Home: undefined;
  CreatePost: undefined;
  MyPosts: undefined;
  Settings: undefined;
};

/**
 * Blog Connection Stack
 */
export type BlogConnectionStackParamList = {
  BlogConnectionList: undefined;
  BlogConnectionDetail: {platform: 'tistory' | 'naver' | 'velog'};
};

/**
 * Post Creation Stack
 */
export type PostCreationStackParamList = {
  PostTypeSelect: undefined;
  CategoryPost: undefined;
  PhotoPost: undefined;
  PostEditor: {postId?: string};
  PostPreview: {postId: string};
};

/**
 * Navigation Props
 */

// Root Stack
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;

export type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;
export type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

// Main Tab
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  RootStackNavigationProp
>;

export type CreatePostScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'CreatePost'>,
  RootStackNavigationProp
>;

/**
 * Route Props
 */
export type SplashScreenRouteProp = RouteProp<RootStackParamList, 'Splash'>;
export type OnboardingScreenRouteProp = RouteProp<RootStackParamList, 'Onboarding'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
