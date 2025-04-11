# ⏱️ Timer App (Vanilla JS)

A simple and minimalistic timer/stopwatch application built with **HTML**, **CSS**, and **Vanilla JavaScript**.

---

## 📦 Tech Stack

- HTML5
- CSS3 (BEM methodology)
- Vanilla JavaScript (ES6+)

---

## Supported Functions

### 🎹 Keyboard Support

You can control the timer using your keyboard:

- `Space` – toggle **Start/Stop**
- `R` – **Reset** the timer

> 💡 The `Space` key is now debounced to prevent multiple triggers when held down, improving control and preventing accidental multiple toggles.

> 💡 `MediaPlayPause` key was considered, but due to inconsistent browser and OS-level behavior, it wasn't implemented.

### 📢 Sound Support

The timer now plays a ticking sound while running, which loops until the timer is stopped or reset.

### 📱 Responsiveness

 The app is fully responsive and works on screens as small as 300px.

---

## 🚀 Live Demo

👉 Check out the live demo on GitHub Pages: [Timer App (Vanilla JS)](https://dor-ka.github.io/frontend-vanilla-js-timer-app/)


---

## 🖼️ Screenshots

Here’s a preview of how the Timer App looks:

![Screenshot 1](path_to_screenshot_1.png)
*Main Timer View*

![Screenshot 2](path_to_screenshot_2.png)
*Timer Running with Sound*

---

## 🔧 Features

### v0.1

- [x] Basic HTML structure with display and buttons
- [x] Minimalistic styling
- [x] Custom favicon added
- [x] SEO-friendly meta tags (Open Graph, Twitter Cards)
- [x] Google Fonts for improved typography

### v0.2

- [x] Start / Stop / Reset logic
- [x] Display minutes seconds and milliseconds
- [x] Timer logic and display updates

### v0.3

- [x] Added ticking sound while the timer is running
- [x] Sound loops during timer operation and stops when timer is stopped or reset

### v0.4

- [x] Simplified timer controls from 3 buttons to 2
- [x] Combined Start and Stop into a single toggle button
- [x] Updated UI icons to reflect button state (Start/Stop)

### v0.5

- [x] Added keyboard support using `Space` key to Start/Stop the timer
- [x] Implemented ticking sound that loops while the timer is running
- [x] Considered `MediaPlayPause` key but skipped due to inconsistent support
- [x] Added support for `R` key to reset the timer
- [x] Debounced `Space` key to prevent multiple triggers on key hold

---

## 📁 Folder Structure

├── css   
&emsp;└── style.css   
&emsp;└── timer.css   
└── img         
&emsp;└── favicon.ico   
&emsp;└── og_image_v1.png  
├── js   
&emsp;└── script.js     
└── sounds         
&emsp;└── tick.mp3   
├── index.html    
└── README.md
---

## 📌 Future Plans

- Add "Lap" feature to save intervals
- Improve UI with subtle animations
- Keyboard shortcuts for controlling the timer

---

## 📄 License

MIT