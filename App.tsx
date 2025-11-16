/**
 * BlogTwin - AI 블로그 작성 도우미
 * @format
 */

import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Platform} from 'react-native';
import {WebView} from 'react-native-webview';

// 웹앱 URL 설정
// 개발 환경: 로컬 서버
// 프로덕션: 배포된 URL로 변경
const WEB_APP_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:3002' // Android 에뮬레이터용
    : 'http://localhost:3002' // iOS 시뮬레이터용
  : 'https://your-deployed-url.vercel.app'; // 배포 URL로 변경

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <WebView
        source={{uri: WEB_APP_URL}}
        style={styles.webview}
        // 성능 최적화 옵션
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        // 네트워크 오류 처리
        onError={(syntheticEvent) => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        // 로딩 상태 처리
        onLoadStart={() => console.log('WebView loading...')}
        onLoadEnd={() => console.log('WebView loaded!')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
});

export default App;
