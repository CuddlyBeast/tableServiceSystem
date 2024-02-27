// Swap between Sign-in And Sign-up Form

const wrapper = document.querySelector('.wrapper')
const loginLink = document.querySelector('.login-link')
const registerLink = document.querySelector('.register-link')

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});



// Functionality of Signing-in and Signing-up

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registrationForm = document.getElementById('registration-form');

    // Add event listener for login form submission
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        const formData = new FormData(loginForm);

        try {
            // Send POST request to backend
            const response = await fetch('http://localhost:3000/api/signin', {
                method: 'POST',
                body: formData
            });

            // Check if response is successful
            if (!response.ok) {
                throw new Error('Login failed'); // Throw error if response is not OK
            }

            // Redirect to index.html upon successful login
            window.location.href = '/index.html';
        } catch (error) {
            // Handle error
            console.error('Login Error:', error);
        }
    });

    // Add event listener for registration form submission
    registrationForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        
        // Get form data
        const formData = new FormData(registrationForm);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
    
        try {
            // Send POST request to backend
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                body: JSON.stringify(jsonData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            // Handle response
            // Example: Convert response to JSON and log it
            const data = await response.json();
            console.log('Registration Response:', data);
        } catch (error) {
            // Handle error
            console.error('Registration Error:', error);
        }
    });    
});
