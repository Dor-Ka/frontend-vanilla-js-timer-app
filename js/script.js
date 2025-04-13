(() => {
       const DOM = {
        beepSound: document.getElementById('beep'),
        startButton: document.querySelector('#start'),
        startIcon: document.querySelector('#start-icon'),
        resetButton: document.querySelector('#reset'),
        display: document.querySelector('#display'),
        historyList: document.querySelector('#history-list'),
        clearHistoryButton: document.getElementById('clear-history'),
        toggleDarkModeButton: document.getElementById('toggle-dark-mode')
    };

    const timerState = {
        startTime: 0,
        currentTime: 0,
        running: false,
        timerInterval: null,
        spacePressed: false
    };

    const utils = {
        formatTime(ms) {
            const minutes = Math.floor(ms / 60000);
            const seconds = Math.floor((ms % 60000) / 1000);
            const milliseconds = Math.floor((ms % 1000) / 10);
            return `${this.pad(minutes)}:${this.pad(seconds)}:${this.pad(milliseconds)}`;
        },

        pad(num) {
            return num < 10 ? `0${num}` : num;
        }
    };

    const storageManager = {
        saveLastMeasurement(time) {
            localStorage.setItem('lastMeasurement', time);
        },

        getHistory() {
            const history = localStorage.getItem('timer-history');
            return history ? JSON.parse(history) : [];
        },

        saveHistory(history) {
            localStorage.setItem('timer-history', JSON.stringify(history));
        },

        addToHistory(duration) {
            const history = this.getHistory();
            const newRecord = {
                time: duration,
                date: new Date().toLocaleString()
            };
            history.push(newRecord);
            this.saveHistory(history);
            this.saveLastMeasurement(duration);
            uiManager.displayHistory();
        },

        saveTimerState() {
            localStorage.setItem('currentTime', timerState.currentTime);
            localStorage.setItem('startTime', timerState.startTime);
            localStorage.setItem('running', timerState.running);
        },

        loadTimerState() {
            if (localStorage.getItem('currentTime') && localStorage.getItem('startTime')) {
                timerState.currentTime = parseInt(localStorage.getItem('currentTime'));
                timerState.startTime = parseInt(localStorage.getItem('startTime'));
                timerState.running = localStorage.getItem('running') === 'true';

                if (timerState.running) {
                    timerState.timerInterval = setInterval(timerManager.updateTime, 10);
                    uiManager.updateStartButton(true);
                    audioManager.playBeep();
                }
                DOM.display.textContent = utils.formatTime(timerState.currentTime);
            }
        },

        getLastMeasurement() {
            return localStorage.getItem('lastMeasurement');
        }
    };

    const timerManager = {
        updateTime() {
            timerState.currentTime = Date.now() - timerState.startTime;
            DOM.display.textContent = utils.formatTime(timerState.currentTime);
            storageManager.saveTimerState();
        },

        startStop() {
            if (!timerState.running) {
                // Start timer
                timerState.startTime = Date.now() - timerState.currentTime;
                timerState.timerInterval = setInterval(this.updateTime, 10);
                timerState.running = true;
                uiManager.updateStartButton(true);
                audioManager.playBeep();
            } else {
                // Stop timer
                clearInterval(timerState.timerInterval);
                timerState.running = false;
                uiManager.updateStartButton(false);
                audioManager.stopBeep();
                storageManager.addToHistory(timerState.currentTime);
            }
            storageManager.saveTimerState();
        },

        reset() {
            clearInterval(timerState.timerInterval);
            timerState.running = false;
            timerState.currentTime = 0;
            DOM.display.textContent = '00:00:00';
            uiManager.updateStartButton(false);
            audioManager.stopBeep();
            storageManager.saveTimerState();
        }
    };

    const uiManager = {
        updateStartButton(isRunning) {
            DOM.startIcon.src = isRunning ? 'img/btn_stop.png' : 'img/btn_start.png';
            DOM.startButton.querySelector('.button-text').textContent = isRunning ? 'Stop' : 'Start';
        },

        displayHistory() {
            const history = storageManager.getHistory();
            DOM.historyList.innerHTML = '';

            this.displayLastMeasurement();

            history.forEach(record => {
                const listItem = document.createElement('li');

                const header = document.createElement('div');
                header.classList.add('history-item-header');
                header.textContent = `Recorded at: ${record.date}`;

                const body = document.createElement('div');
                body.classList.add('history-item-body');
                body.textContent = `Duration: ⏱️ ${utils.formatTime(record.time)}`;

                listItem.appendChild(header);
                listItem.appendChild(body);
                DOM.historyList.appendChild(listItem);
            });
        },

        displayLastMeasurement() {
            const lastMeasurement = storageManager.getLastMeasurement();
            if (lastMeasurement) {
                const listItem = document.createElement('li');
                listItem.classList.add('history__item', 'history__item--last');

                const header = document.createElement('div');
                header.classList.add('history-item-header');
                header.textContent = 'Last Measurement (saved):';

                const body = document.createElement('div');
                body.classList.add('history-item-body');
                body.textContent = `Duration: ⏱️ ${utils.formatTime(lastMeasurement)}`;

                listItem.appendChild(header);
                listItem.appendChild(body);

                DOM.historyList.insertBefore(listItem, DOM.historyList.firstChild);
            }
        },

        toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        },

        applyStoredTheme() {
            if (localStorage.getItem('theme') === 'dark') {
                document.body.classList.add('dark-mode');
            }
        }
    };

    const audioManager = {
        playBeep() {
            DOM.beepSound.currentTime = 0;
            DOM.beepSound.play();

            DOM.beepSound.onended = null;
            DOM.beepSound.onended = () => {
                DOM.beepSound.currentTime = 0;
                DOM.beepSound.play();
            };
        },

        stopBeep() {
            DOM.beepSound.pause();
            DOM.beepSound.currentTime = 0;
            DOM.beepSound.onended = null;
        }
    };

    const eventHandler = {
        setupEventListeners() {
            DOM.startButton.addEventListener('click', timerManager.startStop.bind(timerManager));
            DOM.resetButton.addEventListener('click', timerManager.reset.bind(timerManager));
            DOM.clearHistoryButton.addEventListener('click', () => {
                storageManager.clearHistory();
                uiManager.displayHistory();
            });

            document.addEventListener('keydown', this.handleKeyDown.bind(this));
            document.addEventListener('keyup', this.handleKeyUp.bind(this));

            DOM.toggleDarkModeButton.addEventListener('click', uiManager.toggleDarkMode);
        },

        handleKeyDown(event) {
            if (event.code === 'Space' && !timerState.spacePressed) {
                event.preventDefault();
                timerManager.startStop();
                timerState.spacePressed = true;
            } else if (event.code === 'KeyR') {
                timerManager.reset();
            }
        },

        handleKeyUp(event) {
            if (event.code === 'Space') {
                timerState.spacePressed = false;
            }
        },

        initialize() {
            uiManager.applyStoredTheme();
            storageManager.loadTimerState();
            uiManager.displayHistory();
        }
    };

    storageManager.clearHistory = function() {
        localStorage.removeItem('timer-history');
    };

    function init() {
        eventHandler.setupEventListeners();
        eventHandler.initialize();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();