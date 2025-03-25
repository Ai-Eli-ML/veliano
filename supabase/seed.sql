-- Insert categories first
INSERT INTO public.categories (id, name, slug, description, parent_id) VALUES
('11111111-1111-1111-1111-111111111111', 'Grillz', 'grillz', 'Custom gold grillz for your teeth', NULL),
('22222222-2222-2222-2222-222222222222', 'Jewelry', 'jewelry', 'Premium gold jewelry collection', NULL),
('33333333-3333-3333-3333-333333333333', 'Single Tooth', 'single-tooth', 'Single tooth grillz', '11111111-1111-1111-1111-111111111111'),
('44444444-4444-4444-4444-444444444444', 'Bottom Grillz', 'bottom', 'Bottom row grillz', '11111111-1111-1111-1111-111111111111'),
('55555555-5555-5555-5555-555555555555', 'Chains', 'chains', 'Gold chains', '22222222-2222-2222-2222-222222222222'),
('66666666-6666-6666-6666-666666666666', 'Pendants', 'pendants', 'Gold pendants', '22222222-2222-2222-2222-222222222222');

-- Insert products
INSERT INTO public.products (id, name, slug, description, price, category_id, sku, stock_quantity, is_featured, is_active) VALUES
('77777777-7777-7777-7777-777777777777', '10K Gold Single Tooth Grill', '10k-gold-single-tooth-grill', 'Premium 10K gold single tooth grill, custom fitted for comfort and style.', 199.99, '33333333-3333-3333-3333-333333333333', 'GRILL-10K-SINGLE', 15, true, true),
('88888888-8888-8888-8888-888888888888', '14K Gold 6 Teeth Bottom Grill', '14k-gold-6-teeth-bottom-grill', 'Luxurious 14K gold bottom grill covering 6 teeth, custom made to your specifications.', 599.99, '44444444-4444-4444-4444-444444444444', 'GRILL-14K-BOTTOM-6', 8, true, true),
('99999999-9999-9999-9999-999999999999', '18K Gold Cuban Link Chain', '18k-gold-cuban-link-chain', 'Premium 18K gold Cuban link chain, perfect for any occasion.', 1299.99, '55555555-5555-5555-5555-555555555555', 'CHAIN-18K-CUBAN', 5, true, true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Diamond Pendant', 'diamond-pendant', 'Stunning diamond pendant with 14K gold chain.', 899.99, '66666666-6666-6666-6666-666666666666', 'PEND-DIAMOND', 7, true, true);

-- Insert product images
INSERT INTO public.product_images (id, product_id, url, alt_text, display_order) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '77777777-7777-7777-7777-777777777777', '/placeholder.svg?height=400&width=400', '10K Gold Single Tooth Grill', 0),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '88888888-8888-8888-8888-888888888888', '/placeholder.svg?height=400&width=400', '14K Gold 6 Teeth Bottom Grill', 0),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '99999999-9999-9999-9999-999999999999', '/placeholder.svg?height=400&width=400', '18K Gold Cuban Link Chain', 0),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '/placeholder.svg?height=400&width=400', 'Diamond Pendant', 0); 