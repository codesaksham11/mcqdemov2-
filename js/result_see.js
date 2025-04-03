// js/result_see.js

document.addEventListener('DOMContentLoaded', () => {
    const summarySection = document.getElementById('summary-section');
    const detailsSection = document.getElementById('details-section');
    const loadingMessage = document.getElementById('loading-message-result');
    const scoreFeedback = document.getElementById('score-feedback');
    const scoreDisplay = document.getElementById('score-display');
    const timeTakenDisplay = document.getElementById('time-taken-display');
    const showDetailsBtn = document.getElementById('show-details-btn');
    const hideDetailsBtn = document.getElementById('hide-details-btn');
    const detailedAnswersContainer = document.getElementById('detailed-answers-container');

    // --- 1. Load Results Data ---
    const resultsString = sessionStorage.getItem('see_quiz_results');
    if (!resultsString) {
        loadingMessage.textContent = 'Result data not found. Please take the quiz first.';
        loadingMessage.style.color = 'var(--error-color)';
         // Hide action buttons if results are missing
        document.querySelector('.action-buttons').style.display = 'none';
        return;
    }

    try {
        const results = JSON.parse(resultsString);
        const { askedQuestions, userAnswers, timeTaken, totalTime, settings } = results;

        // --- 2. Calculate Score ---
        let score = 0;
        let skippedCount = 0;
        askedQuestions.forEach((question, index) => {
            const correctAnswer = question.answer; // e.g., 'c'
            const userAnswer = userAnswers[index]; // e.g., 'a', or undefined if skipped

            if (userAnswer === correctAnswer) {
                score++;
            } else if (typeof userAnswer === 'undefined') {
                 skippedCount++;
            }
        });

        const totalQuestions = askedQuestions.length;
        const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

        // --- 3. Display Summary ---
        scoreDisplay.textContent = `${score} / ${totalQuestions}`;

        // Display Time Taken
        if (timeTaken === -1) { // Check for timeout flag
            timeTakenDisplay.textContent = 'Time Out!';
            timeTakenDisplay.style.color = 'var(--error-color)';
             timeTakenDisplay.style.fontWeight = 'bold';
        } else if (typeof timeTaken === 'number') {
             timeTakenDisplay.textContent = formatTime(timeTaken); // Use utility function
        } else {
            timeTakenDisplay.textContent = 'N/A';
        }


        // Determine and display feedback message
        let feedbackText = "";
        let feedbackClass = "";
        if (percentage === 100) {
            feedbackText = "Perfect! You nailed it!";
            feedbackClass = "feedback-perfect";
        } else if (percentage >= 80) {
            feedbackText = "Appreciable effort! Keep it up!";
            feedbackClass = "feedback-good";
        } else if (percentage >= 50) {
             feedbackText = "Good job! A little more effort needed.";
             feedbackClass = "feedback-effort";
        } else if (percentage >= 25) {
            feedbackText = "Needs more practice.";
            feedbackClass = "feedback-practice";
        } else {
            feedbackText = "Try harder next time!";
            feedbackClass = "feedback-fail";
        }
        scoreFeedback.textContent = feedbackText;
        scoreFeedback.className = `feedback-message ${feedbackClass}`; // Apply class

        loadingMessage.style.display = 'none'; // Hide loading
        summarySection.style.display = 'block'; // Show summary


        // --- 4. Populate Detailed View (Hidden Initially) ---
        askedQuestions.forEach((question, index) => {
            const questionBlock = document.createElement('div');
            questionBlock.className = 'result-question-block';

            const questionText = document.createElement('p');
            questionText.className = 'question-text';
            questionText.innerHTML = `${index + 1}. ${question.question}`;
            questionBlock.appendChild(questionText);

            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'options-container';

            const correctAnswerId = question.answer;
            const userAnswerId = userAnswers[index];
            let isCorrect = userAnswerId === correctAnswerId;
            let isSkipped = typeof userAnswerId === 'undefined';

            // Add class to question block for overall styling
            if (isCorrect) {
                questionBlock.classList.add('correct');
            } else if (isSkipped) {
                 questionBlock.classList.add('skipped');
            } else {
                questionBlock.classList.add('incorrect');
            }

            const optionKeys = Object.keys(question.options); // ['a', 'b', 'c', 'd']
             optionKeys.forEach(key => {
                 const optionDiv = document.createElement('div');
                 optionDiv.className = 'option-result';

                 const spanText = document.createElement('span');
                 spanText.innerHTML = `${key}) ${question.options[key]}`; // Use innerHTML for option text
                 optionDiv.appendChild(spanText);

                 const markerSpan = document.createElement('span');
                 markerSpan.className = 'marker';


                 // Apply markers and classes based on correctness/selection
                 if (key === correctAnswerId) {
                     optionDiv.classList.add('correct-answer');
                     markerSpan.innerHTML = '✓'; // Tick for correct answer
                       if (isCorrect || isSkipped) { // If user chose correct OR skipped, mark it
                           optionDiv.classList.add('ticked');
                       }
                 }

                 if (!isSkipped && key === userAnswerId && !isCorrect) {
                     optionDiv.classList.add('incorrect-selection');
                     markerSpan.innerHTML = '✗'; // Cross for user's wrong selection
                 }

                  // Only append marker if it has content
                 if (markerSpan.innerHTML) {
                    optionDiv.appendChild(markerSpan);
                 }


                 optionsContainer.appendChild(optionDiv);
             });


            questionBlock.appendChild(optionsContainer);
            detailedAnswersContainer.appendChild(questionBlock);
        });


        // --- 5. Event Listeners for Details Toggle ---
        showDetailsBtn.addEventListener('click', () => {
            detailsSection.style.display = 'block';
            showDetailsBtn.style.display = 'none'; // Hide "Show" button
        });

        hideDetailsBtn.addEventListener('click', () => {
             detailsSection.style.display = 'none';
             showDetailsBtn.style.display = 'block'; // Show "Show" button again
             // Optional: Scroll back to summary
              summarySection.scrollIntoView({ behavior: 'smooth' });
        });

    } catch (error) {
         console.error("Error parsing results data:", error);
         loadingMessage.textContent = 'Error displaying results. Data might be corrupted.';
         loadingMessage.style.color = 'var(--error-color)';
         document.querySelector('.action-buttons').style.display = 'none';
    }

    // Clean up sessionStorage? Optional, depends if you want results to persist briefly after refresh
    // sessionStorage.removeItem('see_quiz_results');
    // sessionStorage.removeItem('see_quiz_settings');


}); // End DOMContentLoaded
