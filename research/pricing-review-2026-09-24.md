# AYT Ride — competitor pricing and margin review (24 September 2026)

**Status: REVIEW ONLY; do not deploy prices until driver quotes and actual acquisition cost are confirmed.** All prices are public advertised one-way EUR per vehicle, not checkout-verified. Vehicle classes, capacities, hotel zones and inclusions differ.

## Competitor published price comparison

| AYT to | AYT Ride sedan | Bentour private 1–4 | Merry Tourism sedan 1–3 | BookRideNow Vito 1–6 | Rento private 1–6 | Antalya Ride advertised from |
|---|---:|---:|---:|---:|---:|---:|
| Lara/Kundu | 30 | 28 | 35 | 35 | 45 | 20 |
| Belek | 45 | 32 | 45 | 45 | 55 | 35 |
| Kemer | 60 | 47.5 | 50 | 55 | 75 | 45 |
| Side | 65 | 47.5 | 65 | 50 | 75 | 40 |
| Alanya | 95 | 72 | 95 | 65–75 (passenger band/area) | 110 | 60 |

Sources (accessed 2026-09-24):
- https://bentour.com.tr/en/transfer-prices (rates from Aug 28, 2026)
- https://www.merrytourism.com/tr/antalya-airport-transfer
- https://www.bookridenow.com/en/blog/antalya-airport-transfer-prices-2026 (July 2026)
- https://rentotransfer.com/book/antalya-airport-transfer
- https://antalyaride.com.tr/en (advertised 'from' prices, not directly comparable)
- https://www.taxitoantalya.com/ (promotional fares)

## AYT Ride current catalog, direct cost and break-even

Assumptions: EUR/TRY 55.70 as indicative 24 Sep rate (https://fon.org.tr/en/doviz/EUR), 40 TRY per occupied km, zero empty return cost, 400 TRY customer acquisition cost per completed ride, 100 TRY other variable expense, minimum 300 TRY contribution after those costs. These are planning assumptions, not audited operating expenses. Break-even minimum price = ceil((40*distance_km + 400 + 100 + 300)/55.70).

| Route | km (catalog) | Current sedan EUR | Driver TRY | Floor EUR (>=300 TRY after assumed CAC and other) | Candidate sedan EUR | Candidate contribution TRY |
|---|---:|---:|---:|---:|---:|---:|
| Lara | 14 | 30 | 560 | 25 | 27 | 444 |
| Belek | 33 | 45 | 1320 | 39 | 40 | 408 |
| Kemer | 58 | 60 | 2320 | 57 | 57 | 355 |
| Side | 65 | 65 | 2600 | 62 | 63 | 409 |
| Alanya | 125 | 95 | 5000 | 105 | 105 | 349 |
| Kaleici | 16 | 35 | 640 | 26 | 33 | 698 |
| Konyaalti | 25 | 40 | 1000 | 33 | 37 | 561 |

Candidate prices are a *scenario*, NOT an approved or deployed price list. Alanya cannot be both cheapest in this competitor sample and meet the assumed minimum contribution at the current 40 TRY/km buy rate. For €72 Alanya, maximum all-in driver buy cost to retain 300 TRY after 500 TRY CAC/other would be ~3,210 TRY, equivalent to ~25.7 TRY/km over 125 km.

**VIP Van:** No verified driver buy tariff by route/class. Do not lower VIP pricing until supplier prices, luggage limits, child-seat costs and night surcharges are confirmed.

**Other controls before deployment:**
1. Catalog is not necessarily the production price source: inspect Worker/D1 admin settings and public catalog API; verify override precedence.
2. Rebuild generated localized HTML and update static quote totals, schema and route/article price copy together; run tests and inspect the deployed pages.
3. Return-trip discount is currently 10% on second ride; evaluate profitability of BOTH legs, including possible separate driver assignment.
4. Different hotel zones (Alanya centre vs Okurcalar/Mahmutlar, Kemer vs Tekirova, Side vs Kizilagac) should not share a low fixed fare without exact destination validation.
5. Validate actual CAC per **completed paid transfer**, not just booking requests. Record cancellation/no-show and payment fees.
