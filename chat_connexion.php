<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        $input = $_POST;
    }
    
    $username = trim($input['username'] ?? '');
    
    // Charger les utilisateurs
    $users = loadUsers();
    
    // Chercher l'utilisateur
    $foundUser = null;
    foreach ($users as $user) {
        if ($user['username'] === $username) {
            $foundUser = $user;
            break;
        }
    }
    
    if (!$foundUser) {
        echo json_encode([
            'success' => false,
            'message' => 'Utilisateur non trouvé'
        ]);
        exit;
    }
    
    // Pour la démo, retourner les infos (sans le mot de passe)
    echo json_encode([
        'success' => true,
        'message' => 'Utilisateur trouvé',
        'user' => [
            'username' => $foundUser['username'],
            'sequence' => $foundUser['sequence'],
            'created_at' => $foundUser['created_at']
        ]
    ]);
    
    // Stocker en session pour la validation
    $_SESSION['current_user'] = $foundUser;
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['validate'])) {
    // Validation de la séquence
    $username = $_GET['username'] ?? '';
    $sequence = json_decode($_GET['sequence'] ?? '[]', true);
    
    $users = loadUsers();
    $foundUser = null;
    
    foreach ($users as $user) {
        if ($user['username'] === $username) {
            $foundUser = $user;
            break;
        }
    }
    
    if (!$foundUser) {
        echo json_encode([
            'success' => false,
            'message' => 'Utilisateur non trouvé'
        ]);
        exit;
    }
    
    $correct = $foundUser['sequence'] == $sequence;
    
    if ($correct) {
        $_SESSION['logged_in'] = true;
        $_SESSION['username'] = $username;
        
        echo json_encode([
            'success' => true,
            'message' => 'Connexion réussie ! Le chat est content.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Mauvaise séquence ! Le chat n\'est pas content.'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée'
    ]);
}
?>