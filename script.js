document.addEventListener('DOMContentLoaded', () => {
    const scrambledWordDisplay = document.getElementById('scrambled-word');
    const userInput = document.getElementById('user-input');
    const submitButton = document.getElementById('submit-button');
    const scrambleButton = document.getElementById('scramble-button');
    const hintButton = document.getElementById('hint-button');
    const hintCountDisplay = document.getElementById('hint-count');
    const messageDisplay = document.getElementById('message');

    let words = [];
    let currentWord = '';
    let scrambledWord = '';
    let hintsRemaining = 5;

    // Function to fetch words from words.json
    async function loadWords() {
        try {
            const response = await fetch('words.json');
            words = await response.json();
        } catch (error) {
            console.error('Error loading words:', error);
            words = ["example", "sample", "testing"]; // Fallback words
        }
        startGame();
    }

    // Function to choose a random word
    function chooseWord() {
        return words[Math.floor(Math.random() * words.length)];
    }

    // Function to scramble a word
    function scrambleWordFunc(word) {
        const wordArray = word.split('');
        for (let i = wordArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
        }
        return wordArray.join('');
    }

    // Function to start a new game
    function startGame() {
        currentWord = chooseWord();
        scrambledWord = scrambleWordFunc(currentWord);

        // Ensure scrambled word is different from the original
        if (scrambledWord === currentWord) {
            scrambledWord = scrambleWordFunc(currentWord); // Scramble again if same
        }

        scrambledWordDisplay.textContent = scrambledWord;
        userInput.value = '';
        messageDisplay.textContent = '';
        hintsRemaining = 5;
        hintCountDisplay.textContent = hintsRemaining;
    }

    // Function to check the user's answer
    function checkAnswer() {
        const userAnswer = userInput.value.toLowerCase();
        if (userAnswer === currentWord.toLowerCase()) {
            messageDisplay.textContent = 'Correct! 🎉';
            messageDisplay.classList.remove('error');
            messageDisplay.classList.add('correct'); // Add 'correct' class if you want specific styling
            setTimeout(startGame, 1500); // Start new game after 1.5 seconds
        } else {
            messageDisplay.textContent = 'Incorrect, try again! 😔';
            messageDisplay.classList.remove('correct');
            messageDisplay.classList.add('error');
        }
    }

    // Function to get a hint
    function getHint() {
        if (hintsRemaining > 0) {
            hintsRemaining--;
            hintCountDisplay.textContent = hintsRemaining;
            const hint = currentWord.charAt(0); // First letter hint
            messageDisplay.textContent = `Hint: The word starts with "${hint.toUpperCase()}..."`;
            messageDisplay.classList.remove('error');
        } else {
            messageDisplay.textContent = 'No more hints left! 😞';
            messageDisplay.classList.add('error');
        }
    }

    // Event listeners
    submitButton.addEventListener('click', checkAnswer);

    scrambleButton.addEventListener('click', () => {
        scrambledWord = scrambleWordFunc(currentWord);
        scrambledWordDisplay.textContent = scrambledWord;
        messageDisplay.textContent = ''; // Clear any messages
    });

    hintButton.addEventListener('click', getHint);

    // Initial word loading and game start
    loadWords();
});
