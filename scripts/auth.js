// Authentication utility functions
// API configuration
const API_URL = 'http://localhost:5000/api';
window.API_URL = API_URL; // Make globally accessible

// Check if user is logged in
function isLoggedIn() {
  const currentUser = localStorage.getItem('bridgeEd_currentUser');
  return currentUser !== null && currentUser !== '{}';
}

// Get current user
function getCurrentUser() {
  const userStr = localStorage.getItem('bridgeEd_currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

// Save current user
function setCurrentUser(user) {
  localStorage.setItem('bridgeEd_currentUser', JSON.stringify(user));
}

// Logout
function logout() {
  localStorage.removeItem('bridgeEd_currentUser');
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

// Get all students for a teacher (API call)
async function getStudentsByTeacher(teacherId) {
  try {
    const response = await fetch(`${API_URL}/studentprogress/teacher/${teacherId}`);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching students for teacher:', error);
    return [];
  }
}

// Assign student to teacher (API call)
async function assignStudentToTeacher(studentId, teacherId) {
  try {
    const response = await fetch(`${API_URL}/studentprogress/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        studentId: studentId,
        teacherId: teacherId
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Error assigning student to teacher:', error);
    return false;
  }
}

// Update navbar based on login status
function updateNavbar() {
  const authLink = document.getElementById('authLink');
  const teacherDashboardNavItem = document.getElementById('teacherDashboardNavItem');
  const profileNavItem = document.getElementById('profileNavItem');
  
  if (authLink) {
    if (isLoggedIn()) {
      const user = getCurrentUser();
      authLink.textContent = 'Logout';
      authLink.href = '#';
      authLink.onclick = (e) => {
        e.preventDefault();
        logout();
      };
      
      // Show/hide Teacher Dashboard based on user type
      if (teacherDashboardNavItem) {
        if (user.type === 'teacher') {
          teacherDashboardNavItem.style.display = 'block';
        } else {
          teacherDashboardNavItem.style.display = 'none';
        }
      }
      
      // Show/hide Profile link based on user type
      if (profileNavItem) {
        if (user.type === 'student') {
          profileNavItem.style.display = 'block';
        } else {
          profileNavItem.style.display = 'none';
        }
      }
    } else {
      authLink.textContent = 'Login';
      authLink.href = './login.html';
      authLink.onclick = null;
      
      // Hide both Teacher Dashboard and Profile when not logged in
      if (teacherDashboardNavItem) {
        teacherDashboardNavItem.style.display = 'none';
      }
      
      if (profileNavItem) {
        profileNavItem.style.display = 'none';
      }
    }
  }
}

// Require authentication - redirect to login if not logged in
function requireAuth(redirectTo = './login.html') {
  if (!isLoggedIn()) {
    window.location.replace(redirectTo);
  }
}

// Make auth functions globally available
window.Auth = {
  isLoggedIn,
  getCurrentUser,
  setCurrentUser,
  logout,
  findUserById,
  getStudentsByTeacher,
  assignStudentToTeacher,
  updateNavbar,
  requireAuth
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateNavbar);
