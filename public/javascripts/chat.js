
  // Connect to Socket.io server
  const socket = io();
  const currentUser ='<%=user.username%>'; // Set the current user's username

  // Handle form submission
  document.querySelector('.message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const messageInput = document.querySelector('.message-input');
    const message = messageInput.value.trim();
    if (message !== '') {
      socket.emit('send message', { message: message, username: currentUser }); // Send message to server
      messageInput.value = ''; // Clear input field
    }
  });

  // Listen for new messages
  socket.on('new message', (data) => {
    // Display new message in chat interface
    const messagesContainer = document.querySelector('.messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message-container', 'px-4', 'py-1', 'rounded-b-md','mb-1','mt-1', 'text-white', 'clear-both');

    if (data.sender === currentUser) {
      // Message sent by current user, align right
      messageElement.classList.add('bg-blue-500', 'float-right', 'rounded-l-md', 'mr-2');
    } else {
      // Message received, align left
      messageElement.classList.add('bg-gray-500', 'float-left', 'rounded-r-md', 'ml-2');
    }

    messageElement.innerHTML = `
      <div class="message h-full w-full m-0">${data.message}</div>
      <div class="message-info">
          <span class="text-sm font-light mr-1">${data.sender}</span>
          <span class="text-sm font-light mr-1">${data.timestamp}</span>
      </div>`;
    messagesContainer.appendChild(messageElement);
  });
