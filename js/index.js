// Select HTML elements
const form = document.getElementById('search-form');
const wordInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const results = document.getElementById('results');

const wordDisplay = document.getElementById('word');
const pronunciationDisplay = document.getElementById('phonetic');
const audio = document.getElementById('audio');

const partOfSpeechDisplay = document.getElementById('partOfSpeech');
const definitionDisplay = document.getElementById('definition-text');
const exampleDisplay = document.getElementById('example');

const synonymList = document.getElementById('synonyms-list');

const sourceSection = document.getElementById('source-section');
const sourceLink = document.getElementById('source-link');

const favoriteBtn = document.getElementById('favorite-btn');
const favoriteList = document.getElementById('favorite-list');

document.addEventListener('DOMContentLoaded', () => {
    displayFavorites(); // Display favorites on page load
});

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
    searchBtn.disabled = true; // Disable search button during the fetch
    loading.classList.remove('hidden'); // Show loading indicator
    wordDisplay.textContent = 'Loading...'; // Show loading message
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
        if (!response.ok) {
            throw new Error('Word not found');
        }
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Word not found');
        }
        displayWordData(data[0]); // Display the first result
    } catch (error) {
       if (error.message === 'Word not found') {
            showError('Word not found. Please try another word.');
        } else {
            showError('An error occurred while fetching the data. Please try again later.');
        }
    } finally {
        loading.classList.add('hidden'); // Hide loading indicator
        searchBtn.disabled = false; // Re-enable search button
    }
}   

// Function to display the word data
function displayWordData(data) {
    results.classList.remove('hidden'); // Show results section
    errorMessage.classList.add('hidden'); // Hide error message if previously shown
    // word display with first letter capitalized
    wordDisplay.textContent = data.word
     ? data.word.charAt(0).toUpperCase() + data.word.slice(1) 
     : 'N/A';

     // Pronuncuation display
     const phonetic = data.phonetic || (data.phonetics?.find(p => p.text)?.text) || 'N/A';
    pronunciationDisplay.textContent = phonetic;
      // Audio display
    const audioObj = data.phonetics?.find(p => p.audio && p.audio.trim() !== '');
    const audioSrc = audioObj?.audio || '';
    if (audioSrc) {
        audio.src = audioSrc;
        audio.style.display = 'block';
    } else {
        audio.src = '';
        audio.style.display = 'none';
    }

    // meaning display
    const meaning = data.meanings[0] || {};
    partOfSpeechDisplay.textContent = meaning.partOfSpeech || 'N/A';

    // Definitions display
const definitions = meaning.definitions || [];

// Clear any previous definitions
definitionDisplay.innerHTML = '';

if (definitions.length > 0) {
    definitions.forEach((def, index) => {
        const p = document.createElement('p');
        p.textContent = `${index + 1}. ${def.definition}`;
        p.classList.add('mb-2'); // Adds spacing between definitions
        definitionDisplay.appendChild(p);
    });
    
} else {
    definitionDisplay.textContent = 'N/A';
}
    // Example display
    const example = 
    meaning.definitions?.find(def => def.example)?.example || 'No example available.';
    exampleDisplay.textContent = example;
       
    
    // Synonyms display
      synonymList.innerHTML = '';
     const synonyms = [
    ...new Set([
        ...(meaning.synonyms || []),
        ...(meaning.definitions?.flatMap(
            def => def.synonyms || []
        ) || [])
    ])
];
      if (synonyms.length > 0) {
        synonyms.forEach((synonym) => {
            const li = document.createElement('li');
            li.textContent = synonym;
            li.style.cursor = 'pointer';

            li.addEventListener('click', () => {
                wordInput.value = synonym.trim();
                searchWord(synonym.trim());
            });
            synonymList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'N/A';
        synonymList.appendChild(li);
    }

// Source link display
    if (data.sourceUrls && data.sourceUrls.length > 0) {
        sourceLink.href = data.sourceUrls[0];
        sourceLink.textContent = data.sourceUrls[0];
        sourceSection.classList.remove('hidden');
    } else {
        sourceSection.classList.add('hidden');
    }

    // Update the favorite button status when a new word is displayed
    updateFavoriteButton();
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
        span.style.cursor = 'pointer';
        span.style.color = '#2563eb'; // Blue text
        span.style.textDecoration = 'underline';

  // Search when the word is clicked
   span.addEventListener('click', () => {
    wordInput.value = word;
    searchWord(word);
  });

   li.appendChild(span);

    const removeBtn = document.createElement('button');
     removeBtn.type = 'button';
     removeBtn.textContent = 'Remove';
 removeBtn.addEventListener("click", () => {
      favorite = favorite.filter((fav) => fav.toLowerCase() !== word.toLowerCase());
      saveFavorites();
      displayFavorites();
// Re-sync the favorite button
  updateFavoriteButton();
 });
        li.appendChild(removeBtn);
        favoriteList.appendChild(li);
    });
}

// Add current word to favorites
favoriteBtn.addEventListener('click', () => {
    const currentWord = wordDisplay.textContent.trim();
    // check if current already exists (case-insensitive)
    const alreadyExists = favorite.some((fav) => fav.toLowerCase() === currentWord.toLowerCase());
    if (currentWord && 
        currentWord !== 'Loading...' && 
        currentWord !== 'N/A' &&
        !alreadyExists) {
        favorite.push(currentWord.toLowerCase());
        saveFavorites();
        displayFavorites();
        updateFavoriteButton();
    }
});

// Save favorites to local storage
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorite));
}
// update the favorite button text based on whether the word is already in favorites
function updateFavoriteButton() {
    const currentWord = wordDisplay.textContent.trim().toLowerCase();
     if (!currentWord || currentWord === "loading..." || currentWord ===''){
        favoriteBtn.textContent = "Add to Favorites";
        favoriteBtn.classList.remove("saved");
     }
    const saved = favorite.some((fav) => fav.toLowerCase() === currentWord)
    if (saved) {

        favoriteBtn.textContent = "Saved";
        favoriteBtn.classList.add("saved");

    } else {

        favoriteBtn.textContent = "Add to Favorites";
        favoriteBtn.classList.remove("saved");
        return;
    }

}
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
    wordDisplay.textContent = '';
    definitionDisplay.textContent = '';
    pronunciationDisplay.textContent = '';
    audio.src = '';
    audio.style.display = 'none';
    partOfSpeechDisplay.textContent = '';
    exampleDisplay.textContent = '';
    synonymList.innerHTML = '';

    // source link display
    sourceLink.href = '';
    sourceLink.textContent = '';
    sourceSection.classList.add('hidden');
}
