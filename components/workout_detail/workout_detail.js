import { STATE } from '../../../logic/state.js';
import { fetcher } from '../../../logic/state.js';
import { PubSub } from "../../../logic/pubsub.js";

PubSub.subscribe({ event: 'renderWorkoutDetail', listener: renderWorkoutDetail });

function renderWorkoutDetail(workoutId) {
    const app = document.getElementById('app');

    // Retrieve the workout details from the state
    const workout = STATE.getEntity('userWorkouts').find(w => w.id === workoutId) ||
        STATE.getEntity('defaultWorkouts').find(w => w.id === workoutId);

    if (!workout) {
        app.innerHTML = '<p>Workout not found.</p>';
        return;
    }

    // Sort exercises by exercise_order
    const sortedExercises = workout.exercises.sort((a, b) => a.exercise_order - b.exercise_order);

    // Create workout detail container
    app.innerHTML = `
    <div id="workout-detail-wrapper" class="wrapper">
        <div id="workout-detail">
        <h2>${workout.name}</h2>
        <p>${workout.description}</p>
        <div id="exercise-list">
            ${sortedExercises.map(ex => `
            <div class="exercise-container" data-id="${ex.exercise_id}">
                <p>Name: ${ex.name}</p>
                <p>Sets: <span class="sets">${ex.sets}</span></p>
                <p>Repetitions: <span class="reps">${ex.repetitions}</span></p>
            </div>
            `).join('')}
        </div>
        <button id="edit-button">Edit</button>
        <button id="save-button" class="hidden">Save</button>
        <button id="start-button">Start Workout</button>
        <div id="timer" class="hidden">00:00:00</div>
        </div>
    </div>
  `;

    document.getElementById('edit-button').addEventListener('click', enableEdit);
    document.getElementById('save-button').addEventListener('click', () => saveWorkout(workoutId));
    document.getElementById('start-button').addEventListener('click', startWorkout);

    function enableEdit() {
        document.querySelectorAll('.sets, .reps').forEach(span => {
            const value = span.textContent;
            span.innerHTML = `<input type="number" value="${value}">`;
        });
        document.getElementById('edit-button').classList.add('hidden');
        document.getElementById('save-button').classList.remove('hidden');
    }

    async function saveWorkout(workoutId) {
        const updatedExercises = Array.from(document.querySelectorAll('.exercise-container')).map(container => {
            const exerciseId = container.getAttribute('data-id');
            const sets = container.querySelector('.sets input').value;
            const reps = container.querySelector('.reps input').value;
            return { exercise_id: exerciseId, sets: parseInt(sets), repetitions: parseInt(reps) };
        });

        const token = localStorage.getItem("token");
        const request = new Request('./api/workout.php?action=update_exercises', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token, workout_id: workoutId, exercises: updatedExercises })
        });

        const response = await fetcher(request);
        const result = await response.json();

        if (response.ok) {
            updatedExercises.forEach(updatedExercise => {
                const exercise = workout.exercises.find(ex => ex.exercise_id == updatedExercise.exercise_id);
                exercise.sets = updatedExercise.sets;
                exercise.repetitions = updatedExercise.repetitions;
            });

            renderWorkoutDetail(workoutId);  // Re-render the workout detail view
        } else {
            console.error('Failed to update exercises:', result.error);
        }
    }

    function startWorkout() {
        document.getElementById('start-button').classList.add('hidden');
        document.getElementById('edit-button').classList.add('hidden');
        document.getElementById('timer').classList.remove('hidden');
        document.querySelectorAll('.exercise-container').forEach(container => {
            container.innerHTML += '<input type="checkbox" class="exercise-complete">';
        });

        let startTime = Date.now();

        function updateTimer() {
            const elapsedTime = Date.now() - startTime;
            const hours = String(Math.floor(elapsedTime / 3600000)).padStart(2, '0');
            const minutes = String(Math.floor((elapsedTime % 3600000) / 60000)).padStart(2, '0');
            const seconds = String(Math.floor((elapsedTime % 60000) / 1000)).padStart(2, '0');
            document.getElementById('timer').textContent = `${hours}:${minutes}:${seconds}`;

            if (elapsedTime < 7200000) {  // 2 hours in milliseconds
                requestAnimationFrame(updateTimer);
            }
        }

        requestAnimationFrame(updateTimer);
    }
}

