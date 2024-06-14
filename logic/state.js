let _state = {};

const STATE = {
    getEntity: (entity) => {
        return JSON.parse(JSON.stringify(_state[entity] || []));
    },

    fillState: async (token) => {
        try {
            const [defaultWorkoutsResponse, exercisesResponse, userWorkoutsResponse] = await Promise.all([
                fetcher(new Request('./api/workout.php?action=default_workouts')),
                fetcher(new Request('./api/workout.php?action=exercises')),
                fetcher(new Request(`./api/workout.php?action=user_workouts&token=${token}`))
            ]);

            const defaultWorkouts = await defaultWorkoutsResponse.json();
            const exercises = await exercisesResponse.json();
            const userWorkouts = await userWorkoutsResponse.json();

            _state = {
                defaultWorkouts: defaultWorkouts || [],
                userWorkouts: userWorkouts || [],
                exercises: exercises || []
            };


            console.log(_state);
        } catch (error) {
            console.log('Error filling state:', error);
        }
    },

    Post: async ({ entity, request }) => {
        try {
            const response = await fetcher(request);
            const result = await response.json();

            if (response.ok) {
                _state[entity] = [...(_state[entity] || []), result.data];
            }

            return result;
        } catch (error) {
            console.log('Error in Post:', error);
        }
    },

    Patch: async ({ entity, request }) => {
        try {
            const response = await fetcher(request);
            const result = await response.json();

            if (response.ok) {
                const index = _state[entity].findIndex(item => item.id === result.data.id);
                if (index !== -1) {
                    _state[entity][index] = result.data;
                }
            }

            return result;
        } catch (error) {
            console.log('Error in Patch:', error);
        }
    },

    Delete: async ({ entity, request }) => {
        try {
            const response = await fetcher(request);
            const result = await response.json();

            if (response.ok) {
                _state[entity] = _state[entity].filter(item => item.id !== result.data.id);
            }

            return result;
        } catch (error) {
            console.log('Error in Delete:', error);
        }
    }
};

async function fetcher(request) {
    try {
        let response = await fetch(request);
        return response;
    } catch (error) {
        console.log(error);
    }
}

// Example of usage:
// STATE.fillState('your-token-here');
// let workouts = STATE.getEntity('userWorkouts');

export { STATE, fetcher };


