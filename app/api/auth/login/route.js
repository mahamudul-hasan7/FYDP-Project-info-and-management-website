import { NextResponse } from 'next/server';
import {
  findUserByCredentials,
  setSessionCookie,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts
} from '../../../../lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { identifier, password, rememberMe = true } = body || {};

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide both Student ID / Username and Password.' },
        { status: 400 }
      );
    }

    const rateLimitKey = (identifier || '').trim().toLowerCase();
    const rateCheck = checkRateLimit(rateLimitKey);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: rateCheck.message || 'Too many failed attempts. Please wait 5 minutes.'
        },
        { status: 429 }
      );
    }

    const user = await findUserByCredentials(identifier, password);
    if (!user) {
      recordFailedAttempt(rateLimitKey);
      const updatedCheck = checkRateLimit(rateLimitKey);
      const remainingMsg =
        updatedCheck.remaining > 0
          ? ` (${updatedCheck.remaining} attempts remaining before temporary lockout)`
          : ' (Account locked for 5 minutes)';

      return NextResponse.json(
        {
          success: false,
          message: `Invalid credentials. Please verify your Student ID and Password.${remainingMsg}`
        },
        { status: 401 }
      );
    }

    // Success: clear rate limit counter
    clearFailedAttempts(rateLimitKey);

    // Set secure HTTP-only session cookie
    await setSessionCookie(user, rememberMe);

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: {
        slug: user.slug,
        name: user.name,
        username: user.username,
        role: user.role,
        roleTitle: user.roleTitle,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server authentication error.' },
      { status: 500 }
    );
  }
}

