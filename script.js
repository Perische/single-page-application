// Select HTML elements
const form = document.getElementById('search-form');
const wordInput = document.getElementById('search-input');

const wordDisplay = document.getElementById('word');
const definitionDisplay = document.getElementById('definition-text');
const pronunciationDisplay = document.getElementById('phonetic');
const audio = document.getElementById('audio');

const partOfSpeechDisplay = document.getElementById('partOfSpeech');
const exampleDisplay = document.getElementById('example');
const synonymList = document.getElementById('synonyms-list');
const errorMessage = document.getElementById('errorMessage');
const favoriteBtn = document.getElementById('favorite-btn');
const favoriteList = document.getElementById('favorite-list');
const results = document.getElementById('results');

// Add event listener for form submission
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    const word = wordInput.value.trim(); // Get the input value and trim whitespace
    
    if (word === '') {
        errorMessage.textContent = 'Please enter a word.';
        return;
    }
    searchWord(word);
});

// Function to search for the word using the API
async function searchWord(word) {
    clearDisplay(); // Clear previous results
    results.classList.remove('hidden'); // Show results section
    wordDisplay.textContent = 'Loading...'; // Show loading message
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        const data = await response.json();
        displayWordData(data[0]); // Display the first result
    } catch (error) {
        if (error.message === 'Word not found') {
            showError('Word not found ');
        } else {
            showError('Word not found');
        }
    }
}

// Function to display the word data
function displayWordData(data) {
    errorMessage.classList.add('hidden'); // Hide error message if previously shown
    results.classList.remove('hidden'); // Show results section
    // word display with first letter capitalized
    wordDisplay.textContent =
     data.word.charAt(0).toUpperCase() + data.word.slice(1) || 'N/A';

     // Pronuncuation display
     const phonetic = data.phonetic || (data.phonetics && data.phonetics[0]?.text) || 'N/A';
    pronunciationDisplay.textContent = phonetic;
      // Audio display
      const audioSrc = data.phonetics && data.phonetics[0]?.audio;
    if (audioSrc) {
        audio.src = audioSrc;
        audio.style.display = 'block';
    } else {
        audio.src = '';
        audio.style.display = 'none';
    }
    // Definition display
    const definition = data.meanings[0]?.definitions[0]?.definition || 'N/A';
    definitionDisplay.textContent = definition;

    // meaning display
    const meaning = data.meanings[0] || {};
    partOfSpeechDisplay.textContent = meaning.partOfSpeech || 'N/A';
   
    // Multiple definitions display
    const definitions = meaning.definitions || [];
    if (definitions.length > 1) {
        const additionalDefinitions = definitions.slice(1).map(def => def.definition).join('; ');
        definitionDisplay.textContent += `; ${additionalDefinitions}`;
    }

    // Example display
    const example = meaning.definitions[0]?.example || 'N/A';
    exampleDisplay.textContent = example;
    
    // Synonyms display
      synonymList.innerHTML = '';
      const synonyms = meaning.definitions[0]?.synonyms || [];
      if (synonyms.length > 0) {
        synonyms.forEach((synonym) => {
            const li = document.createElement('li');
            li.textContent = synonym;
            li.addEventListener('click', () => {
                wordInput.value = synonym;
                searchWord(synonym);
            });
            synonymList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'N/A';
        synonymList.appendChild(li);
    }
}
// Function to add Favorite functionality
let favorite = JSON.parse(localStorage.getItem('favorites')) || [];

// Display favorites on page load
function displayFavorites() {
    favoriteList.innerHTML = '';
    if (favorite.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No favorites yet.';
        favoriteList.appendChild(li);
        return;
    }

    favorite.forEach((word) => {
        const li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = word.charAt(0).toUpperCase() + word.slice(1);
        li.appendChild(span);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                favorite = favorite.filter((fav) => fav.toLowerCase() !== word.toLowerCase());
                saveFavorites();
                displayFavorites();
            }
        });
        li.appendChild(checkbox);

        li.addEventListener('click', () => {
            wordInput.value = word;
            searchWord(word);
        });

        favoriteList.appendChild(li);
    });
}

// Add current word to favorites
favoriteBtn.addEventListener('click', () => {
    const currentWord = wordDisplay.textContent;
    if (currentWord && !favorite.includes(currentWord)) {
        favorite.push(currentWord);
        saveFavorites();
        displayFavorites();
    }
});

// Save favorites to local storage
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorite));
}

// Load favorites on page load
window.addEventListener('load', () => {
    displayFavorites();
});
    
// Function to show error messages
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    results.classList.add('hidden'); // Hide results section
}

// Function to clear the display
function clearDisplay() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
    results.classList.add('hidden'); // Hide results section
    wordInput.value = '';
    wordDisplay.textContent = '';
    definitionDisplay.textContent = '';
    pronunciationDisplay.textContent = '';
    audio.src = '';
    audio.style.display = 'none';
    partOfSpeechDisplay.textContent = '';
    exampleDisplay.textContent = '';
    synonymList.innerHTML = '';
}
