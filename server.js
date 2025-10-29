const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static game files from repo root
app.use(helmet()); // セキュリティヘッダーを追加
app.use(express.static(path.resolve(__dirname)));
app.use(express.json());
app.use(cors());

// DB (data/leaderboard.db)
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'leaderboard.db');

const fs = require('fs');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Ensure table exists
db.prepare(
  `CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id TEXT NOT NULL DEFAULT 'default',
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`
).run();

// Insert sample helper (only if empty)
const count = db.prepare('SELECT COUNT(*) AS c FROM leaderboard').get().c;
if (count === 0) {
  const insert = db.prepare('INSERT INTO leaderboard (game_id, name, score) VALUES (?, ?, ?)');
  insert.run('game9', 'Alice', 1200);
  insert.run('game9', 'Bob', 900);
  insert.run('game9', 'Carol', 700);
}

// API: GET top N
app.get('/api/leaderboard', (req, res) => {
  const gameId = req.query.game_id || 'default';
  const limit = Math.min(parseInt(req.query.limit || '10', 10), 100);
  const stmt = db.prepare('SELECT id, name, score, created_at FROM leaderboard WHERE game_id = ? ORDER BY score DESC, created_at ASC LIMIT ?');
  const rows = stmt.all(gameId, limit);
  res.json(rows);
});

// API: POST new score { name, score }
app.post('/api/leaderboard', (req, res) => {
  const { name, score } = req.body || {};
  if (typeof name !== 'string' || !name.trim() || typeof score !== 'number') {
    return res.status(400).json({ error: '不正なペイロードです。{ name: string, score: number } の形式で送信してください。' });
  }
  const insert = db.prepare('INSERT INTO leaderboard (game_id, name, score) VALUES (?, ?, ?)');
  const info = insert.run('game9', name.trim().slice(0, 64), Math.floor(score));
  const row = db.prepare('SELECT id, name, score, created_at FROM leaderboard WHERE id = ?').get(info.lastInsertRowid);
  res.json(row);
});

app.get('/api/ping', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Dev server listening on http://localhost:${PORT}`);
  console.log('Static files served from:', path.resolve(__dirname));
});
