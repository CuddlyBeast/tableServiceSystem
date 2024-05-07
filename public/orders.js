const BASE_URL = "https://glutton4grub-d79cf866d83c.herokuapp.com/";

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


document.addEventListener('DOMContentLoaded', async function() {
    try {
        const token = localStorage.getItem('token')


        const response = await fetch(`${BASE_URL}api/order/history`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }); 
        const orders = await response.json();
        
        const menuResponse = await fetch(`${BASE_URL}api/menu`);
        const menuData = await menuResponse.json();

        const groupedOrders = groupOrdersByOrderNumber(orders);

        let orderHistoryHtml = '';

        // Populate orders in the HTML
        groupedOrders.forEach(orderGroup => {
               const firstOrder = orderGroup[0];
               let totalPrice = 0;
               let orderInfoHtml = '';
               
               orderHistoryHtml += `
               <div class="order-info">
                   <h2 class="main-title">Order Number: ${firstOrder.order_num}   <button class="delete-order" data-order-id="${firstOrder.order_num}"><ion-icon name="trash-outline"></ion-icon></button></h2>
                   <p>Time of Purchase: ${firstOrder.updated_at.slice(11, 19)} | ${firstOrder.updated_at.slice(0, 10)}</p>
                   <p>Paid With: ${firstOrder.paid_with}</p>
           `;

          
        if (firstOrder.table_num !== 0) {
            orderInfoHtml = `<p>Table Number: ${firstOrder.table_num}</p>`;
        }
        
        
        if (firstOrder.address.toLowerCase() !== 'n/a') {
            orderInfoHtml = `<p>Address: ${firstOrder.address}</p>`;
        }

        orderInfoHtml += `</div>`;
        orderHistoryHtml += orderInfoHtml;

            
            orderGroup.forEach(order => {
                const menuItem = menuData.find(item => item.id === order.menu_id);

                const itemName = menuItem ? menuItem.name : 'Unknown Item';
                const itemImage = menuItem ? menuItem.image : 'Unknown Image';
                
                orderHistoryHtml += `
                    <div class="order-item">
                        <div><img class="highlight-img" src="${itemImage}"/></div>
                        <p>Item Name: ${itemName}</p>
                        <p>Quantity: ${order.qty}</p>
                        <p>Price: $${parseFloat(order.price * order.qty).toFixed(2)}</p>
                    </div>
                `;

                  totalPrice += parseFloat(order.price) * order.qty;
            });

            orderHistoryHtml += `
            <div class="order-total">
                <p><strong>Total Price: $${totalPrice.toFixed(2)}</strong></p>
            </div>
            <hr class="divider">
            `;
        });

        document.querySelector('.order-history').innerHTML = orderHistoryHtml;


        // Delete Order Button
        document.querySelectorAll('.delete-order').forEach(button => {
            button.addEventListener('click', async () => {
                const orderId = parseInt(button.dataset.orderId);
                try {
                    const response = await fetch(`${BASE_URL}api/order/delete/${orderId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to delete order');
                    }
                    location.reload();
                } catch (error) {
                    console.error('Error deleting order:', error);
                }
            });

           // Get the order creation time
           const orderId = parseInt(button.dataset.orderId);
           const order = orders.find(order => order.order_num === orderId);
           const orderCreationTime = new Date(order.updated_at).getTime();


           // Calculate the time elapsed since the order was made
           const currentTime = new Date().getTime();
           const timeElapsed = currentTime - orderCreationTime;

           // Set the timeout to hide the delete button after five minutes since the order was made
           const timeLimit = 300000;
           const timeRemaining = Math.max(timeLimit - timeElapsed, 0);
           setTimeout(() => {
               button.style.display = 'none';
           }, timeRemaining);
       });


    } catch (error) {
        console.error('Error fetching orders:', error);
    }
});


// Function to group orders by order number DESC
function groupOrdersByOrderNumber(orders) {
    const groupedOrders = {};
    orders.forEach(order => {
        if (!groupedOrders[order.order_num]) {
            groupedOrders[order.order_num] = [];
        }
        groupedOrders[order.order_num].push(order);
    });

    const sortedOrderNumbers = Object.keys(groupedOrders).sort((a, b) => b - a);

    const descendingGroupedOrders = sortedOrderNumbers.map(orderNum => groupedOrders[orderNum]);

    return descendingGroupedOrders;
}
