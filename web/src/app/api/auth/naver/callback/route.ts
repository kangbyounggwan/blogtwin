import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json();

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing code or state' },
        { status: 400 }
      );
    }

    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`;

    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${code}&state=${state}`,
      { method: 'GET' }
    );

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token from Naver');
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(tokenData.error_description || 'Token exchange failed');
    }

    const accessToken = tokenData.access_token;

    // Get user profile from Naver
    const profileResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to get user profile from Naver');
    }

    const profileData = await profileResponse.json();

    if (profileData.resultcode !== '00') {
      throw new Error('Failed to get user profile');
    }

    const naverUser = profileData.response;

    // Create or update user in Supabase
    // Note: You'll need to implement your own user creation logic here
    // For now, returning mock data

    return NextResponse.json({
      user: {
        id: naverUser.id,
        email: naverUser.email,
        nickname: naverUser.nickname,
        profile_image: naverUser.profile_image,
      },
      session: {
        access_token: accessToken,
        refresh_token: tokenData.refresh_token,
      },
    });
  } catch (error: any) {
    console.error('Naver OAuth callback error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
