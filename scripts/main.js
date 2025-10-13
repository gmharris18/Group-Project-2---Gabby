// Custom JavaScript

// Initialize localStorage for BridgeEd
(function() {
  // Initialize users storage if not exists
  if (!localStorage.getItem('bridgeEd_users')) {
    localStorage.setItem('bridgeEd_users', JSON.stringify([]));
  }
})();

