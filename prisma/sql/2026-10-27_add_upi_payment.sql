-- Reference SQL for the UPI QR payment change (PostgreSQL).
-- This project syncs its schema with `prisma db push` (see prisma/prepare.ts, run by `npm run build`),
-- so this file is NOT executed automatically; it documents the exact change for review or manual use.
-- Both statements are additive and non-destructive.

ALTER TYPE "PaymentMethod" ADD VALUE IF NOT EXISTS 'UPI';

ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentReference" TEXT;
