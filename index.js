

//* Post Bodies
const register = {
    username: 'Adam',
    email: 'adam.eliasson.swe@gmail.com',
    password: 'lol'
}
const login = {
    username: 'Adam',
    password: 'lol'
}

const addExercises = {
    "token": "hashed_password",
    "workout_id": 1,
    "exercises": [
        {
            "exercise_id": 1,
            "exercise_order": 1,
            "repetitions": 10,
            "sets": 3
        },
        {
            "exercise_id": 2,
            "exercise_order": 2,
            "repetitions": 12,
            "sets": 3
        },
        {
            "exercise_id": 3,
            "exercise_order": 3,
            "repetitions": 15,
            "sets": 4
        }
    ]
}

const updateRepsAndSets = {
    "token": "hashed_password",
    "workout_id": 1,
    "exercises": [
        {
            "exercise_id": 1,
            "repetitions": 12,
            "sets": 4
        },
        {
            "exercise_id": 2,
            "repetitions": 15,
            "sets": 3
        }
    ]
}


//* Delete bodies
const deleteWorkout = {
    token: '$2y$10$DYm0uOPxpJJvx5iFN12wDOCfgfnYQjsTUSvaJACLrf3WWgpd1EgMi',
    workout_id: 4
}

const deleteExercises = {
    "token": "hashed_password",
    "workout_id": 1,
    "exercise_ids": [1, 2]
}

//* Get prefixes
const users = './api/user.php?action=get_users'
const userWorkouts = './api/workout.php?action=user_workouts&token=$2y$10$DYm0uOPxpJJvx5iFN12wDOCfgfnYQjsTUSvaJACLrf3WWgpd1EgMi'
const defaultWorkouts = './api/workout.php?action=default_workouts'




const request = new Request(`./api/user.php?action=register`, {
    method: 'POST',
    headers: { "Content-type": 'application/json' },
    body: JSON.stringify()
})

// fetcher(request)

async function fetcher(request) {
    try {
        const response = await fetch(request);
        console.log(response);

        const resource = await response.json();
        console.log(resource);
        // return response;

    } catch (e) {
        console.log(e);
    }

}