

const story = {
    "start": {
        id: "start",
        bg: "#2c3e50",
        character: "💻",
        name: "Vieux PC",
        text: "Oh non... J'entends le proviseur dire : 'Ce PC ne supporte pas Windows 11, il faut le jeter.' Je ne veux pas finir à la poubelle !",
        choices: [
            {
                text: "Essayer de s'allumer pour montrer que je fonctionne encore",
                next: "scene1",
                effect: { autonomy: +10 }
            },
            {
                text: "Tenter une mise à jour désespérée de Windows",
                next: "bad_end2",  // NOUVELLE FIN TRAGIQUE
                effect: { autonomy: -10 }
            },
            {
                text: "Rester éteint et accepter le destin",
                next: "bad_end1"
            }
        ]
    },
    "scene1": {
        id: "scene1",
        bg: "#34495e",
        character: "👨‍🎓",
        name: "Léo, élève curieux",
        text: "Tiens ! L'ordinateur s'est allumé tout seul ! Il affiche une vieille photo de notre classe... Il a encore de la vie !",
        choices: [
            {
                text: "Afficher un message : 'Sauvez-moi ! Je peux encore servir !'",
                next: "scene2",
                effect: { inclusion: +10 }
            },
            {
                text: "Montrer un écran d'erreur pour faire pitié",
                next: "scene2",
                effect: { inclusion: +5 }
            },
            {
                text: "Afficher une pub pour Windows 12 (trahison !)",
                next: "bad_end3",  // NOUVELLE FIN TRAGIQUE
                effect: { autonomy: -20, inclusion: -10 }
            }
        ]
    },
    "scene2": {
        id: "scene2",
        bg: "#1a5276",
        character: "💻",
        name: "Vieux PC",
        text: "Léo a appelé le technicien. Il m'examine... Que va-t-il décider ?",
        choices: [
            {
                text: "Proposer d'installer Linux pour me donner une seconde vie",
                next: "scene3",
                effect: { autonomy: +15, durability: +10 }
            },
            {
                text: "Dire qu'on peut me reconditionner pour un usage simple",
                next: "scene3",
                effect: { durability: +15, inclusion: +5 }
            },
            {
                text: "Suggérer de me démonter pour pièces détachées",
                next: "scene3",
                effect: { durability: +10 }
            },
            {
                text: "Proposer de m'utiliser comme presse-papier décoratif",
                next: "bad_end4",  // NOUVELLE FIN TRAGIQUE
                effect: { autonomy: -15, durability: -10 }
            }
        ]
    },
    "scene3": {
        id: "scene3",
        bg: "#1a5276",
        character: "👩‍🏫",
        name: "Mme Dubois, enseignante",
        text: "Linux ? Mais les élèves sauront-ils l'utiliser ? Et les logiciels pédagogiques ?",
        choices: [
            {
                text: "Montrer la suite LibreOffice et des logiciels éducatifs libres",
                next: "scene4",
                effect: { inclusion: +15, autonomy: +10 }
            },
            {
                text: "Proposer une formation découverte du logiciel libre",
                next: "scene4",
                effect: { inclusion: +20 }
            },
            {
                text: "Dire qu'on peut garder Windows sur d'autres machines",
                next: "scene4",
                effect: { autonomy: +5 }
            },
            {
                text: "Prétendre que Linux est trop compliqué et abandonner",
                next: "bad_end5",  // NOUVELLE FIN TRAGIQUE
                effect: { autonomy: -20, inclusion: -15 }
            }
        ]
    },
    "scene4": {
        id: "scene4",
        bg: "#7d3c98",
        character: "💻",
        name: "Vieux PC",
        text: "Réunion décisive chez le proviseur. Monsieur Obsolescence est là : 'Jetez-le et achetez du neuf ! C'est plus simple !'",
        choices: [
            {
                text: "Calculer les économies : reconditionnement = 500€ économisés",
                next: "final",
                effect: { durability: +15, inclusion: +10 }
            },
            {
                text: "Montrer l'impact écologique : recycler = 300kg de CO2 évités",
                next: "final",
                effect: { durability: +20 }
            },
            {
                text: "Faire témoigner Léo : 'Ce PC a toute notre histoire !'",
                next: "final",
                effect: { inclusion: +20, autonomy: +10 }
            },
            {
                text: "Accepter l'offre de Monsieur Obsolescence pour un rachat symbolique",
                next: "bad_end6",  // NOUVELLE FIN TRAGIQUE
                effect: { autonomy: -25, durability: -20, inclusion: -15 }
            }
        ]
    },
    "final": {
        id: "final",
        bg: "#27ae60",
        character: "💻",
        name: "Vieux PC",
        text: "Victoire ! Le proviseur a décidé de m'adopter et même d'étendre la démarche à tout l'établissement ! L'école devient un Village Numérique Résistant labellisé NIRD !",
        choices: [],
        isEnd: true,
        endTitle: "🎉 FÉLICITATIONS ! 🎉",
        endText: "Vous avez sauvé le PC ET transformé l'école !<br><br>Grâce à vos choix, l'établissement adopte :<br>✅ Linux et les logiciels libres<br>✅ Le reconditionnement de matériel<br>✅ La sobriété numérique<br>✅ Le partage des solutions<br><br>Vous êtes un véritable Résistant du Numérique !"
    },

    // ============================
    // FINS TRAGIQUES
    // ============================
    
    // Fin 1 : Recyclage (existante)
    "bad_end1": {
        id: "bad_end1",
        bg: "#c0392b",
        character: "💻",
        name: "Vieux PC",
        text: "Vous finissez dans un carton, direction la déchetterie... Mais attendez ! Un employé vous repère et vous envoie au recyclage. Vos composants serviront peut-être à d'autres machines...",
        choices: [],
        isEnd: true,
        endTitle: "♻️ FIN DE RECYCLAGE ♻️",
        endText: "Ce n'est pas la meilleure fin, mais c'est mieux que la poubelle !<br><br>Rappel NIRD : Le recyclage est important, mais le <strong>réemploi</strong> est encore mieux !<br><br>Visitez le site NIRD pour apprendre à reconditionner."
    },
    
    // Fin 2 : BRICKÉ PAR WINDOWS (nouvelle)
    "bad_end2": {
        id: "bad_end2",
        bg: "#8b0000",
        character: "💻",
        name: "Vieux PC",
        text: "La mise à jour Windows a échoué... Écran bleu ! Vous êtes maintenant complètement inutilisable. Même le recyclage sera difficile.",
        choices: [],
        isEnd: true,
        endTitle: "💀 BRICKÉ PAR WINDOWS 💀",
        endText: "L'obsolescence programmée a frappé !<br><br>Leçon NIRD : Les mises à jour forcées de Windows peuvent rendre le matériel inutilisable.<br>Les logiciels libres comme Linux respectent votre matériel plus longtemps."
    },
    
    // Fin 3 : TRAHISON (nouvelle)
    "bad_end3": {
        id: "bad_end3",
        bg: "#ff4500",
        character: "💻",
        name: "Vieux PC",
        text: "Léo est furieux ! 'Tu affiches des pubs pour Windows alors que tu es en train de mourir à cause d'eux ?' Il vous éteint définitivement.",
        choices: [],
        isEnd: true,
        endTitle: "🤖 TRAHISON NUMÉRIQUE 🤖",
        endText: "Vous avez choisi le camp de l'obsolescence programmée...<br><br>Leçon NIRD : Rester fidèle aux GAFAM, c'est accepter d'être jeté quand vous ne rapportez plus.<br>La résistance numérique commence par le choix des logiciels libres."
    },
    
    // Fin 4 : PRESSE-PAPIER (nouvelle)
    "bad_end4": {
        id: "bad_end4",
        bg: "#696969",
        character: "💻",
        name: "Vieux PC",
        text: "Vous finissez sur une étagère, recouvert de plantes vertes. 'C'est décoratif !' dit le proviseur. Votre processeur pleure en silence.",
        choices: [],
        isEnd: true,
        endTitle: "🪴 FIN DÉCORATIVE 🪴",
        endText: "Mieux vaut servir à quelque chose... même si c'est comme presse-papier ?<br><br>Leçon NIRD : Un ordinateur fonctionnel ne devrait jamais finir comme décoration.<br>Avec Linux, même un vieux PC peut retrouver une utilité réelle."
    },
    
    // Fin 5 : ABANDON (nouvelle)
    "bad_end5": {
        id: "bad_end5",
        bg: "#4b0082",
        character: "💻",
        name: "Vieux PC",
        text: "L'enseignante abandonne : 'C'est trop compliqué.' Vous retournez dans le placard, condamné à l'oubli jusqu'à la prochaine purge.",
        choices: [],
        isEnd: true,
        endTitle: "🚪 FIN DANS LE PLACARD 🚪",
        endText: "La peur du changement a eu raison de votre salut...<br><br>Leçon NIRD : Linux n'est pas plus compliqué, juste différent.<br>La communauté NIRD propose justement des formations pour faciliter la transition."
    },
    
    // Fin 6 : RACHAT SYMBOLIQUE (nouvelle)
    "bad_end6": {
        id: "bad_end6",
        bg: "#ff0000",
        character: "💰",
        name: "Monsieur Obsolescence",
        text: "Félicitations ! Vous avez accepté 50€ de rachat. Vous partez dans un camion rempli d'autres PC sacrifiés... vers une destination inconnue.",
        choices: [],
        isEnd: true,
        endTitle: "💸 VENDU À L'ENNEMI 💸",
        endText: "Vous avez cédé à l'appât du gain immédiat...<br><br>Leçon NIRD : Le coût réel n'est pas seulement financier.<br>500€ économisés en reconditionnant VS 50€ de rachat + 300kg de CO2 + dépendance continue."
    },
    
    // ============================
    // SCÈNE BONUS SI SCORE ÉLEVÉ
    // ============================
    "scene_bonus": {
        id: "scene_bonus",
        bg: "#00bfff",
        character: "🏆",
        name: "PC Super Résistant",
        text: "Incroyable ! Vos choix ont tellement impressionné que l'académie entière veut copier le modèle NIRD ! Vous devenez l'ambassadeur numérique du département !",
        choices: [],
        isEnd: true,
        endTitle: "🏆 FIN ULTIME - HÉROS NUMÉRIQUE 🏆",
        endText: "FÉLICITATIONS ! Vous avez atteint le score maximum !<br><br>Votre établissement est maintenant un modèle NIRD reconnu nationalement.<br>✅ Tous les PC sont reconditionnés avec Linux<br>✅ 0 dépendance aux GAFAM<br>✅ Économie annuelle : 15 000€<br>✅ Émissions CO2 évitées : 2 tonnes<br><br>Vous êtes le champion de la résistance numérique !"
    }
};

// ============================
// ÉTAT DU JEU
// ============================
let gameState = {
    currentSceneId: "start",
    previousScenes: [],
    stats: { autonomy: 30, durability: 30, inclusion: 30 }
};

// ============================
// FONCTIONS GLOBALES
// ============================

function startGame() {
    console.log("🎮 Début du jeu !");
    
    const titleScreen = document.getElementById('title-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    
    if (titleScreen) titleScreen.classList.add('hidden');
    if (gameScreen) gameScreen.classList.remove('hidden');
    if (endScreen) endScreen.classList.add('hidden');
    
    gameState = {
        currentSceneId: "start",
        previousScenes: [],
        stats: { autonomy: 30, durability: 30, inclusion: 30 }
    };
    
    updateStatsDisplay();
    loadScene("start");
}

function restartGame() {
   console.log("🔄 Retour à l'écran titre");
    
    // Cacher l'écran de fin
    document.getElementById('end-screen').classList.add('hidden');
    
    // Cacher l'écran de jeu
    document.getElementById('game-screen').classList.add('hidden');
    
    // Afficher l'écran titre
    document.getElementById('title-screen').classList.remove('hidden');
    
    // Réinitialiser les statistiques (optionnel)
    document.getElementById('autonomy').value = 30;
    document.getElementById('durability').value = 30;
    document.getElementById('inclusion').value = 30;
}

// ============================
// FONCTIONS DU JEU
// ============================

function loadScene(sceneId) {
    console.log("📖 Chargement scène:", sceneId);
    
    // Vérifier si le score est assez élevé pour la scène bonus
    if (sceneId === "final") {
        const totalScore = gameState.stats.autonomy + gameState.stats.durability + gameState.stats.inclusion;
        if (totalScore >= 250) {
            sceneId = "scene_bonus";
        }
    }
    
    const scene = story[sceneId];
    if (!scene) {
        console.error("Scène non trouvée:", sceneId);
        return;
    }
    
    gameState.currentSceneId = sceneId;
    gameState.previousScenes.push(sceneId);
    
    const background = document.getElementById('background');
    const character = document.getElementById('character');
    const characterName = document.getElementById('character-name');
    const dialogText = document.getElementById('dialog-text');
    const choicesContainer = document.getElementById('choices-container');
    const backBtn = document.getElementById('back-btn');
    
    if (background) background.style.background = scene.bg;
    if (character) character.textContent = scene.character;
    if (characterName) characterName.textContent = scene.name;
    if (dialogText) dialogText.textContent = scene.text;
    
    if (choicesContainer) {
        choicesContainer.innerHTML = '';
        
        if (scene.choices && scene.choices.length > 0) {
            scene.choices.forEach(choice => {
                const button = document.createElement('button');
                button.className = 'choice-btn';
                button.textContent = choice.text;
                button.onclick = () => makeChoice(choice);
                choicesContainer.appendChild(button);
            });
            
            if (backBtn) {
                backBtn.style.display = gameState.previousScenes.length > 1 ? 'block' : 'none';
            }
        } else {
            if (backBtn) backBtn.style.display = 'none';
            
            if (scene.isEnd) {
                setTimeout(() => showEndScreen(scene), 7000);
            }
        }
    }
    
    if (scene.effect) {
        applyEffect(scene.effect);
    }
    
    adjustCharacterSize();
    
    // Vérifier si une statistique tombe à 0 (fin tragique immédiate)
    if (gameState.stats.autonomy <= 0 || gameState.stats.durability <= 0 || gameState.stats.inclusion <= 0) {
        setTimeout(() => showZeroStatEnd(), 1000);
    }
}

function makeChoice(choice) {
    console.log("✅ Choix fait:", choice.text);
    
    gameState.previousScenes.push(gameState.currentSceneId);
    
    if (choice.effect) {
        applyEffect(choice.effect);
    }
    
    loadScene(choice.next);
}

function applyEffect(effect) {
    if (effect.autonomy) {
        gameState.stats.autonomy = Math.min(100, Math.max(-20, gameState.stats.autonomy + effect.autonomy));
    }
    if (effect.durability) {
        gameState.stats.durability = Math.min(100, Math.max(-20, gameState.stats.durability + effect.durability));
    }
    if (effect.inclusion) {
        gameState.stats.inclusion = Math.min(100, Math.max(-20, gameState.stats.inclusion + effect.inclusion));
    }
    
    updateStatsDisplay();
}

function updateStatsDisplay() {
    const autonomyBar = document.getElementById('autonomy');
    const durabilityBar = document.getElementById('durability');
    const inclusionBar = document.getElementById('inclusion');
    
    if (autonomyBar) autonomyBar.value = gameState.stats.autonomy;
    if (durabilityBar) durabilityBar.value = gameState.stats.durability;
    if (inclusionBar) inclusionBar.value = gameState.stats.inclusion;
}

function adjustCharacterSize() {
    const character = document.getElementById('character');
    const gameContainer = document.getElementById('game-container');
    
    if (!character || !gameContainer) return;
    
    const containerHeight = gameContainer.clientHeight;
    
    if (containerHeight < 500) {
        character.style.width = '80px';
        character.style.height = '80px';
        character.style.fontSize = '3rem';
        character.style.bottom = '30%';
    } else if (containerHeight < 600) {
        character.style.width = '100px';
        character.style.height = '100px';
        character.style.fontSize = '4rem';
        character.style.bottom = '35%';
    } else {
        character.style.width = '150px';
        character.style.height = '150px';
        character.style.fontSize = '6rem';
        character.style.bottom = '40%';
    }
}

function showZeroStatEnd() {
    let reason = "";
    if (gameState.stats.autonomy <= 0) reason = "Autonomie";
    else if (gameState.stats.durability <= 0) reason = "Durabilité";
    else reason = "Inclusion";
    
    const zeroEnd = {
        endTitle: `⚠️ ${reason} NUL(E) ⚠️`,
        endText: `Votre ${reason.toLowerCase()} est tombée à zéro !<br><br>
                 Sans ${reason.toLowerCase()}, la résistance numérique est impossible.<br>
                 Leçon NIRD : Les trois piliers (Autonomie, Durabilité, Inclusion) sont indispensables.<br>
                 Recommencez et équilibrez mieux vos choix !`
    };
    
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    const endTitle = document.getElementById('end-title');
    const endContent = document.getElementById('end-content');
    
    if (gameScreen) gameScreen.classList.add('hidden');
    if (endScreen) endScreen.classList.remove('hidden');
    if (endTitle) endTitle.textContent = zeroEnd.endTitle;
    if (endContent) endContent.innerHTML = zeroEnd.endText;
}

function showEndScreen(scene) {
    console.log("🏁 Fin du jeu:", scene.endTitle);
    
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    const endTitle = document.getElementById('end-title');
    const endContent = document.getElementById('end-content');
    
    if (gameScreen) gameScreen.classList.add('hidden');
    if (endScreen) endScreen.classList.remove('hidden');
    if (endTitle) endTitle.textContent = scene.endTitle;
    if (endContent) {
        const totalScore = gameState.stats.autonomy + gameState.stats.durability + gameState.stats.inclusion;
        const grade = getGrade(totalScore);
        
        endContent.innerHTML = `
            ${scene.endText}
            <div style="margin: 15px 0; padding: 12px; background: rgba(0,255,204,0.1); border-radius: 8px;">
                <h3 style="margin-bottom: 8px;">Votre score NIRD : ${totalScore}/300</h3>
                <h4 style="color: #ffcc00; margin-bottom: 10px;">${grade}</h4>
                <p style="margin: 4px 0;">Autonomie : ${gameState.stats.autonomy}/100</p>
                <p style="margin: 4px 0;">Durabilité : ${gameState.stats.durability}/100</p>
                <p style="margin: 4px 0;">Inclusion : ${gameState.stats.inclusion}/100</p>
            </div>
            <p style="margin-top: 15px; font-style: italic;">
                ${getEndingComment(totalScore)}
            </p>
        `;
    }
}

// ============================
// FONCTIONS POUR LES NOTES ET COMMENTAIRES
// ============================

function getGrade(score) {
    if (score >= 280) return "🏆 Niveau : Expert NIRD";
    if (score >= 250) return "⭐ Niveau : Résistant confirmé";
    if (score >= 200) return "👍 Niveau : Bon élève";
    if (score >= 150) return "📚 Niveau : Débutant";
    if (score >= 100) return "⚠️ Niveau : À risque";
    if (score >= 50) return "❌ Niveau : Dépendant numérique";
    return "💀 Niveau : Catastrophe écologique";
}

function getEndingComment(score) {
    if (score >= 250) return "Vous avez parfaitement compris l'esprit NIRD ! Partagez vos connaissances !";
    if (score >= 200) return "Bonne compréhension des enjeux, mais il reste des progrès à faire.";
    if (score >= 150) return "Vous commencez à saisir les concepts, continuez à vous informer !";
    if (score >= 100) return "Attention, vous êtes encore trop dépendant des grandes entreprises.";
    if (score >= 50) return "La prise de conscience est faible, visitez le site NIRD pour en savoir plus.";
    return "Vos choix aggravent la situation... Il est urgent de changer !";
}

// ============================
// INITIALISATION
// ============================

document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM chargé - Jeu prêt !");
    
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            if (gameState.previousScenes.length > 1) {
                gameState.previousScenes.pop();
                const previousSceneId = gameState.previousScenes.pop();
                loadScene(previousSceneId);
            }
        });
    }
    
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }
    
    window.addEventListener('resize', adjustCharacterSize);
});

console.log("🎮 'Sauve-Moi – L'Odyssée d'un PC Résistant' chargé");
console.log("🚀 Nuit de l'Info 2025 - Sujet NIRD");
