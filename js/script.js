{
    let startTime = 0;
    let currentTime = 0;
    let running = false;
    let timerInterval;

    const startButton = document.querySelector('#start');
    const stopButton = document.querySelector('#stop');
    const resetButton = document.querySelector('#reset');
    const display = document.querySelector('#display');

    function startTimer() {
        if (!running) {
            startTime = Date.now() - currentTime;
            timerInterval = setInterval(updateTime, 10);
            running = true;
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

    function stopTimer() {
        clearInterval(timerInterval);
        running = false;
    }

    function resetTimer() {
        clearInterval(timerInterval);
        running = false;
        currentTime = 0;
        display.textContent = '00:00:00';
    }

    startButton.addEventListener('click', startTimer);
    stopButton.addEventListener('click', stopTimer);
    resetButton.addEventListener('click', resetTimer);
}