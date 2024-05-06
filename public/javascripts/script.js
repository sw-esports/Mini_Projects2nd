
    // Check if the URL contains a message parameter
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
  
    // If message exists, show alert
    if (message) {
        var passwordInput = document.getElementById("password");
        passwordInput.placeholder = 'Invalid Password';
        passwordInput.classList.add("red-placeholder");
        
    }

    // Get the profile picture element
    
    const profilePic = document.getElementById('pic');

    let singleClick = true;
    
    // Add click event listener for double-click
    profilePic.addEventListener('dblclick', function() {
        // Redirect to the /dbl page
        window.location.href = '/upload';
    });
    
    // Add click event listener for single-click
    profilePic.addEventListener('click', function() {
        if (singleClick) {
            // Set singleClick to false to prevent single-click action
            singleClick = false;
    
            // Delay the execution of the single-click action for 300 milliseconds
            setTimeout(function() {
                // If no double-click occurred, redirect to the /upload page
                if (!singleClick) {
                //  my side bar logic
                }
                // Reset singleClick after the delay
                singleClick = true;
            }, 300);
        }
    });
    