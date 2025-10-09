// Authentication utility functions
// API configuration
const API_URL = 'http://localhost:5000/api';

// Clear any old localStorage data
if (localStorage.getItem('currentUser') || localStorage.getItem('students') || localStorage.getItem('teachers')) {
  localStorage.clear();
}

// Check if user is logged in
function isLoggedIn() {
  return sessionStorage.getItem('currentUser') !== null;
}

// Get current user
function getCurrentUser() {
  const userStr = sessionStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

// Save current user
function setCurrentUser(user) {
  sessionStorage.setItem('currentUser', JSON.stringify(user));
}

// Logout
function logout() {
  sessionStorage.clear();
  window.location.replace('./login.html');
}

// Find user by ID (API call)
async function findUserById(userId) {
  try {
    const response = await fetch(`${API_URL}/profile/${userId}`);
    if (!response.ok) {
      return null;
    }
    const user = await response.json();
    return {
      ...user,
      type: user.userType,
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
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Get all students (API call)
async function getAllStudents() {
  try {
    const response = await fetch(`${API_URL}/profile/students`);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

// Update navbar based on login status
function updateNavbar() {
  const authLink = document.getElementById('authLink');
  if (authLink) {
    if (isLoggedIn()) {
      const user = getCurrentUser();
      authLink.textContent = 'Logout';
      authLink.href = '#';
      authLink.onclick = (e) => {
        e.preventDefault();
        logout();
      };
    } else {
      authLink.textContent = 'Login';
      authLink.href = './login.html';
      authLink.onclick = null;
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateNavbar);

