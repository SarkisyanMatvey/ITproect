const words = [
    "бенди", "чернила", "джоуи", "алиса", "борис", "сэмми",
    "генри", "мультфильм", "инкрустация", "анимация",
    "воскрешение", "первый", "второй", "третий",
    "паутина", "кошмарный", "ужасы"
]; // Слова, связанные с франшизой Bendy

let word = "";
let guessedLetters = [];
let remainingAttempts = 6;

const wordDisplay = document.getElementById("word-display");
const guessesDiv = document.getElementById("guesses");
const livesDiv = document.getElementById("lives");
const messagePara = document.getElementById("message");
const restartButton = document.getElementById("restart-button");
const hintRandomButton = document.getElementById("hint-random");
const hintSelectedButton = document.getElementById("hint-selected");

function startGame() {
    word = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    remainingAttempts = 6;

    displayWord();
    displayGuesses();
    updateLives();
    messagePara.textContent = "";

    hintRandomButton.style.display = "block"; // Показываем кнопку подсказки
    hintSelectedButton.style.display = "block"; // Показываем кнопку подсказки
    restartButton.style.display = "none"; // Скрываем кнопку перезапуска
}

function displayWord() {
    let display = "";

    for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        if (guessedLetters.includes(letter)) {
            display += letter + " "; // Отображаем угаданную букву
        } else {
            display += "_ "; // Отображаем подчеркивание
        }
    }

    wordDisplay.textContent = display.trim(); // Убираем лишний пробел в конце
}

function displayGuesses() {
    guessesDiv.innerHTML = "";

    const alphabet = "абвгдежзийклмнопрстуфхцчшщъыьэюя"; // Русский алфавит

    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        const button = document.createElement("button");
        button.textContent = letter.toUpperCase();
        button.addEventListener("click", guessLetter);

        if (guessedLetters.includes(letter) || remainingAttempts <= 0 || wordDisplay.textContent.replace(/ /g, '') === word) {
            button.disabled = true; // Отключаем кнопку, если буква уже угадана или игра окончена
        }

        guessesDiv.appendChild(button);

        if ((i + 1) % 7 === 0) {
            const br = document.createElement("br"); // Создаем перенос строки
            guessesDiv.appendChild(br); // Добавляем перенос строки после каждой 7-й кнопки
        }
    }
}

function updateLives() {
    livesDiv.textContent = "♪ ".repeat(remainingAttempts).trim(); // Обновляем символы жизней
}

function guessLetter(event) {
    const letter = event.target.textContent.toLowerCase(); // Преобразуем в нижний регистр

    if (!guessedLetters.includes(letter)) { // Проверяем, не была ли буква уже угадана
        guessedLetters.push(letter);

        if (!word.includes(letter)) { // Если буква не в слове
            remainingAttempts--;
            updateLives();
        }

        displayWord();
        displayGuesses();
        checkGameStatus();
    }
}

function checkGameStatus() {
    if (wordDisplay.textContent.replace(/ /g, '') === word) { // Убираем пробелы при проверке
        messagePara.textContent = "Вы спасли Бенди! Вы выиграли!";
        restartButton.style.display = "block"; // Показываем кнопку перезапуска
        hintRandomButton.style.display = "none"; // Скрываем кнопку подсказки
        hintSelectedButton.style.display = "none"; // Скрываем кнопку подсказки
    } else if (remainingAttempts <= 0) {
        messagePara.textContent = "Чернила поглотили вас... Загаданное слово было: " + word;
        restartButton.style.display = "block"; // Показываем кнопку перезапуска
        hintRandomButton.style.display = "none"; // Скрываем кнопку подсказки
        hintSelectedButton.style.display = "none"; // Скрываем кнопку подсказки
    }
}

hintRandomButton.addEventListener("click", () => {
    if (hintRandomButton.style.display !== "none") {
        let randomLetter;
        do {
            randomLetter = word[Math.floor(Math.random() * word.length)];
        } while (guessedLetters.includes(randomLetter)); // Находим случайную букву, которая еще не угадана

        guessedLetters.push(randomLetter); // Добавляем её в угаданные буквы
        displayWord();
        displayGuesses();
        checkGameStatus();
        hintRandomButton.style.display = "none"; // Отключаем кнопку подсказки
    }
});

hintSelectedButton.addEventListener("click", () => {
    if (hintSelectedButton.style.display !== "none") {
        const letterPositions = [];
        for (let i = 0; i < word.length; i++) {
            if (!guessedLetters.includes(word[i])) {
                letterPositions.push(i); // Сохраняем позиции неугаданных букв
            }
        }

        if (letterPositions.length > 0) {
            const positionPrompt = prompt("Введите номер позиции буквы (начиная с 1):");
            if (positionPrompt) {
                const position = parseInt(positionPrompt) - 1; // Приводим к индексу массива
                if (!isNaN(position) && position >= 0 && position < word.length && !guessedLetters.includes(word[position])) {
                    guessedLetters.push(word[position]); // Добавляем её в угаданные буквы
                    displayWord();
                    displayGuesses();
                    checkGameStatus();
                    hintSelectedButton.style.display = "none"; // Отключаем кнопку подсказки
                } else {
                    alert("Некорректная позиция.");
                }
            }
        } else {
            alert("Все буквы уже угаданы.");
        }
    }
});

restartButton.addEventListener("click", startGame); // Добавляем обработчик для кнопки перезапуска

document.addEventListener('keydown', function (event) {
    const letter = event.key.toLowerCase();
    if (/^[а-яё]$/.test(letter)) { // Проверяем, является ли нажатая клавиша буквой русского алфавита
        const buttons = guessesDiv.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.toLowerCase() === letter) {
                guessLetter({
                    target: button
                }); // Вызываем функцию угадывания с кнопкой
            }
        });
    }
});

startGame(); // Запускаем игру при загрузке страницы
