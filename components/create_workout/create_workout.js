import { STATE, fetcher } from '../../../logic/state.js';
import { PubSub } from "../../../logic/pubsub.js";

PubSub.subscribe({ event: 'createWorkout', listener: createWorkoutPopup });

function createWorkoutPopup() {
    // Create the popup container
    const popup = document.createElement('div');
    popup.id = 'create-workout-popup';
    popup.className = 'popup';

    // Popup content
    popup.innerHTML = `
    <div class="popup-header">
      <button id="close-popup-button">Close</button>
      <button id="save-workout-button">Save</button>
    </div>
    <div class="popup-body">
      <input type="text" id="workout-name" placeholder="Workout Name" required><br>
      <textarea id="workout-description" placeholder="Workout Description" required></textarea><br>
      <button id="add-exercise-button">Add Exercise</button>
      <div id="selected-exercises"></div>
    </div>
  `;

    document.getElementById('app').appendChild(popup);

    document.getElementById('close-popup-button').addEventListener('click', closePopup);
    document.getElementById('save-workout-button').addEventListener('click', saveWorkout);
    document.getElementById('add-exercise-button').addEventListener('click', displayExercises);
}

function closePopup() {
    const popup = document.getElementById('create-workout-popup');
    if (popup) {
        document.getElementById('app').removeChild(popup);
    }
}

function displayExercises() {
    const exercises = STATE.getEntity('exercises');
    const exercisesList = document.createElement('div');
    exercisesList.className = 'popup';
    exercisesList.id = 'exercises-list';

    exercises.forEach(exercise => {
        const exerciseItem = document.createElement('div');
        exerciseItem.className = 'exercise-item';
        exerciseItem.textContent = exercise.name;
        exerciseItem.dataset.id = exercise.id;
        exerciseItem.addEventListener('click', () => addExerciseToWorkout(exercise));
        exercisesList.appendChild(exerciseItem);
    });

    document.getElementById('app').appendChild(exercisesList);
}

function addExerciseToWorkout(exercise) {
    document.getElementById('exercises-list').remove();
    const selectedExercises = document.getElementById('selected-exercises');
    const exerciseContainer = document.createElement('div');
    exerciseContainer.className = 'exercise-container';
    exerciseContainer.dataset.id = exercise.id;

    exerciseContainer.innerHTML = `
    <p>${exercise.name}</p>
    <label>Sets: <input type="number" class="exercise-sets" min="1" required></label>
    <label>Reps: <input type="number" class="exercise-reps" min="1" required></label>
  `;

    selectedExercises.appendChild(exerciseContainer);
}

async function saveWorkout() {
    const workoutName = document.getElementById('workout-name').value;
    const workoutDescription = document.getElementById('workout-description').value;
    const selectedExercises = Array.from(document.querySelectorAll('.exercise-container')).map((container, index) => {
        return {
            exercise_id: container.dataset.id,
            exercise_order: index,
            sets: parseInt(container.querySelector('.exercise-sets').value),
            repetitions: parseInt(container.querySelector('.exercise-reps').value)
        };
    });

    const token = window.localStorage.getItem('token');
    const request = new Request('./api/workout.php?action=create_workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token, name: workoutName, description: workoutDescription })
    });

    const response = await fetcher(request);
    const result = await response.json();

    if (response.ok) {
        const workoutId = result.id;

        const exerciseRequests = selectedExercises.map(ex => {
            return new Request('./api/workout.php?action=add_exercises', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token, workout_id: workoutId, exercises: [ex] })
            });
        });

        await Promise.all(exerciseRequests.map(req => fetcher(req)));
        closePopup();
        alert('Workout created successfully!');
    } else {
        console.error('Failed to create workout:', result.error);
        alert('Failed to create workout. Please try again.');
    }
}

