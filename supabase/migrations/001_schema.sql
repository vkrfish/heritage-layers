-- ============================================================
-- 9 Stories & Co. — Supabase Database Schema
-- Run this in: Supabase Dashboard -> SQL Editor -> Run
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Sweets',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  badge TEXT,
  rating NUMERIC(3,1) NOT NULL DEFAULT 0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  ingredients TEXT NOT NULL DEFAULT '',
  allergens TEXT NOT NULL DEFAULT '',
  storage TEXT NOT NULL DEFAULT '',
  shelf_life TEXT NOT NULL DEFAULT '',
  dietary_tags TEXT[] NOT NULL DEFAULT '{}',
  flavor_profile TEXT NOT NULL DEFAULT '',
  is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
  is_new_arrival BOOLEAN NOT NULL DEFAULT FALSE,
  is_gifting_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  is_special_offer BOOLEAN NOT NULL DEFAULT FALSE,
  is_under_99 BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active','Draft','Archived')),
  stock INTEGER NOT NULL DEFAULT 0,
  rating_histogram JSONB NOT NULL DEFAULT '{"5":0,"4":0,"3":0,"2":0,"1":0}'::jsonb,
  weights JSONB NOT NULL DEFAULT '[]'::jsonb,
  frequently_bought_with_slugs TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'UPI' CHECK (payment_method IN ('UPI','Card','COD')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Processing','Shipped','Delivered','Cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROMO CODES
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage','flat','free_shipping')),
  discount_value NUMERIC(10,2) NOT NULL DEFAULT 0,
  min_subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  uses INTEGER NOT NULL DEFAULT 0,
  use_limit INTEGER NOT NULL DEFAULT 1000,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOURNAL POSTS
CREATE TABLE IF NOT EXISTS public.journal_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT 'Editorial',
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Published','Draft')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- UPDATED_AT TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS journal_updated_at ON public.journal_posts;
CREATE TRIGGER journal_updated_at BEFORE UPDATE ON public.journal_posts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS settings_updated_at ON public.site_settings;
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ROW LEVEL SECURITY
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_products" ON public.products FOR SELECT USING (status = 'Active');
CREATE POLICY "public_read_announcements" ON public.announcements FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_read_journal" ON public.journal_posts FOR SELECT USING (status = 'Published');
CREATE POLICY "public_read_promo_codes" ON public.promo_codes FOR SELECT USING (is_active = TRUE);

CREATE POLICY "admin_all_products" ON public.products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_promo_codes" ON public.promo_codes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_announcements" ON public.announcements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_journal" ON public.journal_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "public_insert_orders" ON public.orders FOR INSERT WITH CHECK (TRUE);

-- SEED ANNOUNCEMENTS
INSERT INTO public.announcements (text, is_active, sort_order) VALUES
  ('? Special Festive Offer: Get 10% OFF on Gift Boxes with code FESTIVE10', TRUE, 1),
  ('?? FREE Shipping on all Orders Above ?999 across India!', TRUE, 2),
  ('?? International Diaspora Express Shipping to USA, UK, UAE & Australia', TRUE, 3),
  ('?? 100% Pure Organic Ingredients & Fresh Artisanal A2 Ghee Sweets', TRUE, 4)
ON CONFLICT DO NOTHING;

-- SEED PROMO CODES
INSERT INTO public.promo_codes (code, discount_type, discount_value, min_subtotal, is_active, use_limit, expires_at) VALUES
  ('FESTIVE10', 'percentage', 10, 499, TRUE, 500, '2026-12-31 23:59:59+00'),
  ('FREESHIP', 'flat', 79, 999, TRUE, 1000, '2026-12-31 23:59:59+00'),
  ('FIRSTFOLD10', 'percentage', 10, 0, TRUE, 500, '2026-12-31 23:59:59+00')
ON CONFLICT (code) DO NOTHING;

-- SEED SITE SETTINGS
INSERT INTO public.site_settings (key, value) VALUES
  ('store_name', '9 Stories & Co.'),
  ('support_email', 'care@9stories.co'),
  ('phone', '+91 90000 90000'),
  ('currency', 'INR'),
  ('free_shipping_above', '999'),
  ('shipping_flat', '79'),
  ('cod_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- SEED PRODUCTS
INSERT INTO public.products (slug, name, tagline, category, description, image_url, badge, rating, reviews_count, is_best_seller, is_new_arrival, is_gifting_favorite, is_special_offer, is_under_99, dietary_tags, flavor_profile, status, stock, ingredients, allergens, storage, shelf_life, rating_histogram, weights, frequently_bought_with_slugs) VALUES
('classic-putharekulu','Classic Putharekulu','The original paper-thin rice sweet','Sweets','Paper-thin rice starch sheets expertly folded around fine powdered sugar and pure cow ghee.','',NULL,4.9,214,TRUE,FALSE,FALSE,FALSE,FALSE,ARRAY['Vegetarian','Traditional','Artisan'],'Melt-in-mouth Sweet & Nutty Ghee','Active',48,'Rice starch sheets, powdered organic sugar, pure clarified cow ghee.','Made in a facility that processes tree nuts and dairy.','Store in an airtight container in a cool, dry place.','15 days from preparation date.','{"5":185,"4":22,"3":5,"2":2,"1":0}','[{"label":"250g (6 pcs)","weightGrams":250,"price":349,"msrp":399},{"label":"500g (12 pcs)","weightGrams":500,"price":649,"msrp":749},{"label":"1kg (24 pcs)","weightGrams":1000,"price":1199,"msrp":1399}]',ARRAY['ghee-putharekulu','artisan-gunpowder-podi']),
('ghee-putharekulu','Royal Ghee Putharekulu','Double-brushed with slow-clarified A2 ghee','Sweets','Layer upon layer brushed with slow-clarified A2 cow ghee for an extra rich aroma and silky texture.','','Bestseller',4.9,168,TRUE,FALSE,TRUE,FALSE,FALSE,ARRAY['Pure A2 Ghee','Vegetarian'],'Rich A2 Ghee & Warm Sugar','Active',120,'Rice starch sheets, refined sugar, slow-crafted A2 cow ghee.','Contains dairy.','Airtight container at room temperature.','14 days from preparation date.','{"5":150,"4":14,"3":4,"2":0,"1":0}','[{"label":"250g (6 pcs)","weightGrams":250,"price":429,"msrp":499},{"label":"500g (12 pcs)","weightGrams":500,"price":799,"msrp":899},{"label":"1kg (24 pcs)","weightGrams":1000,"price":1499,"msrp":1699}]',ARRAY['dry-fruit-putharekulu','premium-gift-box']),
('dry-fruit-putharekulu','Dry Fruit Putharekulu','Hand-slivered almonds, pistachios & cashews','Sweets','Finely chopped Iranian pistachios, Mamra almonds, and roasted cashews layered between delicate rice wafers.','','Must Try',4.8,132,FALSE,TRUE,TRUE,FALSE,FALSE,ARRAY['Rich Nut Blend','Vegetarian'],'Nutty Crunch & Silky Sweetness','Active',36,'Rice sheets, powdered sugar, A2 ghee, roasted almonds, pistachios, cashews.','Contains tree nuts and dairy.','Airtight container, cool and dry.','12 days from preparation date.','{"5":110,"4":18,"3":4,"2":0,"1":0}','[{"label":"250g (6 pcs)","weightGrams":250,"price":499,"msrp":599},{"label":"500g (12 pcs)","weightGrams":500,"price":929,"msrp":1099},{"label":"1kg (24 pcs)","weightGrams":1000,"price":1799,"msrp":1999}]',ARRAY['classic-putharekulu','jaggery-putharekulu']),
('jaggery-putharekulu','Organic Jaggery Putharekulu','Unrefined palm jaggery, grand-mother recipe','Sweets','Dark organic palm jaggery instead of refined sugar — earthier, complex caramel notes.','',NULL,4.7,96,TRUE,FALSE,FALSE,FALSE,FALSE,ARRAY['Jaggery Based','Refined Sugar Free','Vegetarian'],'Earthy Molasses & Rich Ghee','Active',64,'Rice starch sheets, organic palm jaggery, pure cow ghee.','Contains dairy.','Airtight container, away from moisture.','15 days from preparation date.','{"5":75,"4":15,"3":6,"2":0,"1":0}','[{"label":"250g (6 pcs)","weightGrams":250,"price":399,"msrp":449},{"label":"500g (12 pcs)","weightGrams":500,"price":749,"msrp":849},{"label":"1kg (24 pcs)","weightGrams":1000,"price":1399,"msrp":1599}]',ARRAY['spicy-butter-murukku','classic-putharekulu']),
('premium-gift-box','Royal Heritage Gift Box','4 Varieties in a silk-wrapped keepsake box','Gift Boxes','A hand-crafted keepsake box holding Classic, Ghee, Dry Fruit, and Jaggery Putharekulu varieties.','','Luxury Gift',5.0,87,TRUE,FALSE,TRUE,FALSE,FALSE,ARRAY['Assorted','Festive Special'],'Assorted Heritage Delights','Active',18,'Rice sheets, powdered sugar, palm jaggery, cow ghee, mixed nuts.','Contains tree nuts and dairy.','Keep box closed in a cool, dry place.','14 days from packing date.','{"5":87,"4":0,"3":0,"2":0,"1":0}','[{"label":"500g (12 pcs)","weightGrams":500,"price":1099,"msrp":1299},{"label":"1kg (24 pcs)","weightGrams":1000,"price":1999,"msrp":2399}]',ARRAY['artisan-gunpowder-podi','spicy-butter-murukku']),
('spicy-butter-murukku','Spicy Butter Murukku','Crunchy spiral savories crafted in pure butter','Savouries','Traditional fried spirals made with rice flour, roasted gram flour, sesame seeds, and farm-fresh butter.','',NULL,4.8,112,TRUE,FALSE,FALSE,FALSE,FALSE,ARRAY['Crispy','Gluten-Free','Vegetarian'],'Spicy, Savory & Buttery','Active',75,'Rice flour, roasted gram flour, fresh butter, cumin seeds, red chili powder, salt.','Contains dairy.','Store in a sealed airtight jar.','30 days from preparation date.','{"5":92,"4":16,"3":4,"2":0,"1":0}','[{"label":"250g","weightGrams":250,"price":199,"msrp":249},{"label":"500g","weightGrams":500,"price":379,"msrp":449},{"label":"1kg","weightGrams":1000,"price":699,"msrp":799}]',ARRAY[]::text[]),
('artisan-gunpowder-podi','Artisan Gunpowder Podi','Hand-roasted lentils, red chilies & asafoetida','Podi & Mixes','Coarsely ground blend of slow-roasted toor dal, chana dal, Byadgi red chilies, and aromatic asafoetida.','','Spice Blend',4.9,143,TRUE,FALSE,FALSE,FALSE,FALSE,ARRAY['Vegan','Gluten-Free','Authentic Spice'],'Fiery, Roasted & Savory','Active',90,'Toor dal, chana dal, red chilies, cumin seeds, black pepper, asafoetida, rock salt.','Vegan.','Store in a cool dry place with tight lid.','90 days from packing date.','{"5":130,"4":10,"3":3,"2":0,"1":0}','[{"label":"250g jar","weightGrams":250,"price":249,"msrp":299},{"label":"500g pouch","weightGrams":500,"price":449,"msrp":549}]',ARRAY[]::text[]),
('mini-ghee-mysore-pak','Mini Ghee Mysore Pak (100g)','Rich melt-in-mouth ghee delicacy','Special Offers','Golden blocks of aromatic besan flour cooked in bubbling hot ghee until porous and velvety soft.','','?99 Store',4.7,64,FALSE,FALSE,FALSE,TRUE,TRUE,ARRAY['Pure Ghee','Under ?99'],'Rich Ghee & Cardamom','Active',200,'Gram flour (besan), sugar, pure ghee, cardamom.','Contains dairy.','Keep in a cool dry place.','20 days from packing date.','{"5":50,"4":10,"3":4,"2":0,"1":0}','[{"label":"100g trial pack","weightGrams":100,"price":99,"msrp":149},{"label":"250g pack","weightGrams":250,"price":229,"msrp":279}]',ARRAY[]::text[])
ON CONFLICT (slug) DO NOTHING;

-- STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', TRUE) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_read_product_images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "admin_upload_product_images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "admin_update_product_images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "admin_delete_product_images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
