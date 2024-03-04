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


        const response = await fetch('http://localhost:3000/api/order/history', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }); 
        const orders = await response.json();
        
        const menuResponse = await fetch('http://localhost:3000/api/menu');
        const menuData = await menuResponse.json();


        const groupedOrders = groupOrdersByOrderNumber(orders);

        // Clear previous content
        let orderHistoryHtml = '';

        // Populate orders in the HTML
        groupedOrders.forEach(orderGroup => {
               const firstOrder = orderGroup[0]; // Get the first order in the group
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

            
            // Iterate over each item in the order group
            orderGroup.forEach(order => {
                // Find the corresponding item in the menu data
                const menuItem = menuData.find(item => item.id === order.menu_id);

                // Display item information
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

                  // Accumulate total price
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
                const orderId = button.dataset.orderId;
                try {
                    const response = await fetch(`http://localhost:3000/api/order/delete/${orderId}`, {
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
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
    }
});


// Function to group orders by order number
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
