// Displaying only one radio input depending on which is selected
const deliveryOption = document.getElementById('delivery');
const tableOption = document.getElementById('table');
const addressInput = document.querySelector('.address-input');
const tableNumberInput = document.querySelector('.table-number-input');

addressInput.style.display = 'none';
tableNumberInput.style.display = 'none';

deliveryOption.addEventListener('change', () => {
    if (deliveryOption.checked) {
        addressInput.style.display = 'block';
        tableNumberInput.style.display = 'none';
    }
});

tableOption.addEventListener('change', () => {
    if (tableOption.checked) {
        addressInput.style.display = 'none';
        tableNumberInput.style.display = 'block';
    }
});

// Visuals for the card and rotation
document.querySelector('.card-number-input').oninput = () => {
    document.querySelector('.card-number-box').innerText = document.querySelector('.card-number-input').value;
}

document.querySelector('.card-holder-input').oninput = () => {
    document.querySelector('.card-holder-name').innerText = document.querySelector('.card-holder-input').value;
}

document.querySelector('.month-input').oninput = () => {
    document.querySelector('.exp-month').innerText = document.querySelector('.month-input').value;
}

document.querySelector('.year-input').oninput = () => {
    document.querySelector('.exp-year').innerText = document.querySelector('.year-input').value;
}

document.querySelector('.cvv-input').onmouseenter = () => {
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(-180deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(0deg)';
}

document.querySelector('.cvv-input').onmouseleave = () => {
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(0deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(180deg)';
}

document.querySelector('.cvv-input').oninput = () => {
    document.querySelector('.cvv-box').innerText = document.querySelector('.cvv-input').value;
}




document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.querySelector('form')
    const addressInput = document.getElementById('address');
    const tableNumberInput = document.getElementById('table-number');
    const totalPrice = localStorage.getItem('totalPrice');

    // Generate the total price that was within the cart
    if (totalPrice) {
        document.getElementById('totalPriceContainer').innerText = `Total (including vat): $${totalPrice}`;
    }

    // Reintroduce the cart items so the user can confirm what they are purchasing
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (storedCartItems) {
            let cartHtml = '';
        storedCartItems.forEach(item => {
            cartHtml += `
                <li>
                    <div><img class="highlight-img" src="${item.image}"/></div>
                    <div>${item.name}</div>
                    <div>$${(item.price * item.quantity).toFixed(2).toLocaleString()}</div>
                    <div>
                        <div class="count">x ${item.quantity}</div>
                    </div>
                </li>
            `;
        });
        document.querySelector('.listCard').innerHTML = cartHtml;
    }


    // Submitting each ordered item seperately with the necessary information and the order number and user id to group them
    checkoutForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 

        const service = document.querySelector('input[name="service"]:checked').value;

        const token = localStorage.getItem('token');


        try {
            const orderResponses = await Promise.all(storedCartItems.map(async item => {
                const jsonData = {
                    menu_id: item.id,
                    qty: item.quantity,
                    price: item.price,
                    ...(service === 'delivery' ? { address: addressInput.value } : { table_num: tableNumberInput.value }),
                };


                const response = await fetch('http://localhost:3000/api/order', {
                    method: 'POST',
                    body: JSON.stringify(jsonData),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });           
    
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(`Failed to place order for item: ${item.id}`);
                }
    
                console.log(`Order placed successfully for item: ${item.id}`);

                return data.order.order_num;
            }));

            if (orderResponses.every(orderNum => orderNum)) {
                const firstItemOrderId = orderResponses[0];
                
                await fetchConfirmOrder(firstItemOrderId, token);
        
                displayMessage('Purchase successful!', true);
                setTimeout(() => {
                    window.location.href = '/menu';
                }, 3000);
            } else {
                throw new Error('Some orders were not placed successfully.');
            }
        } catch (error) {
            console.error('Registration Error:', error);
            displayMessage('Purchase failed', false);
        }
    }); 
    
    // Same display message function present in authentication.html to inform user of success or failure
    function displayMessage(message, isSuccess) {
        const messageContainer = document.getElementById('registration-message');
        messageContainer.textContent = message;

        if (isSuccess) {
            messageContainer.style.color = 'var(--primaryColor)'; 
        } else {
            messageContainer.style.color = 'rgba(211, 8, 8, 0.568)'; 
        }
    }

    // Cannot actually authenticate and transfer money from a card so this put request simulates this by updating the database with the users masked card number
    async function fetchConfirmOrder(orderId, token) {
        const cardNumber = document.querySelector('.card-number-input').value;

        const cardData = {
            paid_with: cardNumber,
        }

        try {
            const response = await fetch(`http://localhost:3000/api/order/payment/${orderId}`, {
                method: 'PUT',
                body: JSON.stringify(cardData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            if (response.ok) {
                // Handle successful response
                console.log(data); // Use data as needed
            } else {
                // Handle error response
                console.error('Error fetching confirm order data');
                throw new Error({ message: 'Payment Confirmation for Order failed'})
            }
        } catch (error) {
            // Handle fetch error
            console.error('Fetch Error:', error);
        }
    }


    // Disables the unselected radio button so that they can both have a required attribute 
    document.querySelectorAll('input[type=radio][name=service]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            if (this.value === 'delivery') {
                addressInput.removeAttribute('disabled');
                tableNumberInput.setAttribute('disabled', 'disabled');
            } else if (this.value === 'table') {
                tableNumberInput.removeAttribute('disabled');
                addressInput.setAttribute('disabled', 'disabled');
            }
        });
    });
});

