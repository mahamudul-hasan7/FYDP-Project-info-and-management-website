import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

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

// Bcrypt password hashing
export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

// Verify password against bcrypt or legacy HMAC hash
export function verifyPassword(inputPassword, storedHash) {
  if (!inputPassword || !storedHash) return false;
  try {
    if (
      storedHash.startsWith('$2a$') ||
      storedHash.startsWith('$2b$') ||
      storedHash.startsWith('$2y$')
    ) {
      return bcrypt.compareSync(inputPassword, storedHash);
    }
    // Backward compatibility check for transitioning accounts
    const legacyHash = crypto
      .createHmac('sha256', SERVER_SECRET)
      .update(inputPassword)
      .digest('hex');
    return legacyHash === storedHash;
  } catch (e) {
    return false;
  }
}

// Seed users with salted bcrypt hashes (Zero plaintext passwords in source code)
const DEFAULT_USERS = [
  {
    slug: 'system-admin',
    username: 'admin',
    aliases: ['superadmin', 'admin@teamrandom.uiu.ac.bd', 'root', '0000000000'],
    name: 'System Administrator',
    role: 'ADMIN',
    roleTitle: 'Project Super Admin',
    email: 'admin@teamrandom.uiu.ac.bd',
    passwordHash: '$2b$10$w29BqDnerqi2Rmd2SEpiLer12x5W3ewHm681/9tGBZqYnrODl4EMe'
  },
  {
    slug: 'md-mahamudul-hasan',
    username: '0112330182',
    aliases: ['mahamudul', 'mhasan2330182@bscse.uiu.ac.bd'],
    name: 'Md Mahamudul Hasan',
    role: 'MEMBER',
    roleTitle: 'Technical Lead',
    email: 'mhasan2330182@bscse.uiu.ac.bd',
    passwordHash: '$2b$10$J2.g7MTH5kwxiQIQ.pt4I.0koyRDg1SSXK404BtKlNyk0SILaV122'
  },
  {
    slug: 'md-sabbir-hossen',
    username: '0112331026',
    aliases: ['sabbir', 'mhossen2331026@bscse.uiu.ac.bd'],
    name: 'Md Sabbir Hossen',
    role: 'MEMBER',
    roleTitle: 'Faculty Communicator',
    email: 'mhossen2331026@bscse.uiu.ac.bd',
    passwordHash: '$2b$10$5V6VBkxzC59Ma2Xym1jXtehMehSadumexrSEMMMMXzTnQHttlWx/y'
  },
  {
    slug: 'tania-islam',
    username: '0112331025',
    aliases: ['tania', 'tislam2331025@bscse.uiu.ac.bd'],
    name: 'Tania Islam',
    role: 'MEMBER',
    roleTitle: 'Lead Researcher',
    email: 'tislam2331025@bscse.uiu.ac.bd',
    passwordHash: '$2b$10$edB8bnjG6JoKMfxtKvge2.ZZlgeEh1AFz1F9Z/4FGup/17NobClsa'
  },
  {
    slug: 'maria-tasnim',
    username: '0112331019',
    aliases: ['maria', 'mtasnim2331019@bscse.uiu.ac.bd'],
    name: 'Maria Tasnim',
    role: 'MEMBER',
    roleTitle: 'Research Assistant',
    email: 'mtasnim2331019@bscse.uiu.ac.bd',
    passwordHash: '$2b$10$.6CXCjGgG6irZb18lVHOx.3NB5MNDWyiDQLmVW5wC0mPGsDKz9tG.'
  },
  {
    slug: 'rehnuma-khan',
    username: '0112310260',
    aliases: ['rehnuma', 'member05', 'member5', 'member-five', 'rkhan2310260@bscse.uiu.ac.bd'],
    name: 'Rehnuma Khan',
    role: 'MEMBER',
    roleTitle: 'Presenter',
    email: 'rkhan2310260@bscse.uiu.ac.bd',
    passwordHash: '$2b$10$YwaBGfkivb6FPiogSjMLC.0qM7WWELIwD3PJAvzFhwPw0Z3N/OZou'
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
export async function findUserByCredentials(loginIdentifier, password) {
  const cleanId = (loginIdentifier || '').trim().toLowerCase();

  // 1. Try Supabase user_credentials table first (Permanent Cloud Store)
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
    if (supabaseUrl && supabaseSecretKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseSecretKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
      const { data, error } = await supabase.from('user_credentials').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        const userRecord = data.find(
          (u) =>
            (u.username && u.username.toLowerCase() === cleanId) ||
            (u.email && u.email.toLowerCase() === cleanId) ||
            (Array.isArray(u.aliases) && u.aliases.some((a) => a.toLowerCase() === cleanId))
        );
        if (userRecord) {
          const isValid = verifyPassword(password, userRecord.password_hash);
          if (isValid) {
            return {
              slug: userRecord.slug,
              username: userRecord.username,
              name: userRecord.name,
              role: userRecord.role,
              roleTitle: userRecord.role_title,
              email: userRecord.email,
              passwordHash: userRecord.password_hash
            };
          }
          return null;
        }
      }
    }
  } catch (err) {
    // Fallback to local store
  }

  // 2. Fallback to local store / DEFAULT_USERS
  const users = getUsersStore();
  const user = users.find(
    (u) =>
      u.username.toLowerCase() === cleanId ||
      u.email.toLowerCase() === cleanId ||
      u.aliases?.some((a) => a.toLowerCase() === cleanId)
  );

  if (!user) return null;

  const isValid =
    verifyPassword(password, user.passwordHash) ||
    (user.backupHash && verifyPassword(password, user.backupHash));

  return isValid ? user : null;
}

// Change password (Permanently persisted in Supabase)
export async function changePassword(slug, oldPassword, newPassword, session) {
  if (!session) {
    throw new Error('Unauthorized');
  }

  const isAdmin = session.role === 'ADMIN';
  const isSelf = session.slug === slug;

  if (!isAdmin && !isSelf) {
    throw new Error('Forbidden: You can only change your own password.');
  }

  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  const newHash = hashPassword(newPassword);

  // 1. Verify and update in Supabase if available
  let supabaseUpdated = false;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
    if (supabaseUrl && supabaseSecretKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseSecretKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });

      const { data: userRec, error: fetchErr } = await supabase
        .from('user_credentials')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!fetchErr && userRec) {
        if (!isAdmin || (isSelf && oldPassword)) {
          if (!oldPassword) {
            throw new Error('Current password is required.');
          }
          if (!verifyPassword(oldPassword, userRec.password_hash)) {
            throw new Error('Current password does not match.');
          }
        }

        const { error: updateErr } = await supabase
          .from('user_credentials')
          .update({ password_hash: newHash, updated_at: new Date().toISOString() })
          .eq('slug', slug);

        if (!updateErr) {
          supabaseUpdated = true;
        }
      }
    }
  } catch (err) {
    if (
      err.message &&
      (err.message.includes('password') ||
        err.message.includes('Forbidden') ||
        err.message.includes('Current password'))
    ) {
      throw err;
    }
  }

  // 2. Local store verification and update
  const users = getUsersStore();
  const userIndex = users.findIndex((u) => u.slug === slug);
  if (userIndex !== -1) {
    if (!supabaseUpdated) {
      if (!isAdmin) {
        if (!oldPassword) {
          throw new Error('Current password is required.');
        }
        const currentHash = users[userIndex].passwordHash;
        const backupHash = users[userIndex].backupHash;
        if (
          !verifyPassword(oldPassword, currentHash) &&
          (!backupHash || !verifyPassword(oldPassword, backupHash))
        ) {
          throw new Error('Current password does not match.');
        }
      } else if (isSelf && oldPassword) {
        const currentHash = users[userIndex].passwordHash;
        const backupHash = users[userIndex].backupHash;
        if (
          !verifyPassword(oldPassword, currentHash) &&
          (!backupHash || !verifyPassword(oldPassword, backupHash))
        ) {
          throw new Error('Current password does not match.');
        }
      }
    }

    users[userIndex].passwordHash = newHash;
    delete users[userIndex].backupHash;
    saveUsersStore(users);
  }

  return true;
}
