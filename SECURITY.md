# Security Notes

AYT Ride is split into a public static site and a private API layer.

The public GitHub Pages site must not include private vehicle costs, margin formulas, admin passwords, mail provider keys, analytics secrets or customer database credentials. The browser can see only route IDs, public prices, vehicle capacity and availability.

Admin login is handled by the production API. A static PIN, localStorage password or browser-only admin gate is not acceptable for production. The admin panel is also marked `noindex,nofollow`, but that is only crawler hygiene, not security.

Bookings are created server-side before confirmation events fire. The backend validates route, date, vehicle capacity, guest fields and public pricing again, then stores the booking in the database. Operator cost is calculated only from backend configuration.

Required production secrets:

- `RESEND_API_KEY`
- `ADMIN_PASSWORD_SALT`
- `ADMIN_PASSWORD_SHA256`
- `ADMIN_SESSION_SECRET`
- `PRIVATE_PRICING_JSON`

Do not commit real secret values to this repository.
