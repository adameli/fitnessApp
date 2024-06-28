import { STATE } from '../../../logic/state.js';
import { PubSub } from "../../../logic/pubsub.js";

PubSub.subscribe({ event: 'displayWorkouts', listener: createWorkoutInstance });
PubSub.subscribe({ event: 'renderHomeContent', listener: createWorkoutInstance });

function createWorkoutInstance(parentId = 'workouts', entity = 'defaultWorkouts') {
    // Retrieve workout data from the specified entity in the state
    const parent = document.getElementById(parentId);
    const workouts = [...STATE.getEntity('defaultWorkouts'), ...STATE.getEntity('userWorkouts')];

    let createWorkoutBtn = document.createElement('button');
    createWorkoutBtn.textContent = "Create Workout";
    createWorkoutBtn.id = 'create-workout-btn';
    createWorkoutBtn.addEventListener('click', () => {
        PubSub.publish({ event: 'createWorkout', detail: null });
    })
    parent.appendChild(createWorkoutBtn);

    // Create and append workout instances to the parent element
    workouts.forEach(workout => {
        const workoutDiv = document.createElement('div');
        workoutDiv.id = `workout-${workout.id}`;
        workoutDiv.className = 'workout-instance';
        if (!workout.created_by) workoutDiv.dataset.default = true;

        // Count the number of exercises
        const exerciseCount = workout.exercises ? workout.exercises.length : 0;

        // Set the innerHTML with workout details
        workoutDiv.innerHTML = `
            <h3>${workout.name}</h3>
            <p>${workout.description}</p>
            <p>Number of exercises: ${exerciseCount}</p>
    `;

        workoutDiv.addEventListener('click', (e) => {
            console.log(e.currentTarget);
            const workoutId = workout.id;
            PubSub.publish({ event: 'renderWorkoutDetail', detail: { workoutId: workoutId, defaultWorkout: e.currentTarget.dataset.default } })
        });

        // Append the workout div to the parent element
        parent.appendChild(workoutDiv);
    });
}