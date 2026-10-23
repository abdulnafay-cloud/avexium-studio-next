# Career applications and owner access

Career forms submit directly to the website. With the configured Neon connection, records and optional PDF CVs (3 MB maximum) are saved in `public.avexium_career_applications` in Postgres. Success is returned only after persistence completes. There is no filesystem fallback when a configured database fails.

## Create your owner account

1. Open `http://localhost:3002/admin/signup`.
2. Use the approved owner email configured in `ADMIN_OWNER_EMAIL` and choose your own password (12–128 characters).
3. Open `/admin/verify`, request a verification code, then enter the code from Neon. The shared Neon email provider uses codes; verification links require a custom email provider.
4. Sign in at `/admin/login`, then review `/admin/applications`.

Only the configured owner email with a verified Neon session can access applications or CVs. Changing the HTML form or signing up another Neon account does not grant dashboard access. The old HTTP Basic password is no longer used. Passwords and sessions are managed by Neon Auth; the application does not store raw passwords.

The inbox shows the latest 500 applications with contact details, portfolio links, messages, availability and private CV downloads. Use Sign out to end the session. Email notifications for new applications are not configured.

`/admin/forgot` and `/admin/reset` provide password recovery. Owner account creation, email code verification and real sign-in need to be completed by the owner; no owner password has been set by the agent.

## Environment

Keep these values in `.env.local` for local development and in the hosting provider's secret settings for production:

- `DATABASE_URL` and `DATABASE_URL_POOLED`: server-only Neon connection strings.
- `NEON_AUTH_BASE_URL`: the managed authentication endpoint.
- `NEON_AUTH_COOKIE_SECRET`: independently generated secret, at least 32 characters.
- `ADMIN_OWNER_EMAIL`: the only approved email address.
- `APP_URL`: `http://localhost:3002` locally; the real HTTPS origin in production.

Rotate the database password that was shared in chat, then replace both connection strings privately. Do not put these secrets in `NEXT_PUBLIC_` variables, source code or Git. The owner password is selected through the signup page, not stored in an environment variable.

## Setup and verification

Dependencies are now installed independently in this project and locked by `pnpm-lock.yaml`; the older project is unchanged. Use `pnpm install --frozen-lockfile` on a new machine.

Run `node scripts/setup-neon.cjs` to create the application table, enable row-level security, remove PUBLIC grants, and copy any existing local records without overwriting database records. The script leaves local source files intact and never edits Neon's managed authentication schema.

Run `node scripts/check-neon-applications.cjs` against the local preview to check database/PDF persistence, validation, unauthenticated access protection and owner-auth screens. It creates and removes only synthetic QA submissions. This does not create the real owner account or test its password.

## Before public deployment

Set production secrets and `APP_URL`, enable HTTPS, and add the deployment origin to the Neon Auth allowed domains. Confirm email/password authentication and verification email delivery in Neon. This project independently requires a verified owner email before private access. Configure database backups and a retention period. CVs remain private database values and download as attachments; consider object storage as application volume grows.

Add a host-level rate limit to application submission and authentication endpoints. Application submission limits are process-local and reset on restart; Neon also manages authentication rate limits. PDF header validation is not malware scanning.

Review the [Neon Next.js setup](https://neon.com/docs/auth/quick-start/nextjs-api-only) and [Neon Auth domain configuration](https://neon.com/docs/auth/guides/domains).


## Owner dashboard

`/admin/applications` now renders a responsive dashboard with navigation, all-time aggregate counts, applications from the last seven days, attached-CV counts and disciplines represented. The searchable inbox loads the latest 500 records; its discipline breakdown describes that loaded set. Role filtering and name/email/role searches use server-side GET parameters. Applicant details expand in place, with private CV downloads and portfolio links. Refresh fetches current data. Sign out is available on desktop and mobile.

Project enquiries, projects/content and settings are labelled Later; no unfinished actions are presented as functional tools. The visual test harness in `scripts/preview-dashboard.cjs` uses synthetic records only and never reads credentials, sessions or the database. It is separate from the protected application.

## Local operational tools

Applications and PDF CVs are included in encrypted backups. See LOCAL-OPERATIONS.md for backup verification, restore dry runs, retention and health checks. Project enquiries now have a separate protected inbox at /admin/enquiries.
