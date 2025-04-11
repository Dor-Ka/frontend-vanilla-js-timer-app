{
    const beepSound = document.getElementById('beep');

    let startTime = 0;
    let currentTime = 0;
    let running = false;
    let timerInterval;

    const startButton = document.querySelector('#start');
    const startIcon = document.querySelector('#start-icon');
    const resetButton = document.querySelector('#reset');
    const display = document.querySelector('#display');

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
        }
    }

    function updateTime() {
        currentTime = Date.now() - startTime;
        const minutes = Math.floor(currentTime / 60000);
        const seconds = Math.floor((currentTime % 60000) / 1000);
        const milliseconds = Math.floor((currentTime % 1000) / 10);

        display.textContent = `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
    }

    function pad(num) {
        return num < 10 ? `0${num}` : num;
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
    }

    startButton.addEventListener('click', startStopTimer);
    resetButton.addEventListener('click', resetTimer);

    document.addEventListener('keydown', function (event) {
        if (event.code === 'Space') {
            event.preventDefault();
            startStopTimer();
        } else if (event.code === "KeyR") {
            resetTimer();
        }
    });

}