# Netlify deployment

Repository: `abdulnafay-cloud/avexium-studio-next`, production branch `main`.
Existing Netlify project: `avexium-studio-next`.
Production origin: `https://avexium-studio-next.netlify.app`.

Netlify uses `netlify.toml`, Node 24, the pnpm lockfile and its automatically managed Next.js adapter. Build with `pnpm run build`; publish `.next`. Do not use a static export: enquiries, owner authentication and private dashboards need server functions.

Keep `DATABASE_URL`, `DATABASE_URL_POOLED`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET` and `ADMIN_OWNER_EMAIL` in protected Netlify production environment variables. Set `APP_URL` and `PUBLIC_SITE_URL` to the production origin. Configure the same origin in Neon Auth's trusted domains if required by the auth provider. Never commit `.env.local`, private records, CVs or backup encryption keys.

Local source snapshots, caches and build output are deliberately excluded from Git. Source HTML references and importer scripts are included so the shared particle experience can be maintained.

Verify after publishing: clean routes, graphics assets, sitemap/robots, admin redirects, direct enquiry persistence and application uploads. A successful deployment does not activate email delivery, scheduled retention, offsite backups or external alerting; these remain separately configured operational tasks documented in `LOCAL-OPERATIONS.md`.
