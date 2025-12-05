document.addEventListener('DOMContentLoaded', function() {
    // Supprimer les claviers existants
    const existingKeyboards = document.querySelectorAll('#letters-only-keyboard, #virtual-keyboard');
    existingKeyboards.forEach(kb => kb.remove());
    
    // Création du conteneur principal
    const lettersContainer = document.createElement('div');
    lettersContainer.id = 'letters-only-keyboard';
    lettersContainer.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        margin: 25px 0 15px 0;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 15px;
        border: 3px solid #5a67d8;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        max-width: 900px;
        min-height: 250px;
        position: relative;
        overflow: visible;
        user-select: none;
    `;
    
    // Configuration des niveaux - VITESSE AUGMENTÉE
    const levelsConfig = {
        startSpeed: 0.8,
        speedIncrement: 0.6,
        maxLevels: 20,
        startCockroaches: 8,
        cockroachIncrement: 4,
        cockroachSpeedMultiplier: 1.8,
        maxSpeed: 15
    };
    
    // Variables d'état
    let currentLevel = 1;
    let letterButtons = [];
    let cockroaches = [];
    let animationId = null;
    let currentSpeed = levelsConfig.startSpeed;
    let isMoving = true;
    let activeField = null; 
    let lastActiveField = null;
    
    // Alphabet de base
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Fonction pour créer un niveau
    function createLevel(level) {
        // Vider le conteneur
        lettersContainer.innerHTML = '';
        letterButtons = [];
        
        // Arrêter les cafards existants
        cockroaches.forEach(c => {
            if (c.element && c.element.parentNode) {
                c.element.remove();
            }
        });
        cockroaches = [];
        
        // Calculer le nombre de lettres
        const letterCount = 26 + (level * 15);
        let lettersString = '';
        
        while (lettersString.length < letterCount) {
            lettersString += alphabet;
        }
        lettersString = lettersString.substring(0, letterCount);
        
        // Mélanger les lettres
        const shuffledLetters = shuffleArray(lettersString.split(''));
        
        // Créer les boutons
        shuffledLetters.forEach((letter, index) => {
            const letterButton = document.createElement('button');
            
            letterButton.textContent = letter;
            letterButton.dataset.letter = letter;
            letterButton.dataset.id = `letter-${index}`;
            letterButton.type = 'button';
            
            // Style
            const size = Math.max(25, 45 - level * 1.2);
            const fontSize = Math.max(10, 16 - level * 0.6);
            const borderRadius = level > 8 ? '50%' : '6px';
            
            // Position initiale
            const initialX = Math.random() * (lettersContainer.offsetWidth - size - 40) + 20;
            const initialY = Math.random() * (lettersContainer.offsetHeight - size - 40) + 20;
            
            letterButton.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                font-size: ${fontSize}px;
                font-weight: ${level > 5 ? '900' : 'bold'};
                border: ${level > 12 ? '3px solid #ff0000' : level > 8 ? '2px solid #ff9900' : '2px solid #ffffff'};
                border-radius: ${borderRadius};
                background: ${getLevelColor(level)};
                color: ${level > 8 ? '#ffffff' : '#2d3748'};
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                box-shadow: ${level > 4 ? '0 0 15px rgba(255,255,255,0.5)' : '0 2px 6px rgba(0,0,0,0.2)'};
                position: absolute;
                left: ${initialX}px;
                top: ${initialY}px;
                z-index: 10;
                user-select: none;
                transform: rotate(${Math.random() * 20 - 10}deg);
                -webkit-tap-highlight-color: transparent;
                outline: none;
            `;
            
            // Animation de pulsation
            if (level > 6) {
                const pulseSpeed = 1.2 - (level * 0.08);
                letterButton.style.animation = `pulse ${pulseSpeed}s infinite alternate`;
            }
            
            // Effet au survol
            letterButton.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.3) rotate(0deg)';
                this.style.zIndex = '15';
                this.style.boxShadow = '0 0 30px rgba(255,255,255,0.9)';
            });
            
            letterButton.addEventListener('mouseleave', function() {
                const movement = this.movement;
                if (movement) {
                    this.style.transform = `rotate(${movement.rotation}deg) scale(1)`;
                }
                this.style.zIndex = '10';
                this.style.boxShadow = level > 4 ? '0 0 15px rgba(255,255,255,0.5)' : '0 2px 6px rgba(0,0,0,0.2)';
            });
            
            // Gestion du clic
            letterButton.addEventListener('mousedown', function(e) {
                e.preventDefault();
                return false;
            });
            
            letterButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Rétablir le focus si nécessaire
                if (!activeField && lastActiveField) {
                    lastActiveField.focus();
                    activeField = lastActiveField;
                }
                
                const letter = this.dataset.letter;
                
                // Insérer la lettre (false = pas une suppression)
                if (insertLetterIntoActiveField(letter, false)) {
                    // Animation de clic réussie
                    this.style.background = '#00ff00';
                    this.style.color = '#000000';
                    this.style.transform = 'scale(1.6)';
                    this.style.zIndex = '20';
                    
                    setTimeout(() => {
                        this.style.background = getLevelColor(level);
                        this.style.color = level > 8 ? '#ffffff' : '#2d3748';
                        this.style.transform = 'scale(1)';
                        this.style.zIndex = '10';
                    }, 200);
                    
                    // Passer au niveau suivant
                    currentLevel++;
                    
                    // Augmentation de vitesse
                    currentSpeed = Math.min(
                        levelsConfig.maxSpeed,
                        currentSpeed * (1 + (levelsConfig.speedIncrement * 0.1 * currentLevel))
                    );
                    
                    // Arrêter l'animation actuelle
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                    }
                    
                    // Créer le nouveau niveau
                    createLevel(currentLevel);
                    updateLevelDisplay();
                    
                    // Redémarrer l'animation
                    if (isMoving) {
                        animateLetters();
                    }
                    
                    // Ajouter des cafards
                    if (currentLevel >= 2) {
                        const cockroachCount = levelsConfig.startCockroaches + 
                                              ((currentLevel - 2) * levelsConfig.cockroachIncrement);
                        createCockroaches(cockroachCount);
                        animateCockroaches();
                    }
                    
                    // Re-focus le champ
                    setTimeout(() => {
                        if (activeField) {
                            activeField.focus();
                        } else if (lastActiveField) {
                            lastActiveField.focus();
                            activeField = lastActiveField;
                        }
                    }, 50);
                    
                } else {
                    // Animation d'erreur
                    this.style.background = '#ff0000';
                    this.style.color = '#ffffff';
                    setTimeout(() => {
                        this.style.background = getLevelColor(level);
                        this.style.color = level > 8 ? '#ffffff' : '#2d3748';
                    }, 300);
                }
            });
            
            // Stocker les propriétés de mouvement
            const speedMultiplier = 1 + (level * 0.15);
            letterButton.movement = {
                x: initialX,
                y: initialY,
                speedX: (Math.random() - 0.5) * currentSpeed * speedMultiplier,
                speedY: (Math.random() - 0.5) * currentSpeed * speedMultiplier,
                rotation: Math.random() * 20 - 10,
                rotationSpeed: (Math.random() - 0.5) * 0.8 * speedMultiplier
            };
            
            lettersContainer.appendChild(letterButton);
            letterButtons.push(letterButton);
        });
        
        // Ajouter des cafards
        if (level >= 2) {
            const cockroachCount = levelsConfig.startCockroaches + 
                                  ((level - 2) * levelsConfig.cockroachIncrement);
            createCockroaches(cockroachCount);
        }
    }
    
    // Fonction pour obtenir la couleur
    function getLevelColor(level) {
        if (level > 15) return '#ff0000';
        if (level > 13) return '#ff3300';
        if (level > 11) return '#ff6600';
        if (level > 9) return '#ff9900';
        if (level > 7) return '#ffcc00';
        if (level > 5) return '#ffff00';
        if (level > 3) return '#00ccff';
        if (level > 1) return '#6699ff';
        return '#ffffff';
    }
    
    // Fonction pour mélanger
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Fonction pour animer les lettres
    function animateLetters() {
        if (!isMoving) return;
        
        const containerWidth = lettersContainer.offsetWidth;
        const containerHeight = lettersContainer.offsetHeight;
        
        letterButtons.forEach(button => {
            const movement = button.movement;
            if (!movement) return;
            
            movement.x += movement.speedX;
            movement.y += movement.speedY;
            movement.rotation += movement.rotationSpeed;
            
            if (movement.x < 5) {
                movement.x = 5;
                movement.speedX *= -0.95;
            }
            if (movement.x > containerWidth - parseInt(button.style.width) - 5) {
                movement.x = containerWidth - parseInt(button.style.width) - 5;
                movement.speedX *= -0.95;
            }
            if (movement.y < 5) {
                movement.y = 5;
                movement.speedY *= -0.95;
            }
            if (movement.y > containerHeight - parseInt(button.style.height) - 5) {
                movement.y = containerHeight - parseInt(button.style.height) - 5;
                movement.speedY *= -0.95;
            }
            
            if (Math.random() > 0.9) {
                movement.speedX += (Math.random() - 0.5) * 0.2;
                movement.speedY += (Math.random() - 0.5) * 0.2;
            }
            
            button.style.transition = `left ${0.3 / (currentSpeed * 0.5)}s linear, top ${0.3 / (currentSpeed * 0.5)}s linear`;
            button.style.left = `${movement.x}px`;
            button.style.top = `${movement.y}px`;
            button.style.transform = `rotate(${movement.rotation}deg) scale(1)`;
        });
        
        animationId = requestAnimationFrame(animateLetters);
    }
    
    // Fonction pour créer les cafards
    function createCockroaches(count) {
        for (let i = 0; i < count; i++) {
            const cockroach = document.createElement('div');
            cockroach.innerHTML = '🪳';
            
            const size = 20 + Math.random() * 15;
            const opacity = 0.4 + Math.random() * 0.5;
            const blur = Math.random() * 1.5;
            
            cockroach.style.cssText = `
                position: absolute;
                font-size: ${size}px;
                z-index: 20;
                user-select: none;
                opacity: ${opacity};
                filter: blur(${blur}px) brightness(${0.7 + Math.random() * 0.6});
                pointer-events: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                transform: scale(${0.8 + Math.random() * 0.4}) rotate(${Math.random() * 360}deg);
            `;
            
            const startX = Math.random() * lettersContainer.offsetWidth;
            const startY = Math.random() * lettersContainer.offsetHeight;
            cockroach.style.left = `${startX}px`;
            cockroach.style.top = `${startY}px`;
            
            lettersContainer.appendChild(cockroach);
            
            const cockroachSpeed = levelsConfig.cockroachSpeedMultiplier + (currentLevel * 0.25);
            
            cockroaches.push({
                element: cockroach,
                x: startX,
                y: startY,
                speedX: (Math.random() - 0.5) * cockroachSpeed,
                speedY: (Math.random() - 0.5) * cockroachSpeed,
                size: size,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 3
            });
        }
    }
    
    // Fonction pour animer les cafards
    function animateCockroaches() {
        if (!isMoving || cockroaches.length === 0) return;
        
        const containerWidth = lettersContainer.offsetWidth;
        const containerHeight = lettersContainer.offsetHeight;
        
        cockroaches.forEach(cockroach => {
            cockroach.x += cockroach.speedX;
            cockroach.y += cockroach.speedY;
            cockroach.rotation += cockroach.rotationSpeed;
            
            if (cockroach.x < 0 || cockroach.x > containerWidth - 40) {
                cockroach.speedX *= -1;
                cockroach.speedX += (Math.random() - 0.5) * 0.5;
                cockroach.x = Math.max(0, Math.min(cockroach.x, containerWidth - 40));
            }
            if (cockroach.y < 0 || cockroach.y > containerHeight - 40) {
                cockroach.speedY *= -1;
                cockroach.speedY += (Math.random() - 0.5) * 0.5;
                cockroach.y = Math.max(0, Math.min(cockroach.y, containerHeight - 40));
            }
            
            if (Math.random() > 0.97) {
                cockroach.speedX = (Math.random() - 0.5) * (levelsConfig.cockroachSpeedMultiplier + currentLevel * 0.3);
                cockroach.speedY = (Math.random() - 0.5) * (levelsConfig.cockroachSpeedMultiplier + currentLevel * 0.3);
            }
            
            cockroach.element.style.left = `${cockroach.x}px`;
            cockroach.element.style.top = `${cockroach.y}px`;
            cockroach.element.style.transform = `rotate(${cockroach.rotation}deg) scale(${0.8 + Math.random() * 0.4})`;
            
            if (Math.random() > 0.85) {
                cockroach.element.style.opacity = Math.random() * 0.5 + 0.3;
            }
            if (Math.random() > 0.9) {
                cockroach.element.style.filter = `blur(${Math.random()}px) brightness(${0.5 + Math.random() * 0.7})`;
            }
        });
        
        requestAnimationFrame(animateCockroaches);
    }
    
    // Fonction pour mettre à jour l'affichage
    function updateLevelDisplay() {
        const oldDisplay = document.getElementById('level-display');
        if (oldDisplay) oldDisplay.remove();
        
        const levelDisplay = document.createElement('div');
        levelDisplay.id = 'level-display';
        
        let displayStyle = '';
        if (currentLevel > 15) {
            displayStyle = `
                background: linear-gradient(90deg, #ff0000, #ff3300);
                color: #ffff00;
                text-shadow: 0 0 15px #ffff00;
                border: 3px solid #ff9900;
                animation: extremeWarning 0.5s infinite alternate;
            `;
        } else if (currentLevel > 10) {
            displayStyle = `
                background: linear-gradient(90deg, #ff6600, #ff9900);
                color: #000;
                text-shadow: 0 0 10px #ffff00;
                border: 3px solid #ff3300;
                animation: warning 0.8s infinite alternate;
            `;
        } else if (currentLevel > 5) {
            displayStyle = `
                background: linear-gradient(90deg, #ffcc00, #ffff00);
                color: #000;
                border: 2px solid #ff9900;
            `;
        } else {
            displayStyle = `
                background: linear-gradient(90deg, #667eea, #764ba2);
                color: white;
                border: 2px solid #5a67d8;
            `;
        }
        
        levelDisplay.style.cssText = `
            text-align: center;
            margin-bottom: 15px;
            padding: 15px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 18px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            ${displayStyle}
        `;
        
        const cockroachCount = currentLevel >= 2 ? 
            levelsConfig.startCockroaches + ((currentLevel - 2) * levelsConfig.cockroachIncrement) : 
            0;
        
        const speedPercent = Math.min(100, (currentSpeed / levelsConfig.maxSpeed) * 100);
        const speedBar = `[${'█'.repeat(Math.floor(speedPercent / 5))}${'░'.repeat(20 - Math.floor(speedPercent / 5))}]`;
        
        levelDisplay.innerHTML = `
            <div style="font-size: 26px; margin-bottom: 8px; font-weight: 900;">⚡ NIVEAU ${currentLevel}</div>
            <div style="font-size: 16px; margin-bottom: 5px;">
                <span style="color: ${currentLevel > 10 ? '#ffff00' : 'inherit'}">
                    VITESSE: ${currentSpeed.toFixed(1)} (${speedPercent.toFixed(0)}%)
                </span>
            </div>
            <div style="font-size: 14px; margin-bottom: 5px; font-family: monospace;">
                ${speedBar}
            </div>
            <div style="font-size: 14px;">
                Lettres: ${letterButtons.length} | 
                🪳 Cafards: ${cockroachCount}
            </div>
            <div style="font-size: 12px; margin-top: 8px; opacity: 0.9;">
                <span style="color: ${activeField ? '#00ff00' : '#ff9900'};">
                    ${activeField ? '✓ CHAMP ACTIF' : '⚠️ CLIQUEZ SUR UN CHAMP'}
                </span>
            </div>
        `;
        
        lettersContainer.insertAdjacentElement('beforebegin', levelDisplay);
        
        if (!document.querySelector('#extreme-animations')) {
            const style = document.createElement('style');
            style.id = 'extreme-animations';
            style.textContent = `
                @keyframes extremeWarning {
                    0% { 
                        box-shadow: 0 0 20px rgba(255,0,0,0.7);
                        transform: scale(1);
                    }
                    100% { 
                        box-shadow: 0 0 40px rgba(255,0,0,0.9);
                        transform: scale(1.02);
                    }
                }
                @keyframes warning {
                    0% { box-shadow: 0 0 15px rgba(255,102,0,0.5); }
                    100% { box-shadow: 0 0 25px rgba(255,102,0,0.8); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Insérer dans la page
    const table = document.querySelector('table');
    if (table) {
        table.insertAdjacentElement('afterend', lettersContainer);
    } else {
        document.body.appendChild(lettersContainer);
    }
    
    // Gestion des champs
    const inputFields = document.querySelectorAll('input');
    
    function updateFieldStyle(field, isActive) {
        if (isActive) {
            field.style.borderColor = '#4299e1';
            field.style.boxShadow = '0 0 0 4px rgba(66, 153, 225, 0.4)';
            field.style.background = '#ffffff';
            field.style.zIndex = '100';
        } else {
            field.style.borderColor = '#cbd5e0';
            field.style.boxShadow = 'none';
            field.style.background = '#f8f9fa';
            field.style.zIndex = 'auto';
        }
    }
    
    inputFields.forEach(input => {
        input.style.cssText += `
            transition: all 0.3s;
            padding: 12px;
            border-radius: 8px;
            border: 2px solid #cbd5e0;
            font-size: 16px;
            width: 100%;
            box-sizing: border-box;
            background: #f8f9fa;
            position: relative;
        `;
        
        input.addEventListener('focus', function() {
            activeField = this;
            lastActiveField = this;
            inputFields.forEach(field => {
                updateFieldStyle(field, field === this);
            });
            updateLevelDisplay();
        });
        
        input.addEventListener('blur', function() {
            updateFieldStyle(this, false);
        });
    });
    
    lettersContainer.addEventListener('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (activeField) {
            setTimeout(() => { activeField.focus(); }, 0);
        } else if (lastActiveField) {
            setTimeout(() => {
                lastActiveField.focus();
                activeField = lastActiveField;
            }, 0);
        }
        return false;
    });
    
    // FONCTION MODIFIÉE POUR GÉRER LA SUPPRESSION
    function insertLetterIntoActiveField(letter, isDeletion = false) {
        const targetField = activeField || lastActiveField;
        
        if (!targetField) {
            showNotification('⚠️ Sélectionnez d\'abord un champ !', 'error');
            return false;
        }
        
        try {
            if (document.activeElement !== targetField) {
                targetField.focus();
            }
            
            const start = targetField.selectionStart;
            const end = targetField.selectionEnd;
            const currentValue = targetField.value;
            
            // CAS NORMAL : Insertion d'une lettre
            if (!isDeletion) {
                targetField.value = currentValue.substring(0, start) + letter + currentValue.substring(end);
                
                const newPosition = start + 1;
                setTimeout(() => {
                    if (targetField) {
                        targetField.setSelectionRange(newPosition, newPosition);
                        targetField.focus();
                        activeField = targetField;
                        lastActiveField = targetField;
                    }
                }, 10);
                
                updateFieldStyle(targetField, true);
                
                const inputEvent = new Event('input', { bubbles: true });
                targetField.dispatchEvent(inputEvent);
                
                setTimeout(() => {
                    showNotification(`"${letter}" ajoutée`, 'success');
                }, 100);
                
                updateLevelDisplay();
                
                return true;
                
            } 
            // CAS SUPPRESSION : Effacer une lettre
            else {
                // Vérifier qu'il y a quelque chose à supprimer
                if (start === end && start > 0) {
                    // Supprimer la lettre avant le curseur
                    targetField.value = currentValue.substring(0, start - 1) + currentValue.substring(end);
                    
                    const newPosition = start - 1;
                    setTimeout(() => {
                        if (targetField) {
                            targetField.setSelectionRange(newPosition, newPosition);
                            targetField.focus();
                            activeField = targetField;
                            lastActiveField = targetField;
                        }
                    }, 10);
                    
                    // REVENIR AU NIVEAU PRÉCÉDENT
                    if (currentLevel > 1) {
                        currentLevel--;
                        
                        // Réduire la vitesse
                        currentSpeed = Math.max(
                            levelsConfig.startSpeed,
                            currentSpeed / (1 + (levelsConfig.speedIncrement * 0.1 * (currentLevel + 1)))
                        );
                        
                        // Arrêter l'animation actuelle
                        if (animationId) {
                            cancelAnimationFrame(animationId);
                        }
                        
                        // Recréer le niveau précédent
                        createLevel(currentLevel);
                        updateLevelDisplay();
                        
                        // Redémarrer l'animation
                        if (isMoving) {
                            animateLetters();
                            if (currentLevel >= 2) {
                                animateCockroaches();
                            }
                        }
                        
                        showNotification(`↩️ Retour au niveau ${currentLevel}`, 'info');
                    } else {
                        showNotification('Déjà au niveau minimum', 'info');
                    }
                    
                    updateFieldStyle(targetField, true);
                    
                    const inputEvent = new Event('input', { bubbles: true });
                    targetField.dispatchEvent(inputEvent);
                    
                    return true;
                } else if (start !== end) {
                    // Supprimer la sélection
                    targetField.value = currentValue.substring(0, start) + currentValue.substring(end);
                    
                    setTimeout(() => {
                        if (targetField) {
                            targetField.setSelectionRange(start, start);
                            targetField.focus();
                            activeField = targetField;
                            lastActiveField = targetField;
                        }
                    }, 10);
                    
                    // REVENIR AU NIVEAU PRÉCÉDENT
                    if (currentLevel > 1) {
                        currentLevel--;
                        
                        // Réduire la vitesse
                        currentSpeed = Math.max(
                            levelsConfig.startSpeed,
                            currentSpeed / (1 + (levelsConfig.speedIncrement * 0.1 * (currentLevel + 1)))
                        );
                        
                        // Arrêter l'animation actuelle
                        if (animationId) {
                            cancelAnimationFrame(animationId);
                        }
                        
                        // Recréer le niveau précédent
                        createLevel(currentLevel);
                        updateLevelDisplay();
                        
                        // Redémarrer l'animation
                        if (isMoving) {
                            animateLetters();
                            if (currentLevel >= 2) {
                                animateCockroaches();
                            }
                        }
                        
                        showNotification(`↩️ Retour au niveau ${currentLevel}`, 'info');
                    }
                    
                    updateFieldStyle(targetField, true);
                    
                    const inputEvent = new Event('input', { bubbles: true });
                    targetField.dispatchEvent(inputEvent);
                    
                    return true;
                } else {
                    showNotification('Rien à supprimer', 'info');
                    return false;
                }
            }
            
        } catch (error) {
            console.error('Erreur:', error);
            showNotification('❌ Erreur', 'error');
            return false;
        }
    }
    
    // Détecter la suppression avec Backspace ou Delete
    document.addEventListener('keydown', function(e) {
        const targetField = activeField || lastActiveField;
        
        if (!targetField || document.activeElement !== targetField) {
            return;
        }
        
        // Backspace (8) ou Delete (46)
        if (e.keyCode === 8 || e.keyCode === 46 || e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            
            const start = targetField.selectionStart;
            const end = targetField.selectionEnd;
            const value = targetField.value;
            
            if (start !== end || (start === end && start > 0)) {
                insertLetterIntoActiveField('', true);
            }
        }
    });
    
    function showNotification(message, type) {
        const oldNotification = document.getElementById('letter-notification');
        if (oldNotification) oldNotification.remove();
        
        const notification = document.createElement('div');
        notification.id = 'letter-notification';
        notification.textContent = message;
        
        const bgColor = type === 'error' ? '#f56565' : 
                       type === 'success' ? '#48bb78' : '#4299e1';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${bgColor};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: bold;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 1500);
    }
    
    // Créer le niveau 1
    createLevel(currentLevel);
    updateLevelDisplay();
    animateLetters();
    
    // Contrôles
    const controlsContainer = document.createElement('div');
    controlsContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 15px;
        margin: 20px 0;
        flex-wrap: wrap;
    `;
    
    const forceFocusButton = document.createElement('button');
    forceFocusButton.textContent = '🎯 FORCER LE FOCUS';
    forceFocusButton.style.cssText = `
        padding: 12px 24px;
        background: linear-gradient(90deg, #00b894, #00a085);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s;
    `;
    
    forceFocusButton.addEventListener('click', function() {
        const firstInput = document.querySelector('input[type="text"]');
        if (firstInput) {
            firstInput.focus();
            activeField = firstInput;
            lastActiveField = firstInput;
            updateFieldStyle(firstInput, true);
            updateLevelDisplay();
            showNotification('Focus sur le champ "Nom" !', 'success');
        }
    });
    
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '⏸️ Pause';
    toggleButton.style.cssText = `
        padding: 12px 24px;
        background: linear-gradient(90deg, #4a5568, #2d3748);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s;
    `;
    
    toggleButton.addEventListener('click', function() {
        isMoving = !isMoving;
        this.textContent = isMoving ? '⏸️ Pause' : '▶️ Play';
        this.style.background = isMoving ? 
            'linear-gradient(90deg, #4a5568, #2d3748)' : 
            'linear-gradient(90deg, #48bb78, #38a169)';
        
        if (isMoving) {
            animateLetters();
            if (currentLevel >= 2) {
                animateCockroaches();
            }
        }
    });
    
    // BOUTON SUPPRESSION AJOUTÉ
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '⌫ Supprimer lettre';
    deleteButton.style.cssText = `
        padding: 12px 24px;
        background: linear-gradient(90deg, #ed8936, #dd6b20);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s;
    `;
    
    deleteButton.addEventListener('click', function() {
        if (insertLetterIntoActiveField('', true)) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        }
    });
    
    const resetButton = document.createElement('button');
    resetButton.textContent = '🔄 Recommencer';
    resetButton.style.cssText = `
        padding: 12px 24px;
        background: linear-gradient(90deg, #f56565, #e53e3e);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s;
    `;
    
    resetButton.addEventListener('click', function() {
        currentLevel = 1;
        currentSpeed = levelsConfig.startSpeed;
        isMoving = true;
        toggleButton.textContent = '⏸️ Pause';
        toggleButton.style.background = 'linear-gradient(90deg, #4a5568, #2d3748)';
        
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        createLevel(currentLevel);
        updateLevelDisplay();
        animateLetters();
        
        const firstInput = document.querySelector('input[type="text"]');
        if (firstInput) {
            setTimeout(() => {
                firstInput.focus();
                activeField = firstInput;
                lastActiveField = firstInput;
                updateFieldStyle(firstInput, true);
            }, 100);
        }
        
        showNotification('Jeu réinitialisé !', 'info');
    });
    
    controlsContainer.appendChild(forceFocusButton);
    controlsContainer.appendChild(toggleButton);
    controlsContainer.appendChild(deleteButton); // AJOUTÉ
    controlsContainer.appendChild(resetButton);
    lettersContainer.insertAdjacentElement('afterend', controlsContainer);
    
    // Instructions
    const instructions = document.createElement('div');
    instructions.style.cssText = `
        text-align: center;
        margin: 20px 0;
        color: #4a5568;
        font-size: 14px;
        padding: 20px;
        background: linear-gradient(135deg, #edf2f7, #e2e8f0);
        border-radius: 10px;
        max-width: 900px;
        border: 2px solid #cbd5e0;
    `;
    
    instructions.innerHTML = `
        <strong style="color: #2d3748; font-size: 16px; display: block; margin-bottom: 15px;">
            ⚡ SYSTÈME COMPLET - INSERTION/SUPPRESSION
        </strong>
        
        <div style="text-align: left; display: inline-block;">
            <div style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 6px; border-left: 4px solid #00b894;">
                <strong style="color: #00b894;">➕ INSÉRER :</strong> Cliquez sur une lettre → niveau suivant
            </div>
            
            <div style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 6px; border-left: 4px solid #ed8936;">
                <strong style="color: #ed8936;">➖ SUPPRIMER :</strong> 
                <ul style="margin: 5px 0 0 20px; padding: 0;">
                    <li>Appuyez sur <strong>Backspace</strong> ou <strong>Delete</strong></li>
                    <li>OU cliquez sur <button style="padding: 4px 8px; background: #ed8936; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">⌫ Supprimer lettre</button></li>
                </ul>
                → retour au niveau précédent
            </div>
            
            <div style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 6px; border-left: 4px solid #4299e1;">
                <strong style="color: #4299e1;">📈 PROGRESSION :</strong>
                <ul style="margin: 5px 0 0 20px; padding: 0;">
                    <li>Chaque lettre insérée = +1 niveau</li>
                    <li>Chaque lettre supprimée = -1 niveau</li>
                    <li>Vitesse et cafards s'adaptent</li>
                </ul>
            </div>
            
            <div style="margin-top: 15px; padding: 12px; background: #fff5f5; border-radius: 6px; border-left: 4px solid #ff0000;">
                <strong>🎯 STRATÉGIE :</strong> Gérer votre progression ! Montez en niveau pour le défi, 
                descendez si c'est trop difficile. Les cafards cachent les lettres aux niveaux élevés.
            </div>
        </div>
    `;
    
    controlsContainer.insertAdjacentElement('afterend', instructions);
    
    // Sélection auto au démarrage
    setTimeout(() => {
        const firstInput = document.querySelector('input[type="text"]');
        if (firstInput) {
            firstInput.focus();
            activeField = firstInput;
            lastActiveField = firstInput;
            updateFieldStyle(firstInput, true);
            updateLevelDisplay();
        }
    }, 500);
    
    // Animations CSS
    if (!document.querySelector('#animations')) {
        const style = document.createElement('style');
        style.id = 'animations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes pulse {
                0% { transform: scale(1); box-shadow: 0 0 10px rgba(255,255,255,0.5); }
                100% { transform: scale(1.1); box-shadow: 0 0 20px rgba(255,255,255,0.8); }
            }
        `;
        document.head.appendChild(style);
    }
});