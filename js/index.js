// js/index.js

document.addEventListener('DOMContentLoaded', () => {
    const anvils = document.querySelectorAll('.anvil');
    const enterCodeBtn = document.getElementById('enter-code-btn'); // New button trigger
    const codeModal = document.getElementById('code-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const submitCodeBtn = document.getElementById('submit-code-btn');
    const codeInput = document.getElementById('code-input'); // Password input
    const codeLevelSelect = document.getElementById('code-level-select');
    const codeError = document.getElementById('code-error'); // Error span in modal
    const notificationPopup = document.getElementById('notification-popup');
    const notificationMessage = document.getElementById('notification-message');
    const anvilSound = document.getElementById('anvil-sound');

    // Hardcoded valid access codes
    const VALID_CODES = {
        see: 'zombieintsunami',
        basic: 'outofcontextnepal',
        ktm: 'davinchiproduction'
    };

    // --- Initial Check: Disable dropdown options for already stored codes ---
    function updateDropdownOptions() {
        Object.keys(VALID_CODES).forEach(level => {
            const codeKey = `${level}_code`; // e.g., 'see_code'
            const optionElement = codeLevelSelect.querySelector(`option[value="${level}"]`);
            if (localStorage.getItem(codeKey) && optionElement) {
                optionElement.disabled = true;
                optionElement.textContent += " (Code Stored)"; // Visual feedback
            } else if (optionElement) {
                // Ensure it's enabled if code was removed (e.g., manually)
                optionElement.disabled = false;
                 // Remove the stored message if it exists from previous state
                optionElement.textContent = optionElement.textContent.replace(" (Code Stored)", "");
            }
        });
    }
    updateDropdownOptions(); // Run on initial load

    // --- Anvil Click Listener (Navigation Only) ---
    anvils.forEach(anvil => {
        anvil.addEventListener('click', () => {
            const targetPage = anvil.dataset.target;

            // Play sound
            if (anvilSound) {
                anvilSound.currentTime = 0;
                anvilSound.play().catch(error => console.error("Audio play failed:", error));
            }

            // **Directly navigate without checking code**
            window.location.href = targetPage;
        });
    });

    // --- 'Enter Access Code' Button Listener ---
    enterCodeBtn.addEventListener('click', () => {
        codeInput.value = ''; // Clear previous input
        codeError.textContent = ''; // Clear previous error
        updateDropdownOptions(); // Ensure dropdown reflects current state
        codeModal.style.display = 'block';
        codeLevelSelect.focus(); // Focus the dropdown first
    });

    // --- Modal Close Listeners ---
    closeModalBtn.addEventListener('click', () => {
        codeModal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target === codeModal) {
            codeModal.style.display = 'none';
        }
    });

    // --- Submit Code Button Listener ---
    submitCodeBtn.addEventListener('click', () => {
        const enteredCode = codeInput.value; // Don't trim passwords typically
        const selectedLevel = codeLevelSelect.value;
        const codeKey = `${selectedLevel}_code`; // e.g., 'see_code'

        codeError.textContent = ''; // Clear previous errors

        if (!enteredCode) {
            codeError.textContent = 'Please enter your access code.';
            return;
        }

        // *** Client-side VALIDATION before storing ***
        if (VALID_CODES[selectedLevel] === enteredCode) {
            // Correct Code
            localStorage.setItem(codeKey, enteredCode); // Store the valid code
            codeModal.style.display = 'none';
            showNotification(`Access code for ${selectedLevel.toUpperCase()} accepted and stored!`, 'success', 3000);
            updateDropdownOptions(); // Update dropdown to disable the option

        } else {
            // Incorrect Code
            codeError.textContent = 'Incorrect code for the selected level.';
            codeInput.value = ''; // Clear the wrong code
            codeInput.focus();
             showNotification('Incorrect code.', 'error', 2000); // Show popup too
        }
    });

    // Optional: Allow Enter key to submit code from password field
    codeInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitCodeBtn.click();
        }
    });

    // --- Utility showNotification function (make sure utils.js has it too) ---
    let notificationTimeout;
    function showNotification(message, type = 'info', duration = 3000) {
        // (Include the showNotification function code from utils.js or previous example here
        //  if utils.js isn't loaded properly or guaranteed)
         // Assuming utils.js is loaded first, this can be removed if you are sure.
         // For safety/clarity in standalone example, let's repeat it slightly modified
         if (notificationTimeout) clearTimeout(notificationTimeout);
         notificationMessage.textContent = message;
         notificationPopup.className = 'notification show'; // Base classes
         notificationPopup.classList.remove('error', 'success'); // Clear specific types
          if (type === 'error') notificationPopup.classList.add('error');
         if (type === 'success') notificationPopup.classList.add('success');

         notificationTimeout = setTimeout(() => {
             notificationPopup.classList.remove('show');
         }, duration);
    }


}); // End DOMContentLoaded
