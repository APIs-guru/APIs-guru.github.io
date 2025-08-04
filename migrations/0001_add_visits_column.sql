ALTER TABLE Apis ADD visits INTEGER DEFAULT 0;


CREATE INDEX IF NOT EXISTS idx_categories ON Apis(categories);
CREATE INDEX IF NOT EXISTS idx_tags ON Apis(tags);
CREATE INDEX IF NOT EXISTS idx_added ON Apis(added);
CREATE INDEX IF NOT EXISTS idx_updated ON Apis(updated);
CREATE INDEX IF NOT EXISTS idx_name_search ON Apis(name);
CREATE INDEX IF NOT EXISTS idx_visits ON Apis(visits);