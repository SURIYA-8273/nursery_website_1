-- Add rating and total_reviews columns to plants table

-- Add average_rating column (decimal between 0 and 5)
ALTER TABLE plants
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(2,1) DEFAULT 0.0 CHECK (average_rating >= 0 AND average_rating <= 5);

-- Add total_reviews column (integer count)
ALTER TABLE plants
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0 CHECK (total_reviews >= 0);

-- Add index for filtering/sorting by rating
CREATE INDEX IF NOT EXISTS idx_plants_rating ON plants(average_rating DESC);

-- Add comments
COMMENT ON COLUMN plants.average_rating IS 'Average customer rating (0.0 to 5.0)';
COMMENT ON COLUMN plants.total_reviews IS 'Total number of customer reviews';
