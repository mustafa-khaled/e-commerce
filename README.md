# EE Commerce Monorepo

Production e-commerce platform with NestJS API, Next.js storefront, OpenAPI contract, Kashier payments, Firebase push, and Redis caching.

## Structure

```
apps/api    - NestJS backend (port 8080)
apps/web    - Next.js frontend (port 3000)
packages/   - shared-types, api-contract
infra/      - Docker Compose (MongoDB, Redis, Mailhog)
```

## Quick Start

```bash
# Start infrastructure
pnpm docker:up

# Install dependencies
pnpm install

# Configure environment
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local

# Seed database
pnpm seed

# Run development
pnpm dev
```

- API: http://localhost:8080/api/v1
- Swagger: http://localhost:8080/api/docs
- Web: http://localhost:3000

## Features

- Guest checkout + registered user orders
- COD and Kashier online payments
- Inventory reservations (oversell prevention)
- Multi-language (ar/en) and multi-currency (EGP/USD/EUR)
- Egypt-first shipping zones
- Returns and refunds
- Admin dashboard at `/[locale]/admin`
- Email campaigns and Firebase push notifications
- Redis caching and BullMQ job queues
