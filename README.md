# NandiGo Services

Production rebuild of the NandiGo destination management company website.

## Stack

- Next.js 16 App Router
- Neon Postgres
- Drizzle ORM
- Cloudflare R2 media storage
- Vercel deployment
- Password-protected admin CMS

## Required Environment Variables

Copy `.env.example` to `.env.local` locally and configure the same values in Vercel:

- `DATABASE_URL`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `ADMIN_PASSWORD_HASH`
- `R2_PUBLIC_BASE_URL` optional, recommended for a public R2 custom domain
- `NEXT_PUBLIC_SITE_URL` optional, recommended for canonical URLs

Generate the admin hash with:

```bash
npm run hash-password
```

## Database

Apply the Drizzle migration to Neon:

```bash
npm run db:migrate
npm run db:seed
```

The seed creates the 10 states and 8 categories as database records, not JSX constants.

## Admin

The admin panel is available at `/admin`. Public package and blog routes only query `published` records. Draft records remain admin-only.

## Media Rules

- Images: `image/webp`, maximum 2MB
- Videos: `video/mp4`, maximum 10MB
- Validation happens before any R2 upload call

## Deployment Guard

`npm run build` runs `scripts/validate-env.mjs` first. Missing production credentials fail loudly with `MISSING_INPUT:[VAR_NAME]`.
