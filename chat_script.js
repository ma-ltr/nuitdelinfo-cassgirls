// script.js

// Variables globales
let selectedActions = [];
let userSequence = [];
let patience = 100;
let attempts = 3;
let currentUser = null;

// Animation du chat sur la page d'accueil
document.addEventListener('DOMContentLoaded', function() {
    // Page d'accueil
    const mainCat = document.getElementById('main-cat');
    const catSpeech = document.getElementById('cat-speech');
    
    if (mainCat && catSpeech) {
        const messages = [
            "Miaou ! Je suis le gardien de cette application. Pour entrer, il faudra d'abord me satisfaire !",
            "Ronron... J'aime les câlins, mais seulement dans le bon ordre !",
            "Psst... N'oubliez pas votre séquence, les chats ont la mémoire longue !",
            "Vous avez du poisson ? Non ? Alors contentez-moi autrement !"
        ];
        
        let messageIndex = 0;
        setInterval(() => {
            catSpeech.textContent = messages[messageIndex];
            messageIndex = (messageIndex + 1) % messages.length;
            
            // Animation du chat
            mainCat.style.animation = 'none';
            setTimeout(() => {
                mainCat.style.animation = 'float 3s ease-in-out infinite';
            }, 10);
        }, 5000);
    }
    
    // Page d'inscription
    const actionCards = document.querySelectorAll('.action-card');
    const selectedList = document.getElementById('selected-list');
    const clearOrderBtn = document.getElementById('clear-order');
    const testOrderBtn = document.getElementById('test-order');
    const inscriptionForm = document.getElementById('inscription-form');
    const catMood = document.getElementById('cat-mood');
    
    // Gestion des cartes d'action
    if (actionCards) {
        actionCards.forEach(card => {
            const btn = card.querySelector('.btn-select');
            if (btn) {
                btn.addEventListener('click', function() {
                    const action = card.dataset.action;
                    
                    if (selectedActions.length < 3) {
                        if (!selectedActions.includes(action)) {
                            selectedActions.push(action);
                            updateSelectedList();
                            updateCatMood();
                            
                            // Animation de la carte
                            card.classList.add('selected');
                            card.style.transform = 'scale(1.05)';
                            setTimeout(() => {
                                card.style.transform = 'scale(1)';
                            }, 200);
                        } else {
                            showNotification("Action déjà sélectionnée !", "error");
                        }
                    } else {
                        showNotification("Maximum 3 actions !", "error");
                    }
                });
            }
        });
    }
    
    // Effacer l'ordre
    if (clearOrderBtn) {
        clearOrderBtn.addEventListener('click', function() {
            selectedActions = [];
            updateSelectedList();
            updateCatMood();
            showNotification("Ordre effacé !", "success");
        });
    }
    
    // Tester l'ordre
    if (testOrderBtn) {
        testOrderBtn.addEventListener('click', function() {
            if (selectedActions.length === 3) {
                showNotification(`Test : ${selectedActions.join(' → ')}`, "success");
                updateCatMood('happy');
            } else {
                showNotification("Sélectionnez 3 actions d'abord !", "error");
            }
        });
    }
    
    // Soumission du formulaire d'inscription
    if (inscriptionForm) {
        inscriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (selectedActions.length !== 3) {
                showNotification("Veuillez sélectionner exactement 3 actions !", "error");
                return;
            }
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            
            // Simuler l'enregistrement (à remplacer par un appel API réel)
            const userData = {
                username,
                email,
                sequence: selectedActions,
                createdAt: new Date().toISOString()
            };
            
            // Stocker localement pour la démo
            localStorage.setItem('chat_user_' + username, JSON.stringify(userData));
            localStorage.setItem('current_user', username);
            
            showNotification(`Compte créé pour ${username} !`, "success");
            
            // Animation de réussite
            const cat = document.getElementById('inscription-cat');
            cat.style.transform = 'rotate(360deg)';
            cat.style.transition = 'transform 1s';
            
            setTimeout(() => {
                alert(`Inscription réussie !\n\nVotre séquence : ${selectedActions.join(' → ')}\n\nN'oubliez pas cet ordre pour vous connecter !`);
                window.location.href = 'index.html';
            }, 1000);
        });
    }
    
    // Page de connexion
    const loginForm = document.getElementById('login-form');
    const gameSection = document.getElementById('game-section');
    const successSection = document.getElementById('success-section');
    const failureSection = document.getElementById('failure-section');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('login-username').value;
            const userData = JSON.parse(localStorage.getItem('chat_user_' + username));
            
            if (userData) {
                currentUser = userData;
                startGame(userData);
            } else {
                showNotification("Utilisateur non trouvé !", "error");
            }
        });
    }
    
    // Gestion des boutons du jeu
    document.addEventListener('click', function(e) {
        // Boutons d'action
        if (e.target.classList.contains('action-btn')) {
            const action = e.target.dataset.action;
            userSequence.push(action);
            updateSequenceDisplay();
            updatePatience(-5);
        }
        
        // Valider la séquence
        if (e.target.id === 'validate-sequence') {
            validateSequence();
        }
        
        // Réinitialiser la séquence
        if (e.target.id === 'reset-sequence') {
            userSequence = [];
            updateSequenceDisplay();
            updatePatience(-10);
            showNotification("Séquence réinitialisée !", "warning");
        }
        
        // Réessayer après échec
        if (e.target.id === 'try-again') {
            attempts = 3;
            patience = 100;
            userSequence = [];
            document.getElementById('login-username').value = '';
            gameSection.style.display = 'none';
            successSection.style.display = 'none';
            failureSection.style.display = 'none';
            document.getElementById('login-form').reset();
        }
        
        // Aller au tableau de bord
        if (e.target.id === 'go-to-dashboard') {
            alert("Bienvenue dans l'application ! (Ceci est une démo)");
            window.location.href = 'index.html';
        }
    });
});

// Fonctions utilitaires
function updateSelectedList() {
    const selectedList = document.getElementById('selected-list');
    if (!selectedList) return;
    
    if (selectedActions.length === 0) {
        selectedList.innerHTML = '<p class="empty-message">Aucune action sélectionnée</p>';
        return;
    }
    
    selectedList.innerHTML = '';
    selectedActions.forEach((action, index) => {
        const tag = document.createElement('div');
        tag.className = 'action-tag';
        tag.innerHTML = `
            <span class="order">${index + 1}</span>
            ${getActionIcon(action)} ${action}
        `;
        selectedList.appendChild(tag);
    });
}

function updateCatMood(mood = 'neutral') {
    const catMood = document.getElementById('cat-mood');
    if (!catMood) return;
    
    const messages = {
        neutral: [
            "Hmm... montre-moi ce que tu as...",
            "Je m'ennuie un peu là...",
            "Tu as du poisson peut-être ?"
        ],
        happy: [
            "Ronron... J'aime cet ordre !",
            "Miaou ! Ça me plaît !",
            "Continue comme ça !"
        ],
        bored: [
            "Miaou... c'est long...",
            "Je commence à m'impatienter !",
            "Dépêche-toi un peu !"
        ]
    };
    
    const randomMsg = messages[mood][Math.floor(Math.random() * messages[mood].length)];
    catMood.innerHTML = `<p><i class="fas fa-${mood === 'happy' ? 'smile' : 'meh'}"></i> ${randomMsg}</p>`;
}

function getActionIcon(action) {
    const icons = {
        'câlin': '❤️',
        'nourriture': '🐟',
        'jeu': '🎾',
        'dodo': '🛏️',
        'griffoir': '🌳',
        'observatoire': '🪟'
    };
    return icons[action] || '🐾';
}

function showNotification(message, type = 'info') {
    // Créer une notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    // Style de la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#fff3cd'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#856404'};
        border: 2px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#ffeaa7'};
        border-radius: 15px;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Ajouter les animations CSS pour les notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Fonctions du jeu
function startGame(userData) {
    document.getElementById('game-section').style.display = 'block';
    document.getElementById('greeting').textContent = `Bonjour ${userData.username} !`;
    
    // Afficher les boutons d'action
    const actionsButtons = document.getElementById('actions-buttons');
    actionsButtons.innerHTML = '';
    
    const allActions = ['câlin', 'nourriture', 'jeu', 'dodo', 'griffoir', 'observatoire'];
    allActions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.dataset.action = action;
        btn.innerHTML = `
            <i class="${getActionClass(action)} fa-2x"></i>
            <br>
            <span>${action}</span>
        `;
        actionsButtons.appendChild(btn);
    });
    
    // Réinitialiser le jeu
    userSequence = [];
    patience = 100;
    attempts = 3;
    updatePatience(0);
    updateAttempts();
    updateSequenceDisplay();
    
    // Message initial du chat
    const messages = [
        "Miaou ! Tu es enfin là !",
        "Bon... contente-moi maintenant !",
        "Je sais ce que j'aime, tu te souviens ?",
        "Attention, je n'ai pas toute la journée !"
    ];
    document.getElementById('game-speech').textContent = 
        messages[Math.floor(Math.random() * messages.length)];
}

function getActionClass(action) {
    const classes = {
        'câlin': 'fas fa-heart',
        'nourriture': 'fas fa-fish',
        'jeu': 'fas fa-basketball',
        'dodo': 'fas fa-bed',
        'griffoir': 'fas fa-tree',
        'observatoire': 'fas fa-window-maximize'
    };
    return classes[action] || 'fas fa-paw';
}

function updateSequenceDisplay() {
    const sequenceList = document.getElementById('sequence-list');
    sequenceList.innerHTML = '';
    
    if (userSequence.length === 0) {
        sequenceList.innerHTML = '<p class="empty">Aucune action encore</p>';
        return;
    }
    
    userSequence.forEach((action, index) => {
        const item = document.createElement('div');
        item.className = 'sequence-item';
        item.innerHTML = `
            <span style="opacity: 0.7">${index + 1}.</span>
            ${getActionIcon(action)} ${action}
        `;
        sequenceList.appendChild(item);
    });
}

function updatePatience(change) {
    patience = Math.max(0, Math.min(100, patience + change));
    
    const meter = document.getElementById('patience-meter');
    const text = document.getElementById('patience-text');
    
    if (meter && text) {
        meter.style.width = `${patience}%`;
        text.textContent = `${patience}%`;
        
        // Changer la couleur en fonction de la patience
        if (patience > 60) {
            meter.style.background = 'linear-gradient(90deg, #20bf6b, #ff9f1a)';
        } else if (patience > 30) {
            meter.style.background = 'linear-gradient(90deg, #ff9f1a, #ff5e62)';
        } else {
            meter.style.background = '#ff5e62';
        }
    }
    
    // Mettre à jour le message du chat
    const speech = document.getElementById('game-speech');
    if (speech) {
        if (patience < 30) {
            speech.textContent = "GRRR ! Tu m'énerves !";
            document.getElementById('game-cat').style.background = 'linear-gradient(45deg, #ff4757, #ff3838)';
        } else if (patience < 60) {
            speech.textContent = "Miaou... je commence à m'impatienter...";
            document.getElementById('game-cat').style.background = 'linear-gradient(45deg, #ff9966, #ff5e62)';
        } else {
            speech.textContent = "Miaou ? Continue comme ça !";
            document.getElementById('game-cat').style.background = 'linear-gradient(45deg, #ff9966, #ff5e62)';
        }
    }
}

function updateAttempts() {
    document.getElementById('attempts-count').textContent = attempts;
}

function validateSequence() {
    if (!currentUser) return;
    
    const correctSequence = currentUser.sequence;
    
    // Vérifier la séquence
    let correct = true;
    for (let i = 0; i < Math.min(userSequence.length, correctSequence.length); i++) {
        if (userSequence[i] !== correctSequence[i]) {
            correct = false;
            break;
        }
    }
    
    // Vérifier aussi la longueur
    if (userSequence.length !== correctSequence.length) {
        correct = false;
    }
    
    const feedback = document.getElementById('game-feedback');
    
    if (correct) {
        // Victoire !
        feedback.className = 'game-feedback success';
        feedback.innerHTML = `
            <i class="fas fa-trophy"></i>
            <h3>Félicitations ! 🎉</h3>
            <p>Le chat est ravi ! Vous avez trouvé la bonne séquence :</p>
            <p><strong>${correctSequence.join(' → ')}</strong></p>
            <p>Connexion réussie !</p>
        `;
        
        // Animation de victoire
        const cat = document.getElementById('game-cat');
        cat.style.animation = 'float 1s ease-in-out infinite';
        
        // Afficher la section succès
        setTimeout(() => {
            document.getElementById('game-section').style.display = 'none';
            document.getElementById('success-section').style.display = 'block';
            document.getElementById('success-message').textContent = 
                `Bienvenue ${currentUser.username} ! Le chat est content et vous laisse entrer.`;
        }, 2000);
        
    } else {
        // Échec
        attempts--;
        updateAttempts();
        
        feedback.className = 'game-feedback error';
        feedback.innerHTML = `
            <i class="fas fa-times-circle"></i>
            <h3>Mauvaise séquence ! 😾</h3>
            <p>Le chat n'est pas content... Il reste ${attempts} tentative(s).</p>
        `;
        
        // Animation d'échec
        const cat = document.getElementById('game-cat');
        cat.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            cat.style.animation = '';
        }, 500);
        
        // Réinitialiser la séquence
        userSequence = [];
        updateSequenceDisplay();
        updatePatience(-20);
        
        // Vérifier si plus de tentatives
        if (attempts <= 0) {
            setTimeout(() => {
                document.getElementById('game-section').style.display = 'none';
                document.getElementById('failure-section').style.display = 'block';
            }, 1500);
        }
    }
}