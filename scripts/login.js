// Login page functionality
let currentUserType = 'student';

// Local storage keys
const USERS_KEY = 'bridgeEd_users';
const CURRENT_USER_KEY = 'bridgeEd_currentUser';

// Initialize users storage if not exists
function initUsersStorage() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
  }
}

// Get all users
function getAllUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

// Save users
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Add new user
function addUser(userData) {
  const users = getAllUsers();
  users.push(userData);
  saveUsers(users);
}

// Find user by ID and type
function findUser(userId, userType) {
  const users = getAllUsers();
  return users.find(user => user.userId === userId && user.userType === userType);
}

// Set current user
function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Get current user
function getCurrentUser() {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
}

// Check if logged in
function isLoggedIn() {
  return getCurrentUser() !== null;
}

// Update labels based on user type
function updateUserTypeLabels() {
  const loginIdLabel = document.getElementById('loginIdLabel');
  const signupIdLabel = document.getElementById('signupIdLabel');
  
  if (currentUserType === 'student') {
    loginIdLabel.textContent = 'Student ID';
    signupIdLabel.textContent = 'Student ID';
  } else {
    loginIdLabel.textContent = 'Teacher ID';
    signupIdLabel.textContent = 'Teacher ID';
  }
}

// Handle user type change
document.querySelectorAll('input[name="userType"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    currentUserType = e.target.value;
    updateUserTypeLabels();
  });
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const id = document.getElementById('loginId').value.trim();
  const password = document.getElementById('loginPassword').value;
  const messageDiv = document.getElementById('loginMessage');
  
  messageDiv.innerHTML = '<div class="alert alert-info">Logging in...</div>';
  
  // Find user in local storage
  const user = findUser(id, currentUserType);
  
  if (user && user.password === password) {
    // Login successful
    const userData = {
      type: user.userType,
      userId: user.userId,
      name: user.name,
      StudentID: user.userId,
      StudentName: user.name,
      TeacherID: user.userId,
      TeacherName: user.name,
      StudentScoreGame1: user.scoreGame1 || 0,
      StudentScoreGame2: user.scoreGame2 || 0,
      StudentScoreGame3: user.scoreGame3 || 0,
      StudentScoreGame4: user.scoreGame4 || 0,
      StudentScoreGame5: user.scoreGame5 || 0
    };
    setCurrentUser(userData);
    messageDiv.innerHTML = '<div class="alert alert-success">Login successful! Redirecting...</div>';
    setTimeout(() => {
      if (currentUserType === 'teacher') {
        window.location.href = './teacher-dashboard.html';
      } else {
        window.location.href = './profile.html';
      }
    }, 1000);
  } else {
    messageDiv.innerHTML = '<div class="alert alert-danger">Invalid credentials. Please check your ID and password.</div>';
  }
});

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value.trim();
  const id = document.getElementById('signupId').value.trim();
  const password = document.getElementById('signupPassword').value;
  const messageDiv = document.getElementById('signupMessage');
  
  messageDiv.innerHTML = '<div class="alert alert-info">Creating account...</div>';
  
  // Check if user already exists
  const existingUser = findUser(id, currentUserType);
  
  if (existingUser) {
    messageDiv.innerHTML = '<div class="alert alert-danger">User with this ID already exists. Please choose a different ID.</div>';
    return;
  }
  
  if (!name || !id || !password) {
    messageDiv.innerHTML = '<div class="alert alert-danger">Please fill in all fields.</div>';
    return;
  }
  
  // Create new user
  const newUser = {
    userId: id,
    name: name,
    password: password,
    userType: currentUserType,
    scoreGame1: 0,
    scoreGame2: 0,
    scoreGame3: 0,
    scoreGame4: 0,
    scoreGame5: 0,
    createdAt: new Date().toISOString()
  };
  
  addUser(newUser);
  
  // Set as current user
  const userData = {
    type: newUser.userType,
    userId: newUser.userId,
    name: newUser.name,
    StudentID: newUser.userId,
    StudentName: newUser.name,
    TeacherID: newUser.userId,
    TeacherName: newUser.name,
    StudentScoreGame1: newUser.scoreGame1,
    StudentScoreGame2: newUser.scoreGame2,
    StudentScoreGame3: newUser.scoreGame3,
    StudentScoreGame4: newUser.scoreGame4,
    StudentScoreGame5: newUser.scoreGame5
  };
  
  setCurrentUser(userData);
  messageDiv.innerHTML = '<div class="alert alert-success">Account created successfully! Redirecting...</div>';
  setTimeout(() => {
    if (currentUserType === 'teacher') {
      window.location.href = './teacher-dashboard.html';
    } else {
      window.location.href = './profile.html';
    }
  }, 1000);
});

// Initialize storage and labels
initUsersStorage();
updateUserTypeLabels();

// Check if already logged in - automatically redirect
if (isLoggedIn()) {
  const user = getCurrentUser();
  if (user && user.type === 'teacher') {
    window.location.href = './teacher-dashboard.html';
  } else {
    window.location.href = './profile.html';
  }
}

