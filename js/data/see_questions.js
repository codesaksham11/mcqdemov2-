// js/data/see_questions.js

// IMPORTANT: Ensure this variable name is unique if you load multiple question files
// If loading dynamically, you might wrap this in a function or export it as a module.
const SEE_QUESTIONS_BANK = [
    // --- Science ---
    {
        subject: "science",
        question: "What is the powerhouse of the cell?",
        options: { a: "Nucleus", b: "Ribosome", c: "Mitochondrion", d: "Cell Wall" },
        answer: "c"
    },
    {
        subject: "science",
        question: "Which gas is most abundant in the Earth's atmosphere?",
        options: { a: "Oxygen", b: "Nitrogen", c: "Carbon Dioxide", d: "Argon" },
        answer: "b"
    },
    {
        subject: "science",
        question: "What force keeps planets in orbit around the sun?",
        options: { a: "Magnetic Force", b: "Friction", c: "Tension", d: "Gravity" },
        answer: "d"
    },
     {
        subject: "science",
        question: "What is the chemical symbol for Gold?",
        options: { a: "Go", b: "Au", c: "Ag", d: "Gd" },
        answer: "b"
    },
    // --- Math ---
    {
        subject: "math",
        question: "What is the value of Pi (approx.)?",
        options: { a: "3.14", b: "2.71", c: "1.61", d: "4.13" },
        answer: "a"
    },
    {
        subject: "math",
        question: "If a triangle has angles 90°, 45°, what is the third angle?",
        options: { a: "30°", b: "45°", c: "60°", d: "90°" },
        answer: "b"
    },
     {
        subject: "math",
        question: "What is the square root of 144?",
        options: { a: "10", b: "11", c: "12", d: "13" },
        answer: "c"
    },
     {
        subject: "math",
        question: "Solve for x: 2x + 5 = 15",
        options: { a: "x = 3", b: "x = 4", c: "x = 5", d: "x = 10" },
        answer: "c"
    },
    // --- Optional Math ---
    {
        subject: "opt_math",
        question: "What is the derivative of x²?",
        options: { a: "x", b: "2x", c: "x²/2", d: "2" },
        answer: "b"
    },
     {
        subject: "opt_math",
        question: "In matrix A = [[1, 2], [3, 4]], what is the element a₂₁?",
        options: { a: "1", b: "2", c: "3", d: "4" },
        answer: "c"
    },
    {
        subject: "opt_math",
        question: "What is sin(90°)?",
        options: { a: "0", b: "0.5", c: "1", d: "-1" },
        answer: "c"
    },
     {
        subject: "opt_math",
        question: "log₁₀(100) equals?",
        options: { a: "1", b: "2", c: "10", d: "100" },
        answer: "b"
    },
    // --- Social Studies ---
    {
        subject: "social",
        question: "Who is known as the 'Light of Asia'?",
        options: { a: "Mahatma Gandhi", b: "Jesus Christ", c: "Prophet Muhammad", d: "Gautam Buddha" },
        answer: "d"
    },
    {
        subject: "social",
        question: "In which continent is Nepal located?",
        options: { a: "Europe", b: "Africa", c: "Asia", d: "South America" },
        answer: "c"
    },
    {
        subject: "social",
        question: "What is the legislative body of Nepal called?",
        options: { a: "Congress", b: "Parliament (Sansad)", c: "Senate", d: "National Assembly" },
        answer: "b"
    },
    {
        subject: "social",
        question: "When was the first constitution of Nepal promulgated?",
        options: { a: "1950 AD (2007 BS)", b: "1959 AD (2015 BS)", c: "1990 AD (2047 BS)", d: "2015 AD (2072 BS)" },
        answer: "a" // Note: Referring to the Interim Government of Nepal Act 2007 BS
    }
    // --- Add many more questions for each subject ---
];
