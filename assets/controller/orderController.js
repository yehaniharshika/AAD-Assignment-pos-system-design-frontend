let customerData = [];
let itemData = [];
let items = [];

window.addEventListener('load', () => {
    loadCustomerIDs();
    loadItemCodes();
    setOrderDate();
    fetchOrderId();
    fetchOrderData();
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

function loadItemCodes() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4 && http.status === 200) {
            itemData = JSON.parse(http.responseText);
            itemData.forEach((item) => {
                $("#itemCodeOption").append(new Option(item.itemCode, item.itemCode));
                console.log("Successfully loaded item codes");
            });
        }
    };
    http.open("GET", "http://localhost:8081/posSystem/item", true);
    http.send();
}

document.getElementById('itemCodeOption').addEventListener('change', function() {
    const selectedItemCode = this.value;
    const selectedItem = itemData.find(item => item.itemCode === selectedItemCode);

    if (selectedItem) {
        document.getElementById('set-order-form-item-name').value = selectedItem.itemName;
        document.getElementById('set-order-form-item-price').value = selectedItem.unitPrice;
        document.getElementById('set-item-qty-on-hand').value = selectedItem.qtyOnHand;
    }
});

function loadCustomerIDs() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4 && http.status === 200) {
            customerData = JSON.parse(http.responseText);
            customerData.forEach((customer) => {
                $("#custIdOption").append(new Option(customer.customerId, customer.customerId));
                console.log("Successfully loaded customer IDs");
            });
        }
    };
    http.open("GET", "http://localhost:8081/posSystem/customer", true);
    http.send();
}

document.getElementById('custIdOption').addEventListener('change', function() {
    const selectedCustomerId = this.value;
    const selectedCustomer = customerData.find(customer => customer.customerId === selectedCustomerId);

    if (selectedCustomer) {
        document.getElementById('set-customer-name').value = selectedCustomer.name;
        document.getElementById('set-customer-email').value = selectedCustomer.email;
    }
});

document.getElementById('add-to-cart-btn').addEventListener('click', function() {
    const itemCode = document.getElementById('itemCodeOption').value;
    const itemName = document.getElementById('set-order-form-item-name').value;
    const itemPrice = parseFloat(document.getElementById('set-order-form-item-price').value); // changed from unitPrice to itemPrice
    const qtyOnHand = parseInt(document.getElementById('set-item-qty-on-hand').value, 10);
    const qty = parseInt(document.getElementById('order-form-get-qty').value, 10);

    // Ensure all values are defined and valid before proceeding
    if (!itemCode || !itemName || isNaN(itemPrice) || isNaN(qty) || qty <= 0 || qty > qtyOnHand) {
        alert('Please fill in all fields correctly and ensure quantity is within stock.');
        return;
    }

    const total = (itemPrice * qty).toFixed(2);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Item quantity updated successfully in the database');

                items.push({
                    itemCode: itemCode,
                    itemName: itemName,
                    price: itemPrice, // changed from unitPrice to itemPrice
                    qtyOnHand: qtyOnHand - qty,
                    qty: qty,
                    total: parseFloat(total)
                });

                const itemIndex = itemData.findIndex(item => item.itemCode === itemCode);
                if (itemIndex !== -1) {
                    itemData[itemIndex].qtyOnHand -= qty;
                }

                populateItemTable();
                document.querySelector('form').reset();
                document.getElementById('itemCodeOption').focus();
                updateTotal();
            } else {
                alert('Failed to update item quantity in the database');
            }
        }
    };

    xhr.open("PUT", `http://localhost:8081/posSystem/item?itemCode=${itemCode}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        qtyOnHand: qtyOnHand - qty,
        itemName: itemName,
        unitPrice: itemPrice // changed from unitPrice to itemPrice
    }));
});


function populateItemTable() {
    const tbody = $('#item-order-table tbody');
    tbody.empty();

    items.forEach(item => {
        tbody.append(`
            <tr>
                <td>${item.itemCode}</td>
                <td>${item.itemName}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.qtyOnHand}</td>
                <td>${item.qty}</td>
                <td>${item.total.toFixed(2)}</td>
            </tr>
        `);
    });
}

function updateTotal() {
    let totalVal = 0;
    items.forEach(item => {
        totalVal += item.total
    });

    $('#total').val(totalVal.toFixed(2));
    updateSubTotal();
}

function updateSubTotal() {
    const total = parseFloat($('#total').val()) || 0;
    const discount = parseFloat($('#discount').val()) || 0;
    const subTotal = total - (total * discount / 100);
    $('#sub-total').val(subTotal.toFixed(2));
}

$('#discount').on('input', updateSubTotal);

$('#cash').on('input', function() {
    const subTotal = parseFloat($('#sub-total').val()) || 0;
    const cash = parseFloat($(this).val()) || 0;
    const balance = cash - subTotal;
    $('#balance').val(balance.toFixed(2));
});

document.getElementById('item-order-table').addEventListener('click', function(e) {
    if (e.target && e.target.matches('tr')) {
        const row = e.target;
        const cells = row.getElementsByTagName('td');

        document.getElementById('itemCodeOption').value = cells[0].textContent;
        document.getElementById('set-order-form-item-name').value = cells[1].textContent;
        document.getElementById('set-order-form-item-price').value = cells[2].textContent;
        document.getElementById('set-item-qty-on-hand').value = cells[3].textContent;
        document.getElementById('order-form-get-qty').value = cells[4].textContent;
    }
});

document.getElementById('remove-item-btn').addEventListener('click', function() {
    const itemCode = document.getElementById('itemCodeOption').value;
    if (itemCode) {
        const itemIndex = items.findIndex(item => item.itemCode === itemCode);
        if (itemIndex !== -1) {
            const removedItem = items.splice(itemIndex, 1)[0];
            const itemInData = itemData.find(item => item.itemCode === removedItem.itemCode);
            if (itemInData) {
                itemInData.qtyOnHand += removedItem.qty;
            }
            populateItemTable();
            updateTotal();
        }
    }
});

document.getElementById('btn-purchase').addEventListener('click', function() {
    const orderId = document.getElementById('order-id').value;
    const orderDate = document.getElementById('order-date').value;
    const customerId = document.getElementById('custIdOption').value;
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const cash = parseFloat(document.getElementById('cash').value) || 0;
    const total = parseFloat(document.getElementById('total').value) || 0;
    const subTotal = parseFloat(document.getElementById('sub-total').value) || 0;
    const balance = parseFloat(document.getElementById('balance').value) || 0;

    const orderData = {
        orderId: orderId,
        orderDate: orderDate,
        customerId: customerId,
        discount: discount,
        cash: cash,
        total: total,
        subTotal: subTotal,
        balance: balance,
        items: items
    };

    fetch('http://localhost:8081/posSystem/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
        .then(response => response.text())
        .then(message => {
            Swal.fire(
                'Save Successfully!',
                'Customer saved successfully.',
                'success'
            );
            console.log("order success");
            fetchOrderData();
            clearFields();
            fetchOrderId();
            console.log("fetch data");
            // Optionally reset form or perform other actions
        })
        .catch(error => console.error('Error:', error));
});

function clearFields() {
    $("#order-id").val('');
    $("#total").val('');
    $("#discount").val('');
    $("#balance").val('');
    $("#cash").val('');
    $("#sub-total").val('');
    $("#set-customer-name").val('');
    $("#set-customer-email").val('');
    $("#set-order-form-item-name").val('');
    $("#set-order-form-item-price").val('');
    $("#set-item-qty-on-hand").val('');
}
function fetchOrderData() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                // Parse the response JSON and update the table
                const orderData = JSON.parse(http.responseText);
                loadTable(orderData);
            } else {
                console.log("Failed to fetch order data");
            }
        }
    };
    http.open("GET", "http://localhost:8081/posSystem/order", true);
    http.send();
}

function loadTable(orderData) {
    const tbody = $("#item-details-table tbody");
    tbody.empty();

    orderData.forEach((order) => {
        let record = `<tr>
            <td>${order.orderId}</td>
            <td>${order.orderDate}</td>
            <td>${order.customerId}</td>
            <td>${order.total}</td>
            <td>${order.discount}</td>
            <td>${order.subTotal}</td>
            <td>${order.cash}</td>
            <td>${order.balance}</td>
        </tr>`;
        tbody.append(record);
    });
}

$("#order-search").on('click',() =>{
    let orderSearchId = $("#order-search-by-id").val();

    if (!orderSearchId){
        Swal.fire(
            'Input Required',
            'Please enter a order ID to search.',
            'warning'
        );
        return;
    }

    console.log("searching for order ID: ",orderSearchId);
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const order = JSON.parse(http.responseText);
                console.log(order);

                $("#order-id").val(order.orderId);
                $("#order-date").val(order.orderDate);
                $("#custIdOption").val(order.customerId);
                $("#set-customer-name").val(order.name);
                $("#set-customer-email").val(order.email);
                $("#total").val(order.total);
                $("#discount").val(order.discount);
                $("#sub-total").val(order.subTotal);
                $("#cash").val(order.cash);
                $("#balance").val(order.balance);

                Swal.fire(
                    'order Found!',
                    'order details retrieved successfully.',
                    'success'
                );

                setTimeout(() =>{
                    clearFields();
                },10000);
                fetchOrderId();
                setOrderDate();
            } else {
                console.log("Failed to find order");
                console.log("HTTP Status: ", http.status);

                Swal.fire(
                    'Not Found!',
                    'order not found.',
                    'error'
                );

                $("#order-id").val('');
                $("#order-date").val('');
                $("#custIdOption").val('');
                $("#set-customer-name").val('');
                $("#total").val('');
                $("#discount").val('');
                $("#sub-total").val('');
                $("#cash").val('');
                $("#balance").val('');
            }
        }
    };

    http.open("GET", `http://localhost:8081/posSystem/order?orderId=${orderSearchId}`, true);
    http.send();
})








