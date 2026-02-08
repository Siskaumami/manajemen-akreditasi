import sqlite3 from "sqlite3";
import path from "path";

const db = new sqlite3.Database(path.join(process.cwd(), "app.db"));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fileName TEXT NOT NULL,
      fileType TEXT NOT NULL,
      category TEXT NOT NULL,
      uploader TEXT NOT NULL,
      uploadDate TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      filePath TEXT NOT NULL
    )
  `);
});

export default db;
