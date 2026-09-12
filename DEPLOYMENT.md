# Deployment

## Static Site

GitHub Pages serves the static website from `main`.

The custom domain should point to GitHub Pages:

- `A @ 185.199.108.153`
- `A @ 185.199.109.153`
- `A @ 185.199.110.153`
- `A @ 185.199.111.153`
- `CNAME www AbdullahUysal07.github.io`

Keep `CNAME` set to `aytride.com`.

## Booking API

GitHub Pages cannot send reliable email or store reservations by itself. Use the Cloudflare Worker in `server/worker.mjs` for:

- `POST /api/bookings`
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/bookings`

Create a Cloudflare D1 database and apply `server/schema.sql`.

Set secrets in Cloudflare:

- `RESEND_API_KEY`
- `ADMIN_PASSWORD_SALT`
- `ADMIN_PASSWORD_SHA256`
- `ADMIN_SESSION_SECRET`
- `PRIVATE_PRICING_JSON`

`PRIVATE_PRICING_JSON` example shape:

```json
{
  "routes": {
    "lara": {
      "standard-sedan": "set-private-cost-in-cloudflare",
      "vip-van": "set-private-cost-in-cloudflare"
    }
  }
}
```

Use real numeric cost values only inside Cloudflare secrets.

## Google Setup

After `https://aytride.com/` resolves with HTTPS:

1. Add the domain property in Google Search Console.
2. Verify the domain with DNS TXT.
3. Submit `https://aytride.com/sitemap.xml`.
4. Add GA4, Google Ads and GTM IDs to `data/public-catalog.json`.
5. Run `npm run build`, commit and push.

Marketing tags load only after consent. Main sale conversion is `booking_confirmed`, which fires only after the backend creates the booking.
