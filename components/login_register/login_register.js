import { PubSub } from "../../../logic/pubsub.js";
import { STATE } from "../../../logic/state.js";
PubSub.subscribe({ event: 'renderApp', listener: loginRegister })

async function loginRegister() {
    if (window.localStorage.getItem('token')) {
        const token = window.localStorage.getItem('token');
        await STATE.fillState(token)
        PubSub.publish({ event: 'renderHome', detail: null });
        return
    }

    const app = document.getElementById('app');

    let isLogin = true;

    const render = () => {
        app.innerHTML = `
        <div id="login-register-wrapper" class="wrapper">
            <div class="auth-container">
                <h2 class="auth-title">${isLogin ? 'Login' : 'Register'}</h2>
                <form id="authForm" class="auth-form">
                    ${!isLogin ? '<input type="email" id="email" placeholder="Email" class="auth-input" required><br>' : ''}
                    <input type="text" value="Adam" id="username" placeholder="Username" class="auth-input" required><br>
                    <input type="password" value="lol" id="password" placeholder="Password" class="auth-input" required><br>
                    <button type="submit" class="auth-button">${isLogin ? 'Login' : 'Register'}</button>
                </form>
                <button id="toggleForm" class="toggle-button">${isLogin ? 'Switch to Register' : 'Switch to Login'}</button>
                <div id="message" class="auth-message"></div>
            </div>
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
                    const token = result.token;
                    window.localStorage.setItem('token', token);
                    await STATE.fillState(token)
                    console.log(STATE.getEntity('userWorkouts'))
                    PubSub.publish({ event: 'renderHome', detail: null });

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
