# Setup — editable pins, photos & audio

The site works out of the box with the **seed content** (everything authored in
code). To let Krushi **add/edit/remove** her own pins, photos and audio, connect
a free Supabase project and set a secret. ~5 minutes, one time.

## 1. Create a Supabase project
1. Go to https://supabase.com → sign up (free) → **New project**.
2. Wait for it to finish provisioning.

## 2. Create the tables + storage bucket
1. In the project, open **SQL Editor → New query**.
2. Paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and **Run**.
   - This creates the `pins` and `media` tables and a public `media` storage bucket.

## 3. Get your keys
In **Project Settings → API**, copy:
- **Project URL** → `SUPABASE_URL`
- **service_role** secret key → `SUPABASE_SERVICE_ROLE_KEY` (keep this private — server only)

## 4. Set environment variables
Create `.env.local` (copy from `.env.example`):

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # service_role key
EDITOR_SECRET=some-secret-word          # pick anything; share only with Krushi
NEXT_PUBLIC_EDIT_ENABLED=1
```

Restart `npm run dev`.

## 5. Use it
- Open any page and click the small **✎ pencil** (bottom-right). Enter the
  `EDITOR_SECRET`. You're now in **edit mode** (saved for the session).
- **Navsari map:** in edit mode, tap an empty spot to drop a pin (name, note,
  emoji), and use the ✕ on your own pins to remove them. Seed pins are locked.
- **Photos/audio** (next increment): add per page in edit mode.

## Deploying (recommended: Vercel)
1. Push the repo to GitHub, import into https://vercel.com (free).
2. In the Vercel project → **Settings → Environment Variables**, add the same
   four vars from step 4.
3. Deploy. Your NFC links keep working; edits now persist globally.

## Per-page passwords (for the non-NFC path)
Scanning an NFC tag opens a page directly via its secret UID (e.g.
`/navsari/b8k1p4`). If someone instead types the clean name (e.g. `/navsari`),
they get a **password prompt unique to that page**.

Set the passwords in `.env.local` as JSON (page id → password):

```
PAGE_PASSWORDS={"navsari":"our first chai","morse":"dot dash","truce":"i am sorry"}
```

Page ids: `navsari, landour, morse, random-day, calendar, miss-me, homesick,
truce, found-one, final-secret`. Any page without a password simply can't be
opened via the clean URL (NFC UID still works). Passwords are checked
server-side and are case-insensitive.

### Notes
- Without these env vars the site still runs — it just shows seed content and
  hides editing.
- Files are served from Supabase's CDN, so photos/audio load fast worldwide.
- Your seed content (in code) can never be changed from the browser.
