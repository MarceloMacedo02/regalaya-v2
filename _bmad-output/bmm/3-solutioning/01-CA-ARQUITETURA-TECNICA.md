# ARQUITETURA TÉCNICA (CA) - COMPLETA

**Versão:** 1.0  
**Data:** 07 de abril de 2026  
**Status:** Aprovada  
**Artefato:** CA - Arquitetura Técnica  
**Referência:** `../docs/PRD.md`  

---

## 1. VISÃO GERAL DA ARQUITETURA

### 1.1 Diagrama de Arquitetura (C4 Model)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              REGALAYA - ARQUITETURA                         │
│                              NÍVEL 1: SISTEMA                               │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────────────────────────┐
                              │         USUÁRIOS EXTERNOS           │
                              │  ┌─────────┐ ┌─────────┐ ┌──────┐ │
                              │  │Cliente  │ │ Admin   │ │WhatsApp│ │
                              │  │Web App  │ │Panel    │ │Bot    │ │
                              │  └────┬────┘ └────┬────┘ └───┬──┘ │
                              └────────┼──────────┼──────────┼────┘
                                       │          │          │
                                       ▼          ▼          ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         CANAIS DE ENTRADA (FRONTEND)                        │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌────────────┐│
│  │    regalaya.com.br      │  │   admin.regalaya.com.br │  │WhatsApp   ││
│  │    (Next.js 14)         │  │   (Next.js 14)          │  │Cloud API  ││
│  │    Loja Virtual          │  │   Painel Admin          │  │           ││
│  └───────────┬─────────────┘  └───────────┬─────────────┘  └─────┬────┘│
│              │                              │                      │      │
│              │    HTTPS                       │    HTTPS              │      │
│              └──────────────────────────────┴──────────────────────┘      │
└───────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY / LOAD BALANCER                   │
│                              (AWS ALB / CloudFlare)                       │
│                              Rate Limiting, SSL Termination                │
└───────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                              BACKEND (Spring Boot 3)                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────────┐ │
│  │ Auth Module  │ │ Product Mod  │ │ Order Module │ │  Contact Mod   │ │
│  │ /auth/*     │ │ /products/*  │ │ /orders/*    │ │  /contacts/*  │ │
│  │ /admin/users │ │ /categories  │ │ /payments/*  │ │  /dates/*     │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────────┘ │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────────┐ │
│  │ Cart Module │ │ Dashboard    │ │  IA Module   │ │ Notification   │ │
│  │ /cart/*     │ │ /admin/stats │ │ /ai/*        │ │ /notify/*      │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
              │                    │                    │                    │
              ▼                    ▼                    ▼                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                   │
│   ┌────────────────┐  ┌────────────────┐  ┌────────────────────────────┐ │
│   │  PostgreSQL    │  │    Redis       │  │       S3 / CloudFront      │ │
│   │  (RDS)        │  │  (ElastiCache) │  │       (Assets)            │ │
│   │  + pgvector   │  │  Cache/Session │  │  Images, Files            │ │
│   └────────────────┘  └────────────────┘  └────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                              EXTERNAL SERVICES                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────────┐ │
│  │ OpenAI API  │ │ Stripe/MP   │ │ WhatsApp     │ │ Correios/Loggi│ │
│  │ GPT-4, Ada  │ │ Pagamentos   │ │ Cloud API    │ │ Frete         │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Stack Tecnológico

| Camada | Tecnologia | Versão | Propósito |
|--------|------------|--------|-----------|
| **Frontend Web** | Next.js 14 | 14.x | Loja virtual, SSR/SSG |
| **Frontend Admin** | Next.js 14 | 14.x | Painel administrativo |
| **Backend** | Spring Boot | 3.2.x | API REST, microsserviços |
| **Linguagem Backend** | Java | 21 | LTS, performance |
| **Banco de Dados** | PostgreSQL | 15+ | Dados + pgvector |
| **Cache** | Redis | 7+ | Session, cache |
| **IA** | OpenAI | Latest | GPT-4, Ada-002 |
| **Pagamento** | Stripe/MercadoPago | Latest | Checkout |
| **WhatsApp** | Cloud API | Latest | Bot, notificações |
| **Infraestrutura** | AWS | Latest | ECS, RDS, S3 |

---

## 2. ARQUITETURA DE MÓDULOS (BACKEND)

### 2.1 Estrutura de Pacotes

```
br.com.regalaya/
├── auth/                          # Módulo de Autenticação
│   ├── controller/
│   │   ├── AuthController.java
│   │   └── AdminUserController.java
│   ├── service/
│   │   ├── AuthService.java
│   │   └── impl/
│   ├── repository/
│   ├── domain/model/
│   │   ├── User.java
│   │   ├── Role.java
│   │   └── AuditLog.java
│   ├── dto/requests/
│   ├── dto/responses/
│   ├── infrastructure/
│   │   ├── jwt/
│   │   ├── security/
│   │   ├── email/
│   │   ├── audit/
│   │   └── ratelimit/
│   └── exception/
│
├── product/                       # Módulo de Produtos
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── domain/model/
│   ├── dto/
│   ├── mapper/
│   └── exception/
│
├── category/                      # Módulo de Categorias
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── domain/model/
│   └── dto/
│
├── contact/                      # Módulo de Contatos/Pessoas
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── domain/model/
│   │   ├── Contact.java
│   │   └── SpecialDate.java
│   └── dto/
│
├── cart/                         # Módulo de Carrinho
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── domain/model/
│   └── dto/
│
├── order/                        # Módulo de Pedidos
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── domain/model/
│   └── dto/
│
├── address/                       # Módulo de Endereços
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── domain/model/
│   └── dto/
│
├── dashboard/                    # Módulo de Dashboard/Analytics
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── dto/
│
├── notification/                 # Módulo de Notificações
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── dto/
│
├── ai/                           # Módulo de IA
│   ├── controller/
│   ├── service/
│   │   ├── RecommendationService.java
│   │   └── MessageGenerationService.java
│   └── dto/
│
├── webhook/                      # Módulo de Webhooks
│   ├── controller/
│   ├── service/
│   └── dto/
│
├── payment/                      # Módulo de Pagamentos
│   ├── controller/
│   ├── service/
│   ├── dto/
│   └── integration/
│
├── inventory/                    # Módulo de Estoque
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── dto/
│
└── shared/                       # Módulo Compartilhado
    ├── config/
    ├── exception/
    ├── domain/
    │   └── BaseEntity.java
    └── util/
```

---

## 3. DIAGRAMA DE BANCO DE DADOS (POSTGRESQL)

### 3.1 Schema Principal

```sql
-- =====================================================
-- REGALAYA - SCHEMA PRINCIPAL
-- Versão: 1.0
-- Data: 2026-04-07
-- =====================================================

-- Extensão para vetores (RAG)
CREATE EXTENSION IF NOT EXISTS vector;

-- =====================================================
-- TABELAS DE DOMÍNIO
-- =====================================================

-- Tabela de Usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    plan VARCHAR(20) DEFAULT 'FREE' CHECK (plan IN ('FREE', 'PREMIUM', 'BUSINESS')),
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'MANAGER', 'VIEWER')),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    consent_marketing BOOLEAN DEFAULT FALSE,
    consent_whatsapp BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_phone_check CHECK (phone ~ '^\+?[0-9]{10,15}$')
);

-- Tabela de Perfís (Roles)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de associação User-Role
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, role_id)
);

-- Tabela de Tokens Revogados (para logout)
CREATE TABLE revoked_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_jti VARCHAR(255) UNIQUE NOT NULL,
    token_type VARCHAR(20) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_revoked_tokens_expires (expires_at)
);

-- =====================================================
-- TABELAS DE NEGÓCIO
-- =====================================================

-- Tabela de Categorias
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_parent (parent_id)
);

-- Tabela de Produtos
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    images JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INTEGER DEFAULT 0,
    weight DECIMAL(10, 3),
    dimensions JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_products_slug (slug),
    INDEX idx_products_category (category_id),
    INDEX idx_products_price (price),
    INDEX idx_products_active (is_active)
);

-- Embeddings de Produtos (para RAG)
CREATE TABLE product_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    embedding VECTOR(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE (product_id)
);

-- Tabela de Contatos (Pessoas Queridas)
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    whatsapp_id VARCHAR(100),
    email VARCHAR(255),
    relationship VARCHAR(50),
    birth_date DATE,
    notes TEXT,
    image_url TEXT,
    consent BOOLEAN DEFAULT FALSE,
    consent_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_contacts_user (user_id),
    INDEX idx_contacts_phone (phone)
);

-- Tabela de Datas Especiais
CREATE TABLE special_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('BIRTHDAY', 'ANNIVERSARY', 'CHRISTMAS', 'WEDDING', 'OTHER')),
    date DATE NOT NULL,
    recurrence VARCHAR(20) DEFAULT 'YEARLY' CHECK (recurrence IN ('YEARLY', 'MONTHLY', 'ONCE')),
    reminder_days INTEGER DEFAULT 7,
    last_notified_at TIMESTAMP WITH TIME ZONE,
    next_occurrence DATE GENERATED ALWAYS AS (
        CASE 
            WHEN recurrence = 'YEARLY' THEN DATE_TRUNC('year', CURRENT_DATE) + (date - DATE_TRUNC('year', date))
            WHEN recurrence = 'MONTHLY' THEN DATE_TRUNC('month', CURRENT_DATE) + (date - DATE_TRUNC('month', date))
            ELSE date
        END
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_special_dates_contact (contact_id),
    INDEX idx_special_dates_next (next_occurrence)
);

-- Tabela de Endereços
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    label VARCHAR(50),
    recipient_name VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(100),
    neighborhood VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(50) DEFAULT 'Brazil',
    phone VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    address_type VARCHAR(20) DEFAULT 'delivery' CHECK (address_type IN ('delivery', 'billing', 'both')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_addresses_user (user_id),
    INDEX idx_addresses_zip (zip_code)
);

-- Tabela de Carrinho
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    session_id VARCHAR(255),
    coupon_code VARCHAR(50),
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    shipping_method VARCHAR(50),
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    INDEX idx_carts_user (user_id),
    INDEX idx_carts_session (session_id)
);

-- Tabela de Itens do Carrinho
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_cart_items_cart (cart_id),
    INDEX idx_cart_items_product (product_id)
);

-- Tabela de Pedidos
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED')),
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    shipping_address JSONB,
    billing_address JSONB,
    payment_method VARCHAR(30),
    payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    payment_id VARCHAR(255),
    tracking_code VARCHAR(100),
    tracking_url TEXT,
    notes TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_number (order_number),
    INDEX idx_orders_created (created_at)
);

-- Tabela de Itens do Pedido
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(50),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Cupons
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED', 'FREE_SHIPPING')),
    discount_value DECIMAL(10, 2),
    min_order_value DECIMAL(10, 2) DEFAULT 0,
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    applicable_categories JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Wishlists
CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Itens da Wishlist
CREATE TABLE wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    note TEXT,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE (wishlist_id, product_id)
);

-- =====================================================
-- TABELAS DE ADMINISTRAÇÃO
-- =====================================================

-- Tabela de Banners
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(500),
    image_url TEXT NOT NULL,
    link TEXT,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Páginas Institucionais
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Logs de Auditoria
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_created (created_at)
);

-- Tabela de Notificações
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_unread (user_id, is_read)
);

-- Tabela de Logs de Webhooks
CREATE TABLE webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB,
    status VARCHAR(20) DEFAULT 'PENDING',
    attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    response_status INTEGER,
    response_body TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELAS DE INVENTÁRIO
-- =====================================================

-- Tabela de Estoque
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE UNIQUE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 10,
    max_stock_level INTEGER DEFAULT 100,
    reorder_point INTEGER,
    location VARCHAR(50),
    last_stock_check TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Movimentações de Estoque
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('IN', 'OUT', 'ADJUSTMENT', 'RETURN', 'TRANSFER')),
    quantity INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reason VARCHAR(50),
    reference_id UUID,
    reference_type VARCHAR(50),
    notes TEXT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_stock_movements_product (product_id),
    INDEX idx_stock_movements_created (created_at)
);

-- Tabela de Fornecedores
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    cnpj VARCHAR(20),
    email VARCHAR(255),
    phone VARCHAR(20),
    contact_name VARCHAR(255),
    address JSONB,
    payment_terms VARCHAR(100),
    rating DECIMAL(2, 1),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Alertas de Estoque
CREATE TABLE stock_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('LOW_STOCK', 'OUT_OF_STOCK', 'EXPIRY_SOON', 'OVERSTOCK')),
    priority VARCHAR(10) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    message TEXT NOT NULL,
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    acknowledged_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELAS DE Fidelidade
-- =====================================================

-- Tabela de Pontos de Fidelidade
CREATE TABLE loyalty_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    points INTEGER NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('EARN', 'REDEEM', 'EXPIRE', 'ADJUST')),
    description TEXT,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_loyalty_user (user_id),
    INDEX idx_loyalty_expires (expires_at)
);

-- =====================================================
-- TRIGGERS E FUNÇÕES
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger nas tabelas principais
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para gerar número do pedido
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'REG-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('order_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SEQUENCE IF NOT EXISTS order_seq START 1;

-- Trigger para gerar número do pedido
CREATE TRIGGER generate_order_number_trigger
BEFORE INSERT ON orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL)
EXECUTE FUNCTION generate_order_number();

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- GIN index para JSONB
CREATE INDEX idx_products_tags ON products USING GIN (tags);
CREATE INDEX idx_products_metadata ON products USING GIN (metadata);
CREATE INDEX idx_users_roles ON user_roles USING GIN (roles);

-- HNSW index para embeddings (RAG)
CREATE INDEX idx_product_embeddings_hnsw ON product_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Índice parcial para produtos ativos
CREATE INDEX idx_products_active_category ON products(category_id) WHERE is_active = TRUE;

-- Índice para datas especiais próximas
CREATE INDEX idx_special_dates_upcoming ON special_dates(contact_id, next_occurrence) 
WHERE is_active = TRUE AND next_occurrence >= CURRENT_DATE;
```

---

## 4. ROTAS DE API (OPENAPI)

### 4.1 API Authentication

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/v1/auth/register` | Registro de usuário | ❌ |
| POST | `/api/v1/auth/login` | Login | ❌ |
| POST | `/api/v1/auth/logout` | Logout | ✅ JWT |
| POST | `/api/v1/auth/refresh` | Refresh token | ❌ |
| POST | `/api/v1/auth/forgot-password` | Esqueci senha | ❌ |
| POST | `/api/v1/auth/reset-password` | Reset senha | ❌ |
| GET | `/api/v1/auth/me` | Usuário atual | ✅ JWT |

### 4.2 API Products

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/v1/products` | Listar produtos | ❌ |
| GET | `/api/v1/products/{id}` | Detalhe produto | ❌ |
| GET | `/api/v1/products/slug/{slug}` | Produto por slug | ❌ |
| GET | `/api/v1/products/search` | Buscar produtos | ❌ |
| GET | `/api/v1/categories` | Listar categorias | ❌ |
| GET | `/api/v1/categories/{id}` | Categoria com produtos | ❌ |
| POST | `/api/v1/admin/products` | Criar produto | ✅ ADMIN |
| PUT | `/api/v1/admin/products/{id}` | Atualizar produto | ✅ ADMIN |
| DELETE | `/api/v1/admin/products/{id}` | Excluir produto | ✅ ADMIN |

### 4.3 API Contacts

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/v1/contacts` | Listar contatos | ✅ JWT |
| POST | `/api/v1/contacts` | Criar contato | ✅ JWT |
| GET | `/api/v1/contacts/{id}` | Detalhe contato | ✅ JWT |
| PUT | `/api/v1/contacts/{id}` | Atualizar contato | ✅ JWT |
| DELETE | `/api/v1/contacts/{id}` | Excluir contato | ✅ JWT |
| GET | `/api/v1/contacts/{id}/dates` | Datas do contato | ✅ JWT |
| POST | `/api/v1/contacts/{id}/dates` | Criar data especial | ✅ JWT |
| PUT | `/api/v1/dates/{id}` | Atualizar data | ✅ JWT |
| DELETE | `/api/v1/dates/{id}` | Excluir data | ✅ JWT |

### 4.4 API Cart

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/v1/cart` | Ver carrinho | ✅ JWT |
| POST | `/api/v1/cart/items` | Adicionar item | ✅ JWT |
| PUT | `/api/v1/cart/items/{id}` | Atualizar item | ✅ JWT |
| DELETE | `/api/v1/cart/items/{id}` | Remover item | ✅ JWT |
| POST | `/api/v1/cart/apply-coupon` | Aplicar cupom | ✅ JWT |
| DELETE | `/api/v1/cart` | Esvaziar carrinho | ✅ JWT |

### 4.5 API Orders

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/v1/orders` | Meus pedidos | ✅ JWT |
| GET | `/api/v1/orders/{id}` | Detalhe pedido | ✅ JWT |
| POST | `/api/v1/orders` | Criar pedido | ✅ JWT |
| POST | `/api/v1/payments/pix` | Pagar com PIX | ✅ JWT |
| POST | `/api/v1/payments/card` | Pagar com cartão | ✅ JWT |
| GET | `/api/v1/orders/{id}/tracking` | Rastreamento | ✅ JWT |

### 4.6 API Admin

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/v1/admin/dashboard/stats` | Métricas | ✅ ADMIN |
| GET | `/api/v1/admin/dashboard/sales-chart` | Gráfico vendas | ✅ ADMIN |
| GET | `/api/v1/admin/orders` | Listar pedidos | ✅ ADMIN |
| PATCH | `/api/v1/admin/orders/{id}/status` | Alterar status | ✅ ADMIN |
| POST | `/api/v1/admin/orders/{id}/refund` | Reembolso | ✅ ADMIN |
| GET | `/api/v1/admin/customers` | Listar clientes | ✅ ADMIN |
| GET | `/api/v1/admin/customers/{id}` | Detalhe cliente | ✅ ADMIN |
| GET | `/api/v1/admin/products` | Listar produtos | ✅ ADMIN |
| GET | `/api/v1/admin/categories` | Listar categorias | ✅ ADMIN |
| POST | `/api/v1/admin/categories` | Criar categoria | ✅ ADMIN |
| GET | `/api/v1/admin/users` | Listar usuários admin | ✅ ADMIN |
| POST | `/api/v1/admin/users` | Criar usuário admin | ✅ ADMIN |
| GET | `/api/v1/admin/banners` | Listar banners | ✅ ADMIN |
| POST | `/api/v1/admin/banners` | Criar banner | ✅ ADMIN |
| GET | `/api/v1/admin/inventory` | Listar estoque | ✅ ADMIN |
| GET | `/api/v1/admin/inventory/alerts` | Alertas estoque | ✅ ADMIN |

### 4.7 API AI

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/v1/ai/recommendations` | Recomendações | ✅ JWT |
| POST | `/api/v1/ai/generate-message` | Gerar mensagem | ✅ JWT |
| GET | `/api/v1/ai/usage` | Uso de IA | ✅ JWT |

### 4.8 API Notifications

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/v1/notifications` | Minhas notificações | ✅ JWT |
| PUT | `/api/v1/notifications/{id}/read` | Marcar como lida | ✅ JWT |
| PUT | `/api/v1/notifications/read-all` | Marcar todas lidas | ✅ JWT |

### 4.9 API Webhooks

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/v1/webhooks/whatsapp` | WhatsApp events | Signature |
| POST | `/api/v1/webhooks/payment` | Payment events | Signature |
| POST | `/api/v1/webhooks/shipping` | Shipping events | Signature |

---

## 5. ARQUITETURA DE INTEGRAÇÃO

### 5.1 Diagrama de Integração

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         REGALAYA - INTEGRAÇÕES                          │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │    REGALAYA API     │
                    │   (Spring Boot)    │
                    └──────────┬──────────┘
                               │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  WhatsApp API  │  │   OpenAI API    │  │  Stripe / MP   │
│                 │  │                 │  │                 │
│ • Envio msgs   │  │ • GPT-4         │  │ • Pagamentos   │
│ • Templates    │  │ • Embeddings    │  │ • Webhooks     │
│ • Status       │  │ • Completion    │  │ • Refunds      │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                     │                     │
         └──────────────────────┼─────────────────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │     LOGÍSTICA      │
                    │                     │
                    │ • Correios         │
                    │ • Loggi            │
                    │ • Cálculo de fretes│
                    └─────────────────────┘
```

### 5.2 Contratos de Integração

#### WhatsApp Cloud API

```java
// Configuração
whatsapp.api.version=v18.0
whatsapp.api.phone-number-id=${WHATSAPP_PHONE_ID}
whatsapp.api.access-token=${WHATSAPP_ACCESS_TOKEN}
whatsapp.api.webhook-secret=${WHATSAPP_WEBHOOK_SECRET}

// Endpoints utilizados
// POST /v18.0/{phone-number-id}/messages - Envio de mensagens
// GET /v18.0/{phone-number-id}/messages/{message-id} - Status da mensagem
// POST /v18.0/{phone-number-id}/message_templates - Templates
```

#### OpenAI API

```java
// Configuração
openai.api-key=${OPENAI_API_KEY}
openai.organization=${OPENAI_ORG_ID}
openai.model.gpt4=gpt-4-turbo-preview
openai.model.embedding=text-embedding-ada-002
openai.temperature=0.7
openai.max-tokens=500

// Uso
// POST /v1/chat/completions - Chat/Gerar mensagens
// POST /v1/embeddings - Embeddings para RAG
```

#### Stripe/Mercado Pago

```java
// Stripe
stripe.api-key=${STRIPE_SECRET_KEY}
stripe.webhook-secret=${STRIPE_WEBHOOK_SECRET}
stripe.publishable-key=${STRIPE_PUBLISHABLE_KEY}

// Mercado Pago
mercadopago.access-token=${MP_ACCESS_TOKEN}
mercadopago.webhook-url=${MP_WEBHOOK_URL}
```

---

## 6. SEGURANÇA

### 6.1 Autenticação e Autorização

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FLUXO DE AUTENTICAÇÃO                            │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│  Cliente │         │   API    │         │  Redis   │         │   DB     │
└────┬─────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                    │                    │
     │  1. Login POST     │                    │                    │
     │  /auth/login       │                    │                    │
     │───────────────────▶│                    │                    │
     │                    │  2. Validar       │                    │
     │                    │───────────────────▶│                    │
     │                    │                    │  3. Verificar     │
     │                    │                    │───────────────────▶│
     │                    │                    │◀───────────────────│
     │                    │◀───────────────────│                    │
     │                    │  4. Gerar JWT     │                    │
     │                    │     (15min)        │                    │
     │                    │  5. Gerar Refresh  │                    │
     │                    │     (7 dias)       │                    │
     │                    │  6. Armazenar      │                    │
     │                    │     Refresh no      │                    │
     │                    │     Redis           │                    │
     │                    │───────────────────▶│                    │
     │◀───────────────────│                    │                    │
     │  7. JWT + Refresh  │                    │                    │
     │                    │                    │                    │
     │  8. Request + JWT  │                    │                    │
     │───────────────────▶│  9. Validar JWT    │                    │
     │                    │───────────────────▶│                    │
     │                    │◀───────────────────│                    │
     │                    │ 10. Claims OK      │                    │
     │                    │                    │                    │
     │◀───────────────────│                    │                    │
     │ 11. Response       │                    │                    │
```

### 6.2 RBAC (Roles e Permissões)

| Role | Permissões |
|------|------------|
| **USER** | read:own_data, write:own_data, orders:read, orders:create, contacts:manage, wishlists:manage |
| **VIEWER** | read:all_data, reports:read |
| **MANAGER** | VIEWER + orders:manage, customers:read, products:read, inventory:read |
| **ADMIN** | MANAGER + users:manage, products:manage, categories:manage, banners:manage, settings:manage |
| **SUPERADMIN** | ADMIN + system:all |

### 6.3 Rate Limiting

| Endpoint | Limite | Janela |
|----------|--------|--------|
| `/auth/*` | 10 req | 1 min |
| `/products/*` | 100 req | 1 min |
| `/orders/*` | 50 req | 1 min |
| `/ai/*` | 20 req | 1 min |
| `/whatsapp/*` | 100 req | 24h |

---

## 7. DEPLOYMENT

### 7.1 Arquitetura AWS

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           AWS - REGALAYA                                │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   CloudFront     │
                              │   (CDN)         │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │   ALB           │
                              │ (Load Balancer) │
                              └────────┬────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
           ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
           │  ECS Fargate  │ │  ECS Fargate  │ │  ECS Fargate   │
           │  (regalaya-   │ │  (regalaya-   │ │  (Background   │
           │   api)        │ │   admin-api)  │ │   Workers)     │
           └───────┬───────┘ └───────┬───────┘ └───────┬───────┘
                   │                 │                 │
                   └─────────────────┼─────────────────┘
                                     │
                         ┌───────────┴───────────┐
                         │                       │
                         ▼                       ▼
                ┌────────────────┐      ┌────────────────┐
                │  RDS Aurora    │      │  ElastiCache   │
                │  PostgreSQL   │      │  Redis         │
                └───────────────┘      └────────────────┘
                         │
                         ▼
                ┌────────────────┐
                │  S3           │
                │  (Assets)     │
                └────────────────┘
```

### 7.2 Configuração ECS

```yaml
# Task Definition - regalaya-api
task_definition:
  family: regalaya-api
  cpu: 1024
  memory: 2048
  container_definitions:
    - name: api
      image: registry.regalaya.com.br/regalaya-api:latest
      port_mappings:
        - container_port: 8080
      environment:
        - SPRING_PROFILES_ACTIVE: production
        - JAVA_OPTS: -Xms512m -Xmx1024m
      health_check:
        command: ["CMD-SHELL", "curl -f http://localhost:8080/actuator/health"]
        interval: 30
        timeout: 5
        retries: 3
```

---

## 8. MONITORAMENTO

### 8.1 Métricas CloudWatch

| Namespace | Métricas |
|----------|----------|
| **AWS/ApplicationELB** | RequestCount, TargetResponseTime, HTTP_5XX_Count |
| **AWS/ECS** | CPUUtilization, MemoryUtilization |
| **AWS/RDS** | CPUUtilization, DatabaseConnections, FreeStorageSpace |
| **AWS/ElastiCache** | CurrConnections, CacheHits, CacheMisses |
| **Custom/Regalaya** | OrderCount, PaymentSuccess, PaymentFailed, AIRecommendationCount |

### 8.2 Alarmes

| Alarme | Condição | Ação |
|--------|----------|------|
| HighErrorRate | 5XX > 1% | SNS → DevTeam |
| HighLatency | p95 > 500ms | SNS → DevTeam |
| LowDiskSpace | < 20% | SNS → DevTeam |
| HighCPU | > 80% | SNS → DevTeam |
| AIRateLimit | Quota > 90% | SNS → DevTeam |

---

## 9. CONCLUSÃO

Este documento estabelece a arquitetura técnica completa para o projeto Regalaya:

- ✅ Estrutura de módulos clara
- ✅ Schema de banco de dados completo
- ✅ 50+ endpoints de API documentados
- ✅ Contratos de integração definidos
- ✅ Modelo de segurança implementado
- ✅ Arquitetura de deployment AWS

**Próximo passo:** Integrar com Épicos e Histórias (CE)

---

**Documento criado:** 07 de abril de 2026  
**Versão:** 1.0  
**Status:** Aprovado
