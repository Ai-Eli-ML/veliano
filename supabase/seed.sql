-- Insert categories first
INSERT INTO public.categories (id, name, slug, description, image_url, parent_id) VALUES
('cat1', 'Grillz', 'grillz', 'Custom gold grillz for your teeth', '/placeholder.svg?height=400&width=400', NULL),
('cat2', 'Jewelry', 'jewelry', 'Premium gold jewelry collection', '/placeholder.svg?height=400&width=400', NULL),
('cat3', 'Single Tooth', 'single-tooth', 'Single tooth grillz', '/placeholder.svg?height=400&width=400', 'cat1'),
('cat4', 'Bottom Grillz', 'bottom', 'Bottom row grillz', '/placeholder.svg?height=400&width=400', 'cat1'),
('cat5', 'Chains', 'chains', 'Gold chains', '/placeholder.svg?height=400&width=400', 'cat2'),
('cat6', 'Pendants', 'pendants', 'Gold pendants', '/placeholder.svg?height=400&width=400', 'cat2');

-- Insert products
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, sku, inventory_quantity, is_published, featured, has_variants, created_at, updated_at) VALUES
('prod1', '10K Gold Single Tooth Grill', '10k-gold-single-tooth-grill', 'Premium 10K gold single tooth grill, custom fitted for comfort and style.', 199.99, 249.99, 'GRILL-10K-SINGLE', 15, true, true, false, NOW(), NOW()),
('prod2', '14K Gold 6 Teeth Bottom Grill', '14k-gold-6-teeth-bottom-grill', 'Luxurious 14K gold bottom grill covering 6 teeth, custom made to your specifications.', 599.99, 699.99, 'GRILL-14K-BOTTOM-6', 8, true, true, false, NOW(), NOW()),
('prod3', '18K Gold Cuban Link Chain', '18k-gold-cuban-link-chain', 'Premium 18K gold Cuban link chain, perfect for any occasion.', 1299.99, NULL, 'CHAIN-18K-CUBAN', 5, true, true, false, NOW(), NOW()),
('prod4', 'Diamond Pendant', 'diamond-pendant', 'Stunning diamond pendant with 14K gold chain.', 899.99, 999.99, 'PEND-DIAMOND', 7, true, true, false, NOW(), NOW());

-- Insert product images
INSERT INTO public.product_images (id, product_id, url, alt_text, position) VALUES
('img1', 'prod1', '/placeholder.svg?height=400&width=400', '10K Gold Single Tooth Grill', 0),
('img2', 'prod2', '/placeholder.svg?height=400&width=400', '14K Gold 6 Teeth Bottom Grill', 0),
('img3', 'prod3', '/placeholder.svg?height=400&width=400', '18K Gold Cuban Link Chain', 0),
('img4', 'prod4', '/placeholder.svg?height=400&width=400', 'Diamond Pendant', 0);

-- Insert product categories relationships
INSERT INTO public.product_categories (product_id, category_id) VALUES
('prod1', 'cat1'),
('prod1', 'cat3'),
('prod2', 'cat1'),
('prod2', 'cat4'),
('prod3', 'cat2'),
('prod3', 'cat5'),
('prod4', 'cat2'),
('prod4', 'cat6'); 