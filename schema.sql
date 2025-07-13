-- D1 Schema for APIs Guru data
DROP TABLE IF EXISTS Apis;

CREATE TABLE Apis (
  name TEXT PRIMARY KEY,
  categories TEXT, -- JSON string, e.g., '["finance","banking"]'
  tags TEXT, -- JSON string, e.g., '["api","transactions"]'
  added TEXT,
  updated TEXT,
  swaggerUrl TEXT,
  swaggerYamlUrl TEXT,
  description TEXT,
  title TEXT,
  version TEXT,
  logoUrl TEXT,
  externalUrl TEXT,
  contact TEXT, -- JSON string for contact info
  license TEXT, -- JSON string for license info
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_categories ON Apis(categories);
CREATE INDEX idx_tags ON Apis(tags);
CREATE INDEX idx_added ON Apis(added);
CREATE INDEX idx_updated ON Apis(updated);
CREATE INDEX idx_name_search ON Apis(name);
