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

    // Function to fetch words from words.json
    async function loadWords() {
        try {
            const response = await fetch('words.json');
            words = await response.json();
        } catch (error) {
            console.error('Error loading words:', error);
            words = [{ word: "example", category: "basic" }, { word: "sample", category: "test" }, { word: "testing", category: "code" }];
        }
        startGame();
    }

    // Function to choose a random word object
    function chooseWordObject() {
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

    // Function to get a hint
    function getHint() {
        if (hintsRemaining > 0) {
            hintsRemaining--;
            hintCountDisplay.textContent = hintsRemaining;
            let hintText = "";

            switch (hintType % 5) {
                case 0: // First Letter
                    hintText = `Hint ${5 - hintsRemaining}: Starts with "${currentWord.charAt(0).toUpperCase()}..."`;
                    break;
                case 1: // Word Length
                    hintText = `Hint ${5 - hintsRemaining}: The word has ${currentWord.length} letters.`;
                    break;
                case 2: // Category
                    hintText = `Hint ${5 - hintsRemaining}: Category is "${currentWordObject.category}".`;
                    break;
                case 3: // Vowel Count
                    const vowels = currentWord.toLowerCase().match(/[aeiou]/g) || [];
                    hintText = `Hint ${5 - hintsRemaining}: It has ${vowels.length} vowels.`;
                    break;
                case 4: // Reveal a Letter
                    let letterToReveal = '';
                    let letterIndex = -1;
                    for (let i = 0; i < currentWord.length; i++) {
                        if (!revealedLetters.includes(i)) {
                            letterToReveal = currentWord[i];
                            letterIndex = i;
                            revealedLetters.push(i);
                            break;
                        }
                    }
                    if (letterToReveal) {
                        let displayedScrambled = scrambledWord.split('');
                        displayedScrambled[letterIndex] = letterToReveal.toUpperCase();
                        scrambledWordDisplay.textContent = displayedScrambled.join('').toUpperCase(); // Keep scrambled word display always uppercase
                        hintText = `Hint ${5 - hintsRemaining}: Letter '${letterToReveal.toUpperCase()}' is at position ${letterIndex + 1}.`;
                    } else {
                        hintText = "Hint: No more letters to reveal.";
                    }
                    break;
            }
            messageDisplay.textContent = hintText;
            messageDisplay.classList.remove('error');
            hintType++;

        } else {
            messageDisplay.textContent = 'No more hints left! 😞';
            messageDisplay.classList.add('error');
        }
    }


    // Event listeners
    submitButton.addEventListener('click', checkAnswer);

    scrambleButton.addEventListener('click', () => {
        scrambledWord = scrambleWordFunc(currentWord);
        scrambledWordDisplay.textContent = scrambledWord.toUpperCase(); // Display scrambled word in uppercase after scramble
        messageDisplay.textContent = '';
        revealedLetters = [];
    });

    hintButton.addEventListener('click', getHint);

    // Initial word loading and game start
    loadWords();
});
