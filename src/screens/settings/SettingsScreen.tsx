/**
 * Settings Screen
 * 앱 설정 및 계정 관리 화면
 */

import React from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Screen, Text, Card} from '@components/common';
import {Colors, Spacing} from '@constants';
import {RootStackNavigationProp} from '@types/navigation';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
}

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();

  const blogSettings: SettingItem[] = [
    {
      id: 'naver',
      title: '네이버 블로그 연동',
      subtitle: '연동 관리',
      icon: '📗',
      onPress: () => navigation.navigate('BlogConnection'),
    },
  ];

  const aiSettings: SettingItem[] = [
    {
      id: 'style-analysis',
      title: 'AI 스타일 분석',
      subtitle: '분석 기간 및 설정',
      icon: '🤖',
      onPress: () => console.log('AI style settings'),
    },
    {
      id: 'content-preferences',
      title: '콘텐츠 생성 설정',
      subtitle: '톤앤매너, 길이 등',
      icon: '✍️',
      onPress: () => console.log('Content preferences'),
    },
  ];

  const appSettings: SettingItem[] = [
    {
      id: 'notifications',
      title: '알림 설정',
      subtitle: '푸시 알림 관리',
      icon: '🔔',
      onPress: () => console.log('Notification settings'),
    },
    {
      id: 'theme',
      title: '테마 설정',
      subtitle: '라이트/다크 모드',
      icon: '🎨',
      onPress: () => console.log('Theme settings'),
    },
  ];

  const accountSettings: SettingItem[] = [
    {
      id: 'profile',
      title: '프로필 설정',
      icon: '👤',
      onPress: () => console.log('Profile settings'),
    },
    {
      id: 'privacy',
      title: '개인정보 처리방침',
      icon: '🔒',
      onPress: () => console.log('Privacy policy'),
    },
    {
      id: 'terms',
      title: '이용약관',
      icon: '📄',
      onPress: () => console.log('Terms of service'),
    },
    {
      id: 'version',
      title: '앱 버전',
      subtitle: '1.0.0',
      icon: 'ℹ️',
      onPress: () => console.log('App version'),
    },
  ];

  const renderSettingSection = (title: string, items: SettingItem[]) => (
    <View style={styles.section}>
      <Text variant="h6" style={styles.sectionTitle}>
        {title}
      </Text>
      <Card variant="outlined" padding="none">
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.settingItem,
              index !== items.length - 1 && styles.settingItemBorder,
            ]}
            onPress={item.onPress}>
            <View style={styles.settingIcon}>
              <Text variant="h5">{item.icon}</Text>
            </View>
            <View style={styles.settingContent}>
              <Text variant="subtitle1">{item.title}</Text>
              {item.subtitle && (
                <Text variant="caption" color="secondary" style={styles.settingSubtitle}>
                  {item.subtitle}
                </Text>
              )}
            </View>
            <Text variant="body1" color="secondary">

            </Text>
          </TouchableOpacity>
        ))}
      </Card>
    </View>
  );

  return (
    <Screen padding={false}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* User Profile */}
        <Card variant="elevated" padding="lg" style={styles.profileCard}>
          <View style={styles.profile}>
            <View style={styles.avatar}>
              <Text variant="h3">👤</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text variant="h5">사용자</Text>
              <Text variant="body2" color="secondary">
                로그인이 필요합니다
              </Text>
            </View>
          </View>
        </Card>

        {/* Blog Settings */}
        {renderSettingSection('블로그 연동', blogSettings)}

        {/* AI Settings */}
        {renderSettingSection('AI 설정', aiSettings)}

        {/* App Settings */}
        {renderSettingSection('앱 설정', appSettings)}

        {/* Account Settings */}
        {renderSettingSection('계정 및 정보', accountSettings)}

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => console.log('Logout')}>
            <Text variant="subtitle1" style={styles.logoutText}>
              로그아웃
            </Text>
          </TouchableOpacity>
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
  profileCard: {
    marginBottom: Spacing.lg,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.base,
  },
  profileInfo: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.base,
  },
  settingContent: {
    flex: 1,
  },
  settingSubtitle: {
    marginTop: 2,
  },
  logoutContainer: {
    marginTop: Spacing.base,
    marginBottom: Spacing.xl,
  },
  logoutButton: {
    padding: Spacing.base,
    backgroundColor: Colors.common.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error[500],
    alignItems: 'center',
  },
  logoutText: {
    color: Colors.error[500],
  },
});
