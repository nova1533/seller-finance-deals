# Seller Finance Deals

Public site listing homes available on contract for deed. Next.js + Tailwind, hosted on Vercel,
content stored in Supabase.

## One-time setup (Boz)

1. **Database + photo storage** — open the Supabase project's SQL Editor and run everything in
   [`supabase/schema.sql`](./supabase/schema.sql). This creates the `properties` table and the
   `property-photos` storage bucket.

2. **Environment variables** — in the Vercel project's Settings → Environment Variables, add:

   | Variable | Where to find it |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
   | `NEXT_PUBLIC_SUPABASE_KEY` | Supabase → Settings → API → "publishable" key |
   | `SUPABASE_URL` | same Project URL as above |
   | `SUPABASE_SECRET_KEY` | Supabase → Settings → API → "secret" key (not the publishable one) |
   | `ADMIN_PASSWORD` | pick a password for the `/admin` add/edit-property page |
   | `ADMIN_SESSION_SECRET` | any random string (optional but recommended) |
   | `NEXT_PUBLIC_CONTACT_PHONE` | the phone number shown on the site |
   | `NEXT_PUBLIC_LEAD_FORM_URL` | link to the buyer-inquiry Google Form, once created |
   | `ANTHROPIC_API_KEY` | powers the "Generate with AI" description button in `/admin` |

   See `.env.example` for the same list.

3. **Buyer lead form** — create a Google Form for people interested in a property (name, phone,
   email, which property, message). In the form's Responses tab, turn on "Get email
   notifications for new responses." Paste the form's live URL into `NEXT_PUBLIC_LEAD_FORM_URL`.

## Adding or editing a property

Go to `/admin`, log in with `ADMIN_PASSWORD`, and use "Add Property" or "Edit." Photos upload
directly from that form into Supabase, no separate step needed.

Fill in the address, terms, and details fields, then click "Generate with AI" above the
Description box to draft a description from what you've entered. It only uses the facts you've
typed in, it never looks anything up online, so review and edit before saving.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the same values as above.
