/**
 * Publish Settings Screen
 * 발행 설정 화면
 */

import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Screen, Text, Card, Button} from '@components/common';
import {Colors, Spacing, BorderRadius} from '@constants';
import {RootStackParamList} from '@types/navigation';
import {PublishService} from '@services/PublishService';
import {PublishSettings, PublishVisibility, PublishPlatform} from '@types/publish';
import {useBlogStore} from '@stores/blogStore';
import Clipboard from '@react-native-clipboard/clipboard';

type PublishSettingsRouteProp = RouteProp<RootStackParamList, 'PublishSettings'>;

export const PublishSettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<PublishSettingsRouteProp>();
  const {naverConnection} = useBlogStore();

  const {postId, title, content} = route.params;

  // 네이버 블로그만 사용
  const platform: PublishPlatform = 'naver';
  const [visibility, setVisibility] = useState<PublishVisibility>('public');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [allowComments, setAllowComments] = useState(true);
  const [allowShare, setAllowShare] = useState(true);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    const settings: PublishSettings = {
      platform,
      visibility,
      category: category.trim() || undefined,
      tags: tags.trim() ? tags.split(',').map(t => t.trim()) : undefined,
      allowComments,
      allowShare,
      scheduleDate,
    };

    const publishRequest = {
      postId,
      title,
      content,
      settings,
    };

    // 검증
    const validation = PublishService.validatePublish(publishRequest);

    if (!validation.isValid) {
      Alert.alert('검증 실패', validation.errors.join('\n'));
      return;
    }

    if (validation.warnings.length > 0) {
      Alert.alert('경고', validation.warnings.join('\n'), [
        {text: '취소', style: 'cancel'},
        {text: '계속', onPress: () => proceedPublish(publishRequest)},
      ]);
      return;
    }

    await proceedPublish(publishRequest);
  };

  const proceedPublish = async (publishRequest: any) => {
    setIsPublishing(true);

    try {
      const result = await PublishService.preparePublish(publishRequest);

      if (result.success) {
        if (scheduleDate) {
          Alert.alert(
            '예약 완료',
            `${scheduleDate.toLocaleString()}에 발행됩니다.`,
            [{text: '확인', onPress: () => navigation.goBack()}],
          );
        } else {
          Alert.alert('발행 완료', '글이 발행되었습니다!', [
            {text: '확인', onPress: () => navigation.goBack()},
          ]);
        }
      } else {
        // 네이버 블로그 수동 발행 안내
        if (result.error === 'naver_manual_required') {
          handleNaverManualPublish(publishRequest);
        } else {
          Alert.alert('발행 실패', result.error || '알 수 없는 오류');
        }
      }
    } catch (error) {
      console.error('Publish error:', error);
      Alert.alert('오류', '발행 중 오류가 발생했습니다.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleNaverManualPublish = (publishRequest: any) => {
    Alert.alert(
      '네이버 블로그 발행',
      '네이버 블로그는 공식 API로 글 작성을 지원하지 않습니다.\n\n다음 중 한 가지 방법을 선택해주세요:',
      [
        {
          text: '클립보드에 복사',
          onPress: () => {
            const clipboardText = PublishService.generateClipboardText(publishRequest);
            Clipboard.setString(clipboardText);
            Alert.alert(
              '복사 완료',
              '클립보드에 복사되었습니다.\n\n네이버 블로그 앱/웹에서 붙여넣기 하세요.',
            );
          },
        },
        {
          text: '네이버 블로그 열기',
          onPress: () => {
            // TODO: 네이버 블로그 앱/웹 열기
            Alert.alert('준비 중', '네이버 블로그 연동은 추후 업데이트 예정입니다.');
          },
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ],
    );
  };

  const handleSchedule = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setScheduleDate(selectedDate);
    }
  };

  return (
    <Screen padding={false}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* 공개 설정 */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text variant="h6" style={styles.sectionTitle}>
            공개 설정
          </Text>
          <View style={styles.visibilityButtons}>
            {(['public', 'private', 'protected'] as PublishVisibility[]).map(v => (
              <TouchableOpacity
                key={v}
                style={[
                  styles.visibilityButton,
                  visibility === v && styles.visibilityButtonActive,
                ]}
                onPress={() => setVisibility(v)}>
                <Text
                  variant="body2"
                  style={[
                    styles.visibilityButtonText,
                    visibility === v && styles.visibilityButtonTextActive,
                  ]}>
                  {v === 'public'
                    ? '전체 공개'
                    : v === 'private'
                    ? '비공개'
                    : '이웃 공개'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* 카테고리 & 태그 */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text variant="h6" style={styles.sectionTitle}>
            카테고리 & 태그
          </Text>

          <View style={styles.inputGroup}>
            <Text variant="subtitle2" style={styles.inputLabel}>
              카테고리
            </Text>
            <TextInput
              style={styles.input}
              placeholder="예: 여행, 일상, 개발"
              placeholderTextColor={Colors.grey[400]}
              value={category}
              onChangeText={setCategory}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text variant="subtitle2" style={styles.inputLabel}>
              태그 (쉼표로 구분)
            </Text>
            <TextInput
              style={styles.input}
              placeholder="예: 제주도, 맛집, 여행"
              placeholderTextColor={Colors.grey[400]}
              value={tags}
              onChangeText={setTags}
              multiline
              numberOfLines={2}
            />
            <Text variant="caption" color="secondary">
              최대 10개 권장
            </Text>
          </View>
        </Card>

        {/* 추가 옵션 */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text variant="h6" style={styles.sectionTitle}>
            추가 옵션
          </Text>

          <View style={styles.optionRow}>
            <Text variant="body2">댓글 허용</Text>
            <Switch
              value={allowComments}
              onValueChange={setAllowComments}
              trackColor={{false: Colors.grey[300], true: Colors.primary.light}}
              thumbColor={allowComments ? Colors.primary.main : Colors.grey[500]}
            />
          </View>

          <View style={styles.optionRow}>
            <Text variant="body2">공유 허용</Text>
            <Switch
              value={allowShare}
              onValueChange={setAllowShare}
              trackColor={{false: Colors.grey[300], true: Colors.primary.light}}
              thumbColor={allowShare ? Colors.primary.main : Colors.grey[500]}
            />
          </View>
        </Card>

        {/* 예약 발행 */}
        <Card variant="elevated" padding="lg" style={styles.card}>
          <Text variant="h6" style={styles.sectionTitle}>
            예약 발행
          </Text>

          {scheduleDate ? (
            <View style={styles.scheduledInfo}>
              <Text variant="body2">
                예약 시간: {scheduleDate.toLocaleString('ko-KR')}
              </Text>
              <TouchableOpacity onPress={() => setScheduleDate(undefined)}>
                <Text variant="caption" color="error">
                  취소
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Button
              title="예약 시간 설정"
              variant="outline"
              size="medium"
              onPress={handleSchedule}
            />
          )}

          {showDatePicker && (
            <DateTimePicker
              value={scheduleDate || new Date()}
              mode="datetime"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
        </Card>

        {/* 발행 버튼 */}
        <View style={styles.publishButtons}>
          <Button
            title={scheduleDate ? '예약 발행' : '지금 발행'}
            variant="primary"
            size="large"
            fullWidth
            loading={isPublishing}
            onPress={handlePublish}
            disabled={!naverConnection.isConnected || isPublishing}
          />

          {!naverConnection.isConnected && (
            <Text variant="caption" color="error" align="center" style={styles.errorText}>
              먼저 블로그를 연동해주세요
            </Text>
          )}
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
    paddingBottom: Spacing['2xl'],
  },
  card: {
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    marginBottom: Spacing.base,
  },
  visibilityButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  visibilityButton: {
    flex: 1,
    padding: Spacing.base,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.grey[300],
    alignItems: 'center',
  },
  visibilityButtonActive: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary[50],
  },
  visibilityButtonText: {
    color: Colors.grey[700],
  },
  visibilityButtonTextActive: {
    color: Colors.primary.main,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: Spacing.base,
  },
  inputLabel: {
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.grey[300],
    borderRadius: BorderRadius.sm,
    padding: Spacing.base,
    fontSize: 14,
    color: Colors.grey[900],
    backgroundColor: Colors.common.white,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[100],
  },
  scheduledInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.sm,
  },
  publishButtons: {
    marginTop: Spacing.base,
  },
  errorText: {
    marginTop: Spacing.sm,
  },
});
