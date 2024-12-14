class App {
    constructor() {
      
        
        const wordCanvas = document.getElementById('wordCanvas');
        const wordCtx = setupCanvasScaling(wordCanvas);
        
        const fogCanvas = document.getElementById('fogCanvas');
        const fogCtx = setupCanvasScaling(fogCanvas);
          
          let word = ""; 
          const placedChars = [];
          const charPadding = 10;
          const revealRadius = 30; 
          let totalWhiteChars = 0;
          let timerId; 
          let gamePhase = 0; 
          const phaseTimers = [5, 30]; //5 second first phase and 30 second 2nd phase diffulcty control varible
          
          getRandomWord().then(Word => {
            if (Word) {
                word = Word.trim().toUpperCase();// difficulty control varible lenght of the word 
                init();
            } 
          });
        
        
        async function getRandomWord() {
            const words = await loadWords();
            if (words.length > 0) {
              const randomIndex = Math.floor(Math.random() * words.length);
              return words[randomIndex];
            }
          }
        
          async function loadWords() {
            try {
              const response = await fetch('words_alpha.txt');
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const text = await response.text();
              const words = text.split('\n').filter(word => word.trim() !== '');
              return words;
            } catch (error) {
              console.error('Error loading words:', error);
              return [];
            }
          }
                
        function setupCanvasScaling(canvas) {
            const scale = window.devicePixelRatio || 1; 
            canvas.width = canvas.offsetWidth * scale;
            canvas.height = canvas.offsetHeight * scale;
            const ctx = canvas.getContext('2d');
            ctx.scale(scale, scale);
            ctx.pixelRatio = scale; 
            return ctx;
        }
        
        
        function drawWord() {
            const baseFontSize = 20; 
            const scaledFontSize = baseFontSize / wordCtx.pixelRatio; 
        
            if (placedChars.length === 0 && gamePhase == 0) {
                wordCtx.font = `bold ${scaledFontSize}px Arial`; 
                wordCtx.textAlign = 'center';
                wordCtx.textBaseline = 'middle';
        
                for (let i = 0; i < word.length; i++) {
                    const character = word[i];
                    wordCtx.font = `bold ${scaledFontSize}px Arial`;
                    const charWidth = wordCtx.measureText(character).width / wordCtx.pixelRatio;
                    const charHeight = scaledFontSize;
        
                    let x, y;
                    let isValidPosition = false;
        
                    while (!isValidPosition) {
                        x = Math.random() * (wordCanvas.width / wordCtx.pixelRatio - charWidth - charPadding * 2) + charPadding;
                        y = Math.random() * (wordCanvas.height / wordCtx.pixelRatio - charHeight - charPadding * 2) + charPadding;
        
                        isValidPosition = true;
        
                        for (const char of placedChars) {
                            const dx = char.x - x;
                            const dy = char.y - y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
        
                            if (distance < Math.max(charWidth, charHeight) + charPadding) {
                                isValidPosition = false;
                                break;
                            }
                        }
                    }
        
                    placedChars.push({
                        character,
                        x,
                        y,
                        charWidth,
                        charHeight,
                        charColor: 'rgba(255, 255, 255, 1)',
                    });
                }
            }
        
            wordCtx.clearRect(0, 0, wordCanvas.width, wordCanvas.height);
            placedChars.forEach(({ character, x, y, charColor }) => {
                wordCtx.fillStyle = charColor;
                wordCtx.fillText(character, x + charPadding, y + scaledFontSize / 2);
            });
        }
        
        
        
        
        
        function resetGame() {
            word = "";
            placedChars.length = 0; 
            totalWhiteChars = 0;
        
            const incompleteWordContainer = document.getElementById('incompleteWord');
            incompleteWordContainer.innerHTML = "";
        
            const confidenceBar = document.querySelector('.confidence-bar');
            confidenceBar.style.height = "0%";
        
            wordCtx.clearRect(0, 0, wordCanvas.width, wordCanvas.height);
            fogCtx.clearRect(0, 0, fogCanvas.width, fogCanvas.height);
        
            clearInterval(timerId); // Clear any running timers
        
            getRandomWord().then(Word => {
                if (Word) {
                    word = Word.trim().toUpperCase();
                    init();
                }
            });
        }
        
        
        function startWordAssemblyPhase() {
            gamePhase = 1;
            fogCanvas.style.zIndex = 1;
            wordCanvas.style.zIndex = 2;
        
            displayGreenChars();
            clearAllGreenChars();            
            startTimer(1); 
        }
        
        function endGame(success) {
            clearInterval(timerId); 
            resetGame();  
        }
        
        
        function startTimer(phase) {
            let countdown = phaseTimers[phase];
            const timerDisplay = document.getElementById('timerDisplay');
            timerDisplay.textContent = `Time left: ${countdown} seconds`;
        
            timerId = setInterval(() => {
                countdown--;
                timerDisplay.textContent = `Time left: ${countdown} seconds`;
        
                if (countdown < 0) {
                    clearInterval(timerId);
        
                    if (phase === 0) {
                        const anyGreenChars = placedChars.some(char => char.charColor === 'rgba(0, 255, 0)');
                        if (anyGreenChars) {
                            startWordAssemblyPhase(); 
                        } else {
                            endGame(false); 
                        }
                    } else {
                        endGame(false); 
                    }
                }
            }, 1000);
        }
        
        
        
        
        function checkVisibility() {
            placedChars.forEach(char => {
                const { x, y, charWidth, charHeight } = char;
        
                const imageData = fogCtx.getImageData(
                    x,
                    y,
                    charWidth - charWidth / 2,
                    charHeight - charHeight / 2
                ).data;
        
                let isCovered = false;
        
                for (let i = 3; i < imageData.length; i += 4) {
                    if (imageData[i] > 10) {
                        isCovered = true;
                        break;
                    }
                }
        
                char.charColor = isCovered ? 'rgba(255, 255, 255)' : 'rgba(0, 255, 0)';
            });
    
            trackWhiteCharacters();
            drawWord();
        }
        
        
        
        function drawFog() {
            fogCtx.clearRect(0, 0, fogCanvas.width, fogCanvas.height);
        
            const cellSize = 30; 
            const fogOpacityRange = [0.5, 0.8]; //difficulty control variable
            const circleSizeRange = [20, 50]; 
        
            for (let x = 0; x < fogCanvas.width; x += cellSize) {
                for (let y = 0; y < fogCanvas.height; y += cellSize) {
                    if (Math.random() > 0.5) {
                        const radius = Math.random() * (circleSizeRange[1] - circleSizeRange[0]) + circleSizeRange[0];
                        const opacity = Math.random() * (fogOpacityRange[1] - fogOpacityRange[0]) + fogOpacityRange[0];
                        const fogColorWithOpacity = `rgba(100, 100, 100, ${opacity})`;
        
                        fogCtx.fillStyle = fogColorWithOpacity;
                        fogCtx.beginPath();
                        fogCtx.arc(
                            x + Math.random() * cellSize, 
                            y + Math.random() * cellSize,
                            radius,
                            0,
                            Math.PI * 2
                        );
                        fogCtx.fill();
                    }
                }
            }
        }
        
        function displayGreenChars() {
            const incompleteWordContainer = document.getElementById('incompleteWord');
            incompleteWordContainer.innerHTML = "";

            
            const usedGreenChars = new Set();
            
            word.split('').forEach((char) => {
                if(char !== '\r')
                {
                    const charElement = document.createElement('span');
                    
                    const matchingGreenChar = placedChars.find(
                        (placedChar, charIndex) => 
                            placedChar.character === char &&
                            placedChar.charColor === 'rgba(0, 255, 0)' &&
                            !usedGreenChars.has(charIndex) 
                    );
            
                    if (matchingGreenChar) {
                        charElement.textContent = char; 
                        charElement.style.color = 'green';
                        usedGreenChars.add(placedChars.indexOf(matchingGreenChar)); 
                    } else {
                        charElement.textContent = '_'; 
                        charElement.style.color = 'white';
                    }
            
                    charElement.style.margin = '0 5px';
                    incompleteWordContainer.appendChild(charElement);

                }
                    
            });
        }
        
        
        
        function trackWhiteCharacters() {
            totalWhiteChars = placedChars.filter(char => char.charColor === 'rgba(255, 255, 255)').length;
        }
        
        function backspaceLastLetter() {
            const incompleteWordContainer = document.getElementById('incompleteWord');
            const placeholders = incompleteWordContainer.querySelectorAll('span');
        
            for (let i = placeholders.length -1; i >= 0; i--) {
                if (placeholders[i].textContent !== '_' && placeholders[i].style.color == 'white') {
                    const removedChar = placeholders[i].textContent;
                    placeholders[i].textContent = '_';
        
                    const charIndex = word.indexOf(removedChar);
                    if (charIndex !== -1) {
                        placedChars.push({
                            character: removedChar,
                            x: Math.random() * (wordCanvas.width - 48), 
                            y: Math.random() * (wordCanvas.height - 48),
                            charWidth: wordCtx.measureText(removedChar).width,
                            charHeight: 48,
                            charColor: 'rgba(255, 255, 255)',
                        });
        
                    drawWord(); 
                    break;
                }
            }
            }
        }
        
        
        function clearAllGreenChars(){
            for (let i = placedChars.length - 1; i >= 0; i--) {
                if (placedChars[i].charColor === 'rgba(0, 255, 0)') {
                    placedChars.splice(i, 1);
                }
            }
            trackWhiteCharacters(); 
            drawWord();
        }
        
        
        function revealFog(x, y) {
            fogCtx.globalCompositeOperation = 'destination-out';
            fogCtx.beginPath();
            fogCtx.arc(x, y, revealRadius, 0, Math.PI * 2);
            fogCtx.fill();
            fogCtx.globalCompositeOperation = 'source-over';
        
            checkVisibility(); 
        }
        
        function increaseConfidenceBar() {
            const confidenceBar = document.querySelector('.confidence-bar');
            const confidenceBarContainer = document.querySelector('.confidence-bar-container');

            if (totalWhiteChars > 0) {
                const percentage = (1 - (totalWhiteChars / word.length)) * 100;
                confidenceBar.style.height = `${percentage}%`;
                confidenceBarContainer.classList.add('shake');

                 setTimeout(() => {
              confidenceBarContainer.classList.remove('shake');
            }, 500); 
            }
            totalWhiteChars--;
        }
        
        function fillIncompleteWord(character, index) {
            const incompleteWordContainer = document.getElementById('incompleteWord');
            const placeholders = incompleteWordContainer.querySelectorAll('span');
 
            for (let i = 0; i < placeholders.length; i++) {
                if (placeholders[i].textContent === '_') {
                    placeholders[i].textContent = character;
                    if (word[i] === character) {
                        placeholders[i].style.color = 'green';
                        increaseConfidenceBar();
                    } else {
                        placeholders[i].style.color = 'white';
                    }
                    break;
                }
            }
        
            const completedWord = Array.from(placeholders).map((span) => span.textContent).join('');
            if (completedWord === word) {
                endGame(true); 
            }
            placedChars.splice(index, 1);
        }
        
        
        function init() {
            fogCanvas.style.zIndex = 2;
            wordCanvas.style.zIndex = 1;
            handleResize();
                        
            gamePhase = 0;
            startTimer(0); 
        
            drawWord();
            drawFog();
        
        
            document.getElementById('backspaceButton').addEventListener('click', backspaceLastLetter);
        
            wordCanvas.addEventListener('click', (e) => {
                if (gamePhase === 1) {
                    const rect = wordCanvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
        
                    placedChars.forEach(({ character, x: charX, y: charY, charWidth, charHeight, charColor }, index) => {
                        const distance = Math.sqrt(Math.pow(x - charX - charWidth / 2, 2) + Math.pow(y - charY - charHeight / 2, 2));
                        if (charColor === 'rgba(255, 255, 255)' && distance < Math.max(charWidth, charHeight) / 2) {
                            fillIncompleteWord(character, index);
                            drawWord();
                        }
                    });
                }
            });
        
            fogCanvas.addEventListener('mousedown', (e) => {
                if (gamePhase === 0) {
                    const rect = fogCanvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    revealFog(x, y);
        
                    fogCanvas.addEventListener('mousemove', mouseMoveHandler);
                }
            });
        
            fogCanvas.addEventListener('mouseup', () => {
                fogCanvas.removeEventListener('mousemove', mouseMoveHandler);
            });
        }
        
        
        function mouseMoveHandler(e) {
            if (gamePhase === 0) {
                const rect = fogCanvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                revealFog(x, y);
            }
        }
        
        function resizeCanvas(canvas, context) {
            const container = canvas.parentElement;
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        function handleResize() {
            resizeCanvas(wordCanvas, wordCtx);
            resizeCanvas(fogCanvas, fogCtx);
        
            drawWord();
            drawFog();
        }
        
        window.addEventListener('load', handleResize);
        window.addEventListener('resize', handleResize);
        
        
    }
  }
new App();