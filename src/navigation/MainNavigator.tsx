/**
 * Main Tab Navigator
 * 앱의 주요 기능들을 담은 하단 탭 네비게이션
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '@types/navigation';
import {Colors, IconSize} from '@constants';

// Screens
import {HomeScreen} from '@screens/main/HomeScreen';
import {CreatePostScreen} from '@screens/post-creation/CreatePostScreen';
import {MyPostsScreen} from '@screens/main/MyPostsScreen';
import {SettingsScreen} from '@screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.common.white,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.light.border,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: Colors.light.text.primary,
        },
        tabBarStyle: {
          backgroundColor: Colors.common.white,
          borderTopWidth: 1,
          borderTopColor: Colors.light.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.primary[500],
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '홈',
          tabBarIcon: ({color, size}) => <TabIcon icon="🏠" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{
          title: '글 작성',
          tabBarIcon: ({color, size}) => <TabIcon icon="✍️" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="MyPosts"
        component={MyPostsScreen}
        options={{
          title: '내 글',
          tabBarIcon: ({color, size}) => <TabIcon icon="📝" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: '설정',
          tabBarIcon: ({color, size}) => <TabIcon icon="⚙️" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Temporary Tab Icon (이모지 사용)
const TabIcon: React.FC<{icon: string; color: string; size: number}> = ({icon}) => {
  return <>{icon}</>;
};
