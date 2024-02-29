const mobile = document.querySelector('.menu-toggle');
const mobileLink = document.querySelector('.sidebar');

mobile.addEventListener("click", function(){
    mobile.classList.toggle("is-active");
    mobileLink.classList.toggle("active");
});

mobileLink.addEventListener("click", function(){
    const menuBars = document.querySelector(".is-active");
    if(window.innerWidth <= 1100 && menuBars) {
        mobile.classList.toggle("is-active");
        mobileLink.classList.toggle("active");
    }
});


logout.addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent default form submission

    try {
        // Send GET request to logout endpoint
        const response = await fetch('http://localhost:3000/api/logout', {
            method: 'GET'
        });

        // Check if response is successful
        if (response.ok) {
            // Redirect to index.html upon successful logout
            window.location.href = "/";
        } else {
            // Handle logout failure
            throw new Error('Logout failed');
        }
    } catch (error) {
        // Handle error
        console.error('Logout Error:', error);
    }
});