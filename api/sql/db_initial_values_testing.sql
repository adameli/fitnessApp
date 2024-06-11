BEGIN TRANSACTION;

-- Insert initial users
INSERT INTO users (username, email, password_hash) VALUES
('user1', 'user1@example.com', 'hashed_password1'),
('user2', 'user2@example.com', 'hashed_password2');

-- Insert default workouts (created_by is NULL)
INSERT INTO workouts (name, description, created_by) VALUES
('Leg Workout', 'A default workout focusing on leg exercises.', NULL),
('Arm Workout', 'A default workout focusing on arm exercises.', NULL),
('Back Workout', 'A default workout focusing on back exercises.', NULL);

-- Insert exercises
INSERT INTO exercises (name, description) VALUES
('Squat', 'A lower body exercise focusing on the thighs and hips.'),
('Lunge', 'A lower body exercise targeting the quadriceps and glutes.'),
('Leg Press', 'A compound leg exercise focusing on the quadriceps.'),
('Bicep Curl', 'An upper body exercise focusing on the biceps.'),
('Tricep Extension', 'An upper body exercise targeting the triceps.'),
('Push-up', 'An upper body exercise targeting the chest, triceps, and shoulders.'),
('Pull-up', 'An upper body exercise focusing on the back and biceps.'),
('Deadlift', 'A compound exercise targeting the lower back and hamstrings.'),
('Row', 'An upper body exercise targeting the upper back.');

-- Link exercises to the Leg Workout (workout_id 1)
INSERT INTO workout_exercises (workout_id, exercise_id, exercise_order, repetitions, sets) VALUES
(1, 1, 1, 10, 3), -- Squat
(1, 2, 2, 12, 3), -- Lunge
(1, 3, 3, 10, 3); -- Leg Press

-- Link exercises to the Arm Workout (workout_id 2)
INSERT INTO workout_exercises (workout_id, exercise_id, exercise_order, repetitions, sets) VALUES
(2, 4, 1, 12, 3), -- Bicep Curl
(2, 5, 2, 12, 3), -- Tricep Extension
(2, 6, 3, 15, 3); -- Push-up

-- Link exercises to the Back Workout (workout_id 3)
INSERT INTO workout_exercises (workout_id, exercise_id, exercise_order, repetitions, sets) VALUES
(3, 7, 1, 10, 3), -- Pull-up
(3, 8, 2, 10, 3), -- Deadlift
(3, 9, 3, 12, 3); -- Row




COMMIT;