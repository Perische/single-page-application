# Wordly Dictionary SPA

## Project Description

Wordly Dictionary SPA is a Single Page Application (SPA) built using HTML, CSS, and JavaScript. It allows users to search for English words and instantly retrieve their definitions, pronunciation, examples, synonyms, and audio pronunciation using the Free Dictionary API. The application updates dynamically without refreshing the page and allows users to save their favorite words using localStorage.

---

## Features

- 🔍 Search for English words
- 📖 Display word definitions
- 📝 Display parts of speech
- 🔊 Display pronunciation text
- 🎧 Play pronunciation audio (when available)
- 💬 Display example sentences
- 📚 Display synonyms
- ❤️ Save favorite words using localStorage
- 🔁 Click a favorite word to search it again
- ❌ Remove favorite words
- ⚠️ Handle invalid words and API errors gracefully
- 📱 Responsive design for desktop and mobile devices

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Tailwind CSS
- Fetch API
- Async/Await
- Local Storage
- Free Dictionary API

---

## Project Structure

```
wordly/
│
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    └── screenshot.png
```


---

## Installation

1. Clone the repository

```
git clone https://github.com/Perische/single-page-application.git
```

2. Open the project folder.

3. Open the project with Live Server.

4. npm is not required

OR

4. Open the project in Visual Studio Code.

5. Right-click `index.html`.

6. Select **Open with Live Server**.

---

## Usage

1. Enter an English word in the search box.
2. Click the **Search** button.
3. View the word's:
   - Definition
   - Part of speech
   - Pronunciation
   - Audio pronunciation (if available)
   - Example sentence
   - Synonyms
4. Click **Add to Favorites** to save the word.
5. Click a saved favorite word to search it again.
6. Remove a favorite using the remove option.

---

## API Information

This application uses the **Free Dictionary API**.

Endpoint:

```
https://api.dictionaryapi.dev/api/v2/entries/en/{word}
```

The API provides:

- Word definitions
- Parts of speech
- Pronunciation
- Audio pronunciation
- Example sentences
- Synonyms
- Source links (when available)

---

## Error Handling

The application handles several common errors, including:

- Empty search input
- Invalid or misspelled words
- Missing pronunciation audio
- Missing examples
- Missing synonyms
- API or network failures

---

## Responsive Design

The application is responsive and adapts to different screen sizes, including desktops, tablets, and mobile devices.

---

## Screenshot

![Wordly Dictionary Screenshot](assets/screenshot.png)

Example:

```
assets/
└── screenshot.png
```

Then display it using:

```markdown
![Wordly Dictionary Screenshot](assets/screenshot.png)
```

---

## Live Demo

```
https://perische.github.io/single-page-application/
```

---

## GitHub Repository

https://github.com/Perische/single-page-application

---

## Known Limitations

- Some words do not include pronunciation audio.
- Some words do not contain example sentences.
- Some words do not contain synonyms.
- Only English words are supported by this application.
- Results depend on the availability of data returned by the Free Dictionary API.

---

## Future Improvements

Possible future enhancements include:

- Dark mode
- Search history
- Recent searches
- Word of the Day
- Multiple language support
- Speech-to-text search
- Better favorite management
- Improved animations

---
## Author

**Peris Wamweu**

Software Engineer Developer

GitHub: https://github.com/Perische

---

## License

This project was created for educational purposes.

---
