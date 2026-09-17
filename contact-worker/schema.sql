CREATE TABLE IF NOT EXISTS worksheets (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  answers TEXT NOT NULL CHECK (json_valid(answers))
);
CREATE INDEX IF NOT EXISTS worksheets_created_at ON worksheets(created_at);
