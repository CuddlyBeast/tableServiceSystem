// Toggle for Sidebar

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


// item Slider for highlight and menu category sections

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

const openShopping = document.querySelector('.shopping');
const closeShopping = document.querySelector('.closeShopping');
const total = document.querySelector('.total');
const main = document.querySelector('.main');
const quantity = document.querySelector('.quantity');
const listCard = []; 

openShopping.addEventListener('click', () => {
    main.classList.add('active');
});

closeShopping.addEventListener('click', () => {
    main.classList.remove('active');
});

// Fetching data from API

document.addEventListener('DOMContentLoaded', async function() {
    const logout = document.getElementById('logout');
    const searchBtn = document.querySelector('.search-btn');
    const searchBar = document.querySelector('.search input');
    const filterCards = document.querySelectorAll('.filter-card');

    // Add click event listener to each filter card
    filterCards.forEach(filterCard => {
        filterCard.addEventListener('click', async function() {
            const filterType = filterCard.querySelector('p').textContent;

        filterCards.forEach(card => {
                card.classList.remove('active');
            });

        filterCard.classList.add('active');

        try {
            const response = await fetch('http://localhost:3000/api/menu');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            let filteredData;
            if (filterType === 'All Menus') {
                filteredData = data;
            } else {
                filteredData = data.filter(item => item.type.toLowerCase() === filterType.toLowerCase());
            }
            
            displayTableServiceData(filteredData);
        } catch (error) {
            console.error('Error:', error);
        }
    });
});


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

    // Logout
    logout.addEventListener('click', async function(event) {
        event.preventDefault(); 
    
        try {
            const response = await fetch('http://localhost:3000/api/logout', {
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
    
    // Search Bar Function
    searchBtn.addEventListener('click', async function() {
        try {
            const searchText = searchBar.value.trim().toLowerCase();
            if (searchText !== '') {
                const response = await fetch(`http://localhost:3000/api/menu?search=${searchText}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch search results');
                }
                const searchData = await response.json();
                displayTableServiceData(searchData, searchText);
            } else {
                const response = await fetch('http://localhost:3000/api/menu');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                displayTableServiceData(data);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    });

});

function displayTableServiceData(data, searchText = '') {
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

    if (searchText !== '') {
        data = data.filter(item => item.name.toLowerCase().includes(searchText));
    }

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
    updateLocalStorage(); 
}

function reloadCart() {
    let totalPrice = 0;
    let itemCount = 0;
    
    listCard.forEach(item => {
        totalPrice += item.price * item.quantity;
        itemCount += item.quantity;
    });

    const formattedTotalPrice = totalPrice.toFixed(2).toLocaleString();

    total.innerText = `$${formattedTotalPrice}`;
    quantity.innerText = itemCount;
    localStorage.setItem('totalPrice', formattedTotalPrice)

    renderCart();
}


function updateLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(listCard)); 
}


function renderCart() {
    let cartHtml = '';
    listCard.forEach((item, index) => {
        cartHtml += `
            <li>
                <div><img class="highlight-img" src="${item.image}"/></div>
                <div>${item.name}</div>
                <div>$${(item.price * item.quantity).toFixed(2).toLocaleString()}</div>
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


// Order Button in Cart linking to Required Payment
const onClickTotal = document.querySelector('.total');

onClickTotal.addEventListener('click', () => {
    window.location.href = '/payment';
})

