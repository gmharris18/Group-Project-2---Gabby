// Profile page functionality

// Display current user's profile
async function displayCurrentUserProfile() {
  const profileDisplay = document.getElementById('profileDisplay');
  const notLoggedInMessage = document.getElementById('notLoggedInMessage');
  
  // Check if user is logged in
  const currentUser = window.Auth.getCurrentUser();
  if (!currentUser || !currentUser.userId) {
    profileDisplay.style.display = 'none';
    notLoggedInMessage.style.display = 'block';
    return;
  }
  
  // Check if we're viewing another user's profile (from teacher dashboard)
  const urlParams = new URLSearchParams(window.location.search);
  const targetUserId = urlParams.get('userId');
  
  let currentUser = window.Auth.getCurrentUser();
  
  // If viewing another user's profile, fetch their data
  if (targetUserId && currentUser.type === 'teacher') {
    try {
      const targetUser = await window.Auth.findUserById(targetUserId);
      if (targetUser) {
        currentUser = targetUser; // Use target user's data for display
        // Update page title to show it's viewing another user
        document.title = `${targetUser.name}'s Profile - BridgeEd`;
        const profileTitle = document.querySelector('h1');
        if (profileTitle) {
          profileTitle.textContent = `${targetUser.name}'s Profile`;
          // Add back button
          profileTitle.innerHTML = `
            <a href="./teacher-dashboard.html" class="btn btn-outline-secondary btn-sm me-3">
              ← Back to Dashboard
            </a>
            ${targetUser.name}'s Profile
          `;
        }
      }
    } catch (error) {
      console.error('Error fetching target user:', error);
      notLoggedInMessage.style.display = 'block';
      notLoggedInMessage.innerHTML = `
        <div class="alert alert-danger">
          <h4 class="alert-heading">Error</h4>
          <p>Could not load the requested user's profile.</p>
          <hr>
          <a href="./teacher-dashboard.html" class="btn btn-primary">Back to Dashboard</a>
        </div>
      `;
      profileDisplay.style.display = 'none';
      return;
    }
  }
  
  // Only students have profiles for now (unless teacher is viewing student profile)
  if (currentUser.type !== 'student' && !targetUserId) {
    notLoggedInMessage.style.display = 'block';
    notLoggedInMessage.innerHTML = `
      <h5 class="alert-heading">Teacher Profile</h5>
      <p>Teacher features are coming soon!</p>
      <a href="./home.html" class="btn btn-primary">Go to Home</a>
    `;
    return;
  }
  
  try {
    // Fetch fresh data from API
    const userId = currentUser.userId;
    const user = await window.Auth.findUserById(userId);
    
    if (!user) {
      notLoggedInMessage.style.display = 'block';
      notLoggedInMessage.innerHTML = `
        <h5 class="alert-heading">Profile Not Found</h5>
        <p>Unable to load your profile. Please try logging in again.</p>
        <a href="./login.html" class="btn btn-primary">Go to Login</a>
      `;
      return;
    }
    
    // Hide error message
    notLoggedInMessage.style.display = 'none';
    
    // Get user details
    const name = user.name;
    const id = user.userId;
    const initial = name.charAt(0).toUpperCase();
    
    // Update profile display
    document.getElementById('userInitial').textContent = initial;
    document.getElementById('userName').textContent = name;
    document.getElementById('userId').textContent = id;
    
    // Show scores
    document.getElementById('score1').textContent = user.scoreGame1 || 0;
    document.getElementById('score2').textContent = user.scoreGame2 || 0;
    document.getElementById('score3').textContent = user.scoreGame3 || 0;
    document.getElementById('score4').textContent = user.scoreGame4 || 0;
    document.getElementById('score5').textContent = user.scoreGame5 || 0;
    
    // Show profile
    profileDisplay.style.display = 'block';
  } catch (error) {
    console.error('Error displaying profile:', error);
    profileDisplay.style.display = 'none';
    notLoggedInMessage.style.display = 'block';
    notLoggedInMessage.innerHTML = `
      <h5 class="alert-heading">Error</h5>
      <p>Unable to load your profile. Please check your connection and try again.</p>
      <button onclick="location.reload()" class="btn btn-primary">Retry</button>
    `;
  }
}

// Load profile on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication and show appropriate nav items
  const currentUser = window.Auth.getCurrentUser();
  if (currentUser) {
    document.getElementById('authLink').textContent = 'Logout';
    document.getElementById('authLink').href = '#';
    document.getElementById('authLink').onclick = function() {
      window.Auth.logout();
      window.location.href = './login.html';
    };
    
    if (currentUser.type === 'student') {
      document.getElementById('profileNavItem').style.display = 'block';
    } else if (currentUser.type === 'teacher') {
      document.getElementById('teacherDashboardNavItem').style.display = 'block';
    } else if (currentUser.type === 'admin') {
      document.getElementById('adminNavItem').style.display = 'block';
    }
  }
  
  displayCurrentUserProfile();
});
