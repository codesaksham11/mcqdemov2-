// js/index.js

document.addEventListener('DOMContentLoaded', () => {
    const anvils = document.querySelectorAll('.anvil');
    const codeModal = document.getElementById('code-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const submitCodeBtn = document.getElementById('submit-code-btn');
    const codeInput = document.getElementById('code-input');
    const codeLevelSelect = document.getElementById('code-level-select');
    const notificationPopup = document.getElementById('notification-popup');
    const notificationMessage = document.getElementById('notification-message');
    const anvilSound = document.getElementById('anvil-sound'); // Get the audio element

    let notificationTimeout;

    // Function to show notification
    function showNotification(message, type = 'info', duration = 3000) {
        // Clear any existing timeout
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }

        notificationMessage.textContent = message;
        notificationPopup.className = 'notification show'; // Reset classes and add show

        // Add type class (e.g., 'error', 'success')
        if (type === 'error') {
            notificationPopup.classList.add('error');
        } else if (type === 'success') {
             notificationPopup.classList.add('success');
        } else {
             // Keep default style for 'info' or other types
             notificationPopup.classList.remove('error', 'success');
        }


        // Auto-hide after duration
        notificationTimeout = setTimeout(() => {
            notificationPopup.classList.remove('show');
        }, duration);
    }

    // Add click listeners to all anvils
    anvils.forEach(anvil => {
        anvil.addEventListener('click', () => {
            const level = anvil.dataset.level;
            const targetPage = anvil.dataset.target;
            const codeKey = anvil.dataset.codeKey; // e.g., 'see_code'

            // Play sound on click
            if (anvilSound) {
                 anvilSound.currentTime = 0; // Rewind to start if already playing
                 anvilSound.play().catch(error => console.error("Audio play failed:", error)); // Play sound
            }


            // Check if the code already exists in localStorage
            if (localStorage.getItem(codeKey)) {
                // If code exists, proceed directly
                showNotification(`Accessing ${level.toUpperCase()} level...`, 'success', 1500);
                setTimeout(() => {
                     window.location.href = targetPage;
                }, 500); // Short delay for feedback
            } else {
                // If code doesn't exist, show the modal
                codeLevelSelect.value = level; // Pre-select the level in the dropdown
                codeInput.value = ''; // Clear previous input
                codeModal.style.display = 'block';
                codeInput.focus(); // Focus the input field
            }
        });
    });

    // Close modal button listener
    closeModalBtn.addEventListener('click', () => {
        codeModal.style.display = 'none';
    });

    // Close modal if clicking outside the content
    window.addEventListener('click', (event) => {
        if (event.target === codeModal) {
            codeModal.style.display = 'none';
        }
    });

    // Submit code button listener
    submitCodeBtn.addEventListener('click', () => {
        const enteredCode = codeInput.value.trim();
        const selectedLevel = codeLevelSelect.value; // This is set when the modal opens
        const targetPage = document.getElementById(`anvil-${selectedLevel}`).dataset.target;
        const codeKey = document.getElementById(`anvil-${selectedLevel}`).dataset.codeKey;

        if (!enteredCode) {
            showNotification('Please enter an access code.', 'error');
            return; // Don't proceed if code is empty
        }

        // --- Client-side does NOT validate the code ---
        // --- We just store it for the Cloudflare check later ---
        localStorage.setItem(codeKey, enteredCode);

        // Hide modal and show success
        codeModal.style.display = 'none';
        showNotification('Code stored! Proceeding to level selection...', 'success', 2000);

        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = targetPage;
        }, 1000);
    });

    // Optional: Allow Enter key to submit code from input field
     codeInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevent default form submission if it were in a form
          submitCodeBtn.click(); // Trigger the click event of the submit button
        }
    });

}); // End DOMContentLoaded
