
    // Check if the URL contains a message parameter
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
  
    // If message exists, show alert
    if (message) {
        var passwordInput = document.getElementById("password");
        passwordInput.placeholder = 'Invalid Password';
        passwordInput.classList.add("red-placeholder");
        
    }