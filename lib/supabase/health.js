/**
 * Supabase Health & Fast-Fail Connection Monitor
 * Prevents DNS hang / 20+ second freezes when Supabase project is paused or offline.
 */

let cachedStatus = {
  online: false,
  lastChecked: 0,
  error: null
};

// Cooldown before retrying a dead/paused Supabase connection
const OFFLINE_COOLDOWN_MS = 45000; // 45 seconds
// Cache duration for a successful connection
const ONLINE_CACHE_MS = 120000; // 2 minutes

/**
 * Checks if Supabase project is active and reachable via DNS & HTTP.
 * Uses a strict 1.8-second timeout to prevent server request stalling.
 */
export async function checkSupabaseHealth(force = false) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !anonKey) {
    cachedStatus = {
      online: false,
      lastChecked: Date.now(),
      error: 'NEXT_PUBLIC_SUPABASE_URL or key missing in .env'
    };
    return cachedStatus;
  }

  const now = Date.now();
  const timeSinceCheck = now - cachedStatus.lastChecked;

  // Use cached result if within cooldown / cache window
  if (!force && cachedStatus.lastChecked > 0) {
    if (cachedStatus.online && timeSinceCheck < ONLINE_CACHE_MS) {
      return cachedStatus;
    }
    if (!cachedStatus.online && timeSinceCheck < OFFLINE_COOLDOWN_MS) {
      return cachedStatus;
    }
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800); // Strict 1.8s timeout

    const cleanUrl = supabaseUrl.replace(/\/$/, '');
    // Fast health probe against Supabase REST endpoint
    const res = await fetch(`${cleanUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`
      },
      signal: controller.signal
    }).catch(async (fetchErr) => {
      // Secondary probe against root
      return fetch(cleanUrl, {
        method: 'HEAD',
        signal: controller.signal
      });
    });

    clearTimeout(timeout);

    // Any HTTP status code (200, 401, 404, etc.) means DNS resolved and server is online!
    if (res && typeof res.status === 'number') {
      cachedStatus = {
        online: true,
        lastChecked: Date.now(),
        error: null
      };
      return cachedStatus;
    }
  } catch (err) {
    cachedStatus = {
      online: false,
      lastChecked: Date.now(),
      error: err.name === 'AbortError' ? 'Connection timed out (1.8s)' : (err.message || 'Supabase unreachable')
    };
  }

  return cachedStatus;
}

export function getCachedSupabaseStatus() {
  return cachedStatus;
}
