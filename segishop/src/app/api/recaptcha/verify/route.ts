import { NextRequest, NextResponse } from 'next/server';

interface RecaptchaVerifyRequest {
  token: string;
  action: string;
}

interface GoogleRecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { token, action }: RecaptchaVerifyRequest = await request.json();

    // Validate required fields
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      );
    }

    // Get secret key
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (process.env.RECAPTCHA_SKIP_VERIFY === 'true') {
      return NextResponse.json({ success: true, valid: true, score: 0.9, action, minimumScore: 0.5 });
    }
    if (!secretKey) {
      console.error('reCAPTCHA secret key not configured');
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA not configured' },
        { status: 500 }
      );
    }

    // Verify token with Google
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const verifyData = new URLSearchParams({
      secret: secretKey,
      response: token,
      remoteip: request.ip || 'unknown'
    });

    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: verifyData,
    });

    const verifyResult: GoogleRecaptchaResponse = await verifyResponse.json();

    // Log the verification result for debugging
    console.log('reCAPTCHA verification result:', {
      success: verifyResult.success,
      score: verifyResult.score,
      action: verifyResult.action,
      expectedAction: action,
      hostname: verifyResult.hostname,
      errors: verifyResult['error-codes']
    });

    // Check if verification was successful
    if (!verifyResult.success) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'reCAPTCHA verification failed',
        errorCodes: verifyResult['error-codes'] || []
      });
    }

    // Check if action matches
    if (verifyResult.action !== action) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Action mismatch',
        expectedAction: action,
        actualAction: verifyResult.action
      });
    }

    // Check score threshold (0.5 is recommended minimum)
    const minimumScore = 0.5;
    const isValidScore = verifyResult.score >= minimumScore;

    return NextResponse.json({
      success: true,
      valid: isValidScore,
      score: verifyResult.score,
      action: verifyResult.action,
      minimumScore,
      hostname: verifyResult.hostname,
      timestamp: verifyResult.challenge_ts
    });

  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error during reCAPTCHA verification' 
      },
      { status: 500 }
    );
  }
}
