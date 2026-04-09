-- Migration: V1.3 - Cria estrutura base de notificações do épico 9
-- Data: 2026-04-08

CREATE TABLE IF NOT EXISTS notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    special_date_id UUID REFERENCES special_dates(id) ON DELETE SET NULL,
    type VARCHAR(30) NOT NULL CHECK (
        type IN (
            'DATE_REMINDER_7D',
            'DATE_REMINDER_1D',
            'ORDER_CONFIRMATION',
            'ORDER_SHIPPED',
            'ORDER_DELIVERED',
            'AI_RECOMMENDATION',
            'MARKETING'
        )
    ),
    recipient_phone VARCHAR(20),
    recipient_email VARCHAR(150),
    message_template TEXT NOT NULL,
    message_data JSONB,
    scheduled_at TIMESTAMP NOT NULL,
    sent_at TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (
        status IN ('PENDING', 'SENDING', 'SENT', 'FAILED', 'CANCELLED')
    ),
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    error_message TEXT,
    read_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON notification_queue(status);
CREATE INDEX IF NOT EXISTS idx_notification_queue_scheduled ON notification_queue(scheduled_at, status);
CREATE INDEX IF NOT EXISTS idx_notification_queue_user ON notification_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_queue_type ON notification_queue(type);
