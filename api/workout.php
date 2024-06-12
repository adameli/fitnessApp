<?php

require 'db_foundation.php'; // Make sure this file contains the get_pdo() function
require 'helpers.php';
header('Content-Type: application/json');



function authenticate_user($token) {
    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT * FROM Users WHERE password_hash = ?');
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if ($user) {
        return $user['id'];
    } else {
        abort('Invalid token.', 401);
    }
}

function get_default_workouts() {
    $pdo = get_pdo();
    $stmt = $pdo->query('SELECT * FROM Workouts WHERE created_by IS NULL');
    $workouts = $stmt->fetchAll();
    send($workouts);
}

function get_user_workouts($token) {
    $user_id = authenticate_user($token);
    $pdo = get_pdo();

    // Get all workouts for the user
    $stmt = $pdo->prepare('SELECT * FROM Workouts WHERE created_by = ?');
    $stmt->execute([$user_id]);
    $workouts = $stmt->fetchAll();

    // Get exercises for each workout
    foreach ($workouts as &$workout) {
        $stmt = $pdo->prepare('
            SELECT we.exercise_id, e.name, we.exercise_order, we.repetitions, we.sets 
            FROM Workout_Exercises we
            JOIN Exercises e ON we.exercise_id = e.id
            WHERE we.workout_id = ?
            ORDER BY we.exercise_order
        ');
        $stmt->execute([$workout['id']]);
        $workout['exercises'] = $stmt->fetchAll();
    }

    send($workouts);
}

function create_user_workout($token, $name, $description) {
    $user_id = authenticate_user($token);
    $pdo = get_pdo();
    $stmt = $pdo->prepare('INSERT INTO Workouts (name, description, created_by) VALUES (?, ?, ?)');
    $stmt->execute([$name, $description, $user_id]);
    $workout_id = $pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM Workouts WHERE id = ?');
    $stmt->execute([$workout_id]);
    $workout = $stmt->fetch();
    send($workout);
}

function delete_user_workout($token, $workout_id) {
    $user_id = authenticate_user($token);
    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT * FROM Workouts WHERE id = ? AND created_by = ?');
    $stmt->execute([$workout_id, $user_id]);
    $workout = $stmt->fetch();

    if ($workout) {
        $stmt = $pdo->prepare('DELETE FROM Workouts WHERE id = ?');
        $stmt->execute([$workout_id]);
        send($workout);
    } else {
        abort('Workout not found or not authorized to delete.', 403);
    }
}

function add_exercises_to_workout($token, $workout_id, $exercises) {
    $user_id = authenticate_user($token);
    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT * FROM Workouts WHERE id = ? AND created_by = ?');
    $stmt->execute([$workout_id, $user_id]);
    $workout = $stmt->fetch();

    if ($workout) {
        $pdo->beginTransaction();
        foreach ($exercises as $exercise) {
            $stmt = $pdo->prepare('INSERT INTO Workout_Exercises (workout_id, exercise_id, exercise_order, repetitions, sets) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$workout_id, $exercise['exercise_id'], $exercise['exercise_order'], $exercise['repetitions'], $exercise['sets']]);
        }
        $pdo->commit();
        $stmt = $pdo->prepare('SELECT * FROM Workout_Exercises WHERE workout_id = ?');
        $stmt->execute([$workout_id]);
        $updated_workout = $stmt->fetchAll();
        send($updated_workout);
    } else {
        abort('Workout not found or not authorized to add exercises.', 403);
    }
}

function update_exercises_reps_sets($token, $workout_id, $exercises) {
    $user_id = authenticate_user($token);
    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT * FROM Workouts WHERE id = ? AND created_by = ?');
    $stmt->execute([$workout_id, $user_id]);
    $workout = $stmt->fetch();

    if ($workout) {
        $pdo->beginTransaction();
        foreach ($exercises as $exercise) {
            $stmt = $pdo->prepare('UPDATE Workout_Exercises SET repetitions = ?, sets = ? WHERE workout_id = ? AND exercise_id = ?');
            $stmt->execute([$exercise['repetitions'], $exercise['sets'], $workout_id, $exercise['exercise_id']]);
        }
        $pdo->commit();
        $stmt = $pdo->prepare('SELECT * FROM Workout_Exercises WHERE workout_id = ?');
        $stmt->execute([$workout_id]);
        $updated_workout = $stmt->fetchAll();
        send($updated_workout);
    } else {
        abort('Workout not found or not authorized to update exercises.', 403);
    }
}

function delete_exercises_from_workout($token, $workout_id, $exercise_ids) {
    $user_id = authenticate_user($token);
    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT * FROM Workouts WHERE id = ? AND created_by = ?');
    $stmt->execute([$workout_id, $user_id]);
    $workout = $stmt->fetch();

    if ($workout) {
        $pdo->beginTransaction();
        foreach ($exercise_ids as $exercise_id) {
            $stmt = $pdo->prepare('DELETE FROM Workout_Exercises WHERE workout_id = ? AND exercise_id = ?');
            $stmt->execute([$workout_id, $exercise_id]);
        }
        $pdo->commit();
        $stmt = $pdo->prepare('SELECT * FROM Workout_Exercises WHERE workout_id = ?');
        $stmt->execute([$workout_id]);
        $updated_workout = $stmt->fetchAll();
        send($updated_workout);
    } else {
        abort('Workout not found or not authorized to delete exercises.', 403);
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        if ($action === 'default_workouts') {
            get_default_workouts();
        } elseif ($action === 'user_workouts') {
            $token = $_GET['token'] ?? '';
            get_user_workouts($token);
        } else {
            abort('Invalid action.');
        }
        break;

    case 'POST':
        if ($action === 'create_workout') {
            $input = json_decode(file_get_contents('php://input'), true);
            $token = $input['token'] ?? '';
            $name = $input['name'] ?? '';
            $description = $input['description'] ?? '';
            create_user_workout($token, $name, $description);
        } elseif ($action === 'add_exercises') {
            $input = json_decode(file_get_contents('php://input'), true);
            $token = $input['token'] ?? '';
            $workout_id = $input['workout_id'] ?? '';
            $exercises = $input['exercises'] ?? [];
            add_exercises_to_workout($token, $workout_id, $exercises);
        } elseif ($action === 'update_exercises') {
            $input = json_decode(file_get_contents('php://input'), true);
            $token = $input['token'] ?? '';
            $workout_id = $input['workout_id'] ?? '';
            $exercises = $input['exercises'] ?? [];
            update_exercises_reps_sets($token, $workout_id, $exercises);
        } else {
            abort('Invalid action.');
        }
        break;

    case 'DELETE':
        if ($action === 'delete_workout') {
            $input = json_decode(file_get_contents('php://input'), true);
            $token = $input['token'] ?? '';
            $workout_id = $input['workout_id'] ?? '';
            delete_user_workout($token, $workout_id);
        } elseif ($action === 'delete_exercises') {
            $input = json_decode(file_get_contents('php://input'), true);
            $token = $input['token'] ?? '';
            $workout_id = $input['workout_id'] ?? '';
            $exercise_ids = $input['exercise_ids'] ?? [];
            delete_exercises_from_workout($token, $workout_id, $exercise_ids);
        } else {
            abort('Invalid action.');
        }
        break;

    default:
        abort('Invalid request method.', 405);
}


?>
