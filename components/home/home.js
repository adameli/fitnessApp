import { PubSub } from "../../../logic/pubsub.js";

PubSub.subscribe({ event: 'renderHome', listener: renderHomeContent });

function renderHomeContent() {
    const app = document.getElementById('app');

    // Empty the app div
    app.innerHTML = '';

    // Fill the app div with containers
    app.innerHTML = `
        <div id="home-wrapper" class="wrapper">
            <div id="user-info" class="container">
                <h2>User Info</h2>
            </div>
            <div id="workouts" class="container">
                <h2>Workouts</h2>
            </div>
            <div id="progress" class="container">
                <h2>Progress</h2>
            </div>
        </div>
    `;

    // Publish the event onRenderHomeContent
    PubSub.publish({ event: 'renderHomeContent' });
}