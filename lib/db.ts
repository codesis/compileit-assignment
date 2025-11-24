import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { ROOMS } from './rooms';

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'rooms.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, {
    recursive: true,
  });
}

export const db = new Database(dbPath);

function initialize() {
  db.pragma('journal_mode = WAL');

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      capacity INTEGER NOT NULL
    )
  `,
  ).run();

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      roomId TEXT NOT NULL,
      date TEXT NOT NULL,
      startHour INTEGER NOT NULL,
      endHour INTEGER NOT NULL,
      title TEXT NOT NULL,
      organizer TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      FOREIGN KEY (roomId) REFERENCES rooms(id),
      UNIQUE (roomId, date, startHour)
    )
  `,
  ).run();

  const insertRoom = db.prepare(
    `INSERT OR IGNORE INTO rooms (id, name, capacity) VALUES (@id, @name, @capacity)`,
  );
  const transaction = db.transaction(() => {
    for (const room of ROOMS) {
      insertRoom.run(room);
    }
  });
  transaction();
}

initialize();
