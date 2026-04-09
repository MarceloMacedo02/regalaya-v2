-- ============================================
-- SEED DATA FOR REGALAYA API
-- ============================================

-- ============================================
-- 1. CATEGORIES
-- ============================================
INSERT INTO categories (id, name, slug, description, image_url, parent_id, sort_order, is_active, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Chocolates', 'chocolates', 'Chocolates artesanais e premium', NULL, NULL, 1, true, NOW(), NOW()),
  (gen_random_uuid(), 'Flores', 'flores', 'Buquês e arranjos florais', NULL, NULL, 2, true, NOW(), NOW()),
  (gen_random_uuid(), 'Bebidas', 'bebidas', 'Vinhos, Champagnes e mais', NULL, NULL, 3, true, NOW(), NOW()),
  (gen_random_uuid(), 'Bem-estar', 'bem-estar', 'Spa e relaxamento', NULL, NULL, 4, true, NOW(), NOW()),
  (gen_random_uuid(), 'Acessórios', 'acessorios', 'Relógios, joias e acessórios', NULL, NULL, 5, true, NOW(), NOW()),
  (gen_random_uuid(), 'Personalizados', 'personalizados', 'Presentes únicos e personalizados', NULL, NULL, 6, true, NOW(), NOW()),
  (gen_random_uuid(), 'Decoração', 'decoracao', 'Itens decorativos para casa', NULL, NULL, 7, true, NOW(), NOW()),
  (gen_random_uuid(), 'Experiências', 'experiencias', 'Vouchers de experiências', NULL, NULL, 8, true, NOW(), NOW()),
  (gen_random_uuid(), 'Cestas de Presentes', 'cestas-de-presentes', 'Cestas completas para presentear', NULL, NULL, 9, true, NOW(), NOW()),
  (gen_random_uuid(), 'Livros e Papelaria', 'livros-e-papelaria', 'Livros, agendas e itens de papelaria', NULL, NULL, 10, true, NOW(), NOW()),
  (gen_random_uuid(), 'Eletrônicos', 'eletronicos', 'Gadgets e acessórios tecnológicos', NULL, NULL, 11, true, NOW(), NOW()),
  (gen_random_uuid(), 'Casa e Cozinha', 'casa-e-cozinha', 'Itens práticos e decorativos', NULL, NULL, 12, true, NOW(), NOW());

-- ============================================
-- 2. PRODUCTS
-- ============================================
-- Store category IDs for reference
DO $$
DECLARE
  v_chocolates UUID;
  v_flores UUID;
  v_bebidas UUID;
  v_bemestar UUID;
  v_acessorios UUID;
  v_personalizados UUID;
  v_decoracao UUID;
  v_experiencias UUID;
  v_cestas UUID;
  v_livros UUID;
  v_eletronicos UUID;
  v_casa UUID;
BEGIN
  SELECT id INTO v_chocolates FROM categories WHERE slug = 'chocolates';
  SELECT id INTO v_flores FROM categories WHERE slug = 'flores';
  SELECT id INTO v_bebidas FROM categories WHERE slug = 'bebidas';
  SELECT id INTO v_bemestar FROM categories WHERE slug = 'bem-estar';
  SELECT id INTO v_acessorios FROM categories WHERE slug = 'acessorios';
  SELECT id INTO v_personalizados FROM categories WHERE slug = 'personalizados';
  SELECT id INTO v_decoracao FROM categories WHERE slug = 'decoracao';
  SELECT id INTO v_experiencias FROM categories WHERE slug = 'ex  SELECT id INTO v_casa FROM categories WHERE slug = 'casa-e-cozinha';

  INSERT INTO products (id, name, slug, description, short_description, price, compare_at_price, sku, stock, is_active, images, category_id, tags, created_at, updated_at)
  VALUES
    (gen_random_uuid(), 'Caixa de Bombons Belga', 'caixa-bombons-belga', 'Caixa com 12 chocolates belgas de diferentes sabores. Perfeito para presentear em qualquer ocasião. Cada chocolate é feito à mão com ingredientes premium importados da Bélgica.', '12 chocolates belgas artesanais', 89.90, 109.90, 'CHOC-001', 50, true, '["/images/products/chocolates.jpg"]', v_chocolates, 'chocolate, doce, belga, gourmet', NOW(), NOW()),
    (gen_random_uuid(), 'Trufas Artesanais Sortidas', 'trufas-artesanais-sortidas', 'Caixa com 24 trufas artesanais nos sabores: chocolate ao leite, dark, branco, avelã e maracujá. Produzidas diariamente com ingredientes frescos.', '24 trufas de sabores variados', 69.90, NULL, 'CHOC-002', 75, true, '["/images/products/chocolates.jpg"]', v_chocolates, 'chocolate, trufa, doce', NOW(), NOW()),
    (gen_random_uuid(), 'Buquê de Rosas Vermelhas', 'bouquet-rosas-vermelhas', 'Buquê com 24 rosas vermelhas frescas, envolto em papel kraft e fita de cetim. Perfeito para declarações de amor e aniversários.', '24 rosas vermelhas frescas', 189.90, 229.90, 'FLO-001', 20, true, '["/images/products/flores.jpg"]', v_flores, 'flores, rosas, romântico', NOW(), NOW()),
    (gen_random_uuid(), 'Arranjo de Orquídeas', 'arranjo-orquideas', 'Vaso com orquídea Phalaenopsis branca. Planta elegante e duradoura que floresce por meses. Ideal para decoração sofisticada.', 'Orquídea Phalaenopsis em vaso', 159.90, NULL, 'FLO-002', 15, true, '["/images/products/flores.jpg"]', v_flores, 'flores, orquídea, planta, decoração', NOW(), NOW()),
    (gen_random_uuid(), 'Vinho Tinto Premium', 'vinho-tinto-premium', 'Garrafa de vinho tinto chileno Cabernet Sauvignon reserva. Safra 2020, envelhecido por 12 meses em barris de carvalho francês. Notas de frutas vermelhas e especiarias.', 'Cabernet Sauvignon Reserva 2020', 289.90, 349.90, 'VIN-001', 15, true, '["/images/products/vinho.jpg"]', v_bebidas, 'vinho, tinto, bebida, álcool', NOW(), NOW()),
    (gen_random_uuid(), 'Champagne Moët & Chandon', 'champagne-moet-chandon', 'Garrafa de Champagne Moët & Chandon Impérial 750ml. Elegante e sofisticado, perfeito para celebrações especiais.', 'Moët & Chandon Impérial 750ml', 349.90, NULL, 'VIN-002', 10, true, '["/images/products/vinho.jpg"]', v_bebidas, 'champagne, vinho, espumante, celebração, álcool', NOW(), NOW()),
    (gen_random_uuid(), 'Kit Spa Relaxante', 'kit-spa-relaxante', 'Kit completo com óleos essenciais de lavanda, velas aromáticas, sais de banho e máscara facial. Perfeito para criar um ambiente de spa em casa.', 'Kit completo de spa em casa', 199.90, 249.90, 'SPA-001', 30, true, '["/images/products/spa.jpg"]', v_bemestar, 'spa, relaxamento, massagem, bem-estar, autocuidado', NOW(), NOW()),
    (gen_random_uuid(), 'Difusor de Aromas Premium', 'difusor-aromas-premium', 'Difusor de aromas em cerâmica artesanal com 3 óleos essenciais: eucalipto, lavanda e capim-limão. Duração de até 90 dias.', 'Cerâmica artesanal + 3 óleos', 129.90, NULL, 'SPA-002', 25, true, '["/images/products/spa.jpg"]', v_bemestar, 'aroma, difusor, relaxamento, casa', NOW(), NOW()),
    (gen_random_uuid(), 'Relógio Elegante', 'relogio-elegante', 'Relógio com design elegante e pulseira de couro legítimo. Resistência à água IP67. Movimento japonês de alta precisão. Caixa em aço inoxidável.', 'Design clássico com pulseira de couro', 459.90, 599.90, 'REL-001', 10, true, '["/images/products/joias.jpg"]', v_acessorios, 'relógio, masculino, acessório, couro', NOW(), NOW()),
    (gen_random_uuid(), 'Colar de Prata com Pingente', 'colar-prata-pingente', 'Colar em prata 925 com pingente de coração banhado a ouro rosé. Acompanha caixa de presente e certificado de autenticidade.', 'Prata 925 com banho ouro rosé', 259.90, NULL, 'ACE-001', 20, true, '["/images/products/joias.jpg"]', v_acessorios, 'joia, colar, prata, feminino', NOW(), NOW()),
    (gen_random_uuid(), 'Caneca Personalizada Térmica', 'caneca-personalizada-termica', 'Caneca térmica em aço inox 500ml com personalização laser. Mantém bebidas quentes por 12h e frias por 24h. Ideal para presentes corporativos.', 'Aço inox 500ml com gravação laser', 79.90, NULL, 'CAN-001', 100, true, '["/images/products/perfume.jpg"]', v_personalizados, 'caneca, térmico, café, personalizado', NOW(), NOW()),
    (gen_random_uuid(), 'Álbum de Fotos Personalizado', 'album-fotos-personalizado', 'Álbum de fotos capa dura com 40 páginas. Personalização na capa com nome e data. Papel fotográfico de alta qualidade.', '40 páginas com capa personalizada', 149.90, 189.90, 'PER-001', 35, true, '["/images/products/perfume.jpg"]', v_personalizados, 'álbum, fotos, personalizado, memórias', NOW(), NOW()),
    (gen_random_uuid(), 'Almofada Decorativa Veludo', 'almofada-decorativa-veludo', 'Almofada decorativa em veludo premium 45x45cm. Tecido 100% poliéster com enchimento em fibra siliconada. Disponível em 8 cores.', 'Veludo premium 45x45cm', 89.90, NULL, 'ALM-001', 45, true, '["/images/products/chocolates.jpg"]', v_decoracao, 'almofada, decoração, casa, conforto', NOW(), NOW()),
    (gen_random_uuid(), 'Porta-joias Artesanal', 'porta-joias-artesanal', 'Porta-joias de madeira MDF com acabamento em veludo interno. 3 compartimentos organizados com espelho na tampa.', 'Madeira com veludo interno', 129.90, NULL, 'JOI-001', 25, true, '["/images/products/joias.jpg"]', v_decoracao, 'porta-joias, decoração, feminino, madeira', NOW(), NOW()),
    (gen_random_uuid(), 'Vale Experiência Gourmet', 'vale-experiencia-gourmet', 'Voucher para jantar em restaurante estrelado Michelin. Válido para 2 pessoas com menu degustação de 5 tempos. Validade de 12 meses.', 'Jantar degustação para 2 pessoas', 499.90, NULL, 'EXP-001', 50, true, '["/images/products/experiencia.jpg"]', v_experiencias, 'experiência, gourmet, jantar, romântico', NOW(), NOW()),
    (gen_random_uuid(), 'Cesta de Café da Manhã', 'cesta-cafe-manha', 'Cesta de vime com pães artesanais, queijos importados, frutas frescas, suco natural, mel orgânico e geleia artesanal. Perfeita para surpreender.', 'Cesta gourmet completa', 249.90, 299.90, 'CES-001', 18, true, '["/images/products/cesta.jpg"]', v_cestas, 'cesta, café, gourmet, café da manhã', NOW(), NOW()),
    (gen_random_uuid(), 'Cesta de Chocolates Premium', 'cesta-chocolates-premium', 'Cesta decorada com chocolates importados: Lindt, Ferrero Rocher, Godiva e trufas artesanais. Aproximadamente 1kg de chocolates.', '1kg de chocolates importados', 329.90, 399.90, 'CES-002', 12, true, '["/images/products/cesta.jpg"]', v_cestas, 'cesta, chocolate, lindt, presente', NOW(), NOW()),
    (gen_random_uuid(), 'Jogo de Panelas Premium', 'jogo-panelas-premium', 'Jogo com 7 peças em aço inox 18/10. Antiaderente e compatível com indução. Inclui: 2 panelas, 1 frigideira, 1 leiteira e 1 panela de pressão.', '7 peças aço inox 18/10', 599.90, 799.90, 'PAN-001', 8, true, '["/images/products/panelas.jpg"]', v_casa, 'panelas, cozinha, gourmet, inox', NOW(), NOW()),
    (gen_random_uuid(), 'Fone Bluetooth Premium', 'fone-bluetooth-premium', 'Fone de ouvido sem fio com cancelamento de ruído ativo. Bateria de 30 horas. Driver de 40mm com som Hi-Fi. Dobrável com estojo de transporte.', 'Cancelamento de ruído ativo, 30h bateria', 349.90, 449.90, 'FON-001', 22, true, '["/images/products/fone.jpg"]', v_eletronicos, 'fone, bluetooth, som, música, tech', NOW(), NOW()),
    (gen_random_uuid(), 'Smartwatch Fitness', 'smartwatch-fitness', 'Smartwatch com monitor cardíaco, GPS integrado, resistente à água IP68. Tela AMOLED 1.4". Bateria de 14 dias. Compatível com iOS e Android.', 'Monitor cardíaco + GPS integrado', 599.90, NULL, 'SMA-001', 15, true, '["/images/products/fone.jpg"]', v_eletronicos, 'smartwatch, fitness, tech, relógio, saúde', NOW(), NOW());

  RAISE NOTICE 'Inserted 20 products';
.90, NULL, 'SMA-001', 15, true, '["/images/products/fone.jpg"]', v_eletronicos, NOW(), NOW());

  RAISE NOTICE 'Inserted 20 products';
END $$;

-- ============================================
-- 3. ORDERS WITH ITEMS
-- ============================================
DO $$
DECLARE
  v_customer_name TEXT;
  v_customer_email TEXT;
  v_order_id UUID;
  v_item_id UUID;
  v_product_id UUID;
  v_product_name TEXT;
  v_product_sku TEXT;
  v_product_price NUMERIC;
  v_product_images TEXT;
  v_quantity INT;
  v_item_total NUMERIC;
  v_subtotal NUMERIC;
  v_total NUMERIC;
  v_status TEXT;
  v_payment_method TEXT;
  v_payment_status TEXT;
  v_days_ago INT;
  v_created TIMESTAMP;
  v_tracking TEXT;
  statuses TEXT[] := ARRAY['PENDING','PROCESSING','SHIPPED','DELIVERED','DELIVERED','DELIVERED','CANCELLED'];
  payment_methods TEXT[] := ARRAY['credit_card','pix','credit_card','debit_card','boleto'];
  customer_names TEXT[] := ARRAY['João Silva','Maria Santos','Pedro Costa','Ana Oliveira','Carlos Lima','Fernanda Souza','Ricardo Alves','Juliana Martins'];
  customer_emails TEXT[] := ARRAY['joao@email.com','maria@email.com','pedro@email.com','ana@email.com','carlos@email.com','fernanda@email.com','ricardo@email.com','juliana@email.com'];
BEGIN
  FOR i IN 1..25 LOOP
    v_customer_name := customer_names[1 + (i % 8)];
    v_customer_email := customer_emails[1 + (i % 8)];
    v_status := statuses[1 + (i % 7)];
    v_payment_method := payment_methods[1 + (i % 5)];
    v_payment_status := CASE 
      WHEN v_status = 'cancelled' THEN 'failed'
      WHEN v_status = 'pending' THEN 'pending'
      ELSE 'paid'
    END;
    v_days_ago := 1 + (i * 2);
    v_created := NOW() - (v_days_ago || ' days')::INTERVAL;
    v_tracking := CASE 
      WHEN v_status IN ('shipped','delivered') THEN 'BR' || (100000000 + i * 12345)::TEXT
      ELSE NULL
    END;

    INSERT INTO orders (id, order_number, customer_name, customer_email, customer_phone, status, payment_method, payment_status, shipping_address, notes, tracking_code, subtotal, shipping, discount, total, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      'REG-2026-' || LPAD(i::TEXT, 4, '0'),
      v_customer_name,
      v_customer_email,
      '+55 11 9' || (9000 + i)::TEXT || '-' || LPAD((1000 + i)::TEXT, 4, '0'),
      v_status::TEXT,
      v_payment_method,
      v_payment_status,
      '',
      '',
      v_tracking,
      0,
      29.90,
      0,
      0,
      v_created,
      v_created
    ) RETURNING id INTO v_order_id;

    v_subtotal := 0;
    FOR j IN 1..(1 + (i % 3)) LOOP
      SELECT id, name, sku, price, images INTO v_product_id, v_product_name, v_product_sku, v_product_price, v_product_images
      FROM products ORDER BY RANDOM() LIMIT 1;
      
      v_quantity := 1 + (i + j) % 3;
      v_item_total := v_product_price * v_quantity;
      v_subtotal := v_subtotal + v_item_total;

      INSERT INTO order_items (id, order_id, product_name, product_sku, quantity, unit_price, total, image_url, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        v_order_id,
        v_product_name,
        v_product_sku,
        v_quantity,
        v_product_price,
        v_item_total,
        CASE WHEN v_product_images != '[]' THEN substring(v_product_images from 3 for position('"' in substring(v_product_images from 3)) - 2) ELSE '' END,
        v_created,
        v_created
      );
    END LOOP;

    v_total := v_subtotal + 29.90;
    IF i % 5 = 0 THEN
      v_total := v_total - (v_subtotal * 0.10);
      UPDATE orders SET discount = v_subtotal * 0.10, shipping = 0 WHERE id = v_order_id;
    END IF;

    UPDATE orders SET subtotal = v_subtotal, total = v_total WHERE id = v_order_id;
  END LOOP;

  RAISE NOTICE 'Inserted 25 orders with items';
END $$;

-- ============================================
-- Verify results
-- ============================================
SELECT 'Categories: ' || COUNT(*) AS result FROM categories
UNION ALL
SELECT 'Products: ' || COUNT(*) FROM products
UNION ALL
SELECT 'Orders: ' || COUNT(*) FROM orders
UNION ALL
SELECT 'Order Items: ' || COUNT(*) FROM order_items;
