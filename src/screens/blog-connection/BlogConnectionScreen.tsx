/**
 * Blog Connection Screen
 * 블로그 연동 화면
 */

import React, {useState} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {Screen, Text, Card, Button} from '@components/common';
import {Colors, Spacing} from '@constants';
import {NaverOAuthService} from '@services/NaverOAuthService';
import {useBlogStore} from '@stores/blogStore';

export const BlogConnectionScreen: React.FC = () => {
  const {naverConnection, setNaverConnection, disconnectNaver, setLoading, setError} =
    useBlogStore();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleNaverConnect = async () => {
    try {
      setIsConnecting(true);
      setLoading(true);
      setError(null);

      // OAuth 로그인 시작
      const tokenData = await NaverOAuthService.login();

      // 프로필 정보 가져오기
      const profile = await NaverOAuthService.getProfile();

      // Store에 저장
      setNaverConnection(profile);

      Alert.alert(
        '연동 완료',
        `${profile.nickname}님의 네이버 블로그가 연동되었습니다.`,
        [{text: '확인'}],
      );
    } catch (error) {
      console.error('Naver connection error:', error);
      const errorMessage =
        error instanceof Error ? error.message : '네이버 블로그 연동에 실패했습니다.';
      setError(errorMessage);
      Alert.alert('연동 실패', errorMessage, [{text: '확인'}]);
    } finally {
      setIsConnecting(false);
      setLoading(false);
    }
  };

  const handleNaverDisconnect = async () => {
    Alert.alert(
      '연동 해제',
      '네이버 블로그 연동을 해제하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '해제',
          style: 'destructive',
          onPress: async () => {
            try {
              await NaverOAuthService.logout();
              disconnectNaver();
              Alert.alert('연동 해제 완료', '네이버 블로그 연동이 해제되었습니다.');
            } catch (error) {
              console.error('Disconnect error:', error);
              Alert.alert('오류', '연동 해제 중 오류가 발생했습니다.');
            }
          },
        },
      ],
    );
  };

  return (
    <Screen scroll padding>
      <View style={styles.container}>
        <Text variant="h3" style={styles.title}>
          블로그 연동
        </Text>
        <Text variant="body2" color="secondary" style={styles.subtitle}>
          네이버 블로그를 연동하여 AI가 글 작성 스타일을 학습합니다
        </Text>

        {/* Naver Blog Card */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <View style={styles.platformHeader}>
            <View style={styles.platformInfo}>
              <View style={[styles.platformIcon, {backgroundColor: Colors.naver}]}>
                <Text variant="h4" style={styles.platformIconText}>
                  N
                </Text>
              </View>
              <View>
                <Text variant="h5">네이버 블로그</Text>
                <Text variant="caption" color="secondary">
                  {naverConnection.isConnected
                    ? `연동됨 - ${naverConnection.profile?.nickname}`
                    : '연동되지 않음'}
                </Text>
              </View>
            </View>
            {naverConnection.isConnected && (
              <View style={styles.statusBadge}>
                <Text variant="caption" style={styles.statusText}>
                  ✓ 연동됨
                </Text>
              </View>
            )}
          </View>

          {naverConnection.isConnected && naverConnection.profile && (
            <View style={styles.profileInfo}>
              <Text variant="body2" color="secondary">
                닉네임: {naverConnection.profile.nickname}
              </Text>
              {naverConnection.profile.email && (
                <Text variant="body2" color="secondary">
                  이메일: {naverConnection.profile.email}
                </Text>
              )}
              {naverConnection.connectedAt && (
                <Text variant="caption" color="secondary" style={styles.connectedDate}>
                  연동일: {new Date(naverConnection.connectedAt).toLocaleDateString()}
                </Text>
              )}
            </View>
          )}

          <View style={styles.cardActions}>
            {!naverConnection.isConnected ? (
              <Button
                title="네이버로 로그인"
                variant="primary"
                size="medium"
                fullWidth
                loading={isConnecting}
                onPress={handleNaverConnect}
              />
            ) : (
              <>
                <Button
                  title="연동 해제"
                  variant="outline"
                  size="medium"
                  fullWidth
                  onPress={handleNaverDisconnect}
                  style={styles.disconnectButton}
                />
              </>
            )}
          </View>
        </Card>

        {/* Info Card */}
        <Card variant="outlined" padding="lg" style={styles.infoCard}>
          <Text variant="h6" style={styles.infoTitle}>
            📌 연동 안내
          </Text>
          <View style={styles.infoList}>
            <InfoItem text="최근 2개월간의 블로그 글을 분석합니다" />
            <InfoItem text="분석된 스타일로 AI가 새 글을 작성합니다" />
            <InfoItem text="연동 정보는 안전하게 암호화됩니다" />
            <InfoItem text="언제든지 연동을 해제할 수 있습니다" />
          </View>
        </Card>

        {/* Important Notice */}
        <Card variant="filled" padding="lg" style={styles.noticeCard}>
          <Text variant="subtitle1" style={styles.noticeTitle}>
            ⚠️ 중요 안내
          </Text>
          <Text variant="body2" color="secondary" style={styles.noticeText}>
            네이버 블로그는 공식 API로 글 작성을 지원하지 않습니다.{'\n'}
            현재는 OAuth 로그인 및 프로필 조회만 가능하며,{'\n'}
            글 작성 기능은 추후 업데이트 예정입니다.
          </Text>
        </Card>
      </View>
    </Screen>
  );
};

const InfoItem: React.FC<{text: string}> = ({text}) => (
  <View style={styles.infoItem}>
    <Text variant="body2" style={styles.infoBullet}>
      •
    </Text>
    <Text variant="body2" color="secondary" style={styles.infoText}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  card: {
    marginBottom: Spacing.base,
  },
  platformHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  platformIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  platformIconText: {
    color: Colors.common.white,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: Colors.success[50],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: Colors.success[700],
    fontSize: 11,
    fontWeight: '600',
  },
  profileInfo: {
    paddingVertical: Spacing.base,
    gap: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    marginBottom: Spacing.base,
  },
  connectedDate: {
    marginTop: Spacing.xs,
  },
  cardActions: {
    gap: Spacing.sm,
  },
  disconnectButton: {
    borderColor: Colors.error[500],
  },
  infoCard: {
    marginBottom: Spacing.base,
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
  infoText: {
    flex: 1,
    lineHeight: 20,
  },
  noticeCard: {
    backgroundColor: Colors.warning[50],
  },
  noticeTitle: {
    marginBottom: Spacing.sm,
    color: Colors.warning[900],
  },
  noticeText: {
    lineHeight: 20,
    color: Colors.warning[800],
  },
});
