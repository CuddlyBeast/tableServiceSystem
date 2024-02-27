// item Slider for highlight and menu category sections

const mobile = document.querySelector('.menu-toggle');
const mobileLink = document.querySelector('.sidebar');

mobile.addEventListener("click", function(){
    mobile.classList.toggle("is-active");
    mobileLink.classList.toggle("active");
});

mobileLink.addEventListener("click", function(){
    const menuBars = document.querySelector(".is-active");
    if(window.innerWidth <= 768 && menuBars) {
        mobile.classList.toggle("is-active");
        mobileLink.classList.toggle("active");
    }
});

let step = 100;
let stepFilter = 60;
let scrolling = true;

$(".back").bind("click", function(e){
    e.preventDefault();
    $(".highlight-wrapper").animate({
        scrollLeft: "-=" + step + "px"
    })
});

$(".next").bind("click", function(e){
    e.preventDefault();
    $(".highlight-wrapper").animate({
        scrollLeft: "+=" + step + "px"
    })
});

$(".back-menus").bind("click", function(e){
    e.preventDefault();
    $(".filter-wrapper").animate({
        scrollLeft: "-=" + stepFilter + "px"
    })
});

$(".next-menus").bind("click", function(e){
    e.preventDefault();
    $(".filter-wrapper").animate({
        scrollLeft: "+=" + stepFilter + "px"
    })
});

// Cart open and close

let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let total = document.querySelector('.total');
let main = document.querySelector('.main');
let quantity = document.querySelector('.quantity');
let listCard = []; 

openShopping.addEventListener('click', () => {
    main.classList.add('active');
});

closeShopping.addEventListener('click', () => {
    main.classList.remove('active');
});

// Fetching data from API

document.addEventListener('DOMContentLoaded', async function() {
    const logout = document.getElementById('logout');

    try {
        const response = await fetch('http://localhost:3000/api/menu');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        displayTableServiceData(data);
    } catch (error) {
        console.error('Error:', error);
    }

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
    

});

function displayTableServiceData(data) {
    let tableDataHtml = '';
    let detailCardsHtml = '';
    data.forEach(item => {
        tableDataHtml += `
            <div class="highlight-card">
                <img class="highlight-img" src="${item.image}">
                <div class="highlight-desc">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                    <button class="add-to-cart" data-item-id="${item.id}" data-item-price="${item.price}" data-item-name="${item.name}" data-item-image="${item.image}"><ion-icon class="detail-favourites" name="add-circle-outline"></ion-icon></button>
                </div>
            </div>`;
    });

    data.forEach(item => {
        detailCardsHtml += `
            <div class="detail-card">
                <img class="detail-img" src="${item.image}">
                <div class="detail-desc">
                    <div class="detail-name">
                        <h4 data-item-id="${item.id}">${item.name}</h4>
                        <p class="detail-sub">${item.detail}</p>
                        <p class="price find-price" data-item-price="${item.price}">$${item.price}</p>
                    </div>
                    <button class="add-to-cart" data-item-id="${item.id}" data-item-price="${item.price}" data-item-name="${item.name}" data-item-image="${item.image}"><ion-icon class="detail-favourites" name="add-circle-outline"></ion-icon></button>
                </div>
            </div>`;
    });

    document.querySelector('.detail-wrapper').innerHTML = detailCardsHtml;

    document.querySelector('.highlight-wrapper').innerHTML = tableDataHtml;

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            addToCart(button);
        });
    });
}

// Updating Cart 

function addToCart(button) {
    const itemId = button.getAttribute('data-item-id');
    const itemName = button.getAttribute('data-item-name');
    const itemImage = button.getAttribute('data-item-image');
    const itemPrice = parseFloat(button.getAttribute('data-item-price'));
    let existingItem = listCard.find(cartItem => cartItem.id === itemId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        listCard.push({ id: itemId, name: itemName, image: itemImage, price: itemPrice, quantity: 1 });
    }
    reloadCart();
}

function reloadCart() {
    let totalPrice = 0;
    let itemCount = 0;
    
    listCard.forEach(item => {
        totalPrice += item.price * item.quantity;
        itemCount += item.quantity;
    });

    total.innerText = `$${totalPrice.toLocaleString()}`;
    quantity.innerText = itemCount;

    renderCart();
}

function renderCart() {
    let cartHtml = '';
    listCard.forEach((item, index) => {
        cartHtml += `
            <li>
                <div><img class="highlight-img" src="${item.image}"/></div>
                <div>${item.name}</div>
                <div>$${(item.price * item.quantity).toLocaleString()}</div>
                <div>
                    <button class="quantity-change" data-index="${index}" data-change="-1">-</button>
                    <div class="count">${item.quantity}</div>
                    <button class="quantity-change" data-index="${index}" data-change="1">+</button>
                </div>
            </li>
        `;
    });
    document.querySelector('.listCard').innerHTML = cartHtml;

    document.querySelectorAll('.quantity-change').forEach(button => {
        button.addEventListener('click', () => {
            handleQuantityChange(button)
        });
    });
}

function handleQuantityChange(button) {
    const index = parseInt(button.dataset.index);
    const change = parseInt(button.dataset.change);
    const newQuantity = listCard[index].quantity + change;
    if (newQuantity >= 0) {
        changeQuantity(index, newQuantity);
    }
}


function changeQuantity(index, quantity) {
    if (quantity === 0) {
        listCard.splice(index, 1); 
    } else {
        listCard[index].quantity = quantity; 
    }
    reloadCart();
}


