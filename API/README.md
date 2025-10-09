# Educational Minigames API

A .NET 8 Web API backend for the Educational Minigames platform, using SQLite with Entity Framework Core and BCrypt for password hashing.

## 🚀 Quick Start

### Prerequisites
- .NET 8 SDK or later
- Any IDE (Visual Studio, VS Code, Rider, etc.)

### Installation & Running

1. **Navigate to the API directory:**
   ```bash
   cd API
   ```

2. **Restore dependencies:**
   ```bash
   dotnet restore
   ```

3. **Run the application:**
   ```bash
   dotnet run
   ```

The API will start on `http://localhost:5000` and Swagger documentation will be available at `http://localhost:5000/swagger`.

### Database Setup
The SQLite database (`minigames.db`) will be automatically created in the API directory on first run. No manual setup required!

## 📡 API Endpoints

### Authentication

#### Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "userId": "S001",
  "name": "John Doe",
  "password": "password123",
  "userType": "student"  // or "teacher"
}
```

**Response (200 OK):**
```json
{
  "userId": "S001",
  "name": "John Doe",
  "userType": "student",
  "scoreGame1": 0,
  "scoreGame2": 0,
  "scoreGame3": 0,
  "scoreGame4": 0,
  "scoreGame5": 0
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "userId": "S001",
  "password": "password123",
  "userType": "student"
}
```

**Response (200 OK):**
```json
{
  "userId": "S001",
  "name": "John Doe",
  "userType": "student",
  "scoreGame1": 0,
  "scoreGame2": 0,
  "scoreGame3": 0,
  "scoreGame4": 0,
  "scoreGame5": 0
}
```

### Profile

#### Get user profile by ID
```http
GET /api/profile/{userId}
```

**Example:** `GET /api/profile/S001`

**Response (200 OK):**
```json
{
  "userId": "S001",
  "name": "John Doe",
  "userType": "student",
  "scoreGame1": 100,
  "scoreGame2": 85,
  "scoreGame3": 90,
  "scoreGame4": 75,
  "scoreGame5": 95
}
```

#### Get all students
```http
GET /api/profile/students
```

**Response (200 OK):**
```json
[
  {
    "userId": "S001",
    "name": "John Doe",
    "userType": "student",
    "scoreGame1": 100,
    "scoreGame2": 85,
    ...
  },
  ...
]
```

### Scores

#### Update student score
```http
PUT /api/score/{studentId}
Content-Type: application/json

{
  "gameNumber": 1,  // 1-5
  "score": 100
}
```

**Response (200 OK):**
```json
{
  "message": "Score updated successfully.",
  "student": {
    "userId": "S001",
    "name": "John Doe",
    "userType": "student",
    "scoreGame1": 100,
    ...
  }
}
```

#### Get rankings for a specific game
```http
GET /api/score/rankings/{gameNumber}
```

**Example:** `GET /api/score/rankings/1`

**Response (200 OK):**
```json
[
  {
    "userId": "S001",
    "name": "John Doe",
    "userType": "student",
    "scoreGame1": 100,
    ...
  },
  ...
]
```
*Sorted by the specified game's score in descending order.*

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using BCrypt before storage
- **CORS Enabled**: Cross-Origin requests are allowed for frontend integration
- **Input Validation**: All endpoints validate input data
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## 🗄️ Database Schema

### Student Table
| Column | Type | Description |
|--------|------|-------------|
| StudentID | TEXT (PK) | Unique student identifier |
| StudentName | TEXT | Full name |
| StudentPassword | TEXT | Hashed password |
| StudentScoreGame1-5 | INTEGER | Scores for each game |
| CreatedAt | DATETIME | Account creation timestamp |

### Teacher Table
| Column | Type | Description |
|--------|------|-------------|
| TeacherID | TEXT (PK) | Unique teacher identifier |
| TeacherName | TEXT | Full name |
| TeacherPassword | TEXT | Hashed password |
| CreatedAt | DATETIME | Account creation timestamp |

## 🛠️ Development

### Project Structure
```
API/
├── Controllers/
│   ├── AuthController.cs      # Authentication endpoints
│   ├── ProfileController.cs   # Profile management
│   └── ScoreController.cs     # Score updates & rankings
├── Data/
│   └── ApplicationDbContext.cs # EF Core database context
├── DTOs/
│   ├── LoginRequest.cs
│   ├── RegisterRequest.cs
│   ├── UserResponse.cs
│   └── UpdateScoreRequest.cs
├── Models/
│   ├── Student.cs
│   └── Teacher.cs
├── Properties/
│   └── launchSettings.json
├── appsettings.json
├── MinigamesAPI.csproj
└── Program.cs
```

### Testing with Swagger
Once the API is running, navigate to `http://localhost:5000/swagger` to test all endpoints interactively.

### Common Development Commands
```bash
# Build the project
dotnet build

# Run with hot reload
dotnet watch run

# Clean build artifacts
dotnet clean

# View database
# Use any SQLite viewer to open minigames.db
```

## 🌐 Frontend Integration

The frontend HTML pages are configured to connect to this API at `http://localhost:5000/api`. Make sure the API is running before using the web pages.

### Running the Full Stack
1. Start the API: `cd API && dotnet run`
2. Open the frontend: Open `index.html` in your browser (or use a static file server)
3. The pages will automatically connect to the running API

## 📝 Notes

- The database file `minigames.db` will be created in the API directory
- All passwords are securely hashed and cannot be retrieved in plain text
- The API runs on HTTP (not HTTPS) for local development
- For production deployment, configure HTTPS and update CORS policies

## 🐛 Troubleshooting

**Database not found error:**
- The database is auto-created on first run. If you see errors, delete `minigames.db` and restart the API.

**CORS errors in browser:**
- Make sure the API is running on port 5000
- Check that the frontend is making requests to `http://localhost:5000/api`

**Port already in use:**
- Change the port in `Properties/launchSettings.json` under `applicationUrl`
- Update the `API_URL` in `scripts/auth.js` to match the new port

