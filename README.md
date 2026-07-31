# CAS — Car Aircon Supply

CAS is an in-progress e-commerce storefront for automotive air-conditioning parts in the Philippines. It is being built to help vehicle owners and technicians browse compatible A/C components, view product details, add parts to a cart, and prepare an order for delivery.

The current catalog uses sample listings for A/C compressors compatible with selected Hyundai and Toyota vehicles. Prices and inventory are sample data until the store is connected to production product and stock management.

## Current functionality

- Browse the latest automotive A/C parts from the product catalog.
- View a product page with images, pricing, stock, brand, and vehicle-specific product information.
- Add items to a session-based shopping cart and update quantities.
- Create an account or sign in with email and password.
- Enter a Philippine delivery address, including region, city, barangay, postal code, and street address.
- Persist users, products, carts, and future orders in a PostgreSQL database.

## Project status

This is a work in progress and is not ready for production transactions.

The checkout currently collects delivery details and moves toward a payment-method route, but payment processing and completed order placement still need to be implemented. The database already includes models for orders and reviews, and route protection is prepared for account and admin areas, but the corresponding customer and administration features are not yet complete.

## Technology

- [Next.js](https://nextjs.org/) with React and TypeScript
- Tailwind CSS and shadcn/ui-style components for the interface
- Prisma ORM with PostgreSQL (configured for Neon)
- NextAuth/Auth.js credentials authentication
- React Hook Form and Zod for form validation

## Local setup

### Prerequisites

- Node.js 20 or later
- A PostgreSQL database (a Neon PostgreSQL database is the intended provider)

### Install and configure

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
   DIRECT_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
   AUTH_SECRET="replace-with-a-long-random-secret"
   NEXT_PUBLIC_APP_NAME="CAS"
   ```

   `DATABASE_URL` is used by the app at runtime; `DIRECT_URL` is used by Prisma commands.

3. Create the database schema and seed the sample catalog:

   ```bash
   npm run db:push
   npx tsx db/seed.ts
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Sample accounts

The seed data creates these development-only accounts:

| Role          | Email               | Password |
| ------------- | ------------------- | -------- |
| Administrator | `admin@example.com` | `123456` |
| Customer      | `user@example.com`  | `123456` |

Change or remove these accounts before any public deployment.

## Useful commands

```bash
npm run dev        # Start the development server
npm run build      # Build for production
npm run start      # Run the production build
npm run lint       # Run ESLint
npm run db:push    # Apply the Prisma schema to the database
npm run db:studio  # Open Prisma Studio
```

## Roadmap

- Complete payment-method selection and payment-provider integration.
- Implement order creation, confirmation, and customer order history.
- Build the administration dashboard for products, inventory, and order fulfilment.
- Add product search, filtering, compatibility details, and richer specifications.
- Enable reviews for verified purchases.
- Replace sample catalog data, pricing, and credentials with production data.
- Add tests, production security hardening, and deployment configuration.

## Project structure

```text
app/          Routes, pages, and server endpoints
components/   Shared storefront and UI components
db/           Prisma client, sample data, and seeding script
lib/          Server actions, validation, utilities, and constants
prisma/       Prisma schema and database configuration
public/       Product images, branding, and other static assets
```
