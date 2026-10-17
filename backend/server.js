const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'Student Timetable API is running!'
    });
});

// GET: Retrieve all timetable records
app.get('/api/timetable', (req, res) => {
    const records = db.prepare(
        'SELECT * FROM timetable ORDER BY id'
    ).all();

    res.json(records);
});

// GET: Retrieve one record by ID
app.get('/api/timetable/:id', (req, res) => {
    const record = db.prepare(
        'SELECT * FROM timetable WHERE id = ?'
    ).get(req.params.id);

    if (!record) {
        return res.status(404).json({
            error: 'Timetable record not found'
        });
    }

    res.json(record);
});

// POST: Create a new timetable record
app.post('/api/timetable', (req, res) => {
    const {
        course_code,
        course_name,
        day_of_week,
        start_time,
        end_time,
        venue,
        study_goal
    } = req.body;

    if (
        !course_code || !course_name || !day_of_week ||
        !start_time || !end_time
    ) {
        return res.status(400).json({
            error: 'Please provide all required fields'
        });
    }

    const result = db.prepare(`
        INSERT INTO timetable
        (course_code, course_name, day_of_week,
         start_time, end_time, venue, study_goal)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        course_code,
        course_name,
        day_of_week,
        start_time,
        end_time,
        venue || null,
        study_goal || null
    );

    const newRecord = db.prepare(
        'SELECT * FROM timetable WHERE id = ?'
    ).get(result.lastInsertRowid);

    res.status(201).json(newRecord);
});

// PUT: Update an existing timetable record
app.put('/api/timetable/:id', (req, res) => {
    const existing = db.prepare(
        'SELECT * FROM timetable WHERE id = ?'
    ).get(req.params.id);

    if (!existing) {
        return res.status(404).json({
            error: 'Timetable record not found'
        });
    }

    const {
        course_code,
        course_name,
        day_of_week,
        start_time,
        end_time,
        venue,
        study_goal
    } = req.body;

    if (
        !course_code || !course_name || !day_of_week ||
        !start_time || !end_time
    ) {
        return res.status(400).json({
            error: 'Please provide all required fields'
        });
    }

    db.prepare(`
        UPDATE timetable
        SET course_code = ?,
            course_name = ?,
            day_of_week = ?,
            start_time = ?,
            end_time = ?,
            venue = ?,
            study_goal = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(
        course_code,
        course_name,
        day_of_week,
        start_time,
        end_time,
        venue || null,
        study_goal || null,
        req.params.id
    );

    const updatedRecord = db.prepare(
        'SELECT * FROM timetable WHERE id = ?'
    ).get(req.params.id);

    res.json(updatedRecord);
});

// DELETE: Remove a timetable record
app.delete('/api/timetable/:id', (req, res) => {
    const result = db.prepare(
        'DELETE FROM timetable WHERE id = ?'
    ).run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: 'Timetable record not found'
        });
    }

    res.json({
        message: 'Timetable record deleted successfully'
    });
});

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});