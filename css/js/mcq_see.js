// js/mcq_see.js

document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const questionCounterDisplay = document.getElementById('question-counter');
    const timerDisplay = document.getElementById('timer-display');
    const submitBtn = document.getElementById('submit-quiz-btn');
    const loadingMessage = document.getElementById('loading-message');

    let quizQuestions = []; // Array to hold the final selected questions for the quiz
    let userAnswers = {}; // Object to store user answers { questionIndex: selectedOptionId }
    let timerInterval; // Holds the interval ID for the countdown
    let timeRemaining; // Time remaining in seconds

    // --- 1. Load Quiz Settings ---
    const settingsString = sessionStorage.getItem('see_quiz_settings');
    if (!settingsString) {
        showNotification("Quiz settings not found. Redirecting to setup...", 'error', 3000);
        setTimeout(() => window.location.href = 'selection_see.html', 1000);
        return;
    }
    const settings = JSON.parse(settingsString);
    const { quantity, timeLimitMinutes, subjects } = settings;
    timeRemaining = timeLimitMinutes * 60; // Convert minutes to seconds

    // --- 2. Filter and Select Questions ---
    if (typeof SEE_QUESTIONS_BANK === 'undefined' || !Array.isArray(SEE_QUESTIONS_BANK)) {
         loadingMessage.textContent = 'Error: Question data not loaded correctly.';
         showNotification("Error loading question data.", 'error', 5000);
         console.error("SEE_QUESTIONS_BANK is not available or not an array.");
         return;
    }

    // Filter bank by selected subjects
    let availableQuestions = SEE_QUESTIONS_BANK.filter(q => subjects.includes(q.subject));

    if (availableQuestions.length < quantity) {
        loadingMessage.textContent = `Not enough questions available for your selection (${availableQuestions.length} found). Please adjust settings.`;
        showNotification("Not enough questions found.", 'warning', 5000);
        // Optionally disable submit button or redirect back
        submitBtn.disabled = true;
        return;
    }

    // Implement Distribution Logic
    quizQuestions = selectDistributedQuestions(availableQuestions, quantity, subjects);

    // Shuffle the final list of quiz questions for randomness
    quizQuestions = shuffleArray(quizQuestions);

    // Check if selection worked
    if (!quizQuestions || quizQuestions.length === 0) {
        loadingMessage.textContent = 'Error preparing quiz questions.';
         showNotification("Failed to prepare questions.", 'error', 5000);
         submitBtn.disabled = true;
        return;
    }

    // --- 3. Display Questions ---
    displayQuestions(quizQuestions);
    updateQuestionCounter(0, quizQuestions.length); // Initial counter
    loadingMessage.style.display = 'none'; // Hide loading message

    // --- 4. Start Timer ---
    startTimer();

    // --- 5. Event Listeners ---
    quizContainer.addEventListener('change', handleAnswerSelection); // Event delegation for radio buttons
    submitBtn.addEventListener('click', handleSubmit);

    // --- FUNCTION DEFINITIONS ---

    // Function to select questions based on distribution logic
    function selectDistributedQuestions(sourceQuestions, totalQuantity, selectedSubjects) {
        const finalQuestions = [];
        const questionsBySubject = {};
        selectedSubjects.forEach(sub => questionsBySubject[sub] = []);

        // Group source questions by subject
        sourceQuestions.forEach(q => {
            if (questionsBySubject[q.subject]) {
                questionsBySubject[q.subject].push(q);
            }
        });

        // Shuffle questions within each subject group
        for (const sub in questionsBySubject) {
            questionsBySubject[sub] = shuffleArray(questionsBySubject[sub]);
        }

        const numSubjects = selectedSubjects.length;
        const baseQuestionsPerSubject = Math.floor(totalQuantity / numSubjects);
        let remainder = totalQuantity % numSubjects;

        // Distribute base questions
        selectedSubjects.forEach(sub => {
            const count = Math.min(baseQuestionsPerSubject, questionsBySubject[sub].length);
            finalQuestions.push(...questionsBySubject[sub].splice(0, count));
        });


        // Distribute remainder based on priority: Science > Social > Math > Opt Math
        const priority = ["science", "social", "math", "opt_math"];
        const selectedPriority = priority.filter(p => selectedSubjects.includes(p)); // Only consider selected subjects

        let remainingToDistribute = totalQuantity - finalQuestions.length; // How many more needed? Includes base + remainder

         while (remainingToDistribute > 0) {
             let addedInRound = false;
             for (const sub of selectedPriority) {
                  if (remainingToDistribute > 0 && questionsBySubject[sub].length > 0) {
                       finalQuestions.push(questionsBySubject[sub].shift()); // Take one more
                       remainingToDistribute--;
                       addedInRound = true;
                   }
             }
              // Break if no questions can be added (e.g., exhausted all sources)
             if (!addedInRound) break;
         }


        // If after distribution we still don't have enough (due to limited questions per subject),
        // fill up randomly from remaining available questions across selected subjects.
        // This is a fallback, ideally the initial check prevents this.
        let availableRemaining = Object.values(questionsBySubject).flat();
        while (finalQuestions.length < totalQuantity && availableRemaining.length > 0) {
             availableRemaining = shuffleArray(availableRemaining); // Shuffle remaining
             finalQuestions.push(availableRemaining.shift());
        }

        return finalQuestions.slice(0, totalQuantity); // Ensure exactly the quantity requested
    }


    // Function to display questions grouped by subject
    function displayQuestions(questionsToDisplay) {
        quizContainer.innerHTML = ''; // Clear loading message or previous content
        const questionsGrouped = {};

        // Group questions by subject for display ordering
        questionsToDisplay.forEach((q, index) => {
            if (!questionsGrouped[q.subject]) {
                questionsGrouped[q.subject] = [];
            }
            // Add original index to track answers correctly
            questionsGrouped[q.subject].push({ ...q, originalIndex: index });
        });

        // Define display order matching priority (or just selected order)
         const displayOrder = ["science", "social", "math", "opt_math"].filter(s => subjects.includes(s));
         // Add any other selected subjects not in priority order (if applicable)
         subjects.forEach(s => {
            if (!displayOrder.includes(s)) displayOrder.push(s);
         })


        displayOrder.forEach(subject => {
            if (questionsGrouped[subject] && questionsGrouped[subject].length > 0) {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'subject-section';
                sectionDiv.dataset.subject = subject;

                const title = document.createElement('h2');
                // Capitalize subject name for display
                title.textContent = subject.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                sectionDiv.appendChild(title);

                questionsGrouped[subject].forEach((qData, subjectIndex) => {
                    const questionBlock = document.createElement('div');
                    questionBlock.className = 'question-block';
                    questionBlock.id = `question-${qData.originalIndex}`; // Use original index for ID

                    const questionText = document.createElement('p');
                    questionText.className = 'question-text';
                     // Use overall question number
                     const overallQuestionNumber = questionsToDisplay.findIndex(q => q === qData.question) + 1;
                    questionText.innerHTML = `${overallQuestionNumber}. ${qData.question}`; // Use innerHTML if question has formatting
                    questionBlock.appendChild(questionText);

                    const optionsContainer = document.createElement('div');
                    optionsContainer.className = 'options-container';

                    // Shuffle options before displaying? (Optional, usually not done in standard tests)
                    const optionKeys = Object.keys(qData.options); // ['a', 'b', 'c', 'd']

                    optionKeys.forEach(key => {
                        const label = document.createElement('label');
                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.name = `q${qData.originalIndex}_options`; // Unique name per question using original index
                        input.value = key;
                        input.dataset.questionIndex = qData.originalIndex; // Store index on the input

                        const span = document.createElement('span');
                        span.innerHTML = ` ${key}) ${qData.options[key]}`; // Use innerHTML for option text

                        label.appendChild(input);
                        label.appendChild(span);
                        optionsContainer.appendChild(label);
                    });

                    questionBlock.appendChild(optionsContainer);
                    sectionDiv.appendChild(questionBlock);
                });
                quizContainer.appendChild(sectionDiv);
            }
        });
        updateQuestionCounter(0, questionsToDisplay.length); // Update counter after display
    }

    // Function to handle radio button selection
    function handleAnswerSelection(event) {
        if (event.target.type === 'radio' && event.target.name.includes('_options')) {
            const questionIndex = parseInt(event.target.dataset.questionIndex, 10);
            const selectedOptionId = event.target.value;
            userAnswers[questionIndex] = selectedOptionId;
            // console.log(`Question ${questionIndex + 1} answered: ${selectedOptionId}`); // For debugging
        }
    }

    // Function to start the timer
    function startTimer() {
        timerDisplay.textContent = `Time Left: ${formatTime(timeRemaining)}`; // Initial display
        timerInterval = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = `Time Left: ${formatTime(timeRemaining)}`;

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = "Time Out!";
                timerDisplay.style.color = 'var(--error-color)';
                timerDisplay.style.fontWeight = 'bold';
                showNotification("Time is up! Submitting your answers.", 'warning', 3000);
                handleSubmit(true); // Auto-submit on timeout
            } else if (timeRemaining < 60 && !timerDisplay.classList.contains('warning')) {
                 timerDisplay.style.color = 'orange'; // Optional warning color
                 timerDisplay.classList.add('warning');
            }
        }, 1000);
    }

    // Function to handle quiz submission
    function handleSubmit(isTimeout = false) {
        clearInterval(timerInterval); // Stop the timer
        submitBtn.disabled = true; // Prevent double submission
        submitBtn.textContent = 'Submitting...';

        const timeTaken = (timeLimitMinutes * 60) - timeRemaining;

        // Store results data in sessionStorage for the result page
        sessionStorage.setItem('see_quiz_results', JSON.stringify({
            askedQuestions: quizQuestions, // The actual questions asked
            userAnswers: userAnswers, // User's selected answers { index: 'a' }
            timeTaken: isTimeout ? -1 : timeTaken, // Use -1 or specific flag for timeout
            totalTime: timeLimitMinutes * 60, // Original time limit in seconds
            settings: settings // Include original settings if needed on results page
        }));

        // Redirect to result page
        window.location.href = 'result_see.html';
    }

      // Function to update question counter display (current is not tracked in this all-at-once view)
    function updateQuestionCounter(currentIndex, total) {
        // For this design, we just show the total. Could be enhanced for question-by-question nav.
        questionCounterDisplay.textContent = `Total Questions: ${total}`;
    }

}); // End DOMContentLoaded
