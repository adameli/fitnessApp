

BEGIN TRANSACTION;

drop table if exists users;
drop table if exists workouts;
drop table if exists user_workouts;
drop table if exists exercises;
drop table if exists workout_exercises;



CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES Users(id)
);

CREATE TABLE user_workouts (
    user_id INTEGER,
    workout_id INTEGER,
    PRIMARY KEY (user_id, workout_id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (workout_id) REFERENCES Workouts(id)
);

CREATE TABLE exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE workout_exercises (
    workout_id INTEGER,
    exercise_id INTEGER,
    exercise_order INTEGER NOT NULL,
    repetitions INTEGER,
    sets INTEGER,
    PRIMARY KEY (workout_id, exercise_id),
    FOREIGN KEY (workout_id) REFERENCES Workouts(id),
    FOREIGN KEY (exercise_id) REFERENCES Exercises(id)
);



COMMIT;
