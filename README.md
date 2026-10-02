# Team Random FYDP Website — V2

A mobile-first Next.js team website designed to feel more like a compact app/dashboard than a traditional landing page.

## Run

PowerShell (safe workaround if npm.ps1 is blocked):

```powershell
npm.cmd install
npm.cmd run dev
```

Then open: http://localhost:3000

## Add / replace member profile photos

No code change is needed if you keep the exact filenames below.

Put JPG photos inside:

`public/members/`

Exact filenames:

- `md-mahamudul-hasan.jpg`
- `md-sabbir-hossen.jpg`
- `tania-islam.jpg`
- `maria-tasnim.jpg`
- `member-five.jpg`

Recommended photo: square 800x800 or 1000x1000 JPG, face centered.

If a photo is missing, the website automatically shows the member initials instead.

## Edit names / roles / IDs / email / image path

Open:

`data/members.js`

Every member is stored in one simple object. You can change name, role, ID, email, phone, skills, responsibility and profile image path there.

## Supabase Database Setup

For detailed instructions on configuring Supabase SQL schemas, API keys, and environment variables locally and in Vercel, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

## Vercel

Push the folder to GitHub and import the repository in Vercel. Framework preset should detect Next.js automatically. Make sure to set the 4 environment variables from `SUPABASE_SETUP.md` in Vercel Project Settings.

