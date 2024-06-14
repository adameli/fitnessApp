import { PubSub } from "../../../logic/pubsub.js";
import { STATE } from "../../../logic/state.js";
PubSub.subscribe({ event: 'renderApp', listener: loginRegister })

function loginRegister() {
    const app = document.getElementById('app');

    let isLogin = true;

    const render = () => {
        app.innerHTML = `
        <div>
          <h2>${isLogin ? 'Login' : 'Register'}</h2>
          <form id="authForm">
            ${!isLogin ? '<input type="email" id="email" placeholder="Email" required><br>' : ''}
            <input type="text"value="Adam" id="username" placeholder="Username" required><br>
            <input type="password" value="lol" id="password" placeholder="Password" required><br>
            <button type="submit">${isLogin ? 'Login' : 'Register'}</button>
          </form>
          <button id="toggleForm">${isLogin ? 'Switch to Register' : 'Switch to Login'}</button>
          <div id="message"></div>
        </div>
      `;

        document.getElementById('authForm').addEventListener('submit', handleSubmit);
        document.getElementById('toggleForm').addEventListener('click', handleToggle);
    };

    const handleToggle = () => {
        isLogin = !isLogin;
        render();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = isLogin ? null : document.getElementById('email').value;
        const messageElement = document.getElementById('message');

        try {
            const response = await fetch(`./api/user.php?action=${isLogin ? 'login' : 'register'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    ...(email && { email })
                })
            });

            const result = await response.json();

            if (response.ok) {
                messageElement.textContent = isLogin ? 'Login successful!' : 'Registration successful!';
                messageElement.style.color = 'green';

                if (isLogin) {
                    await STATE.fillState('$2y$10$DYm0uOPxpJJvx5iFN12wDOCfgfnYQjsTUSvaJACLrf3WWgpd1EgMi')
                    console.log(STATE.getEntity('userWorkouts'))
                    // PubSub.publish({ event: 'renderHome', detail: null });

                }
            } else {
                messageElement.textContent = result.error || 'An error occurred';
                messageElement.style.color = 'red';
            }
        } catch (error) {
            messageElement.textContent = 'An error occurred';
            messageElement.style.color = 'red';
        }
    };

    render();
};
