-- Script para associar tags aos produtos baseado em keywords
-- Execute após 00-create-tables.sql, 01-insert-tags.sql e 02-insert-tag-keywords.sql

-- Limpar associações anteriores
DELETE FROM product_tags;

-- Associar tags de preço
INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
CROSS JOIN tags t
WHERE t.name = 'até-50' AND p.price <= 50
ON CONFLICT DO NOTHING;

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
CROSS JOIN tags t
WHERE t.name = 'até-100' AND p.price > 50 AND p.price <= 100
ON CONFLICT DO NOTHING;

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
CROSS JOIN tags t
WHERE t.name = 'até-200' AND p.price > 100 AND p.price <= 200
ON CONFLICT DO NOTHING;

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
CROSS JOIN tags t
WHERE t.name = 'acima-200' AND p.price > 200
ON CONFLICT DO NOTHING;

-- Associar tags por keyword (busca no nome e descrição do produto)
INSERT INTO product_tags (product_id, tag_id)
SELECT DISTINCT p.id, tk.tag_id
FROM products p
JOIN tag_keywords tk ON LOWER(p.name) LIKE '%' || LOWER(tk.keyword) || '%'
                   OR LOWER(COALESCE(p.description, '')) LIKE '%' || LOWER(tk.keyword) || '%'
                   OR LOWER(COALESCE(p.short_description, '')) LIKE '%' || LOWER(tk.keyword) || '%'
ON CONFLICT DO NOTHING;

-- Verificar resultado
SELECT p.name, COUNT(pt.tag_id) as total_tags
FROM products p
LEFT JOIN product_tags pt ON p.id = pt.product_id
GROUP BY p.id, p.name
ORDER BY total_tags DESC;
