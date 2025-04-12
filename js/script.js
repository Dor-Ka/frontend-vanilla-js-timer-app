const beepSound = document.getElementById('beep');

let startTime = 0;
let currentTime = 0;
let running = false;
let timerInterval;

const startButton = document.querySelector('#start');
const startIcon = document.querySelector('#start-icon');
const resetButton = document.querySelector('#reset');
const display = document.querySelector('#display');


document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-dark-mode');

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    loadLastMeasurement();
});

function saveLastMeasurement(time) {
    localStorage.setItem('lastMeasurement', time);
}

function addToHistory(duration) {
    const history = getHistory();
    const newRecord = {
        time: duration,
        date: new Date().toLocaleString()
    };
    history.push(newRecord);
    saveHistory(history);
    saveLastMeasurement(duration);
    displayHistory();
}

function saveHistory(history) {
    localStorage.setItem('timer-history', JSON.stringify(history));
}

function saveTime() {
    localStorage.setItem('currentTime', currentTime);
    localStorage.setItem('startTime', startTime);
    localStorage.setItem('running', running);
}

function getHistory() {
    const history = localStorage.getItem('timer-history');
    return history ? JSON.parse(history) : [];
}

function displayHistory() {
    const history = getHistory();
    const historyList = document.querySelector('#history-list');
    historyList.innerHTML = '';

    history.forEach(record => {
        const listItem = document.createElement('li');

        const header = document.createElement('div');
        header.classList.add('history-item-header');
        header.textContent = `Recorded at: ${record.date}`;

        const body = document.createElement('div');
        body.classList.add('history-item-body');
        body.textContent = `Duration: ⏱️ ${formatTime(record.time)}`;

        listItem.appendChild(header);
        listItem.appendChild(body);
        historyList.appendChild(listItem);
    });
}

function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
}

function pad(num) {
    return num < 10 ? `0${num}` : num;
}

function loadTime() {
    if (localStorage.getItem('currentTime') && localStorage.getItem('startTime')) {
        currentTime = parseInt(localStorage.getItem('currentTime'));
        startTime = parseInt(localStorage.getItem('startTime'));
        running = localStorage.getItem('running') === 'true';

        if (running) {
            timerInterval = setInterval(updateTime, 10);
            startIcon.src = 'img/btn_stop.png';
            startButton.querySelector('.button-text').textContent = 'Stop';
            playBeep();
        }
        display.textContent = formatTime(currentTime);
    }
    displayHistory();
}

function loadLastMeasurement() {
    const lastMeasurement = localStorage.getItem('lastMeasurement');
    if (lastMeasurement) {
        const historyList = document.querySelector('#history-list');

        const listItem = document.createElement('li');
        listItem.classList.add('history__item', 'history__item--last'); // stylizujemy specjalnie

        const header = document.createElement('div');
        header.classList.add('history-item-header');
        header.textContent = 'Last Measurement (saved):';

        const body = document.createElement('div');
        body.classList.add('history-item-body');
        body.textContent = `Duration: ⏱️ ${formatTime(lastMeasurement)}`;

        listItem.appendChild(header);
        listItem.appendChild(body);

        historyList.insertBefore(listItem, historyList.firstChild);
    }
}

function playBeep() {
    beepSound.currentTime = 0;
    beepSound.play();

    beepSound.onended = () => {
        beepSound.currentTime = 0;
        beepSound.play();
    };
}

function startStopTimer() {
    if (!running) {
        startTime = Date.now() - currentTime;
        timerInterval = setInterval(updateTime, 10);
        startIcon.src = 'img/btn_stop.png';
        startButton.querySelector('.button-text').textContent = 'Stop';
        running = true;
        playBeep();
    } else {
        clearInterval(timerInterval);
        startIcon.src = 'img/btn_start.png';
        startButton.querySelector('.button-text').textContent = 'Start';
        running = false;
        beepSound.pause();

        addToHistory(currentTime);

    }
    saveTime();
}

function updateTime() {
    currentTime = Date.now() - startTime;
    display.textContent = formatTime(currentTime);
    saveTime();
}

function resetTimer() {
    clearInterval(timerInterval);
    running = false;
    currentTime = 0;
    display.textContent = '00:00:00';
    beepSound.pause();
    beepSound.currentTime = 0;
    startIcon.src = 'img/btn_start.png';
    startButton.querySelector('.button-text').textContent = 'Start';
    saveTime();
}

startButton.addEventListener('click', startStopTimer);
resetButton.addEventListener('click', resetTimer);

let spacePressed = false;
document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && !spacePressed) {
        event.preventDefault();
        startStopTimer();
        spacePressed = true;
    } else if (event.code === 'KeyR') {
        resetTimer();
    }
});

document.addEventListener('keyup', function (event) {
    if (event.code === 'Space') {
        spacePressed = false;
    }
});

document.getElementById('clear-history').addEventListener('click', () => {
    localStorage.removeItem('timer-history');
    displayHistory();
});

displayHistory();
loadTime();
