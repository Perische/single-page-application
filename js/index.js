// ===============================
// Select HTML Elements
// ===============================

const form = document.getElementById("search-form");
const wordInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const results = document.getElementById("results");

const wordDisplay = document.getElementById("word");
const pronunciationDisplay = document.getElementById("phonetic");
const audio = document.getElementById("audio");

const partOfSpeechDisplay = document.getElementById("partOfSpeech");
const definitionDisplay = document.getElementById("definition-text");
const exampleDisplay = document.getElementById("example");

const synonymList = document.getElementById("synonyms-list");

const sourceSection = document.getElementById("source-section");
const sourceLink = document.getElementById("source-link");

const favoriteBtn = document.getElementById("favorite-btn");
const favoriteList = document.getElementById("favorite-list");


// ===============================
// Application State
// ===============================

let currentWord = null;

let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];


// ===============================
// Helper Functions
// ===============================

function show(element) {
    element.classList.remove("hidden");
}


function hide(element) {
    element.classList.add("hidden");
}


function saveFavorites() {
    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );
}


// ===============================
// Page Load
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    displayFavorites();
    favoriteBtn.disabled = true;
});


// ===============================
// Search Event
// ===============================

form.addEventListener("submit", (event) => {

    event.preventDefault();

    const word = wordInput.value.trim();

    if (!word) {
        showError("Please enter a word.");
        return;
    }

    searchWord(word);

});


// ===============================
// Fetch Dictionary API
// ===============================

async function searchWord(word) {

    clearDisplay();

    show(results);
    show(loading);

    searchBtn.disabled = true;


    try {

        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
        );


        if (!response.ok) {
            throw new Error("Word not found");
        }


        const data = await response.json();


        displayWordData(data[0]);


        currentWord = data[0].word.toLowerCase();

        favoriteBtn.disabled = false;


    } catch (error) {

        showError(
            "Word not found. Please try another word."
        );


    } finally {

        hide(loading);

        searchBtn.disabled = false;

    }

}


// ===============================
// Display Word Data
// ===============================

function displayWordData(data) {

    renderWord(data);

    renderPronunciation(data);

    renderAudio(data);

    renderMeaning(data);

    renderSynonyms(data);

    renderSource(data);

    updateFavoriteButton();

}


// ===============================
// Render Functions
// ===============================


function renderWord(data) {

    wordDisplay.textContent =
        data.word.charAt(0).toUpperCase() +
        data.word.slice(1);

}



function renderPronunciation(data) {

    const phonetic =
        data.phonetic ||
        data.phonetics?.find(
            item => item.text
        )?.text ||
        "N/A";


    pronunciationDisplay.textContent =
        phonetic;

}



function renderAudio(data) {

    const audioData =
        data.phonetics?.find(
            item => item.audio
        );


    if (audioData?.audio) {

        audio.src = audioData.audio;

        show(audio);

    } else {

        audio.src = "";

        hide(audio);

    }

}



function renderMeaning(data) {

    const meaning =
        data.meanings[0] || {};


    partOfSpeechDisplay.textContent =
        meaning.partOfSpeech || "N/A";


    renderDefinitions(
        meaning.definitions || []
    );


    renderExample(
        meaning.definitions || []
    );

}



function renderDefinitions(definitions) {


    definitionDisplay.innerHTML = "";


    if (!definitions.length) {

        definitionDisplay.textContent =
            "N/A";

        return;

    }


    definitions.forEach(
        (definition, index) => {


            const paragraph =
                document.createElement("p");


            paragraph.textContent =
                `${index + 1}. ${definition.definition}`;


            definitionDisplay.appendChild(
                paragraph
            );

        }
    );

}



function renderExample(definitions) {

    const example =
        definitions.find(
            item => item.example
        )?.example ||
        "No example available.";


    exampleDisplay.textContent =
        example;

}



function renderSynonyms(data) {

    synonymList.innerHTML = "";


    const meaning =
        data.meanings[0] || {};


    const synonyms = [
        ...new Set([
            ...(meaning.synonyms || []),

            ...(meaning.definitions?.flatMap(
                item => item.synonyms || []
            ) || [])
        ])
    ];



    if (!synonyms.length) {

        synonymList.textContent =
            "N/A";

        return;

    }



    synonyms.forEach(word => {


        const li =
            document.createElement("li");


        li.textContent = word;


        li.classList.add(
            "clickable-word"
        );


        li.addEventListener(
            "click",
            () => {

                wordInput.value = word;

                searchWord(word);

            }
        );


        synonymList.appendChild(li);


    });

}



function renderSource(data) {

    if (
        data.sourceUrls &&
        data.sourceUrls.length
    ) {


        sourceLink.href =
            data.sourceUrls[0];


        sourceLink.textContent =
            data.sourceUrls[0];


        show(sourceSection);


    } else {

        hide(sourceSection);

    }

}


// ===============================
// Favorites
// ===============================


favoriteBtn.addEventListener(
    "click",
    () => {


        if (!currentWord) return;


        if (
            !favorites.includes(currentWord)
        ) {


            favorites.push(currentWord);


            saveFavorites();


            displayFavorites();


            updateFavoriteButton();

        }


    }
);



function displayFavorites() {


    favoriteList.innerHTML = "";


    if (!favorites.length) {

        favoriteList.textContent =
            "No favorites yet.";

        return;

    }



    favorites.forEach(word => {


        const li =
            document.createElement("li");


        const span =
            document.createElement("span");


        span.textContent =
            word;


        span.classList.add(
            "clickable-word"
        );


        span.addEventListener(
            "click",
            () => {

                wordInput.value = word;

                searchWord(word);

            }
        );



        const removeBtn =
            document.createElement("button");


        removeBtn.textContent =
            "Remove";


        removeBtn.type =
            "button";


        removeBtn.addEventListener(
            "click",
            () => {


                favorites =
                    favorites.filter(
                        item =>
                        item !== word
                    );


                saveFavorites();

                displayFavorites();

                updateFavoriteButton();

            }
        );


        li.appendChild(span);

        li.appendChild(removeBtn);


        favoriteList.appendChild(li);


    });

}



function updateFavoriteButton() {


    if (!currentWord) {

        favoriteBtn.textContent =
            "Add to Favorites";

        return;

    }


    if (
        favorites.includes(currentWord)
    ) {

        favoriteBtn.textContent =
            "Saved";

    } else {


        favoriteBtn.textContent =
            "Add to Favorites";

    }

}


// ===============================
// Error Handling
// ===============================


function showError(message) {

    errorMessage.textContent =
        message;


    show(errorMessage);


    hide(results);

}



// ===============================
// Clear UI
// ===============================


function clearDisplay() {


    currentWord = null;


    hide(errorMessage);


    wordDisplay.textContent = "";

    pronunciationDisplay.textContent = "";

    partOfSpeechDisplay.textContent = "";

    definitionDisplay.innerHTML = "";

    exampleDisplay.textContent = "";

    synonymList.innerHTML = "";

    audio.src = "";

    hide(audio);

    hide(sourceSection);


    favoriteBtn.disabled = true;

}