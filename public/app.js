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
let listCard = []; // Store item data in JavaScript array

openShopping.addEventListener('click', () => {
    main.classList.add('active');
});

closeShopping.addEventListener('click', () => {
    main.classList.remove('active');
});

// Fetching data from API

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Make API request to retrieve table service data
        const response = await fetch('http://localhost:3000/api/menu');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        // Display table service data on the HTML page
        displayTableServiceData(data);
    } catch (error) {
        console.error('Error:', error);
    }
});

function displayTableServiceData(data) {
    // Assuming data is an array of objects
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

    // Update the content of the container div (e.g., detail-wrapper)
    document.querySelector('.detail-wrapper').innerHTML = detailCardsHtml;

    // Update the content of the highlight-wrapper div
    document.querySelector('.highlight-wrapper').innerHTML = tableDataHtml;

    // Add event listeners to the add-to-cart buttons
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

    total.innerText = totalPrice.toLocaleString();
    quantity.innerText = itemCount;

    renderCart();
}

function renderCart() {
    let cartHtml = '';
    listCard.forEach(item => {
        cartHtml += `
            <li>
                <div><img src="${item.image}"/></div>
                <div>${item.name}</div>
                <div>$${(item.price * item.quantity).toLocaleString()}</div>
                <div>
                    <button onclick="changeQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <div class="count">${item.quantity}</div>
                    <button onclick="changeQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </li>
        `;
    });
    document.querySelector('.listCard').innerHTML = cartHtml;
}

// function changeQuantity(key, quantity) {
//     if (quantity === 0) {
//         delete listCard[key]
//     } else {
//         listCard[key].quantity = quantity
//         listCard[key].price = quantity * listCard[key].price
//     }
//     reloadCart()
// }







// function initApp(){
//     products.forEach(item =>{
//         let newDiv = document.createElement('div');
//         newDiv.innerHTML = 
//             `<img src="image/${item.image}"/>
//             <div class="title">${item.name}</div>
//             <div class="price">${item.price.toLocaleString()}</div>
//             <button onclick="addToCard(${item}">Add To Cart</button>`
//             ;
//         main.appendChild(newDiv);
//     })
// }