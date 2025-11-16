/**
 * Post Editor Screen
 * 리치 텍스트 에디터 화면 with AI 어시스턴트
 */

import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {
  RichEditor,
  RichToolbar,
  actions,
} from 'react-native-pell-rich-editor';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {Screen, Text, Button, Card} from '@components/common';
import {Colors, Spacing, BorderRadius, Typography} from '@constants';
import {RootStackParamList} from '@types/navigation';
import {AIAssistantService} from '@services/AIAssistantService';
import {PostService} from '@services/PostService';
import {useBlogStore} from '@stores/blogStore';

type PostEditorRouteProp = RouteProp<RootStackParamList, 'PostEditor'>;

interface AIAssistantAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}

export const PostEditorScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<PostEditorRouteProp>();
  const {naverConnection} = useBlogStore();

  const richText = useRef<RichEditor>(null);

  const [title, setTitle] = useState(route.params?.title || '');
  const [content, setContent] = useState(route.params?.content || '');
  const [selectedText, setSelectedText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string>('');

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (title || content) {
        handleAutoSave();
      }
    }, 30000); // 30초마다

    return () => clearInterval(autoSaveInterval);
  }, [title, content]);

  // 자동 저장
  const handleAutoSave = async () => {
    if (!title && !content) return;

    setIsSaving(true);
    try {
      // TODO: PostService를 사용하여 초안 저장
      // const postId = route.params?.postId;
      // if (postId) {
      //   await PostService.updatePost(postId, { title, content });
      // } else {
      //   await PostService.createPost(userId, { title, content, status: 'draft' });
      // }

      setLastSaved(new Date());
      console.log('Auto-saved at', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 수동 저장
  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return;
    }

    if (!content.trim() || content === '<p></p>') {
      Alert.alert('알림', '내용을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      await handleAutoSave();
      Alert.alert('완료', '저장되었습니다!');
    } catch (error) {
      Alert.alert('오류', '저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 발행
  const handlePublish = () => {
    if (!title.trim() || !content.trim() || content === '<p></p>') {
      Alert.alert('알림', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    // 발행 설정 화면으로 이동
    // @ts-ignore
    navigation.navigate('PublishSettings', {
      postId: route.params?.postId || `temp_${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
    });
  };

  // AI 어시스턴트 액션들
  const aiActions: AIAssistantAction[] = [
    {
      id: 'polish',
      label: '문장 다듬기',
      icon: '✨',
      action: handlePolishSentence,
    },
    {
      id: 'spell',
      label: '맞춤법 검사',
      icon: '📝',
      action: handleSpellCheck,
    },
    {
      id: 'improve',
      label: '표현 개선',
      icon: '🎨',
      action: handleImproveExpression,
    },
    {
      id: 'expand',
      label: '내용 확장',
      icon: '📄',
      action: handleExpandContent,
    },
    {
      id: 'tone',
      label: '톤 조정',
      icon: '🎭',
      action: handleAdjustTone,
    },
  ];

  // 문장 다듬기
  async function handlePolishSentence() {
    if (!selectedText) {
      Alert.alert('알림', '다듬을 문장을 선택해주세요.');
      return;
    }

    setAiLoading(true);
    try {
      const result = await AIAssistantService.polishSentence(selectedText);
      setAiResult(result.polishedText);
      Alert.alert(
        '문장 다듬기 완료',
        `원문: ${result.originalText}\n\n수정: ${result.polishedText}\n\n변경사항:\n${result.changes.join('\n')}`,
        [
          {text: '취소', style: 'cancel'},
          {
            text: '적용',
            onPress: () => {
              // 선택된 텍스트를 다듬어진 텍스트로 교체
              const newContent = content.replace(selectedText, result.polishedText);
              setContent(newContent);
              richText.current?.setContentHTML(newContent);
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert('오류', '문장 다듬기에 실패했습니다.');
    } finally {
      setAiLoading(false);
      setShowAIModal(false);
    }
  }

  // 맞춤법 검사
  async function handleSpellCheck() {
    const textToCheck = selectedText || content.replace(/<[^>]*>/g, '');

    if (!textToCheck) {
      Alert.alert('알림', '검사할 내용이 없습니다.');
      return;
    }

    setAiLoading(true);
    try {
      const result = await AIAssistantService.checkSpelling(textToCheck);

      if (!result.hasErrors) {
        Alert.alert('맞춤법 검사', '오류가 발견되지 않았습니다! 👍');
        return;
      }

      const corrections = result.corrections
        .map(c => `• ${c.original} → ${c.corrected}\n  (${c.reason})`)
        .join('\n\n');

      Alert.alert(
        '맞춤법 검사 결과',
        `발견된 오류:\n\n${corrections}`,
        [
          {text: '취소', style: 'cancel'},
          {
            text: '수정 적용',
            onPress: () => {
              const newContent = content.replace(
                textToCheck,
                result.correctedText,
              );
              setContent(newContent);
              richText.current?.setContentHTML(newContent);
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert('오류', '맞춤법 검사에 실패했습니다.');
    } finally {
      setAiLoading(false);
      setShowAIModal(false);
    }
  }

  // 표현 개선
  async function handleImproveExpression() {
    if (!selectedText) {
      Alert.alert('알림', '개선할 텍스트를 선택해주세요.');
      return;
    }

    setAiLoading(true);
    try {
      const result = await AIAssistantService.improveExpression(selectedText);

      Alert.alert(
        '표현 개선',
        `원문: ${selectedText}\n\n개선: ${result.improved}\n\n개선사항:\n${result.improvements.join('\n')}`,
        [
          {text: '취소', style: 'cancel'},
          {
            text: '적용',
            onPress: () => {
              const newContent = content.replace(selectedText, result.improved);
              setContent(newContent);
              richText.current?.setContentHTML(newContent);
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert('오류', '표현 개선에 실패했습니다.');
    } finally {
      setAiLoading(false);
      setShowAIModal(false);
    }
  }

  // 내용 확장
  async function handleExpandContent() {
    if (!selectedText) {
      Alert.alert('알림', '확장할 내용을 선택해주세요.');
      return;
    }

    setAiLoading(true);
    try {
      const expanded = await AIAssistantService.expandContent(
        selectedText,
        'medium',
      );

      Alert.alert(
        '내용 확장',
        `원문: ${selectedText}\n\n확장: ${expanded}`,
        [
          {text: '취소', style: 'cancel'},
          {
            text: '적용',
            onPress: () => {
              const newContent = content.replace(selectedText, expanded);
              setContent(newContent);
              richText.current?.setContentHTML(newContent);
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert('오류', '내용 확장에 실패했습니다.');
    } finally {
      setAiLoading(false);
      setShowAIModal(false);
    }
  }

  // 톤 조정
  async function handleAdjustTone() {
    if (!selectedText) {
      Alert.alert('알림', '조정할 텍스트를 선택해주세요.');
      return;
    }

    Alert.alert('톤 선택', '어떤 톤으로 조정할까요?', [
      {
        text: '격식 있게',
        onPress: () => adjustToneWithType('formal'),
      },
      {
        text: '캐주얼하게',
        onPress: () => adjustToneWithType('casual'),
      },
      {
        text: '전문적으로',
        onPress: () => adjustToneWithType('professional'),
      },
      {
        text: '친근하게',
        onPress: () => adjustToneWithType('friendly'),
      },
      {text: '취소', style: 'cancel'},
    ]);
  }

  async function adjustToneWithType(
    tone: 'formal' | 'casual' | 'professional' | 'friendly',
  ) {
    setAiLoading(true);
    setShowAIModal(false);

    try {
      const adjusted = await AIAssistantService.adjustTone(selectedText, tone);

      Alert.alert(
        '톤 조정 완료',
        `원문: ${selectedText}\n\n조정: ${adjusted}`,
        [
          {text: '취소', style: 'cancel'},
          {
            text: '적용',
            onPress: () => {
              const newContent = content.replace(selectedText, adjusted);
              setContent(newContent);
              richText.current?.setContentHTML(newContent);
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert('오류', '톤 조정에 실패했습니다.');
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <Screen padding={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text variant="caption" color="secondary">
              {isSaving
                ? '저장 중...'
                : lastSaved
                ? `마지막 저장: ${lastSaved.toLocaleTimeString()}`
                : '저장 안됨'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleSave} disabled={isSaving}>
              <Text variant="subtitle2" style={styles.saveButton}>
                저장
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePublish}>
              <Text variant="subtitle2" style={styles.publishButton}>
                발행
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Title Input */}
        <View style={styles.titleContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="제목을 입력하세요"
            placeholderTextColor={Colors.grey[400]}
            value={title}
            onChangeText={setTitle}
            multiline
          />
        </View>

        {/* Rich Text Editor */}
        <ScrollView style={styles.editorContainer}>
          <RichEditor
            ref={richText}
            style={styles.editor}
            placeholder="내용을 입력하세요..."
            initialContentHTML={content}
            onChange={setContent}
            onCursorPosition={() => {
              // 선택된 텍스트 가져오기 (복잡하므로 간단히 처리)
            }}
          />
        </ScrollView>

        {/* Toolbar */}
        <RichToolbar
          editor={richText}
          actions={[
            actions.undo,
            actions.redo,
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.setStrikethrough,
            actions.heading1,
            actions.heading2,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.blockquote,
            actions.code,
          ]}
          iconTint={Colors.grey[700]}
          selectedIconTint={Colors.primary.main}
          style={styles.toolbar}
        />

        {/* AI Assistant Button */}
        <TouchableOpacity
          style={styles.aiButton}
          onPress={() => setShowAIModal(true)}>
          <Text style={styles.aiButtonText}>🤖 AI 어시스턴트</Text>
        </TouchableOpacity>

        {/* AI Assistant Modal */}
        <Modal
          visible={showAIModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAIModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text variant="h5">AI 어시스턴트</Text>
                <TouchableOpacity onPress={() => setShowAIModal(false)}>
                  <Text variant="h5" color="secondary">
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              {aiLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary.main} />
                  <Text variant="body2" color="secondary" style={styles.loadingText}>
                    AI가 작업 중입니다...
                  </Text>
                </View>
              ) : (
                <ScrollView style={styles.actionsContainer}>
                  {aiActions.map(action => (
                    <TouchableOpacity
                      key={action.id}
                      style={styles.actionItem}
                      onPress={action.action}>
                      <Text style={styles.actionIcon}>{action.icon}</Text>
                      <View style={styles.actionContent}>
                        <Text variant="subtitle1">{action.label}</Text>
                      </View>
                      <Text variant="h6" color="secondary">
                        →
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
    backgroundColor: Colors.common.white,
  },
  headerLeft: {},
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  saveButton: {
    color: Colors.primary.main,
  },
  publishButton: {
    color: Colors.success.main,
    fontWeight: 'bold',
  },
  titleContainer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
    backgroundColor: Colors.common.white,
  },
  titleInput: {
    fontSize: Typography.h4.fontSize,
    fontWeight: Typography.h4.fontWeight,
    color: Colors.grey[900],
    padding: 0,
    minHeight: 50,
  },
  editorContainer: {
    flex: 1,
    backgroundColor: Colors.common.white,
  },
  editor: {
    flex: 1,
    minHeight: 300,
    padding: Spacing.base,
  },
  toolbar: {
    backgroundColor: Colors.grey[50],
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
  },
  aiButton: {
    position: 'absolute',
    bottom: 80,
    right: Spacing.base,
    backgroundColor: Colors.primary.main,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    elevation: 4,
    shadowColor: Colors.common.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  aiButtonText: {
    color: Colors.common.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.common.white,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  loadingContainer: {
    padding: Spacing['2xl'],
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.base,
  },
  actionsContainer: {
    padding: Spacing.base,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.grey[50],
    marginBottom: Spacing.sm,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: Spacing.base,
  },
  actionContent: {
    flex: 1,
  },
});
