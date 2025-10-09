-- Educational Minigames Database Schema
-- SQLite Database for .NET Implementation

-- Student Table
CREATE TABLE IF NOT EXISTS Student (
    StudentID TEXT PRIMARY KEY,
    StudentName TEXT NOT NULL,
    StudentPassword TEXT NOT NULL,
    StudentScoreGame1 INTEGER DEFAULT 0,
    StudentScoreGame2 INTEGER DEFAULT 0,
    StudentScoreGame3 INTEGER DEFAULT 0,
    StudentScoreGame4 INTEGER DEFAULT 0,
    StudentScoreGame5 INTEGER DEFAULT 0,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Teacher Table
CREATE TABLE IF NOT EXISTS Teacher (
    TeacherID TEXT PRIMARY KEY,
    TeacherName TEXT NOT NULL,
    TeacherPassword TEXT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_student_name ON Student(StudentName);
CREATE INDEX IF NOT EXISTS idx_teacher_name ON Teacher(TeacherName);

-- Sample data for testing (optional - remove in production)
-- INSERT INTO Student (StudentID, StudentName, StudentPassword, StudentScoreGame1, StudentScoreGame2, StudentScoreGame3, StudentScoreGame4, StudentScoreGame5) 
-- VALUES ('S001', 'John Doe', 'password123', 100, 85, 90, 75, 95);

-- INSERT INTO Teacher (TeacherID, TeacherName, TeacherPassword) 
-- VALUES ('T001', 'Jane Smith', 'teacher123');

