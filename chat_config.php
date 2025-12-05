<?php
// Configuration de la base de données (pour une version réelle)
define('DB_HOST', 'postgresql-cassegirls.alwaysdata.net');
define('DB_NAME', 'cassegirls_database');
define('DB_USER', 'cassegirls');
define('DB_PASS', 'cassegirls_1234_abcd_gplusdinspi***');

// Démarrer la session
session_start();

// Headers pour JSON
header('Content-Type: application/json');

// Gestion CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Pour la démo, on utilise un fichier JSON
$data_file = 'users.json';

// Charger les utilisateurs
function loadUsers() {
    global $data_file;
    if (file_exists($data_file)) {
        return json_decode(file_get_contents($data_file), true) ?: [];
    }
    return [];
}

// Sauvegarder les utilisateurs
function saveUsers($users) {
    global $data_file;
    file_put_contents($data_file, json_encode($users, JSON_PRETTY_PRINT));
}
?>