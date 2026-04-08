-- Migration: V1.2 - Adiciona tabelas para gestão de pedidos admin
-- Data: 2026-04-07
-- Descrição: Adiciona suporte a histórico de status, reembolsos e índices otimizados

-- 1. Adicionar novos campos na tabela orders (se não existirem)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_url VARCHAR(500);

-- 2. Criar tabela order_status_history
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by VARCHAR(100),
    reason TEXT,
    changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para order_status_history
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_changed_at ON order_status_history(changed_at);

-- 3. Criar tabela refund_transactions
CREATE TABLE IF NOT EXISTS refund_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id),
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('FULL', 'PARTIAL')),
    reason TEXT NOT NULL,
    gateway_refund_id VARCHAR(255),
    gateway_response JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
    processed_by VARCHAR(100),
    completed_at TIMESTAMP,
    failure_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para refund_transactions
CREATE INDEX IF NOT EXISTS idx_refund_transactions_order_id ON refund_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_refund_transactions_status ON refund_transactions(status);
CREATE INDEX IF NOT EXISTS idx_refund_transactions_created_at ON refund_transactions(created_at);

-- 4. Atualizar índices da tabela orders (adicionados via JPA, mas explicitamos aqui para clareza)
-- Estes índices são criados automaticamente pelo Hibernate via @Table(indexes=...)
-- Mas deixamos documentado:
-- idx_orders_status
-- idx_orders_created_at
-- idx_orders_user_id
-- idx_orders_customer_name
-- idx_orders_customer_email
-- idx_orders_status_created (composto)

-- 5. Trigger para atualizar updated_at automaticamente (PostgreSQL)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger às tabelas que têm updated_at
CREATE TRIGGER update_refund_transactions_updated_at
    BEFORE UPDATE ON refund_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Dados de exemplo (para desenvolvimento)
-- INSERT INTO order_status_history (order_id, previous_status, new_status, changed_by, reason, changed_at)
-- SELECT
--     o.id,
--     o.status,
--     'PROCESSING',
--     'ADMIN',
--     'Pedido em processamento',
--     NOW()
-- FROM orders o
-- WHERE o.status = 'PENDING'
-- LIMIT 1;

COMMIT;