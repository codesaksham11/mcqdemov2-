// js/selection_see.js

// Make sure utils.js is loaded before this script in the HTML

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('see-selection-form');
    const quantityInput = document.getElementById('quantity');
    const timeInput = document.getElementById('time');
    const subjectCheckboxes = document.querySelectorAll('input[name="subject"]');
    const startQuizBtn = document.getElementById('start-quiz-btn');

    // Error message spans
    const quantityError = document.getElementById('quantity-error');
    const timeError = document.getElementById('time-error');
    const subjectError = document.getElementById('subject-error');

    // --- Event Listener for Form Submission ---
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent actual form submission
        clearErrors(); // Clear previous error messages

        let isValid = true;

        // 1. Validate Quantity
        const quantity = parseInt(quantityInput.value, 10);
        if (isNaN(quantity) || quantity < 1 || quantity > 100) {
            quantityError.textContent = "Please enter a number between 1 and 100.";
            quantityInput.style.borderColor = 'var(--error-color)'; // Highlight input
            isValid = false;
        }

        // 2. Validate Time
        const time = parseInt(timeInput.value, 10);
        if (isNaN(time) || time < 1 || time > 180) {
            timeError.textContent = "Please enter a time between 1 and 180 minutes.";
            timeInput.style.borderColor = 'var(--error-color)';
            isValid = false;
        }

        // 3. Validate Subjects
        const selectedSubjects = [];
        subjectCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedSubjects.push(checkbox.value);
            }
        });

        if (selectedSubjects.length === 0) {
            subjectError.textContent = "Please select at least one subject.";
            // Optional: Add visual indication to the fieldset border
             document.querySelector('.subject-group').style.borderColor = 'var(--error-color)';
            isValid = false;
        }

        // --- If Valid, Store Settings and Redirect ---
        if (isValid) {
            // Store settings in sessionStorage (cleared when browser tab closes)
            sessionStorage.setItem('see_quiz_settings', JSON.stringify({
                quantity: quantity,
                timeLimitMinutes: time,
                subjects: selectedSubjects
            }));

            // Show success feedback (optional)
            showNotification('Settings saved! Starting quiz...', 'success', 1500);

            // Redirect to MCQ page
            setTimeout(() => {
                 window.location.href = 'mcq_see.html';
            }, 500); // Short delay

        } else {
            // Show a general validation error popup
            showNotification("Please fix the errors in the form.", 'error', 2000);
        }
    });

    // --- Helper function to clear errors ---
    function clearErrors() {
        quantityError.textContent = "";
        timeError.textContent = "";
        subjectError.textContent = "";
        quantityInput.style.borderColor = ''; // Reset border color
        timeInput.style.borderColor = '';
        document.querySelector('.subject-group').style.borderColor = '';
    }

    // --- Optional: Real-time feedback (clears error when user types) ---
    quantityInput.addEventListener('input', () => {
        if (quantityError.textContent) clearErrors();
    });
    timeInput.addEventListener('input', () => {
        if (timeError.textContent) clearErrors();
    });
    subjectCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
           if(subjectError.textContent) clearErrors();
        });
    });

}); // End DOMContentLoaded
