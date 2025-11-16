/**
 * Naver OAuth Service
 * 네이버 로그인 및 블로그 API 인증 처리
 */

import InAppBrowser from 'react-native-inappbrowser-reborn';
import {Linking} from 'react-native';
import {SecureStorage} from '@/utils/secureStorage';
import {
  NaverOAuthConfig,
  NaverTokenResponse,
  NaverTokenData,
  NaverProfileResponse,
  NaverProfile,
  NaverOAuthError,
} from '@/types/naver';
import {Config, StorageKeys} from '@/constants';

export class NaverOAuthService {
  private static readonly AUTH_URL = 'https://nid.naver.com/oauth2.0/authorize';
  private static readonly TOKEN_URL = 'https://nid.naver.com/oauth2.0/token';
  private static readonly PROFILE_URL = 'https://openapi.naver.com/v1/nid/me';

  /**
   * 랜덤 State 생성 (CSRF 방지)
   */
  private static generateState(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * OAuth 로그인 시작
   */
  static async login(): Promise<NaverTokenData> {
    try {
      const state = this.generateState();
      await SecureStorage.setItem(StorageKeys.NAVER_OAUTH_STATE, state);

      // OAuth URL 생성
      const authUrl = this.buildAuthUrl(state);

      // InAppBrowser로 로그인 페이지 열기
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openAuth(authUrl, Config.NAVER_REDIRECT_URI, {
          ephemeralWebSession: false,
          showTitle: true,
          enableUrlBarHiding: true,
          enableDefaultShare: false,
        });

        if (result.type === 'success' && result.url) {
          return await this.handleAuthCallback(result.url);
        } else {
          throw new Error('OAuth authentication cancelled or failed');
        }
      } else {
        // Fallback to external browser
        await Linking.openURL(authUrl);
        throw new Error('InAppBrowser not available. Please use external browser.');
      }
    } catch (error) {
      console.error('Naver OAuth login error:', error);
      throw error;
    }
  }

  /**
   * OAuth URL 생성
   */
  private static buildAuthUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: Config.NAVER_CLIENT_ID,
      redirect_uri: Config.NAVER_REDIRECT_URI,
      state: state,
    });

    return `${this.AUTH_URL}?${params.toString()}`;
  }

  /**
   * OAuth 콜백 처리
   */
  private static async handleAuthCallback(url: string): Promise<NaverTokenData> {
    try {
      // URL에서 파라미터 추출
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      // 에러 체크
      if (error) {
        const errorDesc = urlParams.get('error_description') || 'Unknown error';
        throw new Error(`OAuth Error: ${error} - ${errorDesc}`);
      }

      if (!code || !state) {
        throw new Error('Missing authorization code or state');
      }

      // State 검증 (CSRF 방지)
      const savedState = await SecureStorage.getItem(StorageKeys.NAVER_OAUTH_STATE);
      if (state !== savedState) {
        throw new Error('Invalid state parameter. Possible CSRF attack.');
      }

      // 토큰 교환
      const tokenData = await this.exchangeCodeForToken(code, state);

      // 토큰 저장
      await this.saveTokenData(tokenData);

      // State 삭제
      await SecureStorage.removeItem(StorageKeys.NAVER_OAUTH_STATE);

      return tokenData;
    } catch (error) {
      console.error('OAuth callback handling error:', error);
      throw error;
    }
  }

  /**
   * 인증 코드를 토큰으로 교환
   */
  private static async exchangeCodeForToken(
    code: string,
    state: string,
  ): Promise<NaverTokenData> {
    try {
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: Config.NAVER_CLIENT_ID,
        client_secret: Config.NAVER_CLIENT_SECRET,
        code: code,
        state: state,
      });

      const response = await fetch(`${this.TOKEN_URL}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = await response.json();

      if (data.error) {
        const error = data as NaverOAuthError;
        throw new Error(`Token exchange failed: ${error.error_description}`);
      }

      const tokenResponse = data as NaverTokenResponse;

      return {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: Date.now() + tokenResponse.expires_in * 1000,
      };
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  }

  /**
   * 토큰 데이터 저장
   */
  private static async saveTokenData(tokenData: NaverTokenData): Promise<void> {
    await SecureStorage.setObject(StorageKeys.NAVER_TOKEN, tokenData);
  }

  /**
   * 저장된 토큰 조회
   */
  static async getTokenData(): Promise<NaverTokenData | null> {
    return await SecureStorage.getObject<NaverTokenData>(StorageKeys.NAVER_TOKEN);
  }

  /**
   * 토큰 갱신
   */
  static async refreshToken(): Promise<NaverTokenData> {
    try {
      const tokenData = await this.getTokenData();
      if (!tokenData?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: Config.NAVER_CLIENT_ID,
        client_secret: Config.NAVER_CLIENT_SECRET,
        refresh_token: tokenData.refreshToken,
      });

      const response = await fetch(`${this.TOKEN_URL}?${params.toString()}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (data.error) {
        const error = data as NaverOAuthError;
        throw new Error(`Token refresh failed: ${error.error_description}`);
      }

      const tokenResponse = data as NaverTokenResponse;

      const newTokenData: NaverTokenData = {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token || tokenData.refreshToken,
        expiresAt: Date.now() + tokenResponse.expires_in * 1000,
      };

      await this.saveTokenData(newTokenData);

      return newTokenData;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * 토큰 유효성 검사
   */
  static async isTokenValid(): Promise<boolean> {
    const tokenData = await this.getTokenData();
    if (!tokenData) {
      return false;
    }

    // 만료 5분 전이면 갱신 필요
    const bufferTime = 5 * 60 * 1000; // 5 minutes
    return Date.now() < tokenData.expiresAt - bufferTime;
  }

  /**
   * 유효한 액세스 토큰 가져오기 (필요시 자동 갱신)
   */
  static async getValidAccessToken(): Promise<string> {
    const isValid = await this.isTokenValid();

    if (!isValid) {
      const newTokenData = await this.refreshToken();
      return newTokenData.accessToken;
    }

    const tokenData = await this.getTokenData();
    if (!tokenData) {
      throw new Error('No access token available');
    }

    return tokenData.accessToken;
  }

  /**
   * 네이버 프로필 조회
   */
  static async getProfile(): Promise<NaverProfile> {
    try {
      const accessToken = await this.getValidAccessToken();

      const response = await fetch(this.PROFILE_URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data: NaverProfileResponse = await response.json();

      if (data.resultcode !== '00') {
        throw new Error(`Profile fetch failed: ${data.message}`);
      }

      return data.response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * 로그아웃 (토큰 삭제)
   */
  static async logout(): Promise<void> {
    await SecureStorage.removeItem(StorageKeys.NAVER_TOKEN);
    await SecureStorage.removeItem(StorageKeys.NAVER_OAUTH_STATE);
  }

  /**
   * 딥링크 핸들러 (앱으로 돌아왔을 때)
   */
  static async handleDeepLink(url: string): Promise<NaverTokenData> {
    return await this.handleAuthCallback(url);
  }
}
