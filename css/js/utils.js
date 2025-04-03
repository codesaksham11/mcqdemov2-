// js/utils.js

// Function to show notification popup (modified from index.js)
let notificationTimeout;
function showNotification(message, type = 'info', duration = 3000) {
    const popup = document.getElementById('notification-popup');
    const msgElement = document.getElementById('notification-message');

    if (!popup || !msgElement) {
        console.error("Notification elements not found!");
        alert(message); // Fallback
        return;
    }

    // Clear any existing timeout
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }

    msgElement.textContent = message;
    popup.className = 'notification show'; // Reset classes and add show

    // Add type class (e.g., 'error', 'success')
    if (type === 'error') {
        popup.classList.add('error');
    } else if (type === 'success') {
        popup.classList.add('success');
    } else {
        // Keep default style for 'info' or other types
        popup.classList.remove('error', 'success');
    }

    // Auto-hide after duration
    notificationTimeout = setTimeout(() => {
        popup.classList.remove('show');
    }, duration);
}

// Function to shuffle an array (Fisher-Yates Algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// Function to format time (e.g., seconds into MM:SS)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

// Function to get query parameters (useful if needed, but we'll use sessionStorage)
/*
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
*/
