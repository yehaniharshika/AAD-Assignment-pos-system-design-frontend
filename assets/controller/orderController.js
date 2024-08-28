let customerData = [];
let itemData = [];
let items = [];

window.addEventListener('load', () => {
    loadCustomerIDs();
    loadItemCodes();
    setOrderDate();
    fetchOrderId();
});

function setOrderDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('order-date').value = today;
}

function fetchOrderId() {
    fetch("http://localhost:8081/posSystem/order?action=generateOrderId")
        .then(response => response.json())
        .then(orderId => {
            document.getElementById("order-id").value = orderId;
            console.log(orderId);
        })
        .catch(error => console.error("Error fetching order ID:", error));
}

// function loadItemCodes() {
//     const http = new XMLHttpRequest();
//     http.onreadystatechange = () => {
//         if (http.readyState === 4 && http.status === 200) {
//             itemData = JSON.parse(http.responseText);
//             itemData.forEach((item) => {
//                 $("#itemCodeOption").append(new Option(item.itemCode, item.itemCode));
//                 console.log("Successfully loaded item codes");
//             });
//         }
//     };
//     http.open("GET", "http://localhost:8081/posSystem/item", true);
//     http.send();
// }
//
// document.getElementById('itemCodeOption').addEventListener('change', function() {
//     const selectedItemCode = this.value;
//     const selectedItem = itemData.find(item => item.itemCode === selectedItemCode);
//
//     if (selectedItem) {
//         document.getElementById('set-order-form-item-name').value = selectedItem.itemName;
//         document.getElementById('set-order-form-item-price').value = selectedItem.unitPrice;
//         document.getElementById('set-item-qty-on-hand').value = selectedItem.qtyOnHand;
//     }
// });
//
// function loadCustomerIDs() {
//     const http = new XMLHttpRequest();
//     http.onreadystatechange = () => {
//         if (http.readyState === 4 && http.status === 200) {
//             customerData = JSON.parse(http.responseText);
//             customerData.forEach((customer) => {
//                 $("#custIdOption").append(new Option(customer.customerId, customer.customerId));
//                 console.log("Successfully loaded customer IDs");
//             });
//         }
//     };
//     http.open("GET", "http://localhost:8081/posSystem/customer", true);
//     http.send();
// }
//
// document.getElementById('custIdOption').addEventListener('change', function() {
//     const selectedCustomerId = this.value;
//     const selectedCustomer = customerData.find(customer => customer.customerId === selectedCustomerId);
//
//     if (selectedCustomer) {
//         document.getElementById('set-customer-name').value = selectedCustomer.name;
//         document.getElementById('set-customer-email').value = selectedCustomer.email;
//     }
// });
//
// document.getElementById('add-to-cart-btn').addEventListener('click', function() {
//     const itemCode = document.getElementById('itemCodeOption').value;
//     const itemName = document.getElementById('set-order-form-item-name').value;
//     const itemPrice = parseFloat(document.getElementById('set-order-form-item-price').value); // changed from unitPrice to itemPrice
//     const qtyOnHand = parseInt(document.getElementById('set-item-qty-on-hand').value, 10);
//     const qty = parseInt(document.getElementById('order-form-get-qty').value, 10);
//
//     // Ensure all values are defined and valid before proceeding
//     if (!itemCode || !itemName || isNaN(itemPrice) || isNaN(qty) || qty <= 0 || qty > qtyOnHand) {
//         alert('Please fill in all fields correctly and ensure quantity is within stock.');
//         return;
//     }
//
//     const total = (itemPrice * qty).toFixed(2);
//
//     const xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status === 200) {
//                 console.log('Item quantity updated successfully in the database');
//
//                 items.push({
//                     itemCode: itemCode,
//                     itemName: itemName,
//                     price: itemPrice, // changed from unitPrice to itemPrice
//                     qtyOnHand: qtyOnHand - qty,
//                     qty: qty,
//                     total: parseFloat(total)
//                 });
//
//                 const itemIndex = itemData.findIndex(item => item.itemCode === itemCode);
//                 if (itemIndex !== -1) {
//                     itemData[itemIndex].qtyOnHand -= qty;
//                 }
//
//                 populateItemTable();
//                 document.querySelector('form').reset();
//                 document.getElementById('itemCodeOption').focus();
//                 updateTotal();
//             } else {
//                 alert('Failed to update item quantity in the database');
//             }
//         }
//     };
//
//     xhr.open("PUT", `http://localhost:8081/posSystem/item?itemCode=${itemCode}`, true);
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.send(JSON.stringify({
//         qtyOnHand: qtyOnHand - qty,
//         itemName: itemName,
//         unitPrice: itemPrice // changed from unitPrice to itemPrice
//     }));
// });
//
//
// function populateItemTable() {
//     const tbody = $('#item-order-table tbody');
//     tbody.empty();
//
//     items.forEach(item => {
//         tbody.append(`
//             <tr>
//                 <td>${item.itemCode}</td>
//                 <td>${item.itemName}</td>
//                 <td>${item.price.toFixed(2)}</td>
//                 <td>${item.qtyOnHand}</td>
//                 <td>${item.qty}</td>
//                 <td>${item.total.toFixed(2)}</td>
//             </tr>
//         `);
//     });
// }
//
// function updateTotal() {
//     let totalVal = 0;
//     items.forEach(item => {
//         totalVal += item.total
//     });
//
//     $('#total').val(totalVal.toFixed(2));
//     updateSubTotal();
// }
//
// function updateSubTotal() {
//     const total = parseFloat($('#total').val()) || 0;
//     const discount = parseFloat($('#discount').val()) || 0;
//     const subTotal = total - (total * discount / 100);
//     $('#sub-total').val(subTotal.toFixed(2));
// }
//
// $('#discount').on('input', updateSubTotal);
//
// $('#cash').on('input', function() {
//     const subTotal = parseFloat($('#sub-total').val()) || 0;
//     const cash = parseFloat($(this).val()) || 0;
//     const balance = cash - subTotal;
//     $('#balance').val(balance.toFixed(2));
// });
//
// document.getElementById('item-order-table').addEventListener('click', function(e) {
//     if (e.target && e.target.matches('tr')) {
//         const row = e.target;
//         const cells = row.getElementsByTagName('td');
//
//         document.getElementById('itemCodeOption').value = cells[0].textContent;
//         document.getElementById('set-order-form-item-name').value = cells[1].textContent;
//         document.getElementById('set-order-form-item-price').value = cells[2].textContent;
//         document.getElementById('set-item-qty-on-hand').value = cells[3].textContent;
//         document.getElementById('order-form-get-qty').value = cells[4].textContent;
//     }
// });
//
// document.getElementById('remove-item-btn').addEventListener('click', function() {
//     const itemCode = document.getElementById('itemCodeOption').value;
//     if (itemCode) {
//         const itemIndex = items.findIndex(item => item.itemCode === itemCode);
//         if (itemIndex !== -1) {
//             const removedItem = items.splice(itemIndex, 1)[0];
//             const itemInData = itemData.find(item => item.itemCode === removedItem.itemCode);
//             if (itemInData) {
//                 itemInData.qtyOnHand += removedItem.qty;
//             }
//             populateItemTable();
//             updateTotal();
//         }
//     }
// });
//
// document.getElementById('btn-purchase').addEventListener('click', function() {
//     const orderId = document.getElementById('order-id').value;
//     const orderDate = document.getElementById('order-date').value;
//     const customerId = document.getElementById('custIdOption').value;
//     const discount = parseFloat(document.getElementById('discount').value) || 0;
//     const cash = parseFloat(document.getElementById('cash').value) || 0;
//     const total = parseFloat(document.getElementById('total').value) || 0;
//     const subTotal = parseFloat(document.getElementById('sub-total').value) || 0;
//     const balance = parseFloat(document.getElementById('balance').value) || 0;
//
//     const orderData = {
//         orderId: orderId,
//         orderDate: orderDate,
//         customerId: customerId,
//         discount: discount,
//         cash: cash,
//         total: total,
//         subTotal: subTotal,
//         balance: balance,
//         items: items
//     };
//
//     fetch('http://localhost:8081/posSystem/order', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(orderData)
//     })
//         .then(response => response.text())
//         .then(message => {
//             alert(message);
//             // Optionally reset form or perform other actions
//         })
//         .catch(error => console.error('Error:', error));
// });




//event handler for  Add item to cart button
/*$('#add-to-cart-btn').on('click', function() {
    const selectedItemCode = $('#itemCodeOption').val();
    const selectedItem = item_db.find(item => item.itemCode === selectedItemCode);
    const getQty = parseInt($('#order-form-get-qty').val(), 10);

    if (selectedItem && getQty && getQty <= selectedItem.qtyOnHand) {
        //calculates the total price for the item.
        const itemTotal = selectedItem.unitPrice * getQty;

        // Update order database-add data for order_db array
        items.push({
            itemCode: selectedItem.itemCode,
            itemName: selectedItem.itemName,
            price: selectedItem.unitPrice,
            qtyOnHand: selectedItem.qtyOnHand,
            qty: getQty,
            total: itemTotal
        });

        // Update the item quantity on hand in the database
        selectedItem.qtyOnHand -= getQty;

        // Populate the item order table
        populateItemTable();

        /!*Reset the item details*!/
        resetOrderItemDetails.click();
        // Update the total price
        updateTotal();
    } else {
        alert('Invalid quantity or item not in stock.');
    }
});

resetOrderItemDetails.on('click', function() {
    // Clear item details
    $('#itemCodeOption').val('select item code');
    $('#set-order-form-item-name').val('');
    $('#set-order-form-item-price').val('');
    $('#set-item-qty-on-hand').val('');
    $('#order-form-get-qty').val('');

    $("#update-item-btn").prop("disabled", true);
    $("#remove-item-btn").prop("disabled",true);
    $('#add-to-cart-btn').prop("disabled", false);
});


$("#item-order-table").on('click', 'tbody tr', function() {
    let index = $(this).index();
    recordIndex = index;

    console.log("index: ", index);

    let itemCodeValue = $(this).find('td:eq(0)').text();
    let itemNameValue = $(this).find('td:eq(1)').text();
    let priceValue = $(this).find('td:eq(2)').text();
    let qtyOnHandValue = $(this).find('td:eq(3)').text();
    let qtyValue= $(this).find('td:eq(4)').text();

    $("#itemCodeOption").val(itemCodeValue);
    $("#set-order-form-item-name").val(itemNameValue);
    $("#set-order-form-item-price").val(priceValue);
    $("#set-item-qty-on-hand").val(qtyOnHandValue);
    $("#order-form-get-qty").val(qtyValue);

    /!*updateItemBtn.prop("disabled", false);
    removeItemBtn.prop("disabled", false);
    $('#add-to-cart-btn').prop("disabled", true);*!/
});

function populateItemTable() {
    const tbody = $('#item-order-table tbody');
    tbody.empty();

    items.forEach(item => {
        tbody.append(`
            <tr>
                <td>${item.itemCode}</td>
                <td>${item.itemName}</td>
                <td>${item.price}</td>
                <td>${item.qtyOnHand}</td>
                <td>${item.qty}</td>
                <td>${item.total}</td>
            </tr>
        `);
    });
}

function updateTotal() {
    let total = 0;

    items.forEach(item => {
        total += item.total;
    });

    $('#total').val(total);
    updateSubTotal();
}

//update total price when giving discount
function updateSubTotal() {
    const total = parseFloat($('#total').val()) || 0;
    const discount = parseFloat($('#discount').val()) || 0;
    const subTotal = total - (total * discount / 100);
    $('#sub-total').val(subTotal);
}

//discount input
$('#discount').on('input', updateSubTotal);

//calculate balance
$('#cash').on('input', function() {
    const subTotal = parseFloat($('#sub-total').val()) || 0;
    const cash = parseFloat($(this).val()) || 0;
    const balance = cash - subTotal;
    $('#balance').val(balance);
});

resetAllButton.on("click", function () {
    // Reset the form fields to their initial state
    fillCurrentDate();
    loadAllCustomerId();
    loadAllItemCodes();
    $("#order-id").val(generateOrderId());
    $("#total").val('');    //reset the total
    $("#discount").val(''); //reset the discount
    $("#cash").val('');     // reset the cash input
    $("#sub-total").val(''); // reset the sub total input
    $("#set-customer-name").val('');
    $("#set-customer-email").val('');
    $("#set-order-form-item-name").val('');
    $("#set-order-form-item-price").val('');
    $("#set-item-qty-on-hand").val('');


    /!*clear the items array*!/
    items = [];

    /!*clear the item order table*!/
    $("#item-order-table tbody").empty();

    // $("#invoice-update-btn").prop("disabled", false);
    // $("#invoice-delete-btn").prop("disabled", false);
    // $("#btn-purchase").prop("disabled",true);
});

//purchase order
$('#btn-purchase').on('click', function() {
    //get the data needed for the order
    const orderId = $('#order-id').val();
    const orderDate = $('#order-date').val();
    const customerId = $('#custIdOption').val();
    const total = $('#total').val();
    const discount = $('#discount').val();
    const cash = $('#cash').val();

    let order = new OrderModel(
        orderId,
        orderDate,
        customerId,
        total,
        discount,
        cash
    );

    order_db.push(order);
    console.log(order);

    Swal.fire(
        'Order Placed Successfully!',
        'The order has been saved.',
        'success'
    );

    resetAllButton.click();
    populateOrderIdField();
    fillCurrentDate();
    // Repopulate the order details table
    populateTableOrderDetails();
});



$("#order-search").on('click', () => {
    let orderSearchId = $("#order-search-by-id").val();
    let order = order_db.find(order => order.orderId === orderSearchId);

    if (order) {
        $("#order-id").val(order.orderId);
        $("#order-date").val(order.orderDate);
        $("#custIdOption").val(order.customerId);
        $("#total").val(order.total);
        $("#discount").val(order.discount);

        const discountValue = parseFloat($("#discount").val()) || 0;
        const totalValue = parseFloat($("#total").val()) || 0;
        const subtotalValue = totalValue - (totalValue * (discountValue / 100));
        $("#sub-total").val(subtotalValue);

        const cashInput = $("#cash").val(order.cash);
        const cashValue = parseFloat(cashInput) || 0;
        const balanceValue = cashValue - subtotalValue;
        $("#balance").val(balanceValue);

        let customerObj = customer_db.find(customer => customer.customerId === order.customerId);

        if (customerObj) {
            $('#set-customer-name').val(customerObj.name);
            $('#set-customer-email').val(customerObj.email);
        }

        let items = order_details_db
            .filter(orderDetail => {
                if (!orderDetail.orderId) {
                    console.error('OrderDetail with undefined orderId:', orderDetail);
                    return false;
                }
                return orderDetail.orderId === orderSearchId;
            })
            .map(orderDetail => {
                if (!orderDetail.itemCode) {
                    console.error('OrderDetail with undefined itemCode:', orderDetail);
                    return null;
                }

                let item = item_db.find(item => item.itemCode === orderDetail.itemCode);

                if (item) {
                    return {
                        itemCode: item.itemCode,
                        itemName: item.itemName,
                        price: parseFloat(item.unitPrice),
                        qty: parseInt(orderDetail.qty),
                        total: parseFloat(orderDetail.qty * item.unitPrice)
                    };
                } else {
                    console.error(`Item not found for item code: ${orderDetail.itemCode}`);
                    return null;
                }
            });

        items = items.filter(item => item !== null);

        populateItemTableSelectOrderId(items);
    } else {
        console.log("Order not found or could not load the details.");
    }
});

function populateItemTableSelectOrderId(items) {
    const tbody = $('#item-order-table tbody');
    tbody.empty();

    items.forEach(item => {
        tbody.append(`
            <tr>
                <td>${item.itemCode}</td>
                <td>${item.itemName}</td>
                <td>${item.price}</td>
                <td>${item.qty}</td>
                <td>${item.total}</td>
            </tr>
        `);
    });
}*/





