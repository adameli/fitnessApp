<?php

require 'db_foundation.php'; // Make sure this file contains the get_pdo() function
require 'helpers.php';
header('Content-Type: application/json');


function get_entities($table) {
    $pdo = get_pdo();
    $stmt = $pdo->query("SELECT * FROM $table");
    return $stmt->fetchAll();
}

function register_user($username, $email, $password) {
    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT * FROM Users WHERE username = ? OR email = ?');
    $stmt->execute([$username, $email]);
    $user = $stmt->fetch();

    if ($user) {
        abort('User already exists.');
    }

    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)');
    $stmt->execute([$username, $email, $password_hash]);

    send('User successfully registered.', 201);
}

function login_user($username, $password) {
    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT * FROM Users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        send(['token' => $user['password_hash']]);
    } else {
        abort('Invalid username or password.');
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'POST':
        if ($action === 'register') {
            $input = json_decode(file_get_contents('php://input'), true);
            register_user($input['username'], $input['email'], $input['password']);
        } elseif ($action === 'login') {
            $input = json_decode(file_get_contents('php://input'), true);
            login_user($input['username'], $input['password']);
        } else {
            abort('Invalid action.');
        }
        break;

    case 'GET':
        if ($action === 'get_users') {
            $users = get_entities('Users');
            send($users);
        } else {
            abort('Invalid action.');
        }
        break;

    default:
        abort('Invalid request method.', 405);
}

?>
