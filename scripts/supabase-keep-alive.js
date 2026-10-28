#!/usr/bin/env node
/**
 * Supabase Keep-Alive Ping Script
 * Prevents Supabase Free Tier projects from pausing due to 7-day inactivity.
 * 
 * Usage:
 *   node scripts/supabase-keep-alive.js
 * Or via npm:
 *   npm run supabase:keep-alive
 */

const fs = require('fs');
const path = require('path');

// Helper to read .env or .env.local if available locally
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        if (!process.env[key]) process.env[key] = value.trim();
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

async function pingSupabase() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Initiating Supabase Keep-Alive Heartbeat...`);

  if (!supabaseUrl || !anonKey) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_ANON_KEY not found in environment.');
    process.exit(1);
  }

  const cleanUrl = supabaseUrl.replace(/\/$/, '');
  const targetUrl = `${cleanUrl}/rest/v1/`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    console.log(`📡 Response Status: ${res.status} ${res.statusText}`);

    if (res.status === 200 || res.status === 404 || res.status === 401) {
      console.log('✅ Supabase project is ACTIVE and awake! (Activity registered successfully)');
    } else {
      console.log(`⚠️ Supabase returned unexpected status: ${res.status}`);
    }
  } catch (err) {
    console.error('❌ Heartbeat failed:', err.message);
    if (err.message.includes('ENOTFOUND')) {
      console.error('⚠️ DNS Resolution Failed: The Supabase project might be paused or deleted in Supabase dashboard.');
      console.error('👉 Please visit https://supabase.com/dashboard to Unpause/Restore your project.');
    }
    process.exit(1);
  }
}

pingSupabase();
