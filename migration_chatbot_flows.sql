-- Create chatbot_flows table for storing visual chatbot conversation flows
CREATE TABLE IF NOT EXISTS chatbot_flows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    edges JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_chatbot_flows_active ON chatbot_flows(is_active);

-- Add comment
COMMENT ON TABLE chatbot_flows IS 'Stores visual chatbot conversation flow configurations';
