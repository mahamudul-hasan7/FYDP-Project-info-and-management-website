# Supabase Setup & Environment Configuration

This guide provides instructions for connecting your Supabase project to the **Team Random FYDP** platform both locally and on Vercel using Supabase's current API key system (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY`).

---

## 1. Supabase Dashboard Setup

1. Go to [supabase.com](https://supabase.com) and create a new project (or select your existing project).
2. Open the **SQL Editor** tab from the left sidebar.
3. Click **New Query**, copy the entire contents of [`supabase/schema.sql`](./supabase/schema.sql), and click **Run**.
   - This creates all 7 tables (`members`, `tasks`, `sprint_logs`, `team_notes`, `audit_logs`, `banner_config`, `project_info`).
   - Enables Row Level Security (RLS) and sets up automated timestamp triggers.
4. Retrieve your API keys from **Project Settings ➔ API**:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **Publishable key** (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
   - **Secret key** (`SUPABASE_SECRET_KEY`) *(Keep secret! Never share or expose to browser/client code)*

---

## 2. Local Environment Variables Setup

Create a `.env.local` file in the project root (this file is ignored by Git in `.gitignore`):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SECRET_KEY=your-supabase-secret-key

# Strong random secret key for session signatures
AUTH_SECRET=your_super_secure_random_secret_key_here
```

To generate a secure 32-byte `AUTH_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 3. One-Time Baseline Data Migration

Once your `.env.local` contains valid Supabase keys and the SQL schema is executed, run:

```bash
npm run seed:supabase
```

This will safely transfer baseline member profiles, sprint logs, project details, and banner configuration into Supabase without duplicating records.

---

## 4. Vercel Deployment Setup

When deploying to Vercel:

1. Open your project on the [Vercel Dashboard](https://vercel.com).
2. Navigate to **Settings ➔ Environment Variables**.
3. Add the following 4 environment variables for **Production**, **Preview**, and **Development**:

| Variable Name | Description | Environment Scope |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (e.g. `https://xxx.supabase.co`) | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe publishable client key | Production, Preview, Development |
| `SUPABASE_SECRET_KEY` | Server-only secret key (**Secret / Server-Only**) | Production, Preview, Development |
| `AUTH_SECRET` | 32-byte cryptographically secure session salt | Production, Preview, Development |

4. Redeploy your project on Vercel to activate the environment variables.
