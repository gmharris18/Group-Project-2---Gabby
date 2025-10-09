# Database Setup for .NET

This folder contains the SQLite database schema for the Educational Minigames application.

## Schema Overview

The database includes two main tables:

### Student Table
- `StudentID` (TEXT, PRIMARY KEY) - Unique identifier for students
- `StudentName` (TEXT) - Full name of the student
- `StudentPassword` (TEXT) - Student's password (should be hashed in production)
- `StudentScoreGame1` (INTEGER) - Score for Game 1
- `StudentScoreGame2` (INTEGER) - Score for Game 2
- `StudentScoreGame3` (INTEGER) - Score for Game 3
- `StudentScoreGame4` (INTEGER) - Score for Game 4
- `StudentScoreGame5` (INTEGER) - Score for Game 5
- `CreatedAt` (DATETIME) - Timestamp of account creation

### Teacher Table
- `TeacherID` (TEXT, PRIMARY KEY) - Unique identifier for teachers
- `TeacherName` (TEXT) - Full name of the teacher
- `TeacherPassword` (TEXT) - Teacher's password (should be hashed in production)
- `CreatedAt` (DATETIME) - Timestamp of account creation

## Implementation Instructions for .NET

### 1. Install Required NuGet Packages

```bash
dotnet add package Microsoft.Data.Sqlite
dotnet add package System.Data.SQLite
```

### 2. Create Database Connection

```csharp
using Microsoft.Data.Sqlite;

public class DatabaseHelper
{
    private const string ConnectionString = "Data Source=minigames.db";
    
    public static SqliteConnection GetConnection()
    {
        return new SqliteConnection(ConnectionString);
    }
    
    public static void InitializeDatabase()
    {
        using var connection = GetConnection();
        connection.Open();
        
        string schema = File.ReadAllText("database/schema.sql");
        using var command = connection.CreateCommand();
        command.CommandText = schema;
        command.ExecuteNonQuery();
    }
}
```

### 3. Create API Endpoints

You'll need to create RESTful API endpoints for:

- `POST /api/auth/register` - Create new student/teacher account
- `POST /api/auth/login` - Authenticate user
- `GET /api/profile/{userId}` - Get user profile by ID
- `GET /api/students` - Get all students (for rankings)
- `PUT /api/students/{id}/score` - Update student game score

### 4. Security Considerations

**IMPORTANT:** 
- Never store passwords in plain text. Use BCrypt or similar hashing algorithm
- Implement proper authentication tokens (JWT recommended)
- Add input validation and sanitization
- Use parameterized queries to prevent SQL injection
- Implement CORS policy for frontend-backend communication

### Example: Hash Passwords

```csharp
using BCrypt.Net;

public static string HashPassword(string password)
{
    return BCrypt.HashPassword(password);
}

public static bool VerifyPassword(string password, string hash)
{
    return BCrypt.Verify(password, hash);
}
```

## Frontend Integration

The current frontend uses `localStorage` for demo purposes. When you implement the .NET backend:

1. Replace localStorage calls with fetch API calls to your backend
2. Update `scripts/auth.js` to use JWT tokens
3. Add proper error handling and loading states
4. Implement secure session management

Example fetch call:

```javascript
async function login(userId, password, userType) {
    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password, userType })
    });
    
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data.user;
    }
    throw new Error('Login failed');
}
```

## Testing the Frontend (Without Backend)

The current implementation uses localStorage, so you can:
1. Open `index.html` in a browser
2. Create accounts through the signup form
3. Login and test the profile viewing functionality
4. All data is stored locally in the browser

## Next Steps

1. Set up a .NET Web API project
2. Implement the database connection and models
3. Create authentication middleware
4. Build the API endpoints
5. Update frontend JavaScript to call the API
6. Deploy both frontend and backend

