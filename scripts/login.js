// Login page functionality
let currentUserType = 'student';

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
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('loginId').value.trim();
  const password = document.getElementById('loginPassword').value;
  const messageDiv = document.getElementById('loginMessage');
  
  try {
    messageDiv.innerHTML = '<div class="alert alert-info">Logging in...</div>';
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: id,
        password: password,
        userType: currentUserType
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Login successful
      const user = {
        type: data.userType,
        StudentID: data.userId,
        StudentName: data.name,
        TeacherID: data.userId,
        TeacherName: data.name,
        StudentScoreGame1: data.scoreGame1 || 0,
        StudentScoreGame2: data.scoreGame2 || 0,
        StudentScoreGame3: data.scoreGame3 || 0,
        StudentScoreGame4: data.scoreGame4 || 0,
        StudentScoreGame5: data.scoreGame5 || 0
      };
      setCurrentUser(user);
      messageDiv.innerHTML = '<div class="alert alert-success">Login successful! Redirecting...</div>';
      setTimeout(() => {
        window.location.href = './profile.html';
      }, 1000);
    } else {
      messageDiv.innerHTML = `<div class="alert alert-danger">${data.message || 'Invalid credentials.'}</div>`;
    }
  } catch (error) {
    console.error('Login error:', error);
    messageDiv.innerHTML = '<div class="alert alert-danger">Unable to connect to server. Please try again.</div>';
  }
});

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value.trim();
  const id = document.getElementById('signupId').value.trim();
  const password = document.getElementById('signupPassword').value;
  const messageDiv = document.getElementById('signupMessage');
  
  try {
    messageDiv.innerHTML = '<div class="alert alert-info">Creating account...</div>';
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: id,
        name: name,
        password: password,
        userType: currentUserType
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Registration successful
      const user = {
        type: data.userType,
        StudentID: data.userId,
        StudentName: data.name,
        TeacherID: data.userId,
        TeacherName: data.name,
        StudentScoreGame1: data.scoreGame1 || 0,
        StudentScoreGame2: data.scoreGame2 || 0,
        StudentScoreGame3: data.scoreGame3 || 0,
        StudentScoreGame4: data.scoreGame4 || 0,
        StudentScoreGame5: data.scoreGame5 || 0
      };
      setCurrentUser(user);
      messageDiv.innerHTML = '<div class="alert alert-success">Account created successfully! Redirecting...</div>';
      setTimeout(() => {
        window.location.href = './profile.html';
      }, 1000);
    } else {
      messageDiv.innerHTML = `<div class="alert alert-danger">${data.message || 'Registration failed.'}</div>`;
    }
  } catch (error) {
    console.error('Registration error:', error);
    messageDiv.innerHTML = '<div class="alert alert-danger">Unable to connect to server. Please try again.</div>';
  }
});

// Initialize labels
updateUserTypeLabels();

// Check if already logged in - automatically redirect
if (isLoggedIn()) {
  window.location.href = './profile.html';
}

