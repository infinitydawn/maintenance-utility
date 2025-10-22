-- Create inspections table to store inspection history per zone
CREATE TABLE IF NOT EXISTS inspections (
  id SERIAL PRIMARY KEY,
  system_id INTEGER NOT NULL,
  node_number INTEGER NOT NULL,
  loop_number INTEGER NOT NULL,
  zone_number INTEGER NOT NULL,
  zone_prefix VARCHAR(5) DEFAULT '',
  passed BOOLEAN NOT NULL,
  comments TEXT,
  tested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
