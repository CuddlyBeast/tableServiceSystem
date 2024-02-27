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

    // Function to handle login
    const handleLogin = async (email, password) => {
        try {
            // Send POST request to backend
            const response = await fetch('http://localhost:3000/api/signin', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // Check if response is successful
            if (response.ok) {
                // Parse the response JSON
                const data = await response.json();

                // Store the JWT token securely (e.g., in local storage)
                localStorage.setItem('token', data.token);

                // Redirect to index.html upon successful login
                window.location.href = '/index.html';
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            // Handle error
            console.error('Login Error:', error);
        }
    };

    // Add event listener for login form submission
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get email and password from the form
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Call the handleLogin function
        handleLogin(email, password);
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
