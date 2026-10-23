# Local launch implementation

No paid service or public deployment has been activated. The existing Neon database continues to store private records.

## Direct project enquiries

`/start` submits directly to `/api/enquiries`. A receipt appears only after the brief and notification queue entry are saved in one transaction. Retries use a stable reference to avoid duplicate records. The form validates fields, consent and service choices, rejects oversized bodies, checks the origin and includes a honeypot and basic per-process submission limits.

The verified owner can review briefs at `/admin/enquiries`; career applications remain at `/admin/applications`. Both share the private dashboard navigation. Email failure cannot erase a saved enquiry.

## Email previews

Run `pnpm ops:mail`. It creates private `.eml` files in `.data/operations/mail-preview/` and marks queued records as previewed. No email is sent. These files contain personal information: keep them private and remove them when no longer needed.

Live delivery is implemented but inactive. Later, configure `RESEND_API_KEY`, `NOTIFICATION_FROM` and `NOTIFICATION_TO`, verify the sending domain, and run `pnpm ops:mail --send`. The worker records delivery status, retries unsent records on the next run and uses provider idempotency keys. This sends owner notifications, not applicant marketing emails. Neon authentication emails use Neon's separate configuration.

## Encrypted backups and recovery

Run `pnpm ops:backup`. It exports application records, PDF CVs, enquiries and notification state into an authenticated AES-256-GCM encrypted file under `.data/operations/backups/`, then decrypts it to verify integrity. Managed Neon authentication tables are excluded. The private encryption key is in `.env.local`; keep a separate secure copy, because losing it prevents recovery.

Run `pnpm ops:restore PATH_TO_BACKUP` to verify a backup without changing the database. Add `--apply` only when intentionally restoring missing records into the configured database. Restore is atomic and preserves existing records. Test recovery against a separate staging database before relying on it for production disaster recovery.

Local encrypted files are not offsite backups. Later, choose a private external storage destination and a scheduler, monitor backup freshness and test recovery. Backup files and email previews are not automatically pruned; include them in the approved retention policy.

## Retention

Run `pnpm ops:retention` for a report only. Suggested configurable defaults are 180 days for applications, 365 for enquiries and 30 for operational events. No scheduled deletion is enabled. Review and approve periods before running `pnpm ops:retention --apply`. Removing an enquiry also removes its notification queue entry. Encrypted backups and local email previews must be considered separately when fulfilling deletion requests.

## Errors and health

Unhandled server request failures and caught submission failures produce fixed, non-personal event codes in the console and the private operational-events table. The owner-only `/api/admin/health` endpoint reports database availability, unsent notifications and recent event codes. Request bodies, passwords, verification codes and CVs are not recorded in these events. Database outage logs remain in the console if persistence is unavailable.

No external error tracker, alerting destination, uptime monitor or recurring worker has been activated. For production, schedule the notification worker and backups, approve retention, and connect host logs/alerts. Current request limits are local to each server process; configure shared or host-level limits for multiple instances.

## SEO and content

The main views have clean, server-rendered routes, unique metadata and canonical URLs. Service, collaboration and case-study detail routes are included. Legacy hash links still resolve using the original animated transitions. A favicon and generated social preview image are installed. Local previews block indexing and provide an empty sitemap until `PUBLIC_SITE_URL` is configured with the real HTTPS origin.

Case studies describe independent concepts, show original imagery, explain decisions and distinguish concept work from production integrations. They make no invented client, endorsement or business-results claims. Collaboration pages continue to disclose that listings do not confirm active vacancies.

Run `pnpm check:launch` for local configuration, or `pnpm check:launch --production` for deployment requirements. The production check should fail locally until the domain and delivery provider are configured. Set both `APP_URL` and `PUBLIC_SITE_URL` to the real HTTPS origin and configure Neon trusted origins when deploying. Confirm business disclosures and public contact ownership before publishing.
