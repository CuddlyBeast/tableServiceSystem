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
let closeShopping = document.querySelector('.closeShopping')
let listCard = document.querySelector('.listCard')
let total = document.querySelector('.total')
let main = document.querySelector('.main')
let quantity = document.querySelector('.quantity')

openShopping.addEventListener('click', () => {
    main.classList.add('active')
})

closeShopping.addEventListener('click', () => {
    main.classList.remove('active')
})

// Updating Cart 

