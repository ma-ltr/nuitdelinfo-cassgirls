document.addEventListener('DOMContentLoaded', function() {
    // Supprimer les claviers existants
    const existingKeyboards = document.querySelectorAll('#letters-only-keyboard, #virtual-keyboard');
    existingKeyboards.forEach(kb => kb.remove());
    
    // SUPPRIMER LE CHAMP MOT DE PASSE
    const passwordField = document.querySelector('input[type="password"]');
    if (passwordField) {
        const passwordRow = passwordField.closest('tr');
        if (passwordRow) {
            passwordRow.remove();
        }
    }
    
    // MODIFIER LA TABLE POUR N'AVOIR QUE LE NOM
    const table = document.querySelector('table');
    if (table) {
        table.innerHTML = `
            <tr>
                <th>Champ</th>
                <th>À remplir</th>
            </tr>
            <tr>
                <td><label for="name">Nom</label></td>
                <td><input type="text" name="name" id="name" readonly/></td>
            </tr>
        `;
    }
    
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
    
    // Configuration des niveaux
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
                
                // AUTO-FOCUS sur le champ si pas déjà fait
                if (!activeField) {
                    const nameField = document.getElementById('name');
                    if (nameField) {
                        nameField.focus();
                        activeField = nameField;
                        lastActiveField = nameField;
                        updateFieldStyle(nameField, true);
                        updateLevelDisplay();
                    }
                }
                
                const letter = this.dataset.letter;
                
                // Insérer la lettre
                if (insertLetterIntoActiveField(letter)) {
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
                <span style="color: #00ff00; font-weight: bold;">
                    ✓ CHAMP AUTO-ACTIVÉ
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
    if (table) {
        table.insertAdjacentElement('afterend', lettersContainer);
    } else {
        document.body.appendChild(lettersContainer);
    }
    
    // Gestion du champ - EMPÊCHER L'ÉCRITURE DIRECTE
    const nameField = document.getElementById('name');
    
    // Rendre le champ read-only et empêcher toutes les interactions
    if (nameField) {
        nameField.readOnly = true;
        nameField.style.cssText += `
            transition: all 0.3s;
            padding: 12px;
            border-radius: 8px;
            border: 2px solid #cbd5e0;
            font-size: 16px;
            width: 100%;
            box-sizing: border-box;
            background: #f8f9fa;
            position: relative;
            cursor: default;
            user-select: none;
        `;
        
        // EMPÊCHER TOUTES LES INTERACTIONS CLAVIER
        nameField.addEventListener('keydown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        
        nameField.addEventListener('keypress', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        
        nameField.addEventListener('keyup', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        
        nameField.addEventListener('input', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        
        nameField.addEventListener('paste', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        
        nameField.addEventListener('cut', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        
        nameField.addEventListener('copy', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        
        // AUTO-FOCUS au démarrage
        setTimeout(() => {
            nameField.focus();
            activeField = nameField;
            lastActiveField = nameField;
            updateFieldStyle(nameField, true);
            updateLevelDisplay();
        }, 100);
        
        // Gestion du focus
        nameField.addEventListener('focus', function() {
            activeField = this;
            lastActiveField = this;
            updateFieldStyle(this, true);
        });
        
        nameField.addEventListener('blur', function() {
            updateFieldStyle(this, false);
        });
    }
    
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
    
    // Fonction pour insérer une lettre
    function insertLetterIntoActiveField(letter, isDeletion = false) {
        const targetField = activeField || lastActiveField;
        
        if (!targetField) {
            // Auto-activation si pas de champ actif
            const nameField = document.getElementById('name');
            if (nameField) {
                nameField.focus();
                activeField = nameField;
                lastActiveField = nameField;
                updateFieldStyle(nameField, true);
                updateLevelDisplay();
                showNotification('Champ auto-activé !', 'info');
                return insertLetterIntoActiveField(letter, isDeletion); // Réessayer
            }
            return false;
        }
        
        try {
            if (document.activeElement !== targetField) {
                targetField.focus();
            }
            
            const currentValue = targetField.value;
            
            // CAS NORMAL : Insertion d'une lettre
            if (!isDeletion) {
                // Ajouter à la fin
                targetField.value = currentValue + letter;
                
                setTimeout(() => {
                    if (targetField) {
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
            // CAS SUPPRESSION : Effacer la dernière lettre
            else {
                // Vérifier qu'il y a quelque chose à supprimer
                if (currentValue.length > 0) {
                    // Supprimer la dernière lettre
                    targetField.value = currentValue.substring(0, currentValue.length - 1);
                    
                    setTimeout(() => {
                        if (targetField) {
                            targetField.focus();
                            activeField = targetField;
                            lastActiveField = targetField;
                        }
                    }, 10);
                    
                    // REVENIR AU NIVEAU PRÉCÉDENT (si pas déjà au niveau 1)
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
                        
                        showNotification(`↩️ Lettre supprimée - Retour au niveau ${currentLevel}`, 'info');
                    } else {
                        showNotification('Lettre supprimée (déjà au niveau minimum)', 'info');
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
    
    // Contrôles (SANS "FORCER LE FOCUS")
    const controlsContainer = document.createElement('div');
    controlsContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 15px;
        margin: 20px 0;
        flex-wrap: wrap;
    `;
    
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
    
    // BOUTON SUPPRESSION
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
            // Animation du bouton
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
        
        // Vider le champ
        const nameField = document.getElementById('name');
        if (nameField) {
            nameField.value = '';
        }
        
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        createLevel(currentLevel);
        updateLevelDisplay();
        animateLetters();
        
        if (nameField) {
            setTimeout(() => {
                nameField.focus();
                activeField = nameField;
                lastActiveField = nameField;
                updateFieldStyle(nameField, true);
            }, 100);
        }
        
        showNotification('Jeu réinitialisé ! Champ vidé.', 'info');
    });
    
  // BOUTON VALIDER
    const validateButton = document.createElement('button');
    validateButton.textContent = '✅ Valider le formulaire';
    validateButton.style.cssText = `
        padding: 12px 24px;
        background: linear-gradient(90deg, #48bb78, #38a169);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s;
    `;

    validateButton.addEventListener('click', function() {
        const nameField = document.getElementById('name');
        
        if (nameField && nameField.value.trim() !== '') {
            // Afficher notification
            showNotification('Envoi en cours...', 'success');
            
            // Créer formulaire caché
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'enregistrer.php';
            form.style.display = 'none';
            
            const inputNom = document.createElement('input');
            inputNom.type = 'hidden';
            inputNom.name = 'nom_ordinateur';
            inputNom.value = nameField.value;
            
            const inputNiveau = document.createElement('input');
            inputNiveau.type = 'hidden';
            inputNiveau.name = 'niveau_actuel';
            inputNiveau.value = currentLevel;
            
            form.appendChild(inputNom);
            form.appendChild(inputNiveau);
            document.body.appendChild(form);
            
            // Soumettre le formulaire
            form.submit();
            
        } else {
            showNotification('❌ Le champ "Nom" est vide !', 'error');
        }
    });
    
    // AJOUTER LES BOUTONS (SANS "FORCER LE FOCUS")
    controlsContainer.appendChild(toggleButton);
    controlsContainer.appendChild(deleteButton);
    controlsContainer.appendChild(resetButton);
    controlsContainer.appendChild(validateButton);
    lettersContainer.insertAdjacentElement('afterend', controlsContainer);
    
    // Instructions (MISE À JOUR SANS "FORCER LE FOCUS")
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
            🎮 MODE DE JEU - CHAMP AUTO-ACTIVÉ
        </strong>
        
        <div style="text-align: left; display: inline-block;">
            <div style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 6px; border-left: 4px solid #4299e1;">
                <strong style="color: #4299e1;">1. ÉCRITURE :</strong> Cliquez sur les lettres → elles s'ajoutent automatiquement (+1 niveau)
            </div>
            
            <div style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 6px; border-left: 4px solid #ed8936;">
                <strong style="color: #ed8936;">2. SUPPRESSION :</strong> <button style="padding: 4px 8px; background: #ed8936; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">⌫ Supprimer lettre</button> → -1 niveau
            </div>
            
            <div style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 6px; border-left: 4px solid #48bb78;">
                <strong style="color: #48bb78;">3. VALIDATION :</strong> <button style="padding: 4px 8px; background: #48bb78; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">✅ Valider le formulaire</button>
            </div>
            
            <div style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 6px; border-left: 4px solid #f56565;">
                <strong style="color: #f56565;">4. RECOMMENCER :</strong> <button style="padding: 4px 8px; background: #f56565; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">🔄 Recommencer</button> pour tout effacer
            </div>
            
            <div style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 6px; border-left: 4px solid #4a5568;">
                <strong style="color: #4a5568;">5. PAUSE :</strong> <button style="padding: 4px 8px; background: #4a5568; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">⏸️ Pause</button> pour geler l'animation
            </div>
            
            <div style="margin-top: 15px; padding: 12px; background: #fff5f5; border-radius: 6px; border-left: 4px solid #ff0000;">
                <strong>💡 ASTUCE :</strong> Le champ est activé automatiquement. Commencez directement à cliquer sur les lettres !
            </div>
        </div>
    `;
    
    controlsContainer.insertAdjacentElement('afterend', instructions);
    
    // AUTO-FOCUS au démarrage et notification
    setTimeout(() => {
        const nameField = document.getElementById('name');
        if (nameField) {
            nameField.focus();
            activeField = nameField;
            lastActiveField = nameField;
            updateFieldStyle(nameField, true);
            updateLevelDisplay();
            showNotification('Prêt ! Champ "Nom" auto-activé. Cliquez sur les lettres.', 'info');
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
