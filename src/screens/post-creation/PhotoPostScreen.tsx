/**
 * Photo Post Screen
 * 사진 기반 포스팅 화면
 */

import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary, launchCamera, Asset} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {Screen, Text, Card, Button} from '@components/common';
import {Colors, Spacing, BorderRadius} from '@constants';
import {
  ImageProcessor,
  ImageValidator,
  ImageInfo,
} from '@utils/imageProcessing';
import {OpenAIService} from '@services/OpenAIService';
import {useBlogStore} from '@stores/blogStore';
import {useAIStore} from '@stores/aiStore';

interface SelectedImage extends ImageInfo {
  id: string;
  analysis?: string;
}

export const PhotoPostScreen: React.FC = () => {
  const navigation = useNavigation();
  const {naverConnection} = useBlogStore();
  const {setGenerating, setProgress} = useAIStore();

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [generatedTitle, setGeneratedTitle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // 이미지 선택 핸들러
  const handleSelectFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 10,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert('오류', '이미지를 선택하는데 실패했습니다.');
        } else if (response.assets) {
          handleImagesSelected(response.assets);
        }
      },
    );
  };

  // 카메라로 촬영
  const handleTakePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        cameraType: 'back',
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          Alert.alert('오류', '사진 촬영에 실패했습니다.');
        } else if (response.assets) {
          handleImagesSelected(response.assets);
        }
      },
    );
  };

  // 이미지 선택 처리
  const handleImagesSelected = (assets: Asset[]) => {
    const validAssets = assets.filter(asset => {
      if (!asset.uri) return false;
      if (!ImageValidator.isSupportedFormat(asset.uri)) {
        Alert.alert('알림', '지원하지 않는 이미지 형식입니다.');
        return false;
      }
      return true;
    });

    const newImages: SelectedImage[] = validAssets.map((asset, index) => ({
      id: `${Date.now()}_${index}`,
      uri: asset.uri!,
      fileName: asset.fileName,
      fileSize: asset.fileSize,
      width: asset.width,
      height: asset.height,
      type: asset.type,
    }));

    // 최대 10개 제한
    const totalImages = [...selectedImages, ...newImages];
    if (totalImages.length > 10) {
      Alert.alert('알림', '최대 10개의 이미지만 선택할 수 있습니다.');
      setSelectedImages(totalImages.slice(0, 10));
    } else {
      setSelectedImages(totalImages);
    }
  };

  // 이미지 제거
  const handleRemoveImage = (id: string) => {
    setSelectedImages(prev => prev.filter(img => img.id !== id));
  };

  // 이미지 분석
  const handleAnalyzeImages = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('알림', '먼저 이미지를 선택해주세요.');
      return;
    }

    setIsAnalyzing(true);
    setProgress('이미지 분석 중...');

    try {
      // 각 이미지를 GPT-4 Vision으로 분석
      const analyzedImages: SelectedImage[] = [];

      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        setProgress(`이미지 ${i + 1}/${selectedImages.length} 분석 중...`);

        try {
          const result = await OpenAIService.analyzeImage(
            image.uri,
            '이 이미지를 자세히 분석해주세요. 주요 피사체, 배경, 분위기, 색감 등을 설명해주세요.',
          );

          analyzedImages.push({
            ...image,
            analysis: result.analysis,
          });
        } catch (error) {
          console.error('Failed to analyze image:', error);
          analyzedImages.push(image);
        }
      }

      setSelectedImages(analyzedImages);
      setProgress('이미지 분석 완료');
      Alert.alert('완료', '이미지 분석이 완료되었습니다!');
    } catch (error) {
      console.error('Failed to analyze images:', error);
      Alert.alert('오류', '이미지 분석에 실패했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 포스트 생성
  const handleGeneratePost = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('알림', '먼저 이미지를 선택해주세요.');
      return;
    }

    setIsGenerating(true);
    setGenerating(true);
    setProgress('AI가 포스트를 생성하는 중...');

    try {
      // 첫 번째 이미지로 포스트 생성
      const mainImage = selectedImages[0];

      // 사용자 스타일 가져오기 (있으면)
      let userStyle = '';
      if (naverConnection.isConnected) {
        // TODO: 실제로는 StyleAnalysisService에서 가져오기
        userStyle = '친근하고 공감 가는 스타일로 작성';
      }

      const result = await OpenAIService.generatePostFromImage(
        mainImage.uri,
        userStyle,
      );

      setGeneratedContent(result.content);
      setGeneratedTitle(result.title);
      setProgress('포스트 생성 완료!');

      Alert.alert(
        '완료',
        '사진 기반 포스트가 생성되었습니다!\n에디터에서 수정하실 수 있습니다.',
      );
    } catch (error) {
      console.error('Failed to generate post:', error);
      Alert.alert('오류', '포스트 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
      setGenerating(false);
    }
  };

  return (
    <Screen padding={false}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h4">사진으로 포스팅 📸</Text>
          <Text variant="body2" color="secondary">
            사진을 선택하면 AI가 자동으로{'\n'}
            스토리텔링을 만들어드립니다
          </Text>
        </View>

        {/* Image Selection Buttons */}
        <View style={styles.selectionButtons}>
          <Button
            title="갤러리에서 선택"
            variant="primary"
            size="medium"
            onPress={handleSelectFromGallery}
            style={styles.selectionButton}
          />
          <Button
            title="사진 촬영"
            variant="outline"
            size="medium"
            onPress={handleTakePhoto}
            style={styles.selectionButton}
          />
        </View>

        {/* Selected Images Grid */}
        {selectedImages.length > 0 && (
          <Card variant="elevated" padding="base" style={styles.card}>
            <View style={styles.cardHeader}>
              <Text variant="subtitle1">
                선택된 이미지 ({selectedImages.length}/10)
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedImages([])}
                disabled={isAnalyzing || isGenerating}>
                <Text variant="caption" color="error">
                  모두 제거
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.imageGrid}>
              {selectedImages.map(image => (
                <View key={image.id} style={styles.imageItem}>
                  <Image source={{uri: image.uri}} style={styles.thumbnail} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveImage(image.id)}
                    disabled={isAnalyzing || isGenerating}>
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                  {image.fileSize && (
                    <Text variant="caption" style={styles.imageSize}>
                      {ImageProcessor.formatFileSize(image.fileSize)}
                    </Text>
                  )}
                </View>
              ))}
            </View>

            {/* Layout Suggestion */}
            {selectedImages.length > 1 && (
              <View style={styles.suggestion}>
                <Text variant="caption" color="secondary">
                  💡 {selectedImages.length}개 이미지:{' '}
                  {
                    ImageProcessor.suggestGridLayout(selectedImages.length)
                      .layout
                  }{' '}
                  레이아웃 추천
                </Text>
              </View>
            )}
          </Card>
        )}

        {/* Analysis Button */}
        {selectedImages.length > 0 && !generatedContent && (
          <Button
            title={isAnalyzing ? '분석 중...' : 'AI 이미지 분석'}
            variant="outline"
            size="medium"
            onPress={handleAnalyzeImages}
            disabled={isAnalyzing || isGenerating}
            fullWidth
            style={styles.actionButton}
          />
        )}

        {/* Image Analysis Results */}
        {selectedImages.some(img => img.analysis) && (
          <Card variant="outlined" padding="base" style={styles.card}>
            <Text variant="subtitle1" style={styles.sectionTitle}>
              📊 이미지 분석 결과
            </Text>
            {selectedImages.map((image, index) =>
              image.analysis ? (
                <View key={image.id} style={styles.analysisItem}>
                  <Text variant="caption" color="secondary">
                    이미지 {index + 1}
                  </Text>
                  <Text variant="body2" style={styles.analysisText}>
                    {image.analysis}
                  </Text>
                </View>
              ) : null,
            )}
          </Card>
        )}

        {/* Generate Post Button */}
        {selectedImages.length > 0 && (
          <Button
            title={isGenerating ? '생성 중...' : '📝 포스트 생성하기'}
            variant="primary"
            size="large"
            onPress={handleGeneratePost}
            disabled={isAnalyzing || isGenerating}
            fullWidth
            style={styles.generateButton}
          />
        )}

        {/* Loading Indicator */}
        {(isAnalyzing || isGenerating) && (
          <Card variant="elevated" padding="lg" style={styles.loadingCard}>
            <ActivityIndicator size="large" color={Colors.primary.main} />
            <Text
              variant="body2"
              color="secondary"
              align="center"
              style={styles.loadingText}>
              {isAnalyzing
                ? '이미지를 분석하고 있습니다...'
                : 'AI가 포스트를 작성하고 있습니다...'}
            </Text>
          </Card>
        )}

        {/* Generated Content Preview */}
        {generatedContent && (
          <Card variant="elevated" padding="lg" style={styles.card}>
            <Text variant="h5" style={styles.sectionTitle}>
              ✨ 생성된 포스트
            </Text>

            {generatedTitle && (
              <View style={styles.generatedTitle}>
                <Text variant="caption" color="secondary">
                  제목
                </Text>
                <Text variant="h6">{generatedTitle}</Text>
              </View>
            )}

            <View style={styles.generatedContent}>
              <Text variant="caption" color="secondary">
                본문
              </Text>
              <Text variant="body2" style={styles.contentText}>
                {generatedContent}
              </Text>
            </View>

            <View style={styles.editButtons}>
              <Button
                title="에디터에서 수정"
                variant="primary"
                size="medium"
                onPress={() => {
                  // @ts-ignore
                  navigation.navigate('PostEditor', {
                    title: generatedTitle,
                    content: generatedContent,
                  });
                }}
                style={styles.editButton}
              />
              <Button
                title="다시 생성"
                variant="outline"
                size="medium"
                onPress={handleGeneratePost}
                disabled={isGenerating}
                style={styles.editButton}
              />
            </View>
          </Card>
        )}

        {/* Tips */}
        {selectedImages.length === 0 && (
          <Card variant="outlined" padding="lg" style={styles.tipsCard}>
            <Text variant="subtitle1" style={styles.sectionTitle}>
              💡 팁
            </Text>
            <View style={styles.tipsList}>
              <Text variant="body2" style={styles.tipItem}>
                • 최대 10개의 이미지를 선택할 수 있습니다
              </Text>
              <Text variant="body2" style={styles.tipItem}>
                • AI가 이미지를 분석하여 자동으로 설명을 작성합니다
              </Text>
              <Text variant="body2" style={styles.tipItem}>
                • 여러 이미지를 선택하면 스토리텔링이 더 풍부해집니다
              </Text>
              <Text variant="body2" style={styles.tipItem}>
                • 고해상도 이미지일수록 분석이 정확합니다
              </Text>
            </View>
          </Card>
        )}
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
  header: {
    marginBottom: Spacing.lg,
  },
  selectionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  selectionButton: {
    flex: 1,
  },
  card: {
    marginBottom: Spacing.base,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  imageItem: {
    width: '30%',
    aspectRatio: 1,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.error.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: Colors.common.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageSize: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: Colors.common.white,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    fontSize: 10,
  },
  suggestion: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.grey[50],
    borderRadius: BorderRadius.sm,
  },
  actionButton: {
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    marginBottom: Spacing.base,
  },
  analysisItem: {
    marginBottom: Spacing.base,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  analysisText: {
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  generateButton: {
    marginBottom: Spacing.base,
  },
  loadingCard: {
    marginBottom: Spacing.base,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.base,
  },
  generatedTitle: {
    marginBottom: Spacing.base,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  generatedContent: {
    marginBottom: Spacing.base,
  },
  contentText: {
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  editButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.base,
  },
  editButton: {
    flex: 1,
  },
  tipsCard: {
    marginBottom: Spacing.xl,
  },
  tipsList: {
    gap: Spacing.sm,
  },
  tipItem: {
    lineHeight: 20,
  },
});
