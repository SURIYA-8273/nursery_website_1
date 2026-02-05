-- Migration: Remove base price, discount, and stock from plants table
-- Date: 2026-02-05
-- Description: Removes the base price, discount, and stock columns from the plants table
--              since all pricing and stock management is now handled through plant_variants

-- Remove the columns from plants table
ALTER TABLE public.plants 
  DROP COLUMN IF EXISTS price,
  DROP COLUMN IF EXISTS discount,
  DROP COLUMN IF EXISTS stock;

-- Optional: Add comments to document the change
COMMENT ON TABLE public.plants IS 'Plants table - pricing and stock managed through plant_variants table';

-- Note: This migration is safe to run as it only removes columns
-- Make sure to backup your data before running this migration
-- If you need to rollback, you can restore the columns with:
-- ALTER TABLE public.plants 
--   ADD COLUMN price numeric null,
--   ADD COLUMN discount numeric null,
--   ADD COLUMN stock integer null default 0;
