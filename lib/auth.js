import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'team_random_session';
const SERVER_SECRET = process.env.AUTH_SECRET || 'team_random_fydp_secret_key_2026_super_secure_salt';

// File path for persistent credentials store
const AUTH_FILE_PATH = path.join(process.cwd(), 'data', '.auth_store.json');

// Rate limiting in-memory map
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export function checkRateLimit(key) {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record) return { allowed: true, remaining: MAX_ATTEMPTS };

  if (now > record.resetTime) {
    loginAttempts.delete(key);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const waitSeconds = Math.ceil((record.resetTime - now) / 1000);
    return {
      allowed: false,
      waitSeconds,
      message: `Too many failed attempts. Security lockout active for ${waitSeconds}s.`
    };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - record.count };
}

export function recordFailedAttempt(key) {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record || now > record.resetTime) {
    loginAttempts.set(key, { count: 1, resetTime: now + LOCKOUT_WINDOW_MS });
  } else {
    record.count += 1;
  }
}

export function clearFailedAttempts(key) {
  loginAttempts.delete(key);
}

// Hash password with SHA-256 and server secret
export function hashPassword(password) {
  return crypto
    .createHmac('sha256', SERVER_SECRET)
    .update(password)
    .digest('hex');
}

const DEFAULT_USERS = [
  {
    slug: 'system-admin',
    username: 'admin',
    aliases: ['superadmin', 'admin@teamrandom.uiu.ac.bd', 'root', '0000000000'],
    name: 'System Administrator',
    role: 'ADMIN',
    roleTitle: 'Project Super Admin',
    email: 'admin@teamrandom.uiu.ac.bd',
    passwordHash: hashPassword('admin123')
  },
  {
    slug: 'md-mahamudul-hasan',
    username: '0112330182',
    aliases: ['mahamudul', 'mhasan2330182@bscse.uiu.ac.bd'],
    name: 'Md Mahamudul Hasan',
    role: 'ADMIN',
    roleTitle: 'Technical Lead & Admin',
    email: 'mhasan2330182@bscse.uiu.ac.bd',
    passwordHash: hashPassword('mahamudul123')
  },
  {
    slug: 'md-sabbir-hossen',
    username: '0112331026',
    aliases: ['sabbir', 'mhossen2331026@bscse.uiu.ac.bd'],
    name: 'Md Sabbir Hossen',
    role: 'MEMBER',
    roleTitle: 'Presenter',
    email: 'mhossen2331026@bscse.uiu.ac.bd',
    passwordHash: hashPassword('sabbir123')
  },
  {
    slug: 'tania-islam',
    username: '0112331025',
    aliases: ['tania', 'tislam2331025@bscse.uiu.ac.bd'],
    name: 'Tania Islam',
    role: 'MEMBER',
    roleTitle: 'Lead Researcher',
    email: 'tislam2331025@bscse.uiu.ac.bd',
    passwordHash: hashPassword('tania123')
  },
  {
    slug: 'maria-tasnim',
    username: '0112331019',
    aliases: ['maria', 'mtasnim2331019@bscse.uiu.ac.bd'],
    name: 'Maria Tasnim',
    role: 'MEMBER',
    roleTitle: 'Research Assistant',
    email: 'mtasnim2331019@bscse.uiu.ac.bd',
    passwordHash: hashPassword('maria123')
  },
  {
    slug: 'rehnuma-khan',
    username: '0112310260',
    aliases: ['rehnuma', 'member05', 'member5', 'member-five', 'rkhan2310260@bscse.uiu.ac.bd'],
    name: 'Rehnuma Khan',
    role: 'MEMBER',
    roleTitle: 'Presenter',
    email: 'rkhan2310260@bscse.uiu.ac.bd',
    passwordHash: hashPassword('rehnuma123')
  }
];

export function getUsersStore() {
  if (globalThis.__AUTH_USERS_STORE__ && Array.isArray(globalThis.__AUTH_USERS_STORE__)) {
    return globalThis.__AUTH_USERS_STORE__;
  }

  try {
    if (fs.existsSync(AUTH_FILE_PATH)) {
      const content = fs.readFileSync(AUTH_FILE_PATH, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalThis.__AUTH_USERS_STORE__ = parsed;
        return parsed;
      }
    }
  } catch (err) {
    // If file read fails, continue to default
  }

  globalThis.__AUTH_USERS_STORE__ = [...DEFAULT_USERS];
  saveUsersStore(globalThis.__AUTH_USERS_STORE__);
  return globalThis.__AUTH_USERS_STORE__;
}

export function saveUsersStore(users) {
  globalThis.__AUTH_USERS_STORE__ = users;
  try {
    const dir = path.dirname(AUTH_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(AUTH_FILE_PATH, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    // Fallback for restricted serverless environments
    try {
      const tmpPath = path.join('/tmp', '.auth_store.json');
      fs.writeFileSync(tmpPath, JSON.stringify(users, null, 2), 'utf8');
    } catch {}
  }
}

// User credentials getter for external imports
export const USERS = new Proxy([], {
  get(target, prop) {
    const store = getUsersStore();
    return store[prop];
  }
});

// Create secure signed session token
export function createSessionToken(user, rememberMe = true) {
  const durationMs = rememberMe ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 12; // 7 days vs 12 hrs
  const payload = {
    slug: user.slug,
    name: user.name,
    username: user.username,
    role: user.role,
    roleTitle: user.roleTitle,
    email: user.email,
    exp: Date.now() + durationMs
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SERVER_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

// Verify signed session token
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SERVER_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  if (signature !== expectedSig) {
    return null; // Tampered token
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.exp < Date.now()) {
      return null; // Expired session
    }
    return payload;
  } catch {
    return null;
  }
}

// Get current session from server cookies
export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) return null;
  return verifySessionToken(sessionCookie.value);
}

// Set session cookie
export async function setSessionCookie(user, rememberMe = true) {
  const token = createSessionToken(user, rememberMe);
  const cookieStore = await cookies();
  const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 12;

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge
  });
  return token;
}

// Clear session cookie completely
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0)
  });
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Find user by username, email, or alias and verify password
export function findUserByCredentials(loginIdentifier, password) {
  const cleanId = (loginIdentifier || '').trim().toLowerCase();
  const hash = hashPassword(password || '');
  const users = getUsersStore();

  const user = users.find(
    (u) =>
      (u.username.toLowerCase() === cleanId ||
        u.email.toLowerCase() === cleanId ||
        u.aliases?.some((a) => a.toLowerCase() === cleanId)) &&
      (u.passwordHash === hash || (u.backupHash && u.backupHash === hash))
  );

  return user || null;
}

// Change password
export function changePassword(slug, oldPassword, newPassword, session) {
  if (!session) {
    throw new Error('Unauthorized');
  }

  const isAdmin = session.role === 'ADMIN';
  const isSelf = session.slug === slug;

  if (!isAdmin && !isSelf) {
    throw new Error('Forbidden: You can only change your own password.');
  }

  const users = getUsersStore();
  const userIndex = users.findIndex((u) => u.slug === slug);
  if (userIndex === -1) {
    throw new Error('User not found.');
  }

  // If not admin, require and verify current password
  if (!isAdmin) {
    if (!oldPassword) {
      throw new Error('Current password is required.');
    }
    const currentHash = users[userIndex].passwordHash;
    const backupHash = users[userIndex].backupHash;
    const inputHash = hashPassword(oldPassword);
    if (currentHash !== inputHash && (!backupHash || backupHash !== inputHash)) {
      throw new Error('Current password does not match.');
    }
  } else if (isSelf && oldPassword) {
    // If admin is updating their own password and provided old password, verify it
    const currentHash = users[userIndex].passwordHash;
    const backupHash = users[userIndex].backupHash;
    const inputHash = hashPassword(oldPassword);
    if (currentHash !== inputHash && (!backupHash || backupHash !== inputHash)) {
      throw new Error('Current password does not match.');
    }
  }

  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  users[userIndex].passwordHash = hashPassword(newPassword);
  delete users[userIndex].backupHash; // Remove any transition fallback hash
  saveUsersStore(users);
  return true;
}

