// Ultimate Typing Speed Test - Main JavaScript File

class TypingTest {
    constructor() {
        this.currentMode = 'classic';
        this.isTestActive = false;
        this.startTime = null;
        this.endTime = null;
        this.currentText = '';
        this.userInput = '';
        this.currentIndex = 0;
        this.errors = 0;
        this.correctChars = 0;
        this.timer = null;
        this.timeLeft = 60;
        this.testDuration = 60;
        this.soundEnabled = true;
        
        // Game mode properties
        this.gameActive = false;
        this.gameScore = 0;
        this.gameLives = 3;
        this.gameLevel = 1;
        this.fallingWords = [];
        this.gameSpeed = 2000;

        // Color customization
        this.colorPresets = {
            default: {
                primary: '#667eea',
                secondary: '#764ba2',
                accent: '#f093fb',
                success: '#4ade80',
                error: '#f87171'
            },
            ocean: {
                primary: '#0ea5e9',
                secondary: '#0284c7',
                accent: '#06b6d4',
                success: '#10b981',
                error: '#ef4444'
            },
            sunset: {
                primary: '#f97316',
                secondary: '#ea580c',
                accent: '#fbbf24',
                success: '#84cc16',
                error: '#dc2626'
            },
            forest: {
                primary: '#059669',
                secondary: '#047857',
                accent: '#10b981',
                success: '#22c55e',
                error: '#ef4444'
            },
            purple: {
                primary: '#8b5cf6',
                secondary: '#7c3aed',
                accent: '#a855f7',
                success: '#22c55e',
                error: '#ef4444'
            },
            rose: {
                primary: '#e11d48',
                secondary: '#be185d',
                accent: '#f43f5e',
                success: '#10b981',
                error: '#dc2626'
            }
        };

        // Text samples for different difficulties
        this.textSamples = {
            easy: [
                "The quick brown fox jumps over the lazy dog. This is a simple sentence to test your typing speed.",
                "A journey of a thousand miles begins with a single step. Practice makes perfect in everything we do.",
                "Life is what happens when you are busy making other plans. Time flies when you are having fun."
            ],
            medium: [
                "Technology has revolutionized the way we communicate, work, and live our daily lives in the modern world.",
                "The advancement of artificial intelligence and machine learning continues to shape our future possibilities.",
                "Climate change represents one of the most significant challenges facing humanity in the twenty-first century."
            ],
            hard: [
                "Pseudopseudohypoparathyroidism is a rare genetic disorder affecting calcium and phosphate metabolism pathways.",
                "The implementation of quantum cryptography protocols requires sophisticated mathematical algorithms and precise timing.",
                "Neuroplasticity demonstrates the brain's remarkable ability to reorganize synaptic connections throughout life."
            ],
            expert: [
                "#!/usr/bin/env python3\nimport numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\nX_train, y_train = load_dataset()",
                "const asyncFunction = async () => { try { const response = await fetch('/api/data'); return response.json(); } catch (error) { console.error(error); } };",
                "SELECT u.username, COUNT(p.id) as post_count FROM users u LEFT JOIN posts p ON u.id = p.user_id WHERE u.created_at > '2023-01-01' GROUP BY u.id ORDER BY post_count DESC;"
            ]
        };
        
        // Game words for mini game
        this.gameWords = [
            'speed', 'quick', 'fast', 'type', 'word', 'game', 'fun', 'play', 'win', 'score',
            'level', 'power', 'boost', 'combo', 'skill', 'focus', 'rhythm', 'flow', 'zone', 'ace',
            'ninja', 'master', 'expert', 'legend', 'champion', 'hero', 'star', 'rocket', 'flash', 'bolt'
        ];
        
        this.init();
    }
    
    init() {
        this.createParticles();
        this.bindEvents();
        this.loadSavedColors();
        this.updateDisplay();
        this.generateNewText();
    }
    
    createParticles() {
        const particlesContainer = document.getElementById('particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    bindEvents() {
        // Mode switching
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
        });
        
        // Classic mode events
        document.getElementById('startBtn').addEventListener('click', () => this.startTest());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetTest());
        document.getElementById('textInput').addEventListener('input', (e) => this.handleInput(e));
        document.getElementById('timeSelect').addEventListener('change', (e) => this.setTestDuration(e.target.value));
        document.getElementById('difficultySelect').addEventListener('change', () => this.generateNewText());
        
        // Game mode events
        document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseGameBtn').addEventListener('click', () => this.pauseGame());
        document.getElementById('gameInput').addEventListener('input', (e) => this.handleGameInput(e));
        document.getElementById('gameInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.checkGameWord();
            }
        });
        
        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('tryAgainBtn').addEventListener('click', () => this.tryAgain());
        document.getElementById('shareBtn').addEventListener('click', () => this.shareResults());
        
        // Sound toggle
        document.getElementById('soundToggle').addEventListener('click', () => this.toggleSound());

        // Color customization events
        document.getElementById('colorToggle').addEventListener('click', () => this.openColorPanel());
        document.getElementById('closeColorPanel').addEventListener('click', () => this.closeColorPanel());
        document.getElementById('resetColors').addEventListener('click', () => this.resetColors());
        document.getElementById('saveColors').addEventListener('click', () => this.saveColors());

        // Color input events
        ['primary', 'secondary', 'accent', 'success', 'error'].forEach(colorType => {
            const colorInput = document.getElementById(colorType + 'Color');
            const textInput = document.getElementById(colorType + 'ColorText');

            colorInput.addEventListener('input', (e) => this.updateColor(colorType, e.target.value));
            textInput.addEventListener('input', (e) => this.updateColorFromText(colorType, e.target.value));
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.currentTarget.dataset.preset;
                this.applyColorPreset(preset);
            });
        });

        // Drag and drop events
        this.initializeDragAndDrop();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeColorPanel();
            }
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.resetTest();
            }
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                this.openColorPanel();
            }
        });
    }
    
    switchMode(mode) {
        this.currentMode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        if (mode === 'classic') {
            document.getElementById('classicMode').classList.remove('hidden');
            document.getElementById('gameMode').classList.add('hidden');
            this.resetTest();
        } else {
            document.getElementById('classicMode').classList.add('hidden');
            document.getElementById('gameMode').classList.remove('hidden');
            this.resetGame();
        }
    }
    
    generateNewText() {
        const difficultySelect = document.getElementById('difficultySelect');
        const difficulty = difficultySelect ? difficultySelect.value : 'medium';
        const samples = this.textSamples[difficulty] || this.textSamples.medium;
        this.currentText = samples[Math.floor(Math.random() * samples.length)];
        this.displayText();
    }
    
    displayText() {
        const textDisplay = document.getElementById('textDisplay');
        if (!textDisplay || !this.currentText) return;

        textDisplay.innerHTML = '';

        for (let i = 0; i < this.currentText.length; i++) {
            const span = document.createElement('span');
            span.textContent = this.currentText[i];
            span.className = 'char';
            if (i === this.currentIndex && this.isTestActive) {
                span.classList.add('current');
            }
            textDisplay.appendChild(span);
        }
    }
    
    setTestDuration(duration) {
        this.testDuration = parseInt(duration);
        this.timeLeft = this.testDuration;
        this.updateDisplay();
    }
    
    startTest() {
        if (this.isTestActive) return;
        
        this.isTestActive = true;
        this.startTime = Date.now();
        this.timeLeft = this.testDuration;
        this.currentIndex = 0;
        this.errors = 0;
        this.correctChars = 0;
        this.userInput = '';
        
        document.getElementById('textInput').disabled = false;
        document.getElementById('textInput').focus();
        document.getElementById('textInput').value = '';
        document.getElementById('startBtn').disabled = true;
        
        this.displayText();
        this.startTimer();
        this.playSound('start');
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.endTest();
            }
        }, 1000);
    }
    
    handleInput(e) {
        if (!this.isTestActive) return;

        const newInput = e.target.value;
        const oldLength = this.userInput.length;
        const newLength = newInput.length;

        // Handle backspace/deletion
        if (newLength < oldLength) {
            // User deleted characters, adjust counters
            const deletedCount = oldLength - newLength;
            for (let i = 0; i < deletedCount; i++) {
                if (this.currentIndex > 0) {
                    this.currentIndex--;
                    const deletedChar = this.userInput[this.currentIndex];
                    const correctChar = this.currentText[this.currentIndex];

                    if (deletedChar === correctChar && this.correctChars > 0) {
                        this.correctChars--;
                    } else if (deletedChar !== correctChar && this.errors > 0) {
                        this.errors--;
                    }
                }
            }
        } else if (newLength > oldLength) {
            // User typed new characters
            for (let i = oldLength; i < newLength; i++) {
                if (i < this.currentText.length) {
                    const typedChar = newInput[i];
                    const correctChar = this.currentText[i];

                    if (typedChar === correctChar) {
                        this.correctChars++;
                        this.playSound('correct');
                    } else {
                        this.errors++;
                        this.playSound('error');
                    }
                    this.currentIndex = i + 1;
                }
            }
        }

        this.userInput = newInput;
        this.updateCharacterDisplay();
        this.updateDisplay();

        // Check if test is complete
        if (this.currentIndex >= this.currentText.length) {
            this.endTest();
        }
    }
    
    updateCharacterDisplay() {
        const chars = document.querySelectorAll('.char');

        chars.forEach((char, index) => {
            char.className = 'char';

            if (index < this.userInput.length) {
                if (this.userInput[index] === this.currentText[index]) {
                    char.classList.add('correct');
                } else {
                    char.classList.add('incorrect');
                }
            } else if (index === this.currentIndex && this.isTestActive) {
                char.classList.add('current');
            }
        });
    }
    
    endTest() {
        this.isTestActive = false;
        this.endTime = Date.now();
        clearInterval(this.timer);
        
        document.getElementById('textInput').disabled = true;
        document.getElementById('startBtn').disabled = false;
        
        this.calculateResults();
        this.showResults();
        this.playSound('complete');
    }
    
    calculateResults() {
        const timeElapsed = (this.endTime - this.startTime) / 1000 / 60; // in minutes
        const wordsTyped = this.correctChars / 5; // standard: 5 characters = 1 word
        this.wpm = Math.round(wordsTyped / timeElapsed);
        this.accuracy = Math.round((this.correctChars / (this.correctChars + this.errors)) * 100) || 0;
    }
    
    resetTest() {
        this.isTestActive = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        this.currentIndex = 0;
        this.errors = 0;
        this.correctChars = 0;
        this.userInput = '';
        this.timeLeft = this.testDuration;
        this.wpm = 0;
        this.accuracy = 100;
        this.startTime = null;
        this.endTime = null;

        const textInput = document.getElementById('textInput');
        const startBtn = document.getElementById('startBtn');

        if (textInput) {
            textInput.value = '';
            textInput.disabled = true;
        }
        if (startBtn) {
            startBtn.disabled = false;
        }

        this.generateNewText();
        this.updateDisplay();
    }
    
    updateDisplay() {
        // Calculate real-time WPM during typing
        if (this.isTestActive && this.startTime) {
            const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // in minutes
            if (timeElapsed > 0) {
                const wordsTyped = this.correctChars / 5; // standard: 5 characters = 1 word
                this.wpm = Math.round(wordsTyped / timeElapsed);
            }
        }

        // Calculate real-time accuracy
        const totalChars = this.correctChars + this.errors;
        if (totalChars > 0) {
            this.accuracy = Math.round((this.correctChars / totalChars) * 100);
        } else {
            this.accuracy = 100;
        }

        document.getElementById('wpm').textContent = this.wpm || 0;
        document.getElementById('accuracy').textContent = (this.accuracy || 100) + '%';
        document.getElementById('timer').textContent = this.timeLeft;
        document.getElementById('errors').textContent = this.errors;

        // Update progress bar with safety check
        if (this.currentText && this.currentText.length > 0) {
            const progress = (this.currentIndex / this.currentText.length) * 100;
            document.getElementById('progressFill').style.width = Math.min(100, Math.max(0, progress)) + '%';
            document.getElementById('progressText').textContent = Math.round(Math.min(100, Math.max(0, progress))) + '% Complete';
        } else {
            document.getElementById('progressFill').style.width = '0%';
            document.getElementById('progressText').textContent = '0% Complete';
        }
    }

    // Game Mode Functions
    startGame() {
        if (this.gameActive) return;

        this.gameActive = true;
        this.gameScore = 0;
        this.gameLives = 3;
        this.gameLevel = 1;
        this.gameSpeed = 2000;
        this.fallingWords = [];

        document.getElementById('gameInput').disabled = false;
        document.getElementById('gameInput').focus();
        document.getElementById('gameInput').value = '';
        document.getElementById('startGameBtn').disabled = true;
        document.getElementById('pauseGameBtn').disabled = false;

        this.updateGameDisplay();
        this.spawnWord();
        this.gameLoop();
        this.playSound('gameStart');
    }

    spawnWord() {
        if (!this.gameActive) return;

        const word = this.gameWords[Math.floor(Math.random() * this.gameWords.length)];
        const wordElement = document.createElement('div');
        wordElement.className = 'falling-word';
        wordElement.textContent = word;
        wordElement.style.left = Math.random() * 80 + '%';
        wordElement.style.animationDuration = (this.gameSpeed / 1000) + 's';

        const fallingWordsContainer = document.getElementById('fallingWords');
        fallingWordsContainer.appendChild(wordElement);

        this.fallingWords.push({
            element: wordElement,
            word: word,
            matched: false
        });

        // Remove word after animation
        setTimeout(() => {
            if (wordElement.parentNode && !wordElement.classList.contains('matched')) {
                wordElement.remove();
                this.gameLives--;
                this.updateGameDisplay();
                this.playSound('miss');

                if (this.gameLives <= 0) {
                    this.endGame();
                }
            }
        }, this.gameSpeed);

        // Schedule next word
        setTimeout(() => this.spawnWord(), Math.random() * 1000 + 500);
    }

    gameLoop() {
        if (!this.gameActive) return;

        // Increase difficulty over time
        if (this.gameScore > 0 && this.gameScore % 10 === 0) {
            this.gameLevel = Math.floor(this.gameScore / 10) + 1;
            this.gameSpeed = Math.max(1000, this.gameSpeed - 100);
        }

        this.updateGameDisplay();
        setTimeout(() => this.gameLoop(), 100);
    }

    handleGameInput(e) {
        if (!this.gameActive) return;

        const input = e.target.value.trim().toLowerCase();
        if (input.length === 0) return;

        // Check for word matches
        this.fallingWords.forEach((wordObj, index) => {
            if (!wordObj.matched && wordObj.word.toLowerCase() === input) {
                this.matchWord(wordObj, index);
                e.target.value = '';
            }
        });
    }

    checkGameWord() {
        const input = document.getElementById('gameInput').value.trim().toLowerCase();
        if (input.length === 0) return;

        let matched = false;
        this.fallingWords.forEach((wordObj, index) => {
            if (!wordObj.matched && wordObj.word.toLowerCase() === input) {
                this.matchWord(wordObj, index);
                matched = true;
            }
        });

        document.getElementById('gameInput').value = '';

        if (!matched) {
            this.playSound('error');
        }
    }

    matchWord(wordObj, index) {
        wordObj.matched = true;
        wordObj.element.classList.add('matched');

        this.gameScore += wordObj.word.length;
        this.playSound('match');

        // Remove from array and DOM
        setTimeout(() => {
            if (wordObj.element.parentNode) {
                wordObj.element.remove();
            }
            this.fallingWords.splice(index, 1);
        }, 300);

        this.updateGameDisplay();
    }

    pauseGame() {
        this.gameActive = !this.gameActive;
        const pauseBtn = document.getElementById('pauseGameBtn');

        if (this.gameActive) {
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            this.gameLoop();
            this.spawnWord();
        } else {
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        }
    }

    endGame() {
        this.gameActive = false;
        document.getElementById('gameInput').disabled = true;
        document.getElementById('startGameBtn').disabled = false;
        document.getElementById('pauseGameBtn').disabled = true;

        // Clear falling words
        document.getElementById('fallingWords').innerHTML = '';
        this.fallingWords = [];

        this.showGameResults();
        this.playSound('gameOver');
    }

    resetGame() {
        this.gameActive = false;
        this.gameScore = 0;
        this.gameLives = 3;
        this.gameLevel = 1;
        this.gameSpeed = 2000;
        this.fallingWords = [];

        const gameInput = document.getElementById('gameInput');
        const startGameBtn = document.getElementById('startGameBtn');
        const pauseGameBtn = document.getElementById('pauseGameBtn');
        const fallingWords = document.getElementById('fallingWords');

        if (gameInput) {
            gameInput.value = '';
            gameInput.disabled = true;
        }
        if (startGameBtn) startGameBtn.disabled = false;
        if (pauseGameBtn) pauseGameBtn.disabled = true;
        if (fallingWords) fallingWords.innerHTML = '';

        this.updateGameDisplay();
    }

    updateGameDisplay() {
        document.getElementById('gameScore').textContent = this.gameScore;
        document.getElementById('gameLives').textContent = this.gameLives;
        document.getElementById('gameLevel').textContent = this.gameLevel;
    }

    // Modal and Results Functions
    showResults() {
        document.getElementById('finalWPM').textContent = this.wpm;
        document.getElementById('finalAccuracy').textContent = this.accuracy + '%';
        document.getElementById('finalErrors').textContent = this.errors;

        // Performance rating
        const rating = this.getPerformanceRating(this.wpm, this.accuracy);
        document.getElementById('performanceRating').innerHTML = rating.icon + ' ' + rating.text;

        document.getElementById('resultsModal').classList.remove('hidden');
    }

    showGameResults() {
        document.getElementById('finalWPM').textContent = 'N/A';
        document.getElementById('finalAccuracy').textContent = 'N/A';
        document.getElementById('finalErrors').textContent = this.gameScore + ' Points';

        const rating = this.getGameRating(this.gameScore);
        document.getElementById('performanceRating').innerHTML = rating.icon + ' ' + rating.text;

        document.getElementById('resultsModal').classList.remove('hidden');
    }

    getPerformanceRating(wpm, accuracy) {
        if (wpm >= 80 && accuracy >= 95) {
            return { icon: '<i class="fas fa-trophy"></i>', text: 'Typing Master!' };
        } else if (wpm >= 60 && accuracy >= 90) {
            return { icon: '<i class="fas fa-medal"></i>', text: 'Excellent!' };
        } else if (wpm >= 40 && accuracy >= 85) {
            return { icon: '<i class="fas fa-star"></i>', text: 'Great Job!' };
        } else if (wpm >= 25 && accuracy >= 75) {
            return { icon: '<i class="fas fa-thumbs-up"></i>', text: 'Good Work!' };
        } else {
            return { icon: '<i class="fas fa-graduation-cap"></i>', text: 'Keep Practicing!' };
        }
    }

    getGameRating(score) {
        if (score >= 200) {
            return { icon: '<i class="fas fa-crown"></i>', text: 'Word Wizard!' };
        } else if (score >= 150) {
            return { icon: '<i class="fas fa-fire"></i>', text: 'Speed Demon!' };
        } else if (score >= 100) {
            return { icon: '<i class="fas fa-bolt"></i>', text: 'Lightning Fast!' };
        } else if (score >= 50) {
            return { icon: '<i class="fas fa-rocket"></i>', text: 'Getting There!' };
        } else {
            return { icon: '<i class="fas fa-seedling"></i>', text: 'Just Getting Started!' };
        }
    }

    closeModal() {
        const modal = document.getElementById('resultsModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    tryAgain() {
        this.closeModal();
        if (this.currentMode === 'classic') {
            this.resetTest();
        } else {
            this.resetGame();
        }
    }

    shareResults() {
        const text = this.currentMode === 'classic'
            ? `I just typed ${this.wpm} WPM with ${this.accuracy}% accuracy on the Ultimate Typing Test!`
            : `I scored ${this.gameScore} points in the Ultimate Typing Test mini game!`;

        if (navigator.share) {
            navigator.share({
                title: 'Ultimate Typing Test Results',
                text: text,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text + ' ' + window.location.href).then(() => {
                alert('Results copied to clipboard!');
            });
        }
    }

    // Sound Effects
    playSound(type) {
        if (!this.soundEnabled) return;

        try {
            // Create audio context if not exists
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Resume audio context if suspended (required by some browsers)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        } catch (error) {
            console.warn('Audio context not supported:', error);
            return;
        }

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

        // Different sounds for different events
        switch (type) {
            case 'correct':
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.1);
                break;

            case 'error':
                oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.2);
                break;

            case 'complete':
                // Success melody
                const frequencies = [523, 659, 784, 1047]; // C, E, G, C
                frequencies.forEach((freq, index) => {
                    setTimeout(() => {
                        const osc = this.audioContext.createOscillator();
                        const gain = this.audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(this.audioContext.destination);
                        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                        osc.start();
                        osc.stop(this.audioContext.currentTime + 0.3);
                    }, index * 150);
                });
                break;

            case 'start':
                oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.3);
                break;

            case 'match':
                oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.15);
                break;

            case 'miss':
                oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.3);
                break;

            case 'gameStart':
                // Ascending scale
                [261, 294, 330, 349, 392, 440, 494, 523].forEach((freq, index) => {
                    setTimeout(() => {
                        const osc = this.audioContext.createOscillator();
                        const gain = this.audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(this.audioContext.destination);
                        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                        gain.gain.setValueAtTime(0.08, this.audioContext.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                        osc.start();
                        osc.stop(this.audioContext.currentTime + 0.2);
                    }, index * 100);
                });
                break;

            case 'gameOver':
                // Descending scale
                [523, 494, 440, 392, 349, 330, 294, 261].forEach((freq, index) => {
                    setTimeout(() => {
                        const osc = this.audioContext.createOscillator();
                        const gain = this.audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(this.audioContext.destination);
                        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                        gain.gain.setValueAtTime(0.08, this.audioContext.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                        osc.start();
                        osc.stop(this.audioContext.currentTime + 0.2);
                    }, index * 100);
                });
                break;
        }
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundBtn = document.getElementById('soundToggle');

        if (this.soundEnabled) {
            soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            soundBtn.classList.remove('muted');
        } else {
            soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            soundBtn.classList.add('muted');
        }
    }

    // Color Customization Methods
    openColorPanel() {
        const colorPanel = document.getElementById('colorPanel');
        if (colorPanel) {
            colorPanel.classList.remove('hidden');
            this.loadCurrentColors();
        }
    }

    closeColorPanel() {
        const colorPanel = document.getElementById('colorPanel');
        if (colorPanel) {
            colorPanel.classList.add('hidden');
        }
    }

    loadCurrentColors() {
        const savedColors = this.getSavedColors();

        ['primary', 'secondary', 'accent', 'success', 'error'].forEach(colorType => {
            const color = savedColors[colorType] || this.colorPresets.default[colorType];
            document.getElementById(colorType + 'Color').value = color;
            document.getElementById(colorType + 'ColorText').value = color;
            this.updateColorSwatch(colorType, color);
        });
    }

    updateColor(colorType, color) {
        // Validate hex color
        if (!/^#[0-9A-F]{6}$/i.test(color)) return;

        // Update CSS custom property
        document.documentElement.style.setProperty(`--${colorType}-color`, color);

        // Update text input
        document.getElementById(colorType + 'ColorText').value = color;

        // Save to localStorage
        this.saveColorToStorage(colorType, color);
    }

    updateColorFromText(colorType, color) {
        // Validate hex color
        if (!/^#[0-9A-F]{6}$/i.test(color)) return;

        // Update color input
        document.getElementById(colorType + 'Color').value = color;

        // Update CSS custom property
        document.documentElement.style.setProperty(`--${colorType}-color`, color);

        // Save to localStorage
        this.saveColorToStorage(colorType, color);
    }

    applyColorPreset(presetName) {
        const preset = this.colorPresets[presetName];
        if (!preset) return;

        Object.keys(preset).forEach(colorType => {
            const color = preset[colorType];

            // Update inputs
            document.getElementById(colorType + 'Color').value = color;
            document.getElementById(colorType + 'ColorText').value = color;

            // Update CSS
            document.documentElement.style.setProperty(`--${colorType}-color`, color);

            // Update swatch
            this.updateColorSwatch(colorType, color);

            // Save to localStorage
            this.saveColorToStorage(colorType, color);
        });

        this.playSound('correct');
    }

    resetColors() {
        this.applyColorPreset('default');
        this.playSound('start');
    }

    saveColors() {
        const currentColors = {};
        ['primary', 'secondary', 'accent', 'success', 'error'].forEach(colorType => {
            currentColors[colorType] = document.getElementById(colorType + 'Color').value;
        });

        localStorage.setItem('typingTestColors', JSON.stringify(currentColors));
        this.playSound('complete');

        // Show confirmation
        const saveBtn = document.getElementById('saveColors');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        saveBtn.disabled = true;

        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }, 2000);
    }

    saveColorToStorage(colorType, color) {
        const savedColors = this.getSavedColors();
        savedColors[colorType] = color;
        localStorage.setItem('typingTestColors', JSON.stringify(savedColors));
    }

    getSavedColors() {
        try {
            return JSON.parse(localStorage.getItem('typingTestColors')) || {};
        } catch {
            return {};
        }
    }

    loadSavedColors() {
        const savedColors = this.getSavedColors();

        Object.keys(savedColors).forEach(colorType => {
            const color = savedColors[colorType];
            if (color && /^#[0-9A-F]{6}$/i.test(color)) {
                document.documentElement.style.setProperty(`--${colorType}-color`, color);
            }
        });
    }

    // Drag and Drop Methods
    initializeDragAndDrop() {
        // Initialize drag events for color swatches
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('dragstart', (e) => this.handleDragStart(e));
            swatch.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });

        // Initialize drag events for palette colors
        document.querySelectorAll('.palette-color').forEach(color => {
            color.addEventListener('dragstart', (e) => this.handlePaletteDragStart(e));
            color.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });

        // Initialize drop events for color groups and drop zones
        document.querySelectorAll('.color-group').forEach(group => {
            group.addEventListener('dragover', (e) => this.handleDragOver(e));
            group.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            group.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            group.addEventListener('drop', (e) => this.handleDrop(e));
        });

        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.addEventListener('dragover', (e) => this.handleDragOver(e));
            zone.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            zone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            zone.addEventListener('drop', (e) => this.handleDrop(e));
        });
    }

    handleDragStart(e) {
        const colorType = e.target.dataset.colorType;
        const color = document.getElementById(colorType + 'Color').value;

        e.dataTransfer.setData('text/plain', JSON.stringify({
            type: 'color-swap',
            sourceType: colorType,
            color: color
        }));

        e.target.classList.add('dragging');
        document.body.classList.add('drag-active');

        // Show drop zones
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.add('active');
        });

        this.playSound('correct');
    }

    handlePaletteDragStart(e) {
        const color = e.target.dataset.color;

        e.dataTransfer.setData('text/plain', JSON.stringify({
            type: 'color-apply',
            color: color
        }));

        e.target.classList.add('dragging');
        document.body.classList.add('drag-active');

        // Show drop zones
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.add('active');
        });

        this.playSound('correct');
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        document.body.classList.remove('drag-active');

        // Hide drop zones
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('active', 'drag-over');
        });

        // Remove visual feedback
        document.querySelectorAll('.color-group').forEach(group => {
            group.classList.remove('valid-drop-target', 'invalid-drop-target');
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }

    handleDragEnter(e) {
        e.preventDefault();

        const dropZone = e.target.closest('.drop-zone');
        const colorGroup = e.target.closest('.color-group');

        if (dropZone) {
            dropZone.classList.add('drag-over');
        }

        if (colorGroup) {
            colorGroup.classList.add('valid-drop-target');
        }
    }

    handleDragLeave(e) {
        const dropZone = e.target.closest('.drop-zone');
        const colorGroup = e.target.closest('.color-group');

        if (dropZone && !dropZone.contains(e.relatedTarget)) {
            dropZone.classList.remove('drag-over');
        }

        if (colorGroup && !colorGroup.contains(e.relatedTarget)) {
            colorGroup.classList.remove('valid-drop-target', 'invalid-drop-target');
        }
    }

    handleDrop(e) {
        e.preventDefault();

        const dropZone = e.target.closest('.drop-zone');
        const colorGroup = e.target.closest('.color-group');

        if (!dropZone && !colorGroup) return;

        try {
            const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
            const targetType = dropZone ? dropZone.dataset.target : colorGroup.dataset.colorType;

            if (dragData.type === 'color-swap') {
                this.swapColors(dragData.sourceType, targetType);
            } else if (dragData.type === 'color-apply') {
                this.applyColorToTarget(dragData.color, targetType);
            }

            this.playSound('match');
        } catch (error) {
            console.warn('Error handling drop:', error);
            this.playSound('error');
        }

        // Clean up visual feedback
        if (dropZone) dropZone.classList.remove('drag-over');
        if (colorGroup) colorGroup.classList.remove('valid-drop-target', 'invalid-drop-target');
    }

    swapColors(sourceType, targetType) {
        if (sourceType === targetType) return;

        const sourceColor = document.getElementById(sourceType + 'Color').value;
        const targetColor = document.getElementById(targetType + 'Color').value;

        // Swap the colors
        this.updateColor(sourceType, targetColor);
        this.updateColor(targetType, sourceColor);

        // Update swatches
        this.updateColorSwatch(sourceType, targetColor);
        this.updateColorSwatch(targetType, sourceColor);
    }

    applyColorToTarget(color, targetType) {
        this.updateColor(targetType, color);
        this.updateColorSwatch(targetType, color);
    }

    updateColorSwatch(colorType, color) {
        const swatch = document.querySelector(`[data-color-type="${colorType}"]`);
        if (swatch) {
            swatch.style.backgroundColor = color;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TypingTest();
});

// Add some additional utility functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getRandomColor() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4ade80', '#fbbf24'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Add keyboard shortcuts info
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        alert('Keyboard Shortcuts:\nCtrl + R: Reset Test\nEscape: Close Modal\nEnter: Submit Game Word');
    }
});
