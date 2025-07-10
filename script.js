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

        // Keyboard sound settings
        this.keyboardSoundType = 'cherry-mx-blue';
        this.soundVolume = 0.5;
        this.soundVariation = true;
        this.pitchVariation = 0.2;
        
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
        this.loadSavedSoundSettings();
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

        // Duration and difficulty card events
        this.initializeCardSelectors();
        
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

        // Keyboard sound events - use setTimeout to ensure DOM is ready
        setTimeout(() => {
            const keyboardToggle = document.getElementById('keyboardSoundToggle');
            const closeSoundPanel = document.getElementById('closeSoundPanel');
            const resetSounds = document.getElementById('resetSounds');
            const saveSounds = document.getElementById('saveSounds');

            if (keyboardToggle) {
                keyboardToggle.addEventListener('click', () => this.openSoundPanel());
            }
            if (closeSoundPanel) {
                closeSoundPanel.addEventListener('click', () => this.closeSoundPanel());
            }
            if (resetSounds) {
                resetSounds.addEventListener('click', () => this.resetSounds());
            }
            if (saveSounds) {
                saveSounds.addEventListener('click', () => this.saveSounds());
            }

            // Sound preset events
            document.querySelectorAll('.sound-preset').forEach(preset => {
                preset.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('test-sound-btn')) {
                        this.selectSoundPreset(preset.dataset.sound);
                    }
                });
            });

            // Test sound buttons
            document.querySelectorAll('.test-sound-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.testKeyboardSound(btn.dataset.sound);
                });
            });

            // Sound settings
            const volumeSlider = document.getElementById('volumeSlider');
            const variationToggle = document.getElementById('variationToggle');
            const pitchSlider = document.getElementById('pitchSlider');

            if (volumeSlider) {
                volumeSlider.addEventListener('input', (e) => this.updateVolume(e.target.value));
            }
            if (variationToggle) {
                variationToggle.addEventListener('change', (e) => this.toggleVariation(e.target.checked));
            }
            if (pitchSlider) {
                pitchSlider.addEventListener('input', (e) => this.updatePitchVariation(e.target.value));
            }
        }, 100);

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
                this.closeSoundPanel();
            }
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.resetTest();
            }
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                this.openColorPanel();
            }
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.openSoundPanel();
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

    // Enhanced Sound Effects with Keyboard Sounds
    playSound(type) {
        if (!this.soundEnabled) return;

        try {
            // Create audio context if not exists
            if (!this.audioContext) {
                if (window.AudioContext) {
                    this.audioContext = new window.AudioContext();
                } else if (window['webkitAudioContext']) {
                    this.audioContext = new window['webkitAudioContext']();
                } else {
                    console.warn('Web Audio API not supported');
                    return;
                }
            }

            // Resume audio context if suspended (required by some browsers)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        } catch (error) {
            console.warn('Audio context not supported:', error);
            return;
        }

        // Handle keyboard sounds differently
        if (type === 'correct' || type === 'error') {
            this.playKeyboardSound(type === 'correct');
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

    // Realistic Keyboard Sound Generation
    playKeyboardSound(isCorrect = true) {
        if (!this.soundEnabled || this.keyboardSoundType === 'silent') return;

        try {
            const now = this.audioContext.currentTime;
            const baseVolume = this.soundVolume * (isCorrect ? 1 : 0.8);

            // Add pitch variation if enabled
            const pitchVariationAmount = this.soundVariation ?
                (Math.random() - 0.5) * this.pitchVariation : 0;

            // Cherry MX Switches
            switch (this.keyboardSoundType) {
                case 'cherry-mx-blue':
                    this.generateCherryMXBlue(now, baseVolume, pitchVariationAmount, isCorrect);
                    break;
                case 'cherry-mx-brown':
                    this.generateCherryMXBrown(now, baseVolume, pitchVariationAmount, isCorrect);
                    break;
                case 'cherry-mx-red':
                    this.generateCherryMXRed(now, baseVolume, pitchVariationAmount, isCorrect);
                    break;
                case 'cherry-mx-black':
                    this.generateCherryMXBlack(now, baseVolume, pitchVariationAmount, isCorrect);
                    break;
                case 'cherry-mx-clear':
                    this.generateCherryMXClear(now, baseVolume, pitchVariationAmount, isCorrect);
                    break;

                // Gateron Switches
                case 'gateron-blue':
                    this.generateGateronBlue(now, baseVolume, pitchVariationAmount, isCorrect);
                    break;
                case 'gateron-brown':
                    this.generateGateronBrown(now, baseVolume, pitchVariationAmount, isCorrect);
                    break;
                case 'gateron-red':
                    this.generateGateronRed(now, baseVolume, pitchVariationAmount, isCorrect);
                    break;
                case 'gateron-yellow':
                    this.generateGateronYellow(now, baseVolume, pitchVariationAmount, isCorrect);
                    break;

                // Kailh Switches
                case 'kailh-box-white':
                    this.generateKailhBoxWhite(now, baseVolume, pitchVariationAmount, isCorrect);
                    break;
                case 'kailh-box-brown':
                    this.generateKailhBoxBrown(now, baseVolume, pitchVariationAmount, isCorrect);
                    break;
                case 'kailh-speed-silver':
                    this.generateKailhSpeedSilver(now, baseVolume, pitchVariationAmount, isCorrect);
                    break;

                // Premium Switches
                case 'holy-panda':
                    this.generateHolyPanda(now, baseVolume, pitchVariationAmount, isCorrect);
                    break;
                case 'zealios-v2':
                    this.generateZealiosV2(now, baseVolume, pitchVariationAmount, isCorrect);
                    break;
                case 'topre':
                    this.generateTopre(now, baseVolume, pitchVariationAmount, isCorrect);
                    break;

                default:
                    // Fallback to Cherry MX Blue if unknown switch type
                    console.warn('Unknown switch type:', this.keyboardSoundType);
                    this.generateCherryMXBlue(now, baseVolume, pitchVariationAmount, isCorrect);
                    break;
            }
        } catch (error) {
            console.warn('Error playing keyboard sound:', error);
        }
    }

    // === CHERRY MX SWITCHES ===

    generateCherryMXBlue(startTime, volume, pitchVar, isCorrect) {
        // Cherry MX Blue: Iconic clicky switch with sharp tactile bump and audible click
        const clickFreq = 3200 + (pitchVar * 500); // Higher frequency for sharp click
        const tactileFreq = 2400 + (pitchVar * 300);
        const resonanceFreq = 1800 + (pitchVar * 200);

        // Tactile bump (actuation point)
        const tactileOsc = this.audioContext.createOscillator();
        const tactileGain = this.audioContext.createGain();
        tactileOsc.type = 'square';
        tactileOsc.frequency.setValueAtTime(tactileFreq, startTime);
        tactileOsc.connect(tactileGain);
        tactileGain.connect(this.audioContext.destination);

        tactileGain.gain.setValueAtTime(0, startTime);
        tactileGain.gain.linearRampToValueAtTime(volume * 0.6, startTime + 0.001);
        tactileGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.02);

        tactileOsc.start(startTime);
        tactileOsc.stop(startTime + 0.02);

        // Sharp click (bottom out)
        const clickOsc = this.audioContext.createOscillator();
        const clickGain = this.audioContext.createGain();
        const clickFilter = this.audioContext.createBiquadFilter();

        clickOsc.type = 'square';
        clickOsc.frequency.setValueAtTime(clickFreq, startTime + 0.015);
        clickFilter.type = 'highpass';
        clickFilter.frequency.setValueAtTime(2000, startTime + 0.015);

        clickOsc.connect(clickFilter);
        clickFilter.connect(clickGain);
        clickGain.connect(this.audioContext.destination);

        clickGain.gain.setValueAtTime(0, startTime + 0.015);
        clickGain.gain.linearRampToValueAtTime(volume * 0.9, startTime + 0.016);
        clickGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);

        clickOsc.start(startTime + 0.015);
        clickOsc.stop(startTime + 0.06);

        // Resonance and spring return
        const resOsc = this.audioContext.createOscillator();
        const resGain = this.audioContext.createGain();
        resOsc.type = 'sine';
        resOsc.frequency.setValueAtTime(resonanceFreq, startTime + 0.02);
        resOsc.connect(resGain);
        resGain.connect(this.audioContext.destination);

        resGain.gain.setValueAtTime(0, startTime + 0.02);
        resGain.gain.linearRampToValueAtTime(volume * 0.4, startTime + 0.03);
        resGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

        resOsc.start(startTime + 0.02);
        resOsc.stop(startTime + 0.12);

        if (!isCorrect) this.addErrorNoise(startTime, volume * 0.6);
    }

    generateCherryMXBrown(startTime, volume, pitchVar, isCorrect) {
        // Cherry MX Brown: Tactile but quiet, subtle bump without click
        const tactileFreq = 2000 + (pitchVar * 250);
        const bottomFreq = 1600 + (pitchVar * 200);

        // Subtle tactile bump
        const tactileOsc = this.audioContext.createOscillator();
        const tactileGain = this.audioContext.createGain();
        const tactileFilter = this.audioContext.createBiquadFilter();

        tactileOsc.type = 'triangle';
        tactileOsc.frequency.setValueAtTime(tactileFreq, startTime);
        tactileFilter.type = 'lowpass';
        tactileFilter.frequency.setValueAtTime(2500, startTime);

        tactileOsc.connect(tactileFilter);
        tactileFilter.connect(tactileGain);
        tactileGain.connect(this.audioContext.destination);

        tactileGain.gain.setValueAtTime(0, startTime);
        tactileGain.gain.linearRampToValueAtTime(volume * 0.4, startTime + 0.003);
        tactileGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.03);

        tactileOsc.start(startTime);
        tactileOsc.stop(startTime + 0.03);

        // Soft bottom out
        const bottomOsc = this.audioContext.createOscillator();
        const bottomGain = this.audioContext.createGain();
        const bottomFilter = this.audioContext.createBiquadFilter();

        bottomOsc.type = 'sine';
        bottomOsc.frequency.setValueAtTime(bottomFreq, startTime + 0.02);
        bottomFilter.type = 'lowpass';
        bottomFilter.frequency.setValueAtTime(2000, startTime + 0.02);

        bottomOsc.connect(bottomFilter);
        bottomFilter.connect(bottomGain);
        bottomGain.connect(this.audioContext.destination);

        bottomGain.gain.setValueAtTime(0, startTime + 0.02);
        bottomGain.gain.linearRampToValueAtTime(volume * 0.5, startTime + 0.025);
        bottomGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

        bottomOsc.start(startTime + 0.02);
        bottomOsc.stop(startTime + 0.08);

        if (!isCorrect) this.addErrorNoise(startTime, volume * 0.3);
    }

    generateCherryMXRed(startTime, volume, pitchVar, isCorrect) {
        // Cherry MX Red: Smooth linear, no tactile bump, quiet operation
        const freq = 1400 + (pitchVar * 150);
        const bottomFreq = 1200 + (pitchVar * 100);

        // Smooth press
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, startTime);
        filter.Q.setValueAtTime(1.5, startTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);

        osc.start(startTime);
        osc.stop(startTime + 0.06);

        // Subtle bottom out
        const bottomOsc = this.audioContext.createOscillator();
        const bottomGain = this.audioContext.createGain();

        bottomOsc.type = 'sine';
        bottomOsc.frequency.setValueAtTime(bottomFreq, startTime + 0.03);
        bottomOsc.connect(bottomGain);
        bottomGain.connect(this.audioContext.destination);

        bottomGain.gain.setValueAtTime(0, startTime + 0.03);
        bottomGain.gain.linearRampToValueAtTime(volume * 0.2, startTime + 0.035);
        bottomGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);

        bottomOsc.start(startTime + 0.03);
        bottomOsc.stop(startTime + 0.07);

        if (!isCorrect) this.addErrorNoise(startTime, volume * 0.2);
    }

    generateCherryMXBlack(startTime, volume, pitchVar, isCorrect) {
        // Cherry MX Black: Heavy linear switch, deeper sound, more resistance
        const freq = 1200 + (pitchVar * 120);
        const bottomFreq = 1000 + (pitchVar * 80);

        // Heavy press with deeper tone
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, startTime);
        filter.Q.setValueAtTime(2, startTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume * 0.4, startTime + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

        osc.start(startTime);
        osc.stop(startTime + 0.08);

        // Heavier bottom out
        const bottomOsc = this.audioContext.createOscillator();
        const bottomGain = this.audioContext.createGain();

        bottomOsc.type = 'triangle';
        bottomOsc.frequency.setValueAtTime(bottomFreq, startTime + 0.04);
        bottomOsc.connect(bottomGain);
        bottomGain.connect(this.audioContext.destination);

        bottomGain.gain.setValueAtTime(0, startTime + 0.04);
        bottomGain.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.045);
        bottomGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

        bottomOsc.start(startTime + 0.04);
        bottomOsc.stop(startTime + 0.09);

        if (!isCorrect) this.addErrorNoise(startTime, volume * 0.25);
    }

    generateCherryMXClear(startTime, volume, pitchVar, isCorrect) {
        // Cherry MX Clear: Heavy tactile switch, pronounced bump, stiffer spring
        const tactileFreq = 2200 + (pitchVar * 280);
        const bottomFreq = 1700 + (pitchVar * 180);

        // Strong tactile bump
        const tactileOsc = this.audioContext.createOscillator();
        const tactileGain = this.audioContext.createGain();
        const tactileFilter = this.audioContext.createBiquadFilter();

        tactileOsc.type = 'square';
        tactileOsc.frequency.setValueAtTime(tactileFreq, startTime);
        tactileFilter.type = 'bandpass';
        tactileFilter.frequency.setValueAtTime(2200, startTime);
        tactileFilter.Q.setValueAtTime(3, startTime);

        tactileOsc.connect(tactileFilter);
        tactileFilter.connect(tactileGain);
        tactileGain.connect(this.audioContext.destination);

        tactileGain.gain.setValueAtTime(0, startTime);
        tactileGain.gain.linearRampToValueAtTime(volume * 0.7, startTime + 0.002);
        tactileGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.025);

        tactileOsc.start(startTime);
        tactileOsc.stop(startTime + 0.025);

        // Heavy bottom out
        const bottomOsc = this.audioContext.createOscillator();
        const bottomGain = this.audioContext.createGain();
        const bottomFilter = this.audioContext.createBiquadFilter();

        bottomOsc.type = 'triangle';
        bottomOsc.frequency.setValueAtTime(bottomFreq, startTime + 0.025);
        bottomFilter.type = 'lowpass';
        bottomFilter.frequency.setValueAtTime(2200, startTime + 0.025);

        bottomOsc.connect(bottomFilter);
        bottomFilter.connect(bottomGain);
        bottomGain.connect(this.audioContext.destination);

        bottomGain.gain.setValueAtTime(0, startTime + 0.025);
        bottomGain.gain.linearRampToValueAtTime(volume * 0.6, startTime + 0.03);
        bottomGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

        bottomOsc.start(startTime + 0.025);
        bottomOsc.stop(startTime + 0.09);

        if (!isCorrect) this.addErrorNoise(startTime, volume * 0.4);
    }

    // === GATERON SWITCHES ===

    generateGateronBlue(startTime, volume, pitchVar, isCorrect) {
        // Gateron Blue: Smoother than Cherry MX Blue, slightly different click profile
        const clickFreq = 3100 + (pitchVar * 450);
        const tactileFreq = 2300 + (pitchVar * 280);
        const resonanceFreq = 1700 + (pitchVar * 180);

        // Smoother tactile bump
        const tactileOsc = this.audioContext.createOscillator();
        const tactileGain = this.audioContext.createGain();
        tactileOsc.type = 'triangle';
        tactileOsc.frequency.setValueAtTime(tactileFreq, startTime);
        tactileOsc.connect(tactileGain);
        tactileGain.connect(this.audioContext.destination);

        tactileGain.gain.setValueAtTime(0, startTime);
        tactileGain.gain.linearRampToValueAtTime(volume * 0.5, startTime + 0.002);
        tactileGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.025);

        tactileOsc.start(startTime);
        tactileOsc.stop(startTime + 0.025);

        // Crisp click
        const clickOsc = this.audioContext.createOscillator();
        const clickGain = this.audioContext.createGain();
        const clickFilter = this.audioContext.createBiquadFilter();

        clickOsc.type = 'square';
        clickOsc.frequency.setValueAtTime(clickFreq, startTime + 0.018);
        clickFilter.type = 'highpass';
        clickFilter.frequency.setValueAtTime(1800, startTime + 0.018);

        clickOsc.connect(clickFilter);
        clickFilter.connect(clickGain);
        clickGain.connect(this.audioContext.destination);

        clickGain.gain.setValueAtTime(0, startTime + 0.018);
        clickGain.gain.linearRampToValueAtTime(volume * 0.8, startTime + 0.019);
        clickGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.055);

        clickOsc.start(startTime + 0.018);
        clickOsc.stop(startTime + 0.055);

        // Smooth resonance
        const resOsc = this.audioContext.createOscillator();
        const resGain = this.audioContext.createGain();
        resOsc.type = 'sine';
        resOsc.frequency.setValueAtTime(resonanceFreq, startTime + 0.025);
        resOsc.connect(resGain);
        resGain.connect(this.audioContext.destination);

        resGain.gain.setValueAtTime(0, startTime + 0.025);
        resGain.gain.linearRampToValueAtTime(volume * 0.35, startTime + 0.035);
        resGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.11);

        resOsc.start(startTime + 0.025);
        resOsc.stop(startTime + 0.11);

        if (!isCorrect) this.addErrorNoise(startTime, volume * 0.5);
    }

    generateGateronBrown(startTime, volume, pitchVar, isCorrect) {
        // Gateron Brown: Smoother tactile bump than Cherry MX Brown
        const tactileFreq = 1950 + (pitchVar * 230);
        const bottomFreq = 1550 + (pitchVar * 180);

        // Smooth tactile bump
        const tactileOsc = this.audioContext.createOscillator();
        const tactileGain = this.audioContext.createGain();
        const tactileFilter = this.audioContext.createBiquadFilter();

        tactileOsc.type = 'sine';
        tactileOsc.frequency.setValueAtTime(tactileFreq, startTime);
        tactileFilter.type = 'lowpass';
        tactileFilter.frequency.setValueAtTime(2800, startTime);
        tactileFilter.Q.setValueAtTime(1.2, startTime);

        tactileOsc.connect(tactileFilter);
        tactileFilter.connect(tactileGain);
        tactileGain.connect(this.audioContext.destination);

        tactileGain.gain.setValueAtTime(0, startTime);
        tactileGain.gain.linearRampToValueAtTime(volume * 0.35, startTime + 0.004);
        tactileGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.035);

        tactileOsc.start(startTime);
        tactileOsc.stop(startTime + 0.035);

        // Smooth bottom out
        const bottomOsc = this.audioContext.createOscillator();
        const bottomGain = this.audioContext.createGain();
        const bottomFilter = this.audioContext.createBiquadFilter();

        bottomOsc.type = 'sine';
        bottomOsc.frequency.setValueAtTime(bottomFreq, startTime + 0.022);
        bottomFilter.type = 'lowpass';
        bottomFilter.frequency.setValueAtTime(2200, startTime + 0.022);

        bottomOsc.connect(bottomFilter);
        bottomFilter.connect(bottomGain);
        bottomGain.connect(this.audioContext.destination);

        bottomGain.gain.setValueAtTime(0, startTime + 0.022);
        bottomGain.gain.linearRampToValueAtTime(volume * 0.45, startTime + 0.027);
        bottomGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.075);

        bottomOsc.start(startTime + 0.022);
        bottomOsc.stop(startTime + 0.075);

        if (!isCorrect) this.addErrorNoise(startTime, volume * 0.25);
    }

    generateGateronRed(startTime, volume, pitchVar, isCorrect) {
        // Gateron Red: Buttery smooth linear, even smoother than Cherry MX Red
        const freq = 1350 + (pitchVar * 140);
        const bottomFreq = 1150 + (pitchVar * 90);

        // Ultra-smooth press
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1900, startTime);
        filter.Q.setValueAtTime(1.2, startTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume * 0.25, startTime + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.055);

        osc.start(startTime);
        osc.stop(startTime + 0.055);

        // Very subtle bottom out
        const bottomOsc = this.audioContext.createOscillator();
        const bottomGain = this.audioContext.createGain();

        bottomOsc.type = 'sine';
        bottomOsc.frequency.setValueAtTime(bottomFreq, startTime + 0.035);
        bottomOsc.connect(bottomGain);
        bottomGain.connect(this.audioContext.destination);

        bottomGain.gain.setValueAtTime(0, startTime + 0.035);
        bottomGain.gain.linearRampToValueAtTime(volume * 0.15, startTime + 0.04);
        bottomGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.065);

        bottomOsc.start(startTime + 0.035);
        bottomOsc.stop(startTime + 0.065);

        if (!isCorrect) this.addErrorNoise(startTime, volume * 0.15);
    }

    generateGateronYellow(startTime, volume, pitchVar, isCorrect) {
        // Gateron Yellow: Popular linear switch, slightly heavier than Red
        const freq = 1300 + (pitchVar * 130);
        const bottomFreq = 1100 + (pitchVar * 85);

        // Smooth but slightly more substantial press
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1850, startTime);
        filter.Q.setValueAtTime(1.4, startTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.007);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);

        osc.start(startTime);
        osc.stop(startTime + 0.06);

        // Slightly more pronounced bottom out
        const bottomOsc = this.audioContext.createOscillator();
        const bottomGain = this.audioContext.createGain();

        bottomOsc.type = 'triangle';
        bottomOsc.frequency.setValueAtTime(bottomFreq, startTime + 0.038);
        bottomOsc.connect(bottomGain);
        bottomGain.connect(this.audioContext.destination);

        bottomGain.gain.setValueAtTime(0, startTime + 0.038);
        bottomGain.gain.linearRampToValueAtTime(volume * 0.2, startTime + 0.043);
        bottomGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);

        bottomOsc.start(startTime + 0.038);
        bottomOsc.stop(startTime + 0.07);

        if (!isCorrect) this.addErrorNoise(startTime, volume * 0.18);
    }

    // === KAILH SWITCHES ===

    generateKailhBoxWhite(startTime, volume, pitchVar, isCorrect) {
        // Kailh Box White: Crisp, sharp click with box stem design
        const clickFreq = 3400 + (pitchVar * 520);
        const tactileFreq = 2600 + (pitchVar * 320);
        const resonanceFreq = 1900 + (pitchVar * 220);

        // Sharp tactile bump
        const tactileOsc = this.audioContext.createOscillator();
        const tactileGain = this.audioContext.createGain();
        const tactileFilter = this.audioContext.createBiquadFilter();

        tactileOsc.type = 'square';
        tactileOsc.frequency.setValueAtTime(tactileFreq, startTime);
        tactileFilter.type = 'highpass';
        tactileFilter.frequency.setValueAtTime(2000, startTime);

        tactileOsc.connect(tactileFilter);
        tactileFilter.connect(tactileGain);
        tactileGain.connect(this.audioContext.destination);

        tactileGain.gain.setValueAtTime(0, startTime);
        tactileGain.gain.linearRampToValueAtTime(volume * 0.65, startTime + 0.001);
        tactileGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.018);

        tactileOsc.start(startTime);
        tactileOsc.stop(startTime + 0.018);

        // Crisp click
        const clickOsc = this.audioContext.createOscillator();
        const clickGain = this.audioContext.createGain();
        const clickFilter = this.audioContext.createBiquadFilter();

        clickOsc.type = 'square';
        clickOsc.frequency.setValueAtTime(clickFreq, startTime + 0.012);
        clickFilter.type = 'highpass';
        clickFilter.frequency.setValueAtTime(2200, startTime + 0.012);

        clickOsc.connect(clickFilter);
        clickFilter.connect(clickGain);
        clickGain.connect(this.audioContext.destination);

        clickGain.gain.setValueAtTime(0, startTime + 0.012);
        clickGain.gain.linearRampToValueAtTime(volume * 0.95, startTime + 0.013);
        clickGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.045);

        clickOsc.start(startTime + 0.012);
        clickOsc.stop(startTime + 0.045);

        // Clean resonance
        const resOsc = this.audioContext.createOscillator();
        const resGain = this.audioContext.createGain();
        resOsc.type = 'sine';
        resOsc.frequency.setValueAtTime(resonanceFreq, startTime + 0.02);
        resOsc.connect(resGain);
        resGain.connect(this.audioContext.destination);

        resGain.gain.setValueAtTime(0, startTime + 0.02);
        resGain.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.025);
        resGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

        resOsc.start(startTime + 0.02);
        resOsc.stop(startTime + 0.08);

        if (!isCorrect) this.addErrorNoise(startTime, volume * 0.55);
    }

    generateKailhBoxBrown(startTime, volume, pitchVar, isCorrect) {
        // Kailh Box Brown: Stable tactile with box stem, more pronounced than regular browns
        const tactileFreq = 2100 + (pitchVar * 260);
        const bottomFreq = 1650 + (pitchVar * 190);

        // Stable tactile bump
        const tactileOsc = this.audioContext.createOscillator();
        const tactileGain = this.audioContext.createGain();
        const tactileFilter = this.audioContext.createBiquadFilter();

        tactileOsc.type = 'triangle';
        tactileOsc.frequency.setValueAtTime(tactileFreq, startTime);
        tactileFilter.type = 'bandpass';
        tactileFilter.frequency.setValueAtTime(2100, startTime);
        tactileFilter.Q.setValueAtTime(2, startTime);

        tactileOsc.connect(tactileFilter);
        tactileFilter.connect(tactileGain);
        tactileGain.connect(this.audioContext.destination);

        tactileGain.gain.setValueAtTime(0, startTime);
        tactileGain.gain.linearRampToValueAtTime(volume * 0.5, startTime + 0.003);
        tactileGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.03);

        tactileOsc.start(startTime);
        tactileOsc.stop(startTime + 0.03);

        // Stable bottom out
        const bottomOsc = this.audioContext.createOscillator();
        const bottomGain = this.audioContext.createGain();
        const bottomFilter = this.audioContext.createBiquadFilter();

        bottomOsc.type = 'sine';
        bottomOsc.frequency.setValueAtTime(bottomFreq, startTime + 0.025);
        bottomFilter.type = 'lowpass';
        bottomFilter.frequency.setValueAtTime(2300, startTime + 0.025);

        bottomOsc.connect(bottomFilter);
        bottomFilter.connect(bottomGain);
        bottomGain.connect(this.audioContext.destination);

        bottomGain.gain.setValueAtTime(0, startTime + 0.025);
        bottomGain.gain.linearRampToValueAtTime(volume * 0.55, startTime + 0.03);
        bottomGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

        bottomOsc.start(startTime + 0.025);
        bottomOsc.stop(startTime + 0.08);

        if (!isCorrect) this.addErrorNoise(startTime, volume * 0.35);
    }

    generateKailhSpeedSilver(startTime, volume, pitchVar, isCorrect) {
        // Kailh Speed Silver: Ultra-fast linear switch, short travel, gaming-focused
        const freq = 1500 + (pitchVar * 160);
        const bottomFreq = 1300 + (pitchVar * 110);

        // Quick, snappy press
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2100, startTime);
        filter.Q.setValueAtTime(1.8, startTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume * 0.35, startTime + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

        osc.start(startTime);
        osc.stop(startTime + 0.04);

        // Quick bottom out
        const bottomOsc = this.audioContext.createOscillator();
        const bottomGain = this.audioContext.createGain();

        bottomOsc.type = 'triangle';
        bottomOsc.frequency.setValueAtTime(bottomFreq, startTime + 0.025);
        bottomOsc.connect(bottomGain);
        bottomGain.connect(this.audioContext.destination);

        bottomGain.gain.setValueAtTime(0, startTime + 0.025);
        bottomGain.gain.linearRampToValueAtTime(volume * 0.25, startTime + 0.028);
        bottomGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

        bottomOsc.start(startTime + 0.025);
        bottomOsc.stop(startTime + 0.05);

        if (!isCorrect) this.addErrorNoise(startTime, volume * 0.2);
    }

    // === PREMIUM SWITCHES ===

    generateHolyPanda(startTime, volume, pitchVar, isCorrect) {
        // Holy Panda: Deep, thocky tactile switch with pronounced bump
        const tactileFreq = 1800 + (pitchVar * 220);
        const thockFreq = 1200 + (pitchVar * 150);
        const resonanceFreq = 900 + (pitchVar * 100);

        // Deep tactile bump
        const tactileOsc = this.audioContext.createOscillator();
        const tactileGain = this.audioContext.createGain();
        const tactileFilter = this.audioContext.createBiquadFilter();

        tactileOsc.type = 'square';
        tactileOsc.frequency.setValueAtTime(tactileFreq, startTime);
        tactileFilter.type = 'lowpass';
        tactileFilter.frequency.setValueAtTime(2500, startTime);
        tactileFilter.Q.setValueAtTime(2.5, startTime);

        tactileOsc.connect(tactileFilter);
        tactileFilter.connect(tactileGain);
        tactileGain.connect(this.audioContext.destination);

        tactileGain.gain.setValueAtTime(0, startTime);
        tactileGain.gain.linearRampToValueAtTime(volume * 0.7, startTime + 0.004);
        tactileGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

        tactileOsc.start(startTime);
        tactileOsc.stop(startTime + 0.04);

        // Deep thock
        const thockOsc = this.audioContext.createOscillator();
        const thockGain = this.audioContext.createGain();
        const thockFilter = this.audioContext.createBiquadFilter();

        thockOsc.type = 'triangle';
        thockOsc.frequency.setValueAtTime(thockFreq, startTime + 0.03);
        thockFilter.type = 'lowpass';
        thockFilter.frequency.setValueAtTime(1800, startTime + 0.03);
        thockFilter.Q.setValueAtTime(3, startTime + 0.03);

        thockOsc.connect(thockFilter);
        thockFilter.connect(thockGain);
        thockGain.connect(this.audioContext.destination);

        thockGain.gain.setValueAtTime(0, startTime + 0.03);
        thockGain.gain.linearRampToValueAtTime(volume * 0.8, startTime + 0.035);
        thockGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

        thockOsc.start(startTime + 0.03);
        thockOsc.stop(startTime + 0.12);

        // Deep resonance
        const resOsc = this.audioContext.createOscillator();
        const resGain = this.audioContext.createGain();
        resOsc.type = 'sine';
        resOsc.frequency.setValueAtTime(resonanceFreq, startTime + 0.04);
        resOsc.connect(resGain);
        resGain.connect(this.audioContext.destination);

        resGain.gain.setValueAtTime(0, startTime + 0.04);
        resGain.gain.linearRampToValueAtTime(volume * 0.4, startTime + 0.06);
        resGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

        resOsc.start(startTime + 0.04);
        resOsc.stop(startTime + 0.15);

        if (!isCorrect) this.addErrorNoise(startTime, volume * 0.5);
    }

    generateZealiosV2(startTime, volume, pitchVar, isCorrect) {
        // Zealios V2: Sharp, pronounced tactile bump with clean sound
        const tactileFreq = 2300 + (pitchVar * 300);
        const bottomFreq = 1700 + (pitchVar * 200);

        // Sharp tactile bump
        const tactileOsc = this.audioContext.createOscillator();
        const tactileGain = this.audioContext.createGain();
        const tactileFilter = this.audioContext.createBiquadFilter();

        tactileOsc.type = 'square';
        tactileOsc.frequency.setValueAtTime(tactileFreq, startTime);
        tactileFilter.type = 'bandpass';
        tactileFilter.frequency.setValueAtTime(2300, startTime);
        tactileFilter.Q.setValueAtTime(4, startTime);

        tactileOsc.connect(tactileFilter);
        tactileFilter.connect(tactileGain);
        tactileGain.connect(this.audioContext.destination);

        tactileGain.gain.setValueAtTime(0, startTime);
        tactileGain.gain.linearRampToValueAtTime(volume * 0.8, startTime + 0.002);
        tactileGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.02);

        tactileOsc.start(startTime);
        tactileOsc.stop(startTime + 0.02);

        // Clean bottom out
        const bottomOsc = this.audioContext.createOscillator();
        const bottomGain = this.audioContext.createGain();
        const bottomFilter = this.audioContext.createBiquadFilter();

        bottomOsc.type = 'triangle';
        bottomOsc.frequency.setValueAtTime(bottomFreq, startTime + 0.025);
        bottomFilter.type = 'lowpass';
        bottomFilter.frequency.setValueAtTime(2500, startTime + 0.025);

        bottomOsc.connect(bottomFilter);
        bottomFilter.connect(bottomGain);
        bottomGain.connect(this.audioContext.destination);

        bottomGain.gain.setValueAtTime(0, startTime + 0.025);
        bottomGain.gain.linearRampToValueAtTime(volume * 0.6, startTime + 0.03);
        bottomGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.085);

        bottomOsc.start(startTime + 0.025);
        bottomOsc.stop(startTime + 0.085);

        if (!isCorrect) this.addErrorNoise(startTime, volume * 0.4);
    }

    generateTopre(startTime, volume, pitchVar, isCorrect) {
        // Topre: Electro-capacitive switch with unique thock sound
        const thockFreq = 1100 + (pitchVar * 130);
        const capacitiveFreq = 800 + (pitchVar * 80);

        // Capacitive activation
        const capOsc = this.audioContext.createOscillator();
        const capGain = this.audioContext.createGain();
        const capFilter = this.audioContext.createBiquadFilter();

        capOsc.type = 'sine';
        capOsc.frequency.setValueAtTime(capacitiveFreq, startTime);
        capFilter.type = 'lowpass';
        capFilter.frequency.setValueAtTime(1200, startTime);
        capFilter.Q.setValueAtTime(2, startTime);

        capOsc.connect(capFilter);
        capFilter.connect(capGain);
        capGain.connect(this.audioContext.destination);

        capGain.gain.setValueAtTime(0, startTime);
        capGain.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.008);
        capGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

        capOsc.start(startTime);
        capOsc.stop(startTime + 0.05);

        // Signature thock
        const thockOsc = this.audioContext.createOscillator();
        const thockGain = this.audioContext.createGain();
        const thockFilter = this.audioContext.createBiquadFilter();

        thockOsc.type = 'triangle';
        thockOsc.frequency.setValueAtTime(thockFreq, startTime + 0.04);
        thockFilter.type = 'lowpass';
        thockFilter.frequency.setValueAtTime(1600, startTime + 0.04);
        thockFilter.Q.setValueAtTime(3.5, startTime + 0.04);

        thockOsc.connect(thockFilter);
        thockFilter.connect(thockGain);
        thockGain.connect(this.audioContext.destination);

        thockGain.gain.setValueAtTime(0, startTime + 0.04);
        thockGain.gain.linearRampToValueAtTime(volume * 0.9, startTime + 0.045);
        thockGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

        thockOsc.start(startTime + 0.04);
        thockOsc.stop(startTime + 0.15);

        if (!isCorrect) this.addErrorNoise(startTime, volume * 0.3);
    }



    addErrorNoise(startTime, volume) {
        // Add harsh noise for incorrect keystrokes
        const noiseBuffer = this.audioContext.createBuffer(1, 1024, this.audioContext.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);

        for (let i = 0; i < 1024; i++) {
            noiseData[i] = (Math.random() - 0.5) * 2;
        }

        const noiseSource = this.audioContext.createBufferSource();
        const noiseGain = this.audioContext.createGain();
        const noiseFilter = this.audioContext.createBiquadFilter();

        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(2000, startTime);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.audioContext.destination);

        noiseGain.gain.setValueAtTime(0, startTime);
        noiseGain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

        noiseSource.start(startTime);
        noiseSource.stop(startTime + 0.1);
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

    // Sound Panel Management
    openSoundPanel() {
        try {
            const soundPanel = document.getElementById('soundPanel');
            if (soundPanel) {
                soundPanel.classList.remove('hidden');
                this.loadSoundSettings();
            } else {
                console.warn('Sound panel element not found');
            }
        } catch (error) {
            console.error('Error opening sound panel:', error);
        }
    }

    closeSoundPanel() {
        try {
            const soundPanel = document.getElementById('soundPanel');
            if (soundPanel) {
                soundPanel.classList.add('hidden');
            } else {
                console.warn('Sound panel element not found');
            }
        } catch (error) {
            console.error('Error closing sound panel:', error);
        }
    }

    loadSoundSettings() {
        // Load saved settings
        const savedSettings = this.getSavedSoundSettings();

        this.keyboardSoundType = savedSettings.soundType || 'cherry-mx-blue';
        this.soundVolume = savedSettings.volume || 0.5;
        this.soundVariation = savedSettings.variation !== undefined ? savedSettings.variation : true;
        this.pitchVariation = savedSettings.pitchVariation || 0.2;

        // Update UI with error handling
        try {
            document.querySelectorAll('.sound-preset').forEach(preset => {
                preset.classList.remove('active');
            });

            const activePreset = document.querySelector(`[data-sound="${this.keyboardSoundType}"]`);
            if (activePreset) {
                activePreset.classList.add('active');
            }

            const volumeSlider = document.getElementById('volumeSlider');
            const volumeValue = document.getElementById('volumeValue');
            const variationToggle = document.getElementById('variationToggle');
            const pitchSlider = document.getElementById('pitchSlider');
            const pitchValue = document.getElementById('pitchValue');

            if (volumeSlider) {
                volumeSlider.value = this.soundVolume * 100;
            }
            if (volumeValue) {
                volumeValue.textContent = Math.round(this.soundVolume * 100) + '%';
            }
            if (variationToggle) {
                variationToggle.checked = this.soundVariation;
            }
            if (pitchSlider) {
                pitchSlider.value = this.pitchVariation * 100;
            }
            if (pitchValue) {
                pitchValue.textContent = Math.round(this.pitchVariation * 100) + '%';
            }
        } catch (error) {
            console.warn('Error updating sound settings UI:', error);
        }
    }

    selectSoundPreset(soundType) {
        if (!soundType) return;

        this.keyboardSoundType = soundType;

        // Update UI
        document.querySelectorAll('.sound-preset').forEach(preset => {
            preset.classList.remove('active');
        });

        const selectedPreset = document.querySelector(`[data-sound="${soundType}"]`);
        if (selectedPreset) {
            selectedPreset.classList.add('active');
        }

        // Save setting
        this.saveSoundSettings();

        // Play test sound
        setTimeout(() => {
            this.testKeyboardSound(soundType);
        }, 100);
    }

    testKeyboardSound(soundType) {
        if (!soundType || soundType === 'silent') return;

        const originalType = this.keyboardSoundType;
        this.keyboardSoundType = soundType;

        try {
            this.playKeyboardSound(true);
        } catch (error) {
            console.warn('Error testing keyboard sound:', error);
        }

        this.keyboardSoundType = originalType;
    }

    updateVolume(value) {
        this.soundVolume = value / 100;
        const volumeValue = document.getElementById('volumeValue');
        if (volumeValue) {
            volumeValue.textContent = value + '%';
        }
        this.saveSoundSettings();
    }

    toggleVariation(enabled) {
        this.soundVariation = enabled;
        this.saveSoundSettings();
    }

    updatePitchVariation(value) {
        this.pitchVariation = value / 100;
        const pitchValue = document.getElementById('pitchValue');
        if (pitchValue) {
            pitchValue.textContent = value + '%';
        }
        this.saveSoundSettings();
    }

    resetSounds() {
        this.keyboardSoundType = 'cherry-mx-blue';
        this.soundVolume = 0.5;
        this.soundVariation = true;
        this.pitchVariation = 0.2;

        this.loadSoundSettings();
        this.saveSoundSettings();
        this.playSound('start');
    }

    saveSounds() {
        this.saveSoundSettings();
        this.playSound('complete');

        // Show confirmation
        const saveBtn = document.getElementById('saveSounds');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        saveBtn.disabled = true;

        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }, 2000);
    }

    saveSoundSettings() {
        const settings = {
            soundType: this.keyboardSoundType,
            volume: this.soundVolume,
            variation: this.soundVariation,
            pitchVariation: this.pitchVariation
        };

        localStorage.setItem('typingTestSoundSettings', JSON.stringify(settings));
    }

    getSavedSoundSettings() {
        try {
            return JSON.parse(localStorage.getItem('typingTestSoundSettings')) || {};
        } catch {
            return {};
        }
    }

    loadSavedSoundSettings() {
        const savedSettings = this.getSavedSoundSettings();

        this.keyboardSoundType = savedSettings.soundType || 'cherry-mx-blue';
        this.soundVolume = savedSettings.volume || 0.5;
        this.soundVariation = savedSettings.variation !== undefined ? savedSettings.variation : true;
        this.pitchVariation = savedSettings.pitchVariation || 0.2;
    }

    // Card Selector Methods
    initializeCardSelectors() {
        // Duration cards
        document.querySelectorAll('.duration-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectDurationCard(e.currentTarget));
            card.addEventListener('dragstart', (e) => this.handleCardDragStart(e, 'duration'));
            card.addEventListener('dragend', (e) => this.handleCardDragEnd(e));
        });

        // Difficulty cards
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectDifficultyCard(e.currentTarget));
            card.addEventListener('dragstart', (e) => this.handleCardDragStart(e, 'difficulty'));
            card.addEventListener('dragend', (e) => this.handleCardDragEnd(e));
        });

        // Add drop zones for card swapping
        this.createCardDropZones();
    }

    selectDurationCard(selectedCard) {
        // Remove active class from all duration cards
        document.querySelectorAll('.duration-card').forEach(card => {
            card.classList.remove('active');
        });

        // Add active class to selected card
        selectedCard.classList.add('active');

        // Update the hidden select and trigger change
        const duration = selectedCard.dataset.duration;
        const select = document.getElementById('timeSelect');
        select.value = duration;
        this.setTestDuration(duration);

        // Play sound and add animation
        this.playSound('correct');
        this.animateCardSelection(selectedCard);
    }

    selectDifficultyCard(selectedCard) {
        // Remove active class from all difficulty cards
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.classList.remove('active');
        });

        // Add active class to selected card
        selectedCard.classList.add('active');

        // Update the hidden select and trigger change
        const difficulty = selectedCard.dataset.difficulty;
        const select = document.getElementById('difficultySelect');
        select.value = difficulty;
        this.generateNewText();

        // Play sound and add animation
        this.playSound('correct');
        this.animateCardSelection(selectedCard);
    }

    animateCardSelection(card) {
        // Add selection animation
        card.style.transform = 'scale(1.1)';
        card.style.transition = 'transform 0.2s ease';

        setTimeout(() => {
            card.style.transform = '';
            card.style.transition = '';
        }, 200);

        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'selection-ripple';
        card.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    handleCardDragStart(e, cardType) {
        const card = e.currentTarget;
        const value = cardType === 'duration' ? card.dataset.duration : card.dataset.difficulty;

        e.dataTransfer.setData('text/plain', JSON.stringify({
            type: 'card-swap',
            cardType: cardType,
            value: value,
            sourceElement: card.outerHTML
        }));

        card.classList.add('dragging');
        document.body.classList.add('card-drag-active');

        // Show compatible drop zones
        document.querySelectorAll(`.${cardType}-card:not(.dragging)`).forEach(dropCard => {
            dropCard.classList.add('drop-target');
        });

        this.playSound('correct');
    }

    handleCardDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
        document.body.classList.remove('card-drag-active');

        // Remove drop target indicators
        document.querySelectorAll('.drop-target').forEach(card => {
            card.classList.remove('drop-target');
        });
    }

    createCardDropZones() {
        // Add drop functionality to cards
        document.querySelectorAll('.duration-card, .difficulty-card').forEach(card => {
            card.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            card.addEventListener('dragenter', (e) => {
                e.preventDefault();
                if (card.classList.contains('drop-target')) {
                    card.classList.add('drag-over');
                }
            });

            card.addEventListener('dragleave', (e) => {
                if (!card.contains(e.relatedTarget)) {
                    card.classList.remove('drag-over');
                }
            });

            card.addEventListener('drop', (e) => {
                e.preventDefault();
                this.handleCardDrop(e, card);
            });
        });
    }

    handleCardDrop(e, dropTarget) {
        try {
            const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));

            if (dragData.type === 'card-swap') {
                const sourceCard = document.querySelector(`.${dragData.cardType}-card.dragging`);

                if (sourceCard && dropTarget.classList.contains(`${dragData.cardType}-card`)) {
                    // Swap the positions visually with animation
                    this.swapCards(sourceCard, dropTarget);
                    this.playSound('match');
                }
            }
        } catch (error) {
            console.warn('Error handling card drop:', error);
            this.playSound('error');
        }

        dropTarget.classList.remove('drag-over');
    }

    swapCards(card1, card2) {
        // Create temporary placeholders
        const temp1 = document.createElement('div');
        const temp2 = document.createElement('div');

        // Insert placeholders
        card1.parentNode.insertBefore(temp1, card1);
        card2.parentNode.insertBefore(temp2, card2);

        // Add swap animation
        card1.style.transform = 'scale(0.8) rotate(10deg)';
        card2.style.transform = 'scale(0.8) rotate(-10deg)';

        setTimeout(() => {
            // Swap positions
            temp1.parentNode.insertBefore(card2, temp1);
            temp2.parentNode.insertBefore(card1, temp2);

            // Remove placeholders
            temp1.remove();
            temp2.remove();

            // Reset transforms
            card1.style.transform = '';
            card2.style.transform = '';
        }, 300);
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
