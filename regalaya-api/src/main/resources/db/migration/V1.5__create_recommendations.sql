CREATE TABLE IF NOT EXISTS ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    profile_data JSONB NOT NULL,
    suggestions JSONB NOT NULL,
    justification TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_recommendations_user_id ON ai_recommendations(user_id);
