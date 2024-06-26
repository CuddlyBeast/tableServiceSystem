const BASE_URL = "https://glutton4grub-d79cf866d83c.herokuapp.com/";

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
    event.preventDefault();

    try {
        const response = await fetch(`${BASE_URL}api/logout`, {
            method: 'GET'
        });

        if (response.ok) {
            window.location.href = "/";
        } else {
            throw new Error('Logout failed');
        }
    } catch (error) {
        console.error('Logout Error:', error);
    }
});