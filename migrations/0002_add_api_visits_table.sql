
CREATE TABLE IF NOT EXISTS ApiVisits (
  api_name TEXT PRIMARY KEY,
  visits INTEGER DEFAULT 0,
  FOREIGN KEY (api_name) REFERENCES Apis(name) ON DELETE CASCADE
);


INSERT OR IGNORE INTO ApiVisits (api_name, visits)
SELECT name, visits
FROM Apis
WHERE visits IS NOT NULL AND visits > 0;


DROP INDEX IF EXISTS idx_visits;


ALTER TABLE Apis DROP COLUMN visits;


CREATE INDEX IF NOT EXISTS idx_visits ON ApiVisits(visits);


CREATE INDEX IF NOT EXISTS idx_categories ON Apis(categories);
CREATE INDEX IF NOT EXISTS idx_tags ON Apis(tags);
CREATE INDEX IF NOT EXISTS idx_added ON Apis(added);
CREATE INDEX IF NOT EXISTS idx_updated ON Apis(updated);
CREATE INDEX IF NOT EXISTS idx_name_search ON Apis(name);
