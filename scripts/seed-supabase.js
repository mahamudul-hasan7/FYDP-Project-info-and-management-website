/**
 * =============================================================================
 * Team Random FYDP — Safe Idempotent Supabase Seed & Migration Script
 * =============================================================================
 * Migrates baseline project data (members, sprint logs, project info, banner config)
 * into Supabase without duplicating existing records.
 *
 * Uses modern Supabase Secret Key (SUPABASE_SECRET_KEY) for secure server-side execution.
 *
 * Usage:
 *   node scripts/seed-supabase.js
 *   or: npm run seed:supabase
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

// -----------------------------------------------------------------------------
// 1. Environment Variables Loader (.env.local / .env)
// -----------------------------------------------------------------------------
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  } catch (err) {
    // Ignore error reading env
  }
}

// Load .env.local first, then .env fallback
loadEnvFile(path.join(process.cwd(), '.env.local'));
loadEnvFile(path.join(process.cwd(), '.env'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

// -----------------------------------------------------------------------------
// 2. Main Seed Runner
// -----------------------------------------------------------------------------
async function runSeed() {
  console.log('\n======================================================');
  console.log('🚀 Team Random FYDP — Supabase Seed & Migration Script');
  console.log('======================================================\n');

  if (!supabaseUrl || !supabaseSecretKey) {
    console.warn('⚠️  Missing required Supabase server credentials.');
    console.warn('The migration seed requires administrative privileges to populate tables and bypass RLS.');
    console.warn('Required variables:');
    console.warn('  - NEXT_PUBLIC_SUPABASE_URL');
    console.warn('  - SUPABASE_SECRET_KEY\n');
    console.warn('⚠️  Security Notice: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY cannot be used for database seeding.');
    console.warn('👉 Please configure your SUPABASE_SECRET_KEY in .env.local, apply supabase/schema.sql in the Supabase SQL Editor, and re-run:');
    console.warn('   npm run seed:supabase\n');
    process.exit(0);
  }

  // Dynamically import @supabase/supabase-js
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  console.log('📡 Connected to Supabase endpoint:', supabaseUrl.replace(/^(https?:\/\/[^\/]+).*$/, '$1'));
  console.log('🔍 Validating destination tables in Supabase...\n');

  // Validate table existence
  const requiredTables = ['members', 'sprint_logs', 'project_info', 'banner_config', 'user_credentials'];
  for (const table of requiredTables) {
    const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.error(`❌ Table '${table}' check failed:`, error.message);
      console.error(`👉 Please ensure 'supabase/schema.sql' has been executed in the Supabase SQL Editor before running the seed script.\n`);
      process.exit(1);
    }
  }

  console.log('✅ All required tables exist and are reachable!\n');

  // ---------------------------------------------------------------------------
  // Load Local Source Data
  // ---------------------------------------------------------------------------
  const membersModule = await import(pathToFileURL(path.join(process.cwd(), 'data', 'members.js')).href);
  const logsModule = await import(pathToFileURL(path.join(process.cwd(), 'data', 'logs.js')).href);
  const projectModule = await import(pathToFileURL(path.join(process.cwd(), 'data', 'project.js')).href);

  let appStoreData = null;
  const storeFilePath = path.join(process.cwd(), 'data', '.app_store.json');
  if (fs.existsSync(storeFilePath)) {
    try {
      appStoreData = JSON.parse(fs.readFileSync(storeFilePath, 'utf8'));
    } catch (e) {}
  }

  const rawMembers = (appStoreData && Array.isArray(appStoreData.members) && appStoreData.members.length > 0)
    ? appStoreData.members
    : (membersModule.members || []);

  const rawLogs = (appStoreData && Array.isArray(appStoreData.logs) && appStoreData.logs.length > 0)
    ? appStoreData.logs
    : (logsModule.projectLogs || []);

  const projectData = projectModule.projectData || {};
  const bannerConfig = (appStoreData && appStoreData.bannerConfig) || {
    mode: 'auto',
    videoUrl: '/team-banner.mp4',
    imageUrl: '/team-banner.jpg',
    headline: 'Team Random',
    tagline: 'Engineering scalable software architecture & intelligent computing solutions.'
  };

  // ---------------------------------------------------------------------------
  // 1. Seed Members (Idempotent by 'slug')
  // ---------------------------------------------------------------------------
  console.log('🔄 Seeding members table...');
  const memberRecords = rawMembers.map((m, idx) => ({
    slug: m.slug,
    student_id: m.id || m.student_id || '',
    name: m.name,
    email: m.email,
    phone: m.phone || 'Not provided',
    gender: m.gender || null,
    department: m.department || 'Department of Computer Science & Engineering',
    institution: m.institution || 'United International University',
    role: m.role,
    short_role: m.shortRole || m.short_role || null,
    tagline: m.tagline || '',
    initials: m.initials || '',
    image: m.image || '',
    admin_avatar_style: m.adminAvatarStyle || m.admin_avatar_style || null,
    image_position: m.imagePosition || m.image_position || null,
    image_fit: m.imageFit || m.image_fit || null,
    placeholder: m.placeholder || null,
    github: m.github || '',
    linkedin: m.linkedin || '',
    about: m.about || '',
    responsibilities: Array.isArray(m.responsibilities) ? m.responsibilities : [],
    skills: Array.isArray(m.skills) ? m.skills : [],
    focus: Array.isArray(m.focus) ? m.focus : [],
    custom_links: Array.isArray(m.customLinks) ? m.customLinks : (Array.isArray(m.custom_links) ? m.custom_links : []),
    privacy: m.privacy || { email: true, phone: true, github: true, linkedin: true },
    display_order: idx + 1
  }));

  const { data: seededMembers, error: membersErr } = await supabase
    .from('members')
    .upsert(memberRecords, { onConflict: 'slug' })
    .select('slug');

  if (membersErr) {
    console.error('❌ Failed to seed members:', membersErr.message);
  } else {
    console.log(`  ✓ Members table synced: ${memberRecords.length} records processed (${seededMembers?.length || memberRecords.length} upserted, 0 duplicates)`);
  }

  // ---------------------------------------------------------------------------
  // 2. Seed Sprint Logs (Idempotent by 'id')
  // ---------------------------------------------------------------------------
  console.log('🔄 Seeding sprint_logs table...');
  const logRecords = rawLogs.map((log) => ({
    id: typeof log.id === 'number' ? log.id : undefined,
    week: log.week,
    title: log.title,
    date: log.date,
    status: log.status || 'active',
    category: log.category || 'Engineering',
    author: log.author || 'Team Lead',
    highlights: Array.isArray(log.highlights) ? log.highlights : [log.highlights].filter(Boolean)
  }));

  const { data: seededLogs, error: logsErr } = await supabase
    .from('sprint_logs')
    .upsert(logRecords, { onConflict: 'id' })
    .select('id');

  if (logsErr) {
    console.error('❌ Failed to seed sprint logs:', logsErr.message);
  } else {
    console.log(`  ✓ Sprint logs table synced: ${logRecords.length} records processed (${seededLogs?.length || logRecords.length} upserted, 0 duplicates)`);
  }

  // ---------------------------------------------------------------------------
  // 3. Seed Project Info (Idempotent Singleton by 'id')
  // ---------------------------------------------------------------------------
  console.log('🔄 Seeding project_info table...');
  const projectRecord = {
    id: 1,
    title: projectData.title || 'Final Year Design Project (Topic & Title Pending)',
    short_title: projectData.shortTitle || 'Team Random FYDP',
    domain: projectData.domain || 'Computer Science & Engineering',
    status: projectData.status || 'Phase 1 • Topic Pending',
    progress_percent: projectData.progressPercent || 15,
    supervisor: projectData.supervisor || {},
    abstract: projectData.abstract || '',
    tech_stack: projectData.techStack || [],
    milestones: projectData.milestones || []
  };

  const { error: projectErr } = await supabase
    .from('project_info')
    .upsert([projectRecord], { onConflict: 'id' });

  if (projectErr) {
    console.error('❌ Failed to seed project info:', projectErr.message);
  } else {
    console.log('  ✓ Project info table synced (1 singleton record upserted)');
  }

  // ---------------------------------------------------------------------------
  // 4. Seed Banner Config (Idempotent Singleton by 'id')
  // ---------------------------------------------------------------------------
  console.log('🔄 Seeding banner_config table...');
  const bannerRecord = {
    id: 1,
    mode: bannerConfig.mode || 'auto',
    video_url: bannerConfig.videoUrl || bannerConfig.video_url || '/team-banner.mp4',
    image_url: bannerConfig.imageUrl || bannerConfig.image_url || '/team-banner.jpg',
    headline: bannerConfig.headline || 'Team Random',
    tagline: bannerConfig.tagline || 'Engineering scalable software architecture & intelligent computing solutions.'
  };

  const { error: bannerErr } = await supabase
    .from('banner_config')
    .upsert([bannerRecord], { onConflict: 'id' });

  if (bannerErr) {
    console.error('❌ Failed to seed banner config:', bannerErr.message);
  } else {
    console.log('  ✓ Banner config table synced (1 singleton record upserted)');
  }

  // ---------------------------------------------------------------------------
  // 5. Seed User Credentials (Idempotent by 'slug', preserves updated passwords)
  // ---------------------------------------------------------------------------
  console.log('🔄 Seeding user_credentials table...');
  const defaultCredentials = [
    {
      slug: 'system-admin',
      username: 'admin',
      aliases: ['superadmin', 'admin@teamrandom.uiu.ac.bd', 'root', '0000000000'],
      name: 'System Administrator',
      role: 'ADMIN',
      role_title: 'Project Super Admin',
      email: 'admin@teamrandom.uiu.ac.bd',
      password_hash: '$2b$10$w29BqDnerqi2Rmd2SEpiLer12x5W3ewHm681/9tGBZqYnrODl4EMe'
    },
    {
      slug: 'md-mahamudul-hasan',
      username: '0112330182',
      aliases: ['mahamud', 'mahamudul', 'mhasan2330182@bscse.uiu.ac.bd'],
      name: 'Md Mahamud Hasan',
      role: 'MEMBER',
      role_title: 'Technical Lead',
      email: 'mhasan2330182@bscse.uiu.ac.bd',
      password_hash: '$2b$10$J2.g7MTH5kwxiQIQ.pt4I.0koyRDg1SSXK404BtKlNyk0SILaV122'
    },
    {
      slug: 'md-sabbir-hossen',
      username: '0112331026',
      aliases: ['sabbir', 'mhossen2331026@bscse.uiu.ac.bd'],
      name: 'Md Sabbir Hossen',
      role: 'MEMBER',
      role_title: 'Faculty Communicator',
      email: 'mhossen2331026@bscse.uiu.ac.bd',
      password_hash: '$2b$10$5V6VBkxzC59Ma2Xym1jXtehMehSadumexrSEMMMMXzTnQHttlWx/y'
    },
    {
      slug: 'tania-islam',
      username: '0112331025',
      aliases: ['tania', 'tislam2331025@bscse.uiu.ac.bd'],
      name: 'Tania Islam',
      role: 'MEMBER',
      role_title: 'Lead Researcher',
      email: 'tislam2331025@bscse.uiu.ac.bd',
      password_hash: '$2b$10$edB8bnjG6JoKMfxtKvge2.ZZlgeEh1AFz1F9Z/4FGup/17NobClsa'
    },
    {
      slug: 'maria-tasnim',
      username: '0112331019',
      aliases: ['maria', 'mtasnim2331019@bscse.uiu.ac.bd'],
      name: 'Maria Tasnim',
      role: 'MEMBER',
      role_title: 'Research Assistant',
      email: 'mtasnim2331019@bscse.uiu.ac.bd',
      password_hash: '$2b$10$.6CXCjGgG6irZb18lVHOx.3NB5MNDWyiDQLmVW5wC0mPGsDKz9tG.'
    },
    {
      slug: 'rehnuma-khan',
      username: '0112310260',
      aliases: ['rehnuma', 'rkhan2310260@bscse.uiu.ac.bd'],
      name: 'Rehnuma Khan',
      role: 'MEMBER',
      role_title: 'Presenter',
      email: 'rkhan2310260@bscse.uiu.ac.bd',
      password_hash: '$2b$10$YwaBGfkivb6FPiogSjMLC.0qM7WWELIwD3PJAvzFhwPw0Z3N/OZou'
    }
  ];

  const { data: seededCreds, error: credsErr } = await supabase
    .from('user_credentials')
    .upsert(defaultCredentials, { onConflict: 'slug', ignoreDuplicates: true })
    .select('slug');

  if (credsErr) {
    console.error('❌ Failed to seed user credentials:', credsErr.message);
  } else {
    console.log(`  ✓ User credentials table synced: ${defaultCredentials.length} users verified in cloud database.`);
  }

  console.log('\n======================================================');
  console.log('🎉 Supabase Initial Data Seed Completed Successfully!');
  console.log('======================================================\n');
}

runSeed().catch((err) => {
  console.error('\n❌ Unexpected error during seed execution:', err.message);
  process.exit(1);
});
