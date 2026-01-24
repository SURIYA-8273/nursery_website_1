-- DATA SEEDING SCRIPT
-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- 1. Insert Categories (10 items)
INSERT INTO public.categories (name, slug, image, description) VALUES
('Indoor Plants', 'indoor-plants', 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800', 'Plants that thrive inside your home.'),
('Outdoor Garden', 'outdoor-garden', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800', 'Perfect for balconies and gardens.'),
('Succulents & Cacti', 'succulents', 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=800', 'Low maintenance desert plants.'),
('Flowering Plants', 'flowering', 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?auto=format&fit=crop&w=800', 'Add color to your life with blooms.'),
('Air Purifying', 'air-purifying', 'https://images.unsplash.com/photo-1512428559087-560fa0cec34f?auto=format&fit=crop&w=800', 'Clean the air you breathe naturally.'),
('Hanging Baskets', 'hanging', 'https://images.unsplash.com/photo-1591951438980-458189675276?auto=format&fit=crop&w=800', 'Trailing plants for vertical spaces.'),
('Medicinal Plants', 'medicinal', 'https://images.unsplash.com/photo-1563205764-4bf81912ec98?auto=format&fit=crop&w=800', 'Herbs and plants with healing properties.'),
('Fruit Plants', 'fruit', 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=800', 'Grow your own delicious fruits.'),
('Ferns', 'ferns', 'https://images.unsplash.com/photo-1588629012435-f0ea7c356b9c?auto=format&fit=crop&w=800', 'Lush green foliage for shady spots.'),
('Pots & Planters', 'pots', 'https://images.unsplash.com/photo-1416879895691-14022a0aec41?auto=format&fit=crop&w=800', 'Stylish containers for your green friends.');

-- 2. Insert Plants (20 items) linked to categories
-- We use subqueries to get the category UUIDs based on slugs we just inserted.

INSERT INTO public.plants (name, slug, price, discount, description, care_instructions, category_id, images, stock, is_featured) VALUES

-- Indoor Plants
('Snake Plant', 'snake-plant', 499, 399, 'The Snake Plant is an excellent air purifier and tolerant of low light.', 'Water every 2-3 weeks. Low to bright indirect light.', (SELECT id FROM categories WHERE slug = 'indoor-plants'), ARRAY['https://images.unsplash.com/photo-1598887142487-3c854d53d2c9?auto=format&fit=crop&w=800'], 50, true),
('Monstera Deliciosa', 'monstera', 1299, null, 'Famous for its natural leaf holes, the Swiss Cheese Plant is a tropical beauty.', 'Water when top inch is dry. Bright indirect light.', (SELECT id FROM categories WHERE slug = 'indoor-plants'), ARRAY['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800'], 30, true),
('Peace Lily', 'peace-lily', 699, 599, 'Elegant white flowers and lush dark leaves. Great for low light.', 'Keep soil moist. Low to medium light.', (SELECT id FROM categories WHERE slug = 'indoor-plants'), ARRAY['https://images.unsplash.com/photo-1593691509543-c55ce32ebee2?auto=format&fit=crop&w=800'], 40, false),
('ZZ Plant', 'zz-plant', 799, null, 'Virtually indestructible, the ZZ plant has waxy, shiny leaves.', 'Water rarely. Low to bright light.', (SELECT id FROM categories WHERE slug = 'indoor-plants'), ARRAY['https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&w=800'], 25, false),

-- Outdoor Garden
('Hibiscus Red', 'hibiscus-red', 350, null, 'Vibrant red flowers that bloom year-round in warm climates.', 'Daily watering. Full sun.', (SELECT id FROM categories WHERE slug = 'outdoor-garden'), ARRAY['https://images.unsplash.com/photo-1576016770956-debb63d9d081?auto=format&fit=crop&w=800'], 60, false),
('Jasmine Mogra', 'jasmine-mogra', 250, 199, 'Fragrant white flowers commonly used for worship and perfume.', 'Regular watering. Full sun to partial shade.', (SELECT id FROM categories WHERE slug = 'outdoor-garden'), ARRAY['https://images.unsplash.com/photo-1620066228723-57da8fc78d5e?auto=format&fit=crop&w=800'], 100, false),

-- Succulents
('Aloe Vera', 'aloe-vera', 299, 249, 'Medicinal succulent known for its soothing gel.', 'Water deeply but rarely. Bright indirect light.', (SELECT id FROM categories WHERE slug = 'succulents'), ARRAY['https://images.unsplash.com/photo-1616656715456-14736f860da4?auto=format&fit=crop&w=800'], 50, true),
('Jade Plant', 'jade-plant', 399, null, 'A symbol of good luck and prosperity.', 'Allow soil to dry completely. Bright light.', (SELECT id FROM categories WHERE slug = 'succulents'), ARRAY['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800'], 40, false),
('Echeveria Elegans', 'echeveria', 199, null, 'Beautiful rosette-shaped succulent with silvery-blue leaves.', 'Minimal water. Full sun.', (SELECT id FROM categories WHERE slug = 'succulents'), ARRAY['https://images.unsplash.com/photo-1516047285906-8c437340b106?auto=format&fit=crop&w=800'], 45, false),

-- Flowering
('Anthurium Red', 'anthurium', 899, 799, 'Long-lasting red blooms and heart-shaped leaves.', 'Humidity lover. Bright indirect light.', (SELECT id FROM categories WHERE slug = 'flowering'), ARRAY['https://images.unsplash.com/photo-1605650170068-d0554157144e?auto=format&fit=crop&w=800'], 20, true),
('Orchid Moth', 'orchid', 1499, 1299, 'Exotic and elegant flowers that last for months.', 'Soak roots weekly. Filtered light.', (SELECT id FROM categories WHERE slug = 'flowering'), ARRAY['https://images.unsplash.com/photo-1566904626359-19597395420e?auto=format&fit=crop&w=800'], 15, false),

-- Air Purifying
('Spider Plant', 'spider-plant', 249, null, 'Easy to grow and produces "pups". Excellent air cleaner.', 'Moderate watering. bright indirect light.', (SELECT id FROM categories WHERE slug = 'air-purifying'), ARRAY['https://images.unsplash.com/photo-1572688484279-a21d27938e6e?auto=format&fit=crop&w=800'], 80, false),
('Rubber Plant', 'rubber-plant', 649, null, 'Glossy burgundy leaves that make a statement.', 'Keep soil moist. Bright indirect light.', (SELECT id FROM categories WHERE slug = 'air-purifying'), ARRAY['https://images.unsplash.com/photo-1613143302636-6eabb317454e?auto=format&fit=crop&w=800'], 35, true),
('Areca Palm', 'areca-palm', 999, 850, 'Feathery arching fronds, perfect for living rooms.', 'Keep moist. Bright indirect light.', (SELECT id FROM categories WHERE slug = 'air-purifying'), ARRAY['https://images.unsplash.com/photo-1612365476686-21845877cb7b?auto=format&fit=crop&w=800'], 25, false),

-- Hanging
('Money Plant', 'money-plant', 199, 149, 'Fast growing trailing vine, brings good luck.', 'Water weekly. Low to bright light.', (SELECT id FROM categories WHERE slug = 'hanging'), ARRAY['https://images.unsplash.com/photo-1600411833196-7c1f6b15278c?auto=format&fit=crop&w=800'], 100, false),
('String of Pearls', 'string-of-pearls', 450, null, 'Cascading stems of round, bead-like leaves.', 'Careful watering. Bright light.', (SELECT id FROM categories WHERE slug = 'hanging'), ARRAY['https://images.unsplash.com/photo-1518385989710-5390623ae1b0?auto=format&fit=crop&w=800'], 20, false),

-- Medicinal
('Tulsi (Holy Basil)', 'tulsi', 150, null, 'Sacred plant with immense medicinal benefits.', 'Daily watering. Full sun.', (SELECT id FROM categories WHERE slug = 'medicinal'), ARRAY['https://images.unsplash.com/photo-1515585094935-86f78440817c?auto=format&fit=crop&w=800'], 200, false),
('Mint', 'mint', 120, null, 'Fast growing herb, perfect for tea and garnishes.', 'Keep moist. Partial sun.', (SELECT id FROM categories WHERE slug = 'medicinal'), ARRAY['https://images.unsplash.com/photo-1626818165032-47346734fb46?auto=format&fit=crop&w=800'], 80, false),

-- Fruit
('Lemon Plant', 'lemon', 550, null, 'Grow fresh lemons in your garden or large pot.', 'Regular water. Full sun.', (SELECT id FROM categories WHERE slug = 'fruit'), ARRAY['https://images.unsplash.com/photo-1595058564243-d421d604975c?auto=format&fit=crop&w=800'], 30, false),

-- Ferns
('Boston Fern', 'boston-fern', 399, null, 'Classic bushy fern with arching fronds.', 'High humidity. Indirect light.', (SELECT id FROM categories WHERE slug = 'ferns'), ARRAY['https://images.unsplash.com/photo-1601985705806-096a7943ad65?auto=format&fit=crop&w=800'], 40, false);
