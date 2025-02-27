document.addEventListener('DOMContentLoaded', () => {
    const scrambledWordDisplay = document.getElementById('scrambled-word');
    const userInput = document.getElementById('user-input');
    const submitButton = document.getElementById('submit-button');
    const scrambleButton = document.getElementById('scramble-button');
    const hintButton = document.getElementById('hint-button');
    const hintCountDisplay = document.getElementById('hint-count');
    const messageDisplay = document.getElementById('message');

    // Get references to the new HTML elements
    const correctImagePopup = document.getElementById('correct-image-popup');
    const clapSound = document.getElementById('clap-sound');
    const failSound = document.getElementById('fail-sound');

    let words = [];
    let currentWordObject = null;
    let currentWord = '';
    let scrambledWord = '';
    let hintsRemaining = 5;
    let hintType = 0;
    let revealedLetters = [];

    // ... (loadWords, chooseWordObject, scrambleWordFunc, getHint functions - no changes needed) ...

    // Function to start a new game
    function startGame() {
        currentWordObject = chooseWordObject();
        currentWord = currentWordObject.word;
        scrambledWord = scrambleWordFunc(currentWord);

        if (scrambledWord === currentWord) {
            scrambledWord = scrambleWordFunc(currentWord);
        }

        scrambledWordDisplay.textContent = scrambledWord.toUpperCase();
        userInput.value = '';
        messageDisplay.textContent = '';
        hintsRemaining = 5;
        hintCountDisplay.textContent = hintsRemaining;
        hintType = 0;
        revealedLetters = [];

        correctImagePopup.style.display = 'none'; // Hide the correct image at start of each game
    }

    // Function to check the user's answer
    function checkAnswer() {
        const userAnswer = userInput.value.toLowerCase();
        if (userAnswer === currentWord.toLowerCase()) {
            messageDisplay.textContent = 'Correct! 🎉';
            messageDisplay.classList.remove('error');
            messageDisplay.classList.add('correct');

            correctImagePopup.style.display = 'block'; // Show the correct image popup
            clapSound.play(); // Play clap sound

            setTimeout(startGame, 2500); // Start new game after a slightly longer delay (2.5 seconds to see image/hear sound)
        } else {
            messageDisplay.textContent = 'Incorrect, try again! 😔';
            messageDisplay.classList.remove('correct');
            messageDisplay.classList.add('error');

            failSound.play(); // Play fail sound
        }
    }

    // ... (Event listeners and initial loadWords call - no changes needed) ...
});
