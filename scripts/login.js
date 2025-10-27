// Login page functionality
let currentUserType = 'student';

// Update labels based on user type
function updateUserTypeLabels() {
  const loginIdLabel = document.getElementById('loginIdLabel');
  const signupIdLabel = document.getElementById('signupIdLabel');
  
  if (currentUserType === 'student') {
    loginIdLabel.textContent = 'Student ID';
    signupIdLabel.textContent = 'Student ID';
  } else if (currentUserType === 'teacher') {
    loginIdLabel.textContent = 'Teacher ID';
    signupIdLabel.textContent = 'Teacher ID';
  } else if (currentUserType === 'admin') {
    loginIdLabel.textContent = 'Admin ID';
    signupIdLabel.textContent = 'Admin ID';
  }
}

// Handle user type change
document.querySelectorAll('input[name="userType"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    currentUserType = e.target.value;
    updateUserTypeLabels();
    
    // Show/hide class code fields based on user type
    const classCodeField = document.getElementById('classCodeField');
    const teacherClassCodeField = document.getElementById('teacherClassCodeField');
    const classCodeLabel = document.getElementById('classCodeLabel');
    const classCodeHelp = document.getElementById('classCodeHelp');
    
    if (e.target.value === 'student') {
      // Show student class code field
      if (classCodeField) {
        classCodeField.style.display = 'block';
        classCodeField.querySelector('#classCode').required = true;
      }
      if (teacherClassCodeField) {
        teacherClassCodeField.style.display = 'none';
        teacherClassCodeField.querySelector('#teacherClassCode').required = false;
      }
    } else if (e.target.value === 'teacher') {
      // Show teacher class code field
      if (classCodeField) {
        classCodeField.style.display = 'none';
        classCodeField.querySelector('#classCode').required = false;
      }
      if (teacherClassCodeField) {
        teacherClassCodeField.style.display = 'block';
        teacherClassCodeField.querySelector('#teacherClassCode').required = true;
      }
    } else if (e.target.value === 'admin') {
      // Hide both class code fields for admin
      if (classCodeField) {
        classCodeField.style.display = 'none';
        classCodeField.querySelector('#classCode').required = false;
      }
      if (teacherClassCodeField) {
        teacherClassCodeField.style.display = 'none';
        teacherClassCodeField.querySelector('#teacherClassCode').required = false;
      }
    }
  });
});

// Initialize class code field visibility on page load
document.addEventListener('DOMContentLoaded', () => {
  const classCodeField = document.getElementById('classCodeField');
  const teacherClassCodeField = document.getElementById('teacherClassCodeField');
  const studentRadio = document.getElementById('studentType');
  const teacherRadio = document.getElementById('teacherType');
  
  if (studentRadio && studentRadio.checked) {
    // Show student class code field
    if (classCodeField) {
      classCodeField.style.display = 'block';
      classCodeField.querySelector('#classCode').required = true;
    }
    if (teacherClassCodeField) {
      teacherClassCodeField.style.display = 'none';
      teacherClassCodeField.querySelector('#teacherClassCode').required = false;
    }
  } else if (teacherRadio && teacherRadio.checked) {
    // Show teacher class code field
    if (classCodeField) {
      classCodeField.style.display = 'none';
      classCodeField.querySelector('#classCode').required = false;
    }
    if (teacherClassCodeField) {
      teacherClassCodeField.style.display = 'block';
      teacherClassCodeField.querySelector('#teacherClassCode').required = true;
    }
  }
  
  // Check for admin radio button
  const adminRadio = document.getElementById('adminType');
  if (adminRadio && adminRadio.checked) {
    // Hide both class code fields for admin
    if (classCodeField) {
      classCodeField.style.display = 'none';
      classCodeField.querySelector('#classCode').required = false;
    }
    if (teacherClassCodeField) {
      teacherClassCodeField.style.display = 'none';
      teacherClassCodeField.querySelector('#teacherClassCode').required = false;
    }
  }
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('loginId').value.trim();
  const password = document.getElementById('loginPassword').value;
  const messageDiv = document.getElementById('loginMessage');
  
  messageDiv.innerHTML = '<div class="alert alert-info">Logging in...</div>';
  
  try {
    const response = await fetch(`${window.API_URL}/auth/login`, {
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
    
    const result = await response.json();
    
    if (response.ok) {
      // Login successful
      const userData = {
        type: result.userType,
        userId: result.userId,
        name: result.name,
        StudentScoreGame1: result.scoreGame1 || 0,
        StudentScoreGame2: result.scoreGame2 || 0,
        StudentScoreGame3: result.scoreGame3 || 0,
        StudentScoreGame4: result.scoreGame4 || 0,
        StudentScoreGame5: result.scoreGame5 || 0
      };
      
      // Add type-specific fields
      if (result.userType === 'student') {
        userData.StudentID = result.userId;
        userData.StudentName = result.name;
      } else if (result.userType === 'teacher') {
        userData.TeacherID = result.userId;
        userData.TeacherName = result.name;
      } else if (result.userType === 'admin') {
        userData.AdminID = result.userId;
        userData.AdminName = result.name;
      }
      
      window.Auth.setCurrentUser(userData);
      
      messageDiv.innerHTML = '<div class="alert alert-success">Login successful! Redirecting...</div>';
      setTimeout(() => {
        if (currentUserType === 'teacher') {
          window.location.href = './teacher-dashboard.html';
        } else if (currentUserType === 'admin') {
          window.location.href = './admin.html';
        } else {
          window.location.href = './profile.html';
        }
      }, 1000);
    } else {
      messageDiv.innerHTML = `<div class="alert alert-danger">${result.message || 'Login failed. Please check your credentials.'}</div>`;
    }
  } catch (error) {
    console.error('Login error:', error);
    messageDiv.innerHTML = '<div class="alert alert-danger">Login failed. Please try again.</div>';
  }
});

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value.trim();
  const id = document.getElementById('signupId').value.trim();
  const password = document.getElementById('signupPassword').value;
  const classCode = document.getElementById('classCode').value.trim();
  const teacherClassCode = document.getElementById('teacherClassCode').value.trim();
  const messageDiv = document.getElementById('signupMessage');
  
  messageDiv.innerHTML = '<div class="alert alert-info">Creating account...</div>';
  
  if (!name || !id || !password) {
    messageDiv.innerHTML = '<div class="alert alert-danger">Please fill in all fields.</div>';
    return;
  }
  
  // For students, class code is required
  if (currentUserType === 'student' && !classCode) {
    messageDiv.innerHTML = '<div class="alert alert-danger">Please enter a class code to join your teacher\'s class.</div>';
    return;
  }
  
  // For teachers, teacher class code is required
  if (currentUserType === 'teacher' && !teacherClassCode) {
    messageDiv.innerHTML = '<div class="alert alert-danger">Please create a class code for your students.</div>';
    return;
  }
  
  // Validate teacher class code is not empty
  if (currentUserType === 'teacher' && teacherClassCode && teacherClassCode.length === 0) {
    messageDiv.innerHTML = '<div class="alert alert-danger">Please enter a class code.</div>';
    return;
  }
  
  // For admins, no class code validation needed
  
  try {
    const response = await fetch(`${window.API_URL}/auth/register`, {
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
    
    const result = await response.json();
    
    if (response.ok) {
      // Registration successful
      const userData = {
        type: result.userType,
        userId: result.userId,
        name: result.name,
        StudentScoreGame1: result.scoreGame1 || 0,
        StudentScoreGame2: result.scoreGame2 || 0,
        StudentScoreGame3: result.scoreGame3 || 0,
        StudentScoreGame4: result.scoreGame4 || 0,
        StudentScoreGame5: result.scoreGame5 || 0
      };
      
      // Add type-specific fields
      if (result.userType === 'student') {
        userData.StudentID = result.userId;
        userData.StudentName = result.name;
      } else if (result.userType === 'teacher') {
        userData.TeacherID = result.userId;
        userData.TeacherName = result.name;
      } else if (result.userType === 'admin') {
        userData.AdminID = result.userId;
        userData.AdminName = result.name;
      }
      
      window.Auth.setCurrentUser(userData);
      messageDiv.innerHTML = '<div class="alert alert-success">Account created successfully! Redirecting...</div>';
      setTimeout(() => {
        if (currentUserType === 'teacher') {
          window.location.href = './teacher-dashboard.html';
        } else if (currentUserType === 'admin') {
          window.location.href = './admin.html';
        } else {
          window.location.href = './profile.html';
        }
      }, 1000);
    } else {
      messageDiv.innerHTML = `<div class="alert alert-danger">${result.message || 'Registration failed.'}</div>`;
    }
  } catch (error) {
    console.error('Registration error:', error);
    messageDiv.innerHTML = '<div class="alert alert-danger">Registration failed. Please try again.</div>';
  }
});

// Initialize labels
updateUserTypeLabels();

// Password reset functionality
let resetUserType = 'student';

// Update reset form labels based on user type
function updateResetUserTypeLabels() {
  const resetUserIdLabel = document.getElementById('resetUserIdLabel');
  
  if (resetUserType === 'student') {
    resetUserIdLabel.textContent = 'Student ID';
  } else {
    resetUserIdLabel.textContent = 'Teacher ID';
  }
}

// Handle reset user type change
document.addEventListener('DOMContentLoaded', () => {
  // Handle reset form user type changes
  document.querySelectorAll('input[name="resetUserType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      resetUserType = e.target.value;
      updateResetUserTypeLabels();
    });
  });
});

// Handle password reset form submission
document.addEventListener('DOMContentLoaded', () => {
  const resetForm = document.getElementById('resetPasswordForm');
  if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const userId = document.getElementById('resetUserId').value.trim();
      const newPassword = document.getElementById('resetNewPassword').value;
      const confirmPassword = document.getElementById('resetConfirmPassword').value;
      const messageDiv = document.getElementById('resetPasswordMessage');
      
      // Validate inputs
      if (!userId || !newPassword || !confirmPassword) {
        messageDiv.innerHTML = '<div class="alert alert-danger">All fields are required.</div>';
        return;
      }
      
      if (newPassword !== confirmPassword) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Passwords do not match.</div>';
        return;
      }
      
      if (newPassword.length < 6) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Password must be at least 6 characters long.</div>';
        return;
      }
      
      messageDiv.innerHTML = '<div class="alert alert-info">Resetting password...</div>';
      
      try {
        const response = await fetch(`${window.API_URL}/auth/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            newPassword: newPassword,
            userType: resetUserType
          })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          messageDiv.innerHTML = '<div class="alert alert-success">Password reset successfully! You can now login with your new password.</div>';
          
          // Clear form and close modal after 2 seconds
          setTimeout(() => {
            document.getElementById('resetPasswordForm').reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('resetPasswordModal'));
            modal.hide();
            messageDiv.innerHTML = '';
          }, 2000);
        } else {
          messageDiv.innerHTML = `<div class="alert alert-danger">${result.message || 'Password reset failed.'}</div>`;
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        messageDiv.innerHTML = '<div class="alert alert-danger">Password reset failed. Please try again.</div>';
      }
    });
  }
});

// Check if already logged in - automatically redirect
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = window.Auth.getCurrentUser();
  if (currentUser && currentUser.userId && currentUser.type) {
    if (currentUser.type === 'teacher') {
      window.location.href = './teacher-dashboard.html';
    } else if (currentUser.type === 'student') {
      window.location.href = './profile.html';
    }
  }
});
