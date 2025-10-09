# Educational Minigames - Complete Setup Guide

This guide will help you set up and run the full-stack Educational Minigames application with the .NET Web API backend and HTML/JavaScript frontend.

## 📋 Prerequisites

1. **For the Backend (API):**
   - .NET 8 SDK or later
   - Download from: https://dotnet.microsoft.com/download

2. **For the Frontend:**
   - Any modern web browser (Chrome, Firefox, Edge, Safari)
   - Optional: A simple HTTP server for better CORS handling

3. **Verification:**
   ```bash
   dotnet --version
   # Should output 8.0.x or higher
   ```

## 🚀 Complete Setup Instructions

### Step 1: Start the Backend API

1. Open a terminal/command prompt
2. Navigate to the API directory:
   ```bash
   cd API
   ```

3. Restore dependencies:
   ```bash
   dotnet restore
   ```

4. Run the API:
   ```bash
   dotnet run
   ```

5. You should see output like:
   ```
   info: Microsoft.Hosting.Lifetime[14]
         Now listening on: http://localhost:5000
   info: Microsoft.Hosting.Lifetime[0]
         Application started.
   ```

6. **Keep this terminal window open!** The API must stay running.

7. Verify it's working by visiting:
   - API: http://localhost:5000/swagger
   - You should see the Swagger documentation page

### Step 2: Open the Frontend

#### Option A: Direct File Opening (Simple)
1. Open Windows Explorer (or your file manager)
2. Navigate to the project root directory
3. Double-click `index.html`
4. Your default browser will open the application

#### Option B: Using a Static File Server (Recommended for development)
1. Open a **new** terminal/command prompt (keep the API terminal running)
2. Navigate to the project root directory
3. Use one of these methods:

   **Using Python (if installed):**
   ```bash
   # Python 3
   python -m http.server 8080
   
   # Python 2
   python -m SimpleHTTPServer 8080
   ```

   **Using Node.js (if installed):**
   ```bash
   npx http-server -p 8080
   ```

4. Open your browser and go to: http://localhost:8080

### Step 3: Test the Application

1. **Create an Account:**
   - Click "Login / Sign Up" in the navigation
   - Choose "Student" or "Teacher"
   - Fill in the signup form:
     - Name: Test User
     - ID: test001
     - Password: password123
   - Click "Create Account"

2. **You should be automatically logged in and redirected to the home page**

3. **Test Profile Viewing:**
   - Click "Profile" in the navigation
   - Your profile should load automatically
   - Try searching for your user ID (test001)

4. **Logout and Login Again:**
   - Click "Logout" in the navigation
   - Click "Login" and use your credentials

## 🎮 Using the Application

### For Students:
- **Home**: Overview of available features
- **Games**: Browse and play 5 educational minigames (placeholders for now)
- **Rankings**: View leaderboards for each game
- **Profile**: View your scores and profile information

### For Teachers:
- **Home**: Overview dashboard
- **Games**: Browse available games
- **Rankings**: View student rankings
- **Profile**: View your teacher profile

## 🔧 Project Structure

```
MIS321Project2/
├── API/                    # .NET Web API Backend
│   ├── Controllers/        # API endpoints
│   ├── Data/              # Database context
│   ├── DTOs/              # Data transfer objects
│   ├── Models/            # Database models
│   ├── Program.cs         # Application entry point
│   └── minigames.db       # SQLite database (auto-created)
│
├── Pages/                 # Frontend HTML pages
│   ├── home.html          # Main landing page
│   ├── login.html         # Login/signup page
│   ├── profile.html       # User profile page
│   ├── game.html          # Games list
│   └── ranking.html       # Leaderboards
│
├── scripts/               # JavaScript files
│   ├── auth.js            # Authentication utilities
│   ├── login.js           # Login page logic
│   ├── profile.js         # Profile page logic
│   └── main.js            # Shared utilities
│
├── styles/                # Custom CSS
│   └── main.css           # Global styles
│
├── database/              # Database documentation
│   ├── schema.sql         # Database schema
│   └── README.md          # Database setup guide
│
└── index.html             # Entry point (redirects to home)
```

## 🐛 Troubleshooting

### Problem: API won't start
**Error: "The configured user limit (128) on the number of inotify instances has been exceeded"**
- Solution: Restart your terminal and try again
- Or increase the limit: `echo fs.inotify.max_user_instances=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

**Error: "Unable to bind to http://localhost:5000"**
- The port is already in use
- Kill the process using the port or change the port in `API/Properties/launchSettings.json`

### Problem: Frontend shows "Unable to connect to server"
- Make sure the API is running (check terminal)
- Check that the API is listening on port 5000
- Verify the API_URL in `scripts/auth.js` is `http://localhost:5000/api`

### Problem: Login/Signup doesn't work
- Open browser Developer Tools (F12)
- Check the Console tab for errors
- Check the Network tab to see if API requests are failing
- Common issue: CORS errors (make sure API is running)

### Problem: Database errors
- Delete `API/minigames.db` file
- Restart the API - it will recreate the database

### Problem: Page is blank
- Check browser console (F12) for JavaScript errors
- Make sure all HTML files are in the `Pages/` directory
- Make sure all JavaScript files are in the `scripts/` directory

## 📊 API Testing with Swagger

1. With the API running, go to: http://localhost:5000/swagger
2. You'll see all available endpoints
3. Click "Try it out" on any endpoint to test it
4. Example test:
   - Expand `POST /api/auth/register`
   - Click "Try it out"
   - Fill in the request body
   - Click "Execute"
   - View the response

## 🔐 Security Notes

- Passwords are hashed using BCrypt before storage
- Never commit the `minigames.db` file with real user data
- For production, implement proper authentication tokens (JWT)
- For production, enable HTTPS and update CORS policies

## 📝 Development Tips

### Running Both Backend and Frontend
You'll need **two terminal windows**:
1. Terminal 1: API (`cd API && dotnet run`)
2. Terminal 2: Frontend server (optional, or just open HTML files)

### Viewing the Database
Use any SQLite viewer to inspect `API/minigames.db`:
- DB Browser for SQLite (https://sqlitebrowser.org/)
- VS Code SQLite extension
- Online: https://sqliteviewer.app/

### Hot Reload for API Development
```bash
cd API
dotnet watch run
```
This will automatically restart the API when you change C# files.

### Clearing User Data
To start fresh:
1. Stop the API
2. Delete `API/minigames.db`
3. Clear browser localStorage (F12 > Application/Storage > Local Storage > Clear)
4. Restart the API

## 🎯 Next Steps

1. **Implement actual minigames** in separate HTML files
2. **Connect games to score updates** using the Score API
3. **Implement the rankings page** to display leaderboards
4. **Add teacher features** like viewing all student scores
5. **Style improvements** - customize the Bootstrap theme
6. **Add more features**:
   - Password reset functionality
   - User profile editing
   - Game categories
   - Achievements system
   - Statistics dashboard

## 📞 Common Questions

**Q: Do I need to install a database?**
A: No! SQLite is embedded and the database file is auto-created.

**Q: Can I use this without running the API?**
A: The old version used localStorage (browser storage). The current version requires the API for persistence.

**Q: How do I deploy this?**
A: For deployment:
- Backend: Deploy to Azure App Service, AWS, or any hosting that supports .NET
- Frontend: Deploy to any static hosting (GitHub Pages, Netlify, Vercel)
- Update the API_URL in the frontend to point to your deployed API

**Q: Can multiple people use this at the same time?**
A: Yes! The API supports multiple concurrent users. Just deploy it to a server.

## ✅ Quick Start Checklist

- [ ] .NET 8 SDK installed
- [ ] Opened terminal in API directory
- [ ] Ran `dotnet restore`
- [ ] Ran `dotnet run`
- [ ] API is running on port 5000
- [ ] Opened `index.html` in browser
- [ ] Created a test account
- [ ] Successfully logged in
- [ ] Viewed profile page
- [ ] Ready to develop!

---

**Need Help?** Check the browser console (F12) and API terminal for error messages.

