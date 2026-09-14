# Deployment

## Current Hosting Shape

GitHub Pages serves the static website from `main`.

The custom domain should point to GitHub Pages:

- `A @ 185.199.108.153`
- `A @ 185.199.109.153`
- `A @ 185.199.110.153`
- `A @ 185.199.111.153`
- `CNAME www AbdullahUysal07.github.io`

Keep `CNAME` in this repo set to `aytride.com`.

## Production API Requirement

GitHub Pages cannot send email, persist bookings or protect admin data by itself. Production bookings require the Cloudflare Worker in `server/worker.mjs` plus Cloudflare D1.

The Worker provides:

- `GET /api/health`
- `GET /api/public/catalog`
- `POST /api/bookings`
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/bookings`

## Cloudflare Worker + D1 Setup

Copy the example config and keep the real file out of commits if secrets or account-specific IDs are added.

```powershell
Copy-Item wrangler.example.toml wrangler.toml
npx wrangler@latest login
npx wrangler@latest d1 create ayt-ride-bookings
```

Paste the returned `database_id` into `wrangler.toml`.

Apply the database schema:

```powershell
npx wrangler@latest d1 execute ayt-ride-bookings --file=server/schema.sql --remote
```

Generate the admin password hash:

```powershell
node -e "const {createHash,randomBytes}=require('crypto');const password=process.argv[1];const salt=randomBytes(16).toString('hex');console.log('ADMIN_PASSWORD_SALT='+salt);console.log('ADMIN_PASSWORD_SHA256='+createHash('sha256').update(password+salt).digest('hex'));" "CHANGE_THIS_ADMIN_PASSWORD"
```

Add Cloudflare secrets:

```powershell
npx wrangler@latest secret put RESEND_API_KEY
npx wrangler@latest secret put ADMIN_PASSWORD_SALT
npx wrangler@latest secret put ADMIN_PASSWORD_SHA256
npx wrangler@latest secret put ADMIN_SESSION_SECRET
npx wrangler@latest secret put PRIVATE_PRICING_JSON
```

`PRIVATE_PRICING_JSON` must stay private in Cloudflare. Example shape:

```json
{
  "routes": {
    "belek": {
      "standard-sedan": 32,
      "vip-van": 45
    }
  }
}
```

Deploy the Worker:

```powershell
npx wrangler@latest deploy --config wrangler.toml
```

## Required `wrangler.toml` Values

```toml
name = "ayt-ride-api"
main = "server/worker.mjs"
compatibility_date = "2026-09-12"

routes = [
  { pattern = "aytride.com/api/*", zone_name = "aytride.com" },
  { pattern = "www.aytride.com/api/*", zone_name = "aytride.com" }
]

[[d1_databases]]
binding = "DB"
database_name = "ayt-ride-bookings"
database_id = "PASTE_REAL_D1_DATABASE_ID"

[vars]
ALLOWED_ORIGINS = "https://aytride.com,https://www.aytride.com,https://abdullahuysal07.github.io"
BOOKING_EMAIL = "info@shramworld.com"
MAIL_FROM = "AYT Ride <info@shramworld.com>"
ADMIN_EMAILS = "info@shramworld.com"
```

## Admin Login

The production admin email placeholder is:

```text
info@shramworld.com
```

There is no hardcoded production password in the repository. Choose the real admin password during Cloudflare setup, generate `ADMIN_PASSWORD_SALT` and `ADMIN_PASSWORD_SHA256`, then save both as Cloudflare secrets. The same plain password you chose is the password for `/admin/`.

## Production Placeholders

Before paid ads, replace these placeholder values in `data/public-catalog.json` or production secrets:

- Owner booking inbox: `info@shramworld.com`
- Turkish WhatsApp: `90XXXXXXXXXX`
- Display WhatsApp: `+90 XXX XXX XX XX`
- GTM: `GTM-XXXXXXX`
- GA4: `G-XXXXXXXXXX`
- Google Ads: `AW-XXXXXXXXXX`
- Google Ads booking conversion label: `XXXXXXXXXX`

Active analytics fields are intentionally blank until real Google IDs exist.

## Launch Check Commands

After deploy, verify the API:

```powershell
curl.exe -i https://aytride.com/api/health
curl.exe -i -X POST https://aytride.com/api/bookings -H "Origin: https://aytride.com" -H "Content-Type: application/json" --data-binary "@tools/launch-check-booking.json"
npx wrangler@latest d1 execute ayt-ride-bookings --command "select reference, route_id, vehicle_id, passengers, child_seats, public_total_eur, private_vehicle_price_eur, created_at from bookings order by created_at desc limit 5;" --remote
```

Admin visibility check:

1. Open `https://aytride.com/admin/`.
2. Log in with an email from `ADMIN_EMAILS` and the password used to create `ADMIN_PASSWORD_SHA256`.
3. Confirm the launch-check booking appears with public price and private vehicle cost.

## Email Setup

The Worker is prepared for Resend. The email provider must be configured manually:

1. Verify `aytride.com` in Resend or the chosen transactional email provider.
2. Add the provider's DNS records for SPF, DKIM and return-path.
3. Set `RESEND_API_KEY` in Cloudflare.
4. Set `MAIL_FROM` to `AYT Ride <info@shramworld.com>`.
5. Set `BOOKING_EMAIL` to `info@shramworld.com`.

Bookings are saved to D1 before email is attempted. If email delivery fails, the API still returns success with `emailStatus: "failed"` so the persistent reservation is not lost.

## Google Setup

After `https://aytride.com/` resolves with HTTPS:

1. Add the domain property in Google Search Console.
2. Verify the domain with DNS TXT.
3. Submit `https://aytride.com/sitemap.xml`.
4. Add real GTM, GA4, Google Ads and conversion label values to `data/public-catalog.json`.
5. Run `npm run build`, commit and push.

Marketing tags load only after consent. The main booking conversion is `booking_confirmed`, and the client only fires it when a backend booking response has succeeded and marked the booking as persisted.
