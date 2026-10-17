const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Locate the database file
const dbPath = path.join(__dirname, 'timetable.db');

// Open or create the database
const db = new Database(dbPath);

// Check whether the timetable table already exists
const tableExists = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
    AND name = 'timetable'
`).get();

// Create the table and insert sample records only on first setup
if (!tableExists) {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    db.exec(schema);

    console.log('Database table and sample records created.');
} else {
    console.log('Existing database opened. Sample records were not reinserted.');
}

// Export the database for server.js
module.exports = db;

console.log('Database connected successfully!');