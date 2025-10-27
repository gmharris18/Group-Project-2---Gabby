// Custom JavaScript
// No localStorage initialization needed - using API + sessionStorage

// Navigation logic for all pages
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication and show appropriate nav items
  const currentUser = window.Auth ? window.Auth.getCurrentUser() : null;
  if (currentUser) {
    const authLink = document.getElementById('authLink');
    if (authLink) {
      authLink.textContent = 'Logout';
      authLink.href = '#';
      authLink.onclick = function() {
        if (window.Auth) {
          window.Auth.logout();
        }
        window.location.href = './login.html';
      };
    }
    
    // Show appropriate navigation items based on user type
    if (currentUser.type === 'student') {
      const profileNavItem = document.getElementById('profileNavItem');
      if (profileNavItem) {
        profileNavItem.style.display = 'block';
      }
    } else if (currentUser.type === 'teacher') {
      const teacherDashboardNavItem = document.getElementById('teacherDashboardNavItem');
      if (teacherDashboardNavItem) {
        teacherDashboardNavItem.style.display = 'block';
      }
    } else if (currentUser.type === 'admin') {
      const adminNavItem = document.getElementById('adminNavItem');
      if (adminNavItem) {
        adminNavItem.style.display = 'block';
      }
    }
  }
});
