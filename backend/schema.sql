CREATE TABLE IF NOT EXISTS timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    day_of_week TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    venue TEXT,
    study_goal TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO timetable
(course_code, course_name, day_of_week, start_time, end_time, venue, study_goal)
VALUES
('ICT251', 'Web Technologies', 'Monday', '08:00', '10:00', 'Lab 1', 'Practise Node.js'),
('ICT261', 'Object Oriented Programming', 'Tuesday', '10:00', '12:00', 'Room 2', 'Revise Java'),
('ICT281', 'Computer Architecture', 'Wednesday', '08:00', '10:00', 'Room 3', 'Study CPU performance'),
('MAT201', 'Mathematics', 'Thursday', '10:00', '12:00', 'Room 4', 'Practise equations'),
('PHY102', 'Physics', 'Friday', '08:00', '10:00', 'Lab 2', 'Revise vibrations and waves'),
('ICT251', 'Web Technologies', 'Wednesday', '14:00', '16:00', 'Lab 1', 'Practise HTML and JavaScript'),
('ICT261', 'Object Oriented Programming', 'Thursday', '14:00', '16:00', 'Room 2', 'Practise inheritance'),
('ICT281', 'Computer Architecture', 'Friday', '10:00', '12:00', 'Room 3', 'Revise instruction sets'),
('MAT201', 'Mathematics', 'Monday', '14:00', '16:00', 'Room 4', 'Solve practice questions'),
('PHY102', 'Physics', 'Tuesday', '14:00', '16:00', 'Lab 2', 'Review lecture notes');