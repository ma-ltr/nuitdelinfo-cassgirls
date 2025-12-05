// ================= CONFIGURATION DU JEU =================
const gameData = {
    currentScene: 0,
    autonomy: 30,
    durability: 30,
    inclusion: 30,
    history: [],
    choices: []
};

// ================= SCÈNES DU JEU =================
const scenes = [
    {
        id: 0,
        name: "PC Vieux mais Sage",
        text: "Salut jeune humain ! Je suis ton vieux PC. Ensemble depuis 8 ans, j'ai vu passer tes premiers devoirs, tes films, tes jeux... Mais aujourd'hui, je ralentis. La mise à jour vers Windows 11 m'a laissé sur le carreau. Que veux-tu faire ?",
        choices: [
            { text: "M'acheter un nouveau PC tout neuf !", nextScene: 1, effect: { autonomy: -10, durability: -10, inclusion: -5 } },
            { text: "Essayer de me réparer moi-même", nextScene: 2, effect: { autonomy: +5, durability: +10, inclusion: +0 } },
            { text: "Consulter un professionnel", nextScene: 3, effect: { autonomy: +0, durability: +5, inclusion: +5 } }
        ]
    },
    {
        id: 1,
        name: "Vendeur enthousiaste",
        text: "Excellent choix ! Ce nouveau PC a un processeur dernier cri, 16Go de RAM, et une carte graphique qui fait tourner tous les jeux. Seul petit détail : il coûte 1200€. Et ton vieux PC ? Direction la déchetterie !",
        choices: [
            { text: "Acheter quand même", nextScene: 4, effect: { autonomy: -20, durability: -15, inclusion: -20 } },
            { text: "Attendre les soldes", nextScene: 5, effect: { autonomy: -5, durability: -5, inclusion: -5 } },
            { text: "Refuser et reconsidérer", nextScene: 0, effect: { autonomy: +5, durability: +5, inclusion: +5 } }
        ]
    },
    {
        id: 2,
        name: "Atelier bricolage",
        text: "Tu ouvres mon boîtier. Poussière partout ! Un ventilateur ne tourne plus. Tu nettoies, changes la pâte thermique... Mais attention, sans connaissances, tu risques de casser quelque chose !",
        choices: [
            { text: "Continuer le nettoyage", nextScene: 6, effect: { autonomy: +10, durability: +15, inclusion: +10 } },
            { text: "Chercher un tutoriel en ligne", nextScene: 7, effect: { autonomy: +15, durability: +10, inclusion: +15 } },
            { text: "Abandonner et tout fermer", nextScene: 0, effect: { autonomy: -5, durability: -10, inclusion: -5 } }
        ]
    },
    {
        id: 3,
        name: "Réparateur professionnel",
        text: "Le technicien examine ton PC : 'La carte mère va bien, le processeur aussi. Par contre, il manque de RAM et le disque dur est vieillissant. Je peux te proposer une upgrade pour 150€.'",
        choices: [
            { text: "Accepter l'upgrade", nextScene: 8, effect: { autonomy: +20, durability: +25, inclusion: +20 } },
            { text: "Demander un devis plus détaillé", nextScene: 9, effect: { autonomy: +10, durability: +10, inclusion: +15 } },
            { text: "Trop cher, je réfléchis", nextScene: 0, effect: { autonomy: +0, durability: +0, inclusion: +0 } }
        ]
    },
    {
        id: 4,
        name: "Conséquence",
        text: "Nouveau PC acheté ! Tu es content mais... 1200€ en moins sur ton compte. Ton vieux PC finit à la déchetterie alors qu'il aurait pu servir. Impact écologique : 200kg de CO2 pour sa fabrication.",
        choices: [
            { text: "Continuer l'aventure", nextScene: 10, effect: { autonomy: -10, durability: -10, inclusion: -10 } }
        ]
    },
    {
        id: 5,
        name: "Patience",
        text: "Tu attends les soldes. En attendant, tu découvres que ton vieux PC peut encore servir avec Linux ! Tu installes Ubuntu et... il retrouve une seconde jeunesse !",
        choices: [
            { text: "Installer Linux", nextScene: 11, effect: { autonomy: +25, durability: +20, inclusion: +30 } },
            { text: "Attendre quand même les soldes", nextScene: 4, effect: { autonomy: -10, durability: -10, inclusion: -10 } }
        ]
    },
    {
        id: 6,
        name: "Nettoyage réussi",
        text: "Félicitations ! Tu as bien nettoyé ton PC. Il surchauffe moins et est plus silencieux. En fouillant, tu trouves même un slot RAM libre !",
        choices: [
            { text: "Ajouter de la RAM", nextScene: 12, effect: { autonomy: +20, durability: +15, inclusion: +15 } },
            { text: "Me contenter du nettoyage", nextScene: 13, effect: { autonomy: +10, durability: +10, inclusion: +5 } }
        ]
    },
    {
        id: 7,
        name: "Communauté en ligne",
        text: "Sur un forum, tu découvres la démarche NIRD (Numérique Inclusif, Responsable et Durable) ! Des passionnés t'expliquent comment upgrader ton PC pas à pas.",
        choices: [
            { text: "Suivre les conseils NIRD", nextScene: 14, effect: { autonomy: +30, durability: +25, inclusion: +35 } },
            { text: "Télécharger le guide complet", nextScene: 15, effect: { autonomy: +20, durability: +20, inclusion: +25 } }
        ]
    },
    {
        id: 8,
        name: "Upgrade professionnelle",
        text: "Le technicien ajoute 8Go de RAM et un SSD. Résultat : ton PC est 3x plus rapide ! Coût : 150€ au lieu de 1200€ pour un nouveau. Économie : 1050€ et 180kg de CO2 !",
        choices: [
            { text: "Découvrir la suite", nextScene: 16, effect: { autonomy: +25, durability: +30, inclusion: +25 } }
        ]
    },
    {
        id: 9,
        name: "Devis détaillé",
        text: "Le devis montre plusieurs options : SSD (50€), RAM (40€), nettoyage (30€), installation Linux (gratuit). Total : 120€ pour un PC comme neuf !",
        choices: [
            { text: "Accepter le package complet", nextScene: 8, effect: { autonomy: +25, durability: +30, inclusion: +25 } },
            { text: "Choisir seulement le SSD", nextScene: 17, effect: { autonomy: +15, durability: +10, inclusion: +10 } }
        ]
    },
    {
        id: 10,
        name: "Fin - Obsolescence acceptée",
        text: "Tu as choisi la consommation rapide. Ton ancien PC pollue maintenant une décharge. Le nouveau consommera plus d'énergie. Mais au moins, tu as la dernière technologie... pour quelques années.",
        end: true,
        title: "Fin : Cycle de consommation",
        message: "Tu as contribué à l'obsolescence programmée. Pourtant, des solutions durables existaient !"
    },
    {
        id: 11,
        name: "Fin - Découverte de Linux",
        text: "Avec Linux, ton PC retrouve des performances incroyables ! Tu découvres le logiciel libre, une communauté d'entraide, et tu as économisé 1200€. Tu peux même aider d'autres à faire pareil !",
        end: true,
        title: "Fin : Renaissance numérique",
        message: "Bravo ! Tu as adopté une solution durable et inclusive. Le numérique responsable, c'est possible !"
    },
    {
        id: 12,
        name: "RAM ajoutée",
        text: "Avec +8Go de RAM, ton PC peut enfin gérer plusieurs applications en même temps. Tu découvres que beaucoup de vieux PC peuvent être upgradés facilement !",
        choices: [
            { text: "Partager mon expérience", nextScene: 18, effect: { autonomy: +10, durability: +5, inclusion: +20 } }
        ]
    },
    {
        id: 13,
        name: "Fin - Petit entretien",
        text: "Ton PC fonctionne mieux, mais ce n'est qu'un pansement. Sans upgrade, il restera limité. Au moins, tu l'as sauvé de la déchetterie pour quelques mois supplémentaires.",
        end: true,
        title: "Fin : Temporisation",
        message: "Un premier pas, mais il faut aller plus loin pour un impact durable réel !"
    },
    {
        id: 14,
        name: "Fin - Ambassadeur NIRD",
        text: "Grâce à NIRD, tu as non seulement sauvé ton PC, mais tu as aussi aidé 3 amis à faire pareil ! Tu crées même un atelier de réparation dans ton quartier. Le numérique responsable se propage !",
        end: true,
        title: "Fin : Héros du numérique durable",
        message: "Excellente initiative ! Tu es devenu un acteur du changement vers un numérique plus responsable."
    },
    {
        id: 15,
        name: "Guide NIRD",
        text: "Le guide NIRD te montre comment : 1) Diagnostiquer ton matériel, 2) Choisir les upgrades, 3) Installer Linux, 4) Partager tes connaissances. C'est une mine d'or !",
        choices: [
            { text: "Devenir formateur NIRD", nextScene: 14, effect: { autonomy: +20, durability: +15, inclusion: +30 } }
        ]
    },
    {
        id: 16,
        name: "Fin - Upgrade réussie",
        text: "Félicitations ! Ton PC a gagné 5 ans de vie supplémentaire. Tu as économisé de l'argent, réduit ton impact écologique, et découvert le monde du hardware. Qui sait, peut-être deviendras-tu réparateur ?",
        end: true,
        title: "Fin : Upgrade responsable",
        message: "Excellent choix économique et écologique ! Le numérique durable, c'est l'avenir."
    },
    {
        id: 17,
        name: "SSD seulement",
        text: "Avec le SSD, ton PC démarre en 15 secondes au lieu de 2 minutes ! Les applications lancent instantanément. Un gain énorme pour un petit prix.",
        choices: [
            { text: "Satisfait du résultat", nextScene: 19, effect: { autonomy: +15, durability: +10, inclusion: +10 } }
        ]
    },
    {
        id: 18,
        name: "Communauté",
        text: "Tu postes ton expérience sur les réseaux. Beaucoup de gens intéressés ! Tu organises même une soirée 'Upgrade ton PC' avec des amis.",
        choices: [
            { text: "Continuer à partager", nextScene: 14, effect: { autonomy: +10, durability: +5, inclusion: +25 } }
        ]
    },
    {
        id: 19,
        name: "Fin - Amélioration partielle",
        text: "Ton PC est plus rapide, mais toujours limité en RAM. C'est un bon début, mais pense à compléter plus tard pour une vraie différence.",
        end: true,
        title: "Fin : Premier pas",
        message: "Une amélioration, mais pas optimale. Continue sur cette voie !"
    }
];

// ================= FONCTIONS DU JEU =================
function startGame() {
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    loadScene(0);
}

function loadScene(sceneId) {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;
    
    gameData.currentScene = sceneId;
    gameData.history.push(sceneId);
    
    // Mettre à jour l'interface
    document.getElementById('character-name').textContent = scene.name;
    document.getElementById('dialog-text').textContent = scene.text;
    
    // Gérer les choix
    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';
    
    if (scene.end) {
        // Scène de fin
        setTimeout(() => showEndScreen(scene), 500);
    } else {
        // Afficher les choix
        scene.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = `${index + 1}. ${choice.text}`;
            button.onclick = () => makeChoice(choice);
            choicesContainer.appendChild(button);
        });
    }
    
    // Mettre à jour les stats
    updateStats();
}

function makeChoice(choice) {
    // Appliquer les effets du choix
    if (choice.effect) {
        gameData.autonomy = Math.max(0, Math.min(100, gameData.autonomy + (choice.effect.autonomy || 0)));
        gameData.durability = Math.max(0, Math.min(100, gameData.durability + (choice.effect.durability || 0)));
        gameData.inclusion = Math.max(0, Math.min(100, gameData.inclusion + (choice.effect.inclusion || 0)));
    }
    
    gameData.choices.push(choice);
    loadScene(choice.nextScene);
}

function updateStats() {
    document.getElementById('autonomy').value = gameData.autonomy;
    document.getElementById('durability').value = gameData.durability;
    document.getElementById('inclusion').value = gameData.inclusion;
}

function showEndScreen(scene) {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('end-screen').classList.remove('hidden');
    
    document.getElementById('end-title').textContent = scene.title;
    
    let content = `<p>${scene.message}</p>`;
    content += `<div style="margin: 30px 0; padding: 20px; background: rgba(0,255,255,0.1); border-radius: 10px;">`;
    content += `<h3>Ton parcours en chiffres :</h3>`;
    content += `<p>Autonomie : ${gameData.autonomy}/100</p>`;
    content += `<p>Durabilité : ${gameData.durability}/100</p>`;
    content += `<p>Inclusion : ${gameData.inclusion}/100</p>`;
    
    // Calcul du score global
    const totalScore = gameData.autonomy + gameData.durability + gameData.inclusion;
    let evaluation = "";
    
    if (totalScore >= 240) {
        evaluation = "🌟 Excellent ! Tu es un champion du numérique responsable !";
    } else if (totalScore >= 180) {
        evaluation = "👍 Très bien ! Tu fais des choix responsables.";
    } else if (totalScore >= 120) {
        evaluation = "⚠️ Moyen. Tu peux encore améliorer tes choix.";
    } else {
        evaluation = "💡 Débutant. Beaucoup à apprendre sur le numérique durable.";
    }
    
    content += `<p><strong>Score total : ${totalScore}/300</strong></p>`;
    content += `<p>${evaluation}</p>`;
    content += `</div>`;
    
    content += `<p>La démarche NIRD (Numérique Inclusif, Responsable et Durable) promeut :</p>`;
    content += `<ul style="text-align: left; max-width: 600px; margin: 20px auto;">`;
    content += `<li>♻️ La réparation et le réemploi du matériel</li>`;
    content += `<li>🌱 La réduction de l'impact environnemental</li>`;
    content += `<li>🤝 L'inclusion numérique pour tous</li>`;
    content += `<li>📚 La formation et le partage des connaissances</li>`;
    content += `</ul>`;
    
    document.getElementById('end-content').innerHTML = content;
}

function restartGame() {
    // Réinitialiser les données
    gameData.currentScene = 0;
    gameData.autonomy = 30;
    gameData.durability = 30;
    gameData.inclusion = 30;
    gameData.history = [];
    gameData.choices = [];
    
    // Retour à l'écran de titre
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('title-screen').classList.remove('hidden');
}

// ================= INITIALISATION =================
document.addEventListener('DOMContentLoaded', () => {
    // Gérer le bouton retour
    document.getElementById('back-btn').addEventListener('click', () => {
        if (gameData.history.length > 1) {
            gameData.history.pop(); // Retirer la scène actuelle
            const previousScene = gameData.history.pop(); // Retirer aussi pour revenir à l'avant-dernière
            loadScene(previousScene);
        }
    });
    
    // Message de bienvenue dans la console
    console.log('%c🎮 Jeu "Sauve-Moi" chargé', 'color: #00ffff; font-size: 16px;');
    console.log('%c💻 Démarche NIRD : Numérique Inclusif, Responsable et Durable', 'color: #aaa;');
});