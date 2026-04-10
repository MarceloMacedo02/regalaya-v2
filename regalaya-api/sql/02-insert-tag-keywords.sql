-- Script para популировать tag_keywords baseado na estrutura KEYWORD_TO_TAGS
-- Execute após 01-insert-tags.sql

-- vinho
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'vinho', id, NOW(), NOW() FROM tags WHERE name = 'vinho';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'vinho', id, NOW(), NOW() FROM tags WHERE name = 'bebida';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'vinho', id, NOW(), NOW() FROM tags WHERE name = 'harmonização';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'vinho', id, NOW(), NOW() FROM tags WHERE name = 'presente-gourmet';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'vinho', id, NOW(), NOW() FROM tags WHERE name = 'adulto';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'vinho', id, NOW(), NOW() FROM tags WHERE name = 'luxo';

-- espumante
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'espumante', id, NOW(), NOW() FROM tags WHERE name = 'espumante';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'espumante', id, NOW(), NOW() FROM tags WHERE name = 'bebida';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'espumante', id, NOW(), NOW() FROM tags WHERE name = 'celebração';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'espumante', id, NOW(), NOW() FROM tags WHERE name = 'casamento';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'espumante', id, NOW(), NOW() FROM tags WHERE name = 'aniversário';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'espumante', id, NOW(), NOW() FROM tags WHERE name = 'luxo';

-- cerveja
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'cerveja', id, NOW(), NOW() FROM tags WHERE name = 'cerveja';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'cerveja', id, NOW(), NOW() FROM tags WHERE name = 'bebida';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'cerveja', id, NOW(), NOW() FROM tags WHERE name = 'informal';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'cerveja', id, NOW(), NOW() FROM tags WHERE name = 'masculino';

-- whisky
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'whisky', id, NOW(), NOW() FROM tags WHERE name = 'whisky';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'whisky', id, NOW(), NOW() FROM tags WHERE name = 'bebida';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'whisky', id, NOW(), NOW() FROM tags WHERE name = 'premium';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'whisky', id, NOW(), NOW() FROM tags WHERE name = 'masculino';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'whisky', id, NOW(), NOW() FROM tags WHERE name = 'luxo';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'whisky', id, NOW(), NOW() FROM tags WHERE name = 'adulto';

-- gin
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'gin', id, NOW(), NOW() FROM tags WHERE name = 'gin';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'gin', id, NOW(), NOW() FROM tags WHERE name = 'bebida';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'gin', id, NOW(), NOW() FROM tags WHERE name = 'premium';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'gin', id, NOW(), NOW() FROM tags WHERE name = 'adulto';

-- cachaça
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'cachaça', id, NOW(), NOW() FROM tags WHERE name = 'cachaça';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'cachaça', id, NOW(), NOW() FROM tags WHERE name = 'bebida';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'cachaça', id, NOW(), NOW() FROM tags WHERE name = 'nacional';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'cachaça', id, NOW(), NOW() FROM tags WHERE name = 'adulto';

-- chocolate
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'chocolate', id, NOW(), NOW() FROM tags WHERE name = 'chocolate';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'chocolate', id, NOW(), NOW() FROM tags WHERE name = 'doce';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'chocolate', id, NOW(), NOW() FROM tags WHERE name = 'gourmet';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'chocolate', id, NOW(), NOW() FROM tags WHERE name = 'presente-gourmet';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'chocolate', id, NOW(), NOW() FROM tags WHERE name = 'romântico';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'chocolate', id, NOW(), NOW() FROM tags WHERE name = 'aniversário';

-- azeite
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'azeite', id, NOW(), NOW() FROM tags WHERE name = 'azeite';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'azeite', id, NOW(), NOW() FROM tags WHERE name = 'gourmet';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'azeite', id, NOW(), NOW() FROM tags WHERE name = 'culinária';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'azeite', id, NOW(), NOW() FROM tags WHERE name = 'presente-gourmet';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'azeite', id, NOW(), NOW() FROM tags WHERE name = 'luxo';

-- queijo
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'queijo', id, NOW(), NOW() FROM tags WHERE name = 'queijo';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'queijo', id, NOW(), NOW() FROM tags WHERE name = 'gourmet';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'queijo', id, NOW(), NOW() FROM tags WHERE name = 'harmonização';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'queijo', id, NOW(), NOW() FROM tags WHERE name = 'presente-gourmet';

-- cesta
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'cesta', id, NOW(), NOW() FROM tags WHERE name = 'cesta';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'cesta', id, NOW(), NOW() FROM tags WHERE name = 'kit';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'cesta', id, NOW(), NOW() FROM tags WHERE name = 'presente-gourmet';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'cesta', id, NOW(), NOW() FROM tags WHERE name = 'luxo';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'cesta', id, NOW(), NOW() FROM tags WHERE name = 'dia-dos-pais';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'cesta', id, NOW(), NOW() FROM tags WHERE name = 'dia-das-maes';

-- café
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'café', id, NOW(), NOW() FROM tags WHERE name = 'café';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'café', id, NOW(), NOW() FROM tags WHERE name = 'bebida';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'café', id, NOW(), NOW() FROM tags WHERE name = 'gourmet';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'café', id, NOW(), NOW() FROM tags WHERE name = 'manhã';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'café', id, NOW(), NOW() FROM tags WHERE name = 'presente-corporativo';

-- chá
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'chá', id, NOW(), NOW() FROM tags WHERE name = 'chá';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'chá', id, NOW(), NOW() FROM tags WHERE name = 'bebida';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'chá', id, NOW(), NOW() FROM tags WHERE name = 'bem-estar';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'chá', id, NOW(), NOW() FROM tags WHERE name = 'relaxamento';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'chá', id, NOW(), NOW() FROM tags WHERE name = 'saúde';

-- spa
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'spa', id, NOW(), NOW() FROM tags WHERE name = 'spa';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'spa', id, NOW(), NOW() FROM tags WHERE name = 'bem-estar';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'spa', id, NOW(), NOW() FROM tags WHERE name = 'relaxamento';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'spa', id, NOW(), NOW() FROM tags WHERE name = 'feminino';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'spa', id, NOW(), NOW() FROM tags WHERE name = 'luxo';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'spa', id, NOW(), NOW() FROM tags WHERE name = 'mãe';

-- aromaterapia
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'aromaterapia', id, NOW(), NOW() FROM tags WHERE name = 'aromaterapia';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'aromaterapia', id, NOW(), NOW() FROM tags WHERE name = 'bem-estar';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'aromaterapia', id, NOW(), NOW() FROM tags WHERE name = 'relaxamento';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'aromaterapia', id, NOW(), NOW() FROM tags WHERE name = 'saúde';

-- vela
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'vela', id, NOW(), NOW() FROM tags WHERE name = 'vela';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'vela', id, NOW(), NOW() FROM tags WHERE name = 'bem-estar';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'vela', id, NOW(), NOW() FROM tags WHERE name = 'relaxamento';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'vela', id, NOW(), NOW() FROM tags WHERE name = 'decoração';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'vela', id, NOW(), NOW() FROM tags WHERE name = 'romântico';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'vela', id, NOW(), NOW() FROM tags WHERE name = 'aromaterapia';

-- massagem
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'massagem', id, NOW(), NOW() FROM tags WHERE name = 'massagem';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'massagem', id, NOW(), NOW() FROM tags WHERE name = 'bem-estar';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'massagem', id, NOW(), NOW() FROM tags WHERE name = 'relaxamento';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'massagem', id, NOW(), NOW() FROM tags WHERE name = 'saúde';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'massagem', id, NOW(), NOW() FROM tags WHERE name = 'spa';

-- skincare
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'skincare', id, NOW(), NOW() FROM tags WHERE name = 'skincare';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'skincare', id, NOW(), NOW() FROM tags WHERE name = 'beleza';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'skincare', id, NOW(), NOW() FROM tags WHERE name = 'cuidados';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'skincare', id, NOW(), NOW() FROM tags WHERE name = 'feminino';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'skincare', id, NOW(), NOW() FROM tags WHERE name = 'luxo';

-- perfume
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'perfume', id, NOW(), NOW() FROM tags WHERE name = 'perfume';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'perfume', id, NOW(), NOW() FROM tags WHERE name = 'beleza';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'perfume', id, NOW(), NOW() FROM tags WHERE name = 'luxo';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'perfume', id, NOW(), NOW() FROM tags WHERE name = 'romântico';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'perfume', id, NOW(), NOW() FROM tags WHERE name = 'feminino';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'perfume', id, NOW(), NOW() FROM tags WHERE name = 'masculino';

-- kit
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'kit', id, NOW(), NOW() FROM tags WHERE name = 'kit';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'kit', id, NOW(), NOW() FROM tags WHERE name = 'presente-completo';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'kit', id, NOW(), NOW() FROM tags WHERE name = 'curadoria';

-- décor / decor
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'décor', id, NOW(), NOW() FROM tags WHERE name = 'decoração';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'décor', id, NOW(), NOW() FROM tags WHERE name = 'casa';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'décor', id, NOW(), NOW() FROM tags WHERE name = 'presente-casa';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'décor', id, NOW(), NOW() FROM tags WHERE name = 'luxo';

INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'decor', id, NOW(), NOW() FROM tags WHERE name = 'decoração';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'decor', id, NOW(), NOW() FROM tags WHERE name = 'casa';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'decor', id, NOW(), NOW() FROM tags WHERE name = 'presente-casa';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'decor', id, NOW(), NOW() FROM tags WHERE name = 'luxo';

-- quadro
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'quadro', id, NOW(), NOW() FROM tags WHERE name = 'decoração';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'quadro', id, NOW(), NOW() FROM tags WHERE name = 'arte';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'quadro', id, NOW(), NOW() FROM tags WHERE name = 'casa';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'quadro', id, NOW(), NOW() FROM tags WHERE name = 'presente-casa';

-- planta
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'planta', id, NOW(), NOW() FROM tags WHERE name = 'plantas';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'planta', id, NOW(), NOW() FROM tags WHERE name = 'natureza';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'planta', id, NOW(), NOW() FROM tags WHERE name = 'casa';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'planta', id, NOW(), NOW() FROM tags WHERE name = 'bem-estar';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'planta', id, NOW(), NOW() FROM tags WHERE name = 'sustentável';

-- xícara
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'xícara', id, NOW(), NOW() FROM tags WHERE name = 'utensílios';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'xícara', id, NOW(), NOW() FROM tags WHERE name = 'café';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'xícara', id, NOW(), NOW() FROM tags WHERE name = 'chá';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'xícara', id, NOW(), NOW() FROM tags WHERE name = 'casa';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'xícara', id, NOW(), NOW() FROM tags WHERE name = 'presente-casa';

-- taça
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'taça', id, NOW(), NOW() FROM tags WHERE name = 'utensílios';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'taça', id, NOW(), NOW() FROM tags WHERE name = 'vinho';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'taça', id, NOW(), NOW() FROM tags WHERE name = 'bebida';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'taça', id, NOW(), NOW() FROM tags WHERE name = 'casa';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'taça', id, NOW(), NOW() FROM tags WHERE name = 'presente-casa';

-- joia
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'joia', id, NOW(), NOW() FROM tags WHERE name = 'joia';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'joia', id, NOW(), NOW() FROM tags WHERE name = 'acessório';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'joia', id, NOW(), NOW() FROM tags WHERE name = 'luxo';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'joia', id, NOW(), NOW() FROM tags WHERE name = 'feminino';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'joia', id, NOW(), NOW() FROM tags WHERE name = 'romântico';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'joia', id, NOW(), NOW() FROM tags WHERE name = 'aniversário';

-- pulseira
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'pulseira', id, NOW(), NOW() FROM tags WHERE name = 'pulseira';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'pulseira', id, NOW(), NOW() FROM tags WHERE name = 'joia';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'pulseira', id, NOW(), NOW() FROM tags WHERE name = 'acessório';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'pulseira', id, NOW(), NOW() FROM tags WHERE name = 'feminino';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'pulseira', id, NOW(), NOW() FROM tags WHERE name = 'romântico';

-- colar
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'colar', id, NOW(), NOW() FROM tags WHERE name = 'colar';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'colar', id, NOW(), NOW() FROM tags WHERE name = 'joia';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'colar', id, NOW(), NOW() FROM tags WHERE name = 'acessório';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'colar', id, NOW(), NOW() FROM tags WHERE name = 'feminino';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'colar', id, NOW(), NOW() FROM tags WHERE name = 'luxo';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'colar', id, NOW(), NOW() FROM tags WHERE name = 'romântico';

-- bolsa
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'bolsa', id, NOW(), NOW() FROM tags WHERE name = 'bolsa';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'bolsa', id, NOW(), NOW() FROM tags WHERE name = 'moda';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'bolsa', id, NOW(), NOW() FROM tags WHERE name = 'feminino';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'bolsa', id, NOW(), NOW() FROM tags WHERE name = 'luxo';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'bolsa', id, NOW(), NOW() FROM tags WHERE name = 'acessório';

-- carteira
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'carteira', id, NOW(), NOW() FROM tags WHERE name = 'carteira';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'carteira', id, NOW(), NOW() FROM tags WHERE name = 'moda';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'carteira', id, NOW(), NOW() FROM tags WHERE name = 'masculino';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'carteira', id, NOW(), NOW() FROM tags WHERE name = 'acessório';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'carteira', id, NOW(), NOW() FROM tags WHERE name = 'presente-corporativo';

-- relógio
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'relógio', id, NOW(), NOW() FROM tags WHERE name = 'relógio';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'relógio', id, NOW(), NOW() FROM tags WHERE name = 'acessório';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'relógio', id, NOW(), NOW() FROM tags WHERE name = 'masculino';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'relógio', id, NOW(), NOW() FROM tags WHERE name = 'luxo';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'relógio', id, NOW(), NOW() FROM tags WHERE name = 'presente-corporativo';

-- namorad
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'namorad', id, NOW(), NOW() FROM tags WHERE name = 'romântico';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'namorad', id, NOW(), NOW() FROM tags WHERE name = 'dia-dos-namorados';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'namorad', id, NOW(), NOW() FROM tags WHERE name = 'casal';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'namorad', id, NOW(), NOW() FROM tags WHERE name = 'amor';

-- casamento
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'casamento', id, NOW(), NOW() FROM tags WHERE name = 'casamento';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'casamento', id, NOW(), NOW() FROM tags WHERE name = 'celebração';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'casamento', id, NOW(), NOW() FROM tags WHERE name = 'casal';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'casamento', id, NOW(), NOW() FROM tags WHERE name = 'noivado';

-- bebê
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'bebê', id, NOW(), NOW() FROM tags WHERE name = 'bebê';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'bebê', id, NOW(), NOW() FROM tags WHERE name = 'maternidade';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'bebê', id, NOW(), NOW() FROM tags WHERE name = 'recém-nascido';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'bebê', id, NOW(), NOW() FROM tags WHERE name = 'chá-de-bebê';

-- bebe
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'bebe', id, NOW(), NOW() FROM tags WHERE name = 'bebê';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'bebe', id, NOW(), NOW() FROM tags WHERE name = 'maternidade';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'bebe', id, NOW(), NOW() FROM tags WHERE name = 'recém-nascido';

-- infantil
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'infantil', id, NOW(), NOW() FROM tags WHERE name = 'infantil';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'infantil', id, NOW(), NOW() FROM tags WHERE name = 'criança';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'infantil', id, NOW(), NOW() FROM tags WHERE name = 'brinquedo';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'infantil', id, NOW(), NOW() FROM tags WHERE name = 'aniversário-infantil';

-- mãe
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'mãe', id, NOW(), NOW() FROM tags WHERE name = 'mãe';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'mãe', id, NOW(), NOW() FROM tags WHERE name = 'dia-das-maes';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'mãe', id, NOW(), NOW() FROM tags WHERE name = 'feminino';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'mãe', id, NOW(), NOW() FROM tags WHERE name = 'família';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'mãe', id, NOW(), NOW() FROM tags WHERE name = 'afeto';

-- pai
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'pai', id, NOW(), NOW() FROM tags WHERE name = 'pai';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'pai', id, NOW(), NOW() FROM tags WHERE name = 'dia-dos-pais';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'pai', id, NOW(), NOW() FROM tags WHERE name = 'masculino';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'pai', id, NOW(), NOW() FROM tags WHERE name = 'família';

-- corporativo
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'corporativo', id, NOW(), NOW() FROM tags WHERE name = 'presente-corporativo';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'corporativo', id, NOW(), NOW() FROM tags WHERE name = 'empresarial';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'corporativo', id, NOW(), NOW() FROM tags WHERE name = 'profissional';
INSERT INTO tag_keywords (id, keyword, tag_id, created_at, updated_at)
SELECT gen_random_uuid(), 'corporativo', id, NOW(), NOW() FROM tags WHERE name = 'networking';
