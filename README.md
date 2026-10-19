# swisswatch

Swiss World Watch is a database-driven watch storefront with an admin product catalog, cart, and checkout.

## Getting started

```bash
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Seed accounts:

- Admin: `admin@swissworldwatch.com` / `Admin@12345`
- Customer: `customer@swissworldwatch.com` / `Customer@12345`

Admin lives at `/admin`. Product, brand, category, and image data come from Prisma (SQLite by default). `npm run db:reset` rebuilds the database and restores the seed catalog.
