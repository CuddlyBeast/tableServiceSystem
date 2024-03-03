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

    if (totalPrice) {
        // Display the total price wherever needed on the page
        document.getElementById('totalPriceContainer').innerText = `Total (including vat): $${totalPrice}`;
    }


        // Example of retrieving cart information on the payment page
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


    checkoutForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get the values of the selected radio button
        const service = document.querySelector('input[name="service"]:checked').value;

        const token = localStorage.getItem('token');


        try {
            // Use Promise.all to send multiple requests asynchronously
            const orderResponses = await Promise.all(storedCartItems.map(async item => {
                // Create the JSON object containing only the desired fields for the current item
                const jsonData = {
                    menu_id: item.id,
                    qty: item.quantity,
                    price: item.price,
                    // Add either table number or address based on the selected service
                    ...(service === 'delivery' ? { address: addressInput.value } : { table_num: tableNumberInput.value }),
                };

             
                // Send POST request to backend for the current item
                const response = await fetch('http://localhost:3000/api/order', {
                    method: 'POST',
                    body: JSON.stringify(jsonData),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });           
    
                // Handle response
                const data = await response.json();
                if (!response.ok) {
                    // Throw an error if request failed
                    throw new Error(`Failed to place order for item: ${item.id}`);
                }
    
                // Log success message
                console.log(`Order placed successfully for item: ${item.id}`);

                return data.order.order_num;
            }));

    
            if (orderResponses.every(orderNum => orderNum)) {
                // Use the order number from the first item to confirm the order
                const firstItemOrderId = orderResponses[0];
                
                // Call fetchConfirmOrder once after all orders have been placed
                await fetchConfirmOrder(firstItemOrderId, token);
        
                // If all requests succeed, display success message and redirect
                displayMessage('Purchase successful!', true);
                setTimeout(() => {
                    window.location.href = '/menu';
                }, 3000);
            } else {
                // Handle error if any order was not successfully placed
                throw new Error('Some orders were not placed successfully.');
            }
        } catch (error) {
            // Handle error
            console.error('Registration Error:', error);
            displayMessage('Purchase failed', false);
        }
    }); 
    
    function displayMessage(message, isSuccess) {
        const messageContainer = document.getElementById('registration-message');
        messageContainer.textContent = message;

        if (isSuccess) {
            messageContainer.style.color = 'green'; 
        } else {
            messageContainer.style.color = 'red'; 
        }
    }


    async function fetchConfirmOrder(orderId, token) {
        const cardNumber = document.querySelector('.card-number-input').value;

        const cardData = {
            paid_with: cardNumber,
        }

        console.log(cardData)

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


    // Listen for changes in radio button selection
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

    // // Initially disable the table number input by default
    // tableNumberInput.setAttribute('disabled', 'disabled');

});

