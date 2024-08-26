/*

import {item_db} from "../db/db.js";
import {customer_db} from '../db/db.js';
import {order_db} from "../db/db.js";
import {order_details_db} from "../db/db.js";
import OrderModel from "../model/OrderModel.js";

import { populateTableOrderDetails } from './orderDetailsController.js';

var recordIndex;
let selectedItemCode;
let resetAllButton=$('#resetAllBtn');
let updateItemBtn=$('#update-item-btn');
let removeItemBtn=$('#remove-item-btn');
let invoiceUpdateBtn=$('#invoice-update-btn');
let invoiceDeleteBtn=$('#invoice-delete-btn');
let items = [];
let resetOrderItemDetails=$('#resetItemDetailsBtn');

/!*$('#order-section').on('click', function() {
    updateItemBtn.prop("disabled", false);
    removeItemBtn.prop("disabled", false);
    invoiceUpdateBtn.prop("disabled", false);
    invoiceDeleteBtn.prop("disabled", false);
});*!/

function fillCurrentDate(){
    $("#order-date").val(new Date().toISOString().slice(0, 10));
}

function generateOrderId() {
    let highestOrderId = 0;

    // Find the highest numeric part of existing order IDs
    for (let i = 0; i < order_db.length; i++) {
        const numericPart = parseInt(order_db[i].orderId.split('-')[1]);
        if (!isNaN(numericPart) && numericPart > highestOrderId) {
            highestOrderId = numericPart;
        }
    }

    // Generate a new order ID by incrementing the highest numeric part
    const newOrderId = highestOrderId + 1;

    // Insert the new order ID into the #order-id text field
    $('#order-id').val('order-00' + newOrderId);

    // Return the generated order ID
    return 'order-00' + newOrderId;
}

window.addEventListener('load', function() {
    populateOrderIdField();
    fillCurrentDate();
});

/!* Auto-generate the order ID when navigating to the main section *!/
function populateOrderIdField() {
    // Check if the input field with ID 'order-id' exists
    const orderIdField = document.getElementById('order-id');
    if (orderIdField) {
        // Call the function to generate and populate the order ID
        const generatedOrderId = generateOrderId();
        orderIdField.value = generatedOrderId;
    } else {
        console.error("Input field with ID 'order-id' not found.");
    }
}

/!*load customers for combo box*!/
export function loadAllCustomerId() {
    console.log('Loading all customer IDs');
    $('#custIdOption').empty(); // Clear existing options
    // Append new customer IDs
    for (let customerArElement of customer_db) {
        $('#custIdOption').append(`<option value="${customerArElement.customerId}">${customerArElement.customerId}</option>`);
    }
}

/!*set customer details*!/
$('#custIdOption').on('change', function(){
     var selectedCustomerId = $('#custIdOption option:selected').text();
    for (let customerArElement of customer_db) {
        if (customerArElement.customerId === selectedCustomerId){
            $('#set-customer-name').val(customerArElement.name);
            $('#set-customer-email').val(customerArElement.email);
        }
    }
});

/!*load item code for combo box*!/
export function loadAllItemCodes(){
    console.log("load all item codes..");
    $('#itemCodeOption').empty();

    //append new item codes
    for (let itemArElement of item_db){
        $('#itemCodeOption').append(`<option value="${itemArElement.itemCode}">${itemArElement.itemCode}</option>`);
    }
}

/!*set item details*!/
$('#itemCodeOption').on('change', function(){
    var selectedItemCode = $('#itemCodeOption option:selected').text();
    console.log("selectItemCode",selectedItemCode);
    for (let itemArElement of item_db) {
        if (itemArElement.itemCode === selectedItemCode){
            $('#set-order-form-item-name').val(itemArElement.itemName);
            $('#set-order-form-item-price').val(itemArElement.unitPrice);
            $('#set-item-qty-on-hand').val(itemArElement.qtyOnHand);
        }
    }
});

//update order items details
updateItemBtn.on("click", function() {
    let itemCodeValue = $('#itemCodeOption').val();
    let qtyValue = parseInt($('#order-form-get-qty').val());

    let existingItem = items.find(item => item.itemCode === itemCodeValue);

    if (existingItem) {
        if ($('#set-item-qty-on-hand').val() >= qtyValue) {
            // Update the quantity of the existing item
            existingItem.qty = qtyValue;
            existingItem.total = existingItem.price * qtyValue;

            // Populate the item table
            populateItemTable();

            // Reset the item details
            resetOrderItemDetails.click();

        } else {
            alert('Quantity exceeds stock available.');
        }
    }

    updateTotal();
});


//delete select order items details
removeItemBtn.on("click", function() {
    let itemCodeValue =  $('#itemCodeOption').val();

    let index = items.findIndex(item => item.itemCode === itemCodeValue);
    let removeItem = items.splice(index, 1)[0];

    let selectedItem = item_db.find(item => item.itemCode === removeItem.itemCode);
    if (selectedItem){
        selectedItem.qtyOnHand = removeItem.qty;
    }
    selectedItem.qtyOnHand = $('#set-item-qty-on-hand').val();
    populateItemTable();
    resetOrderItemDetails.click();
    updateTotal();
});


// Update quantity on hand when getting quantity is entered
$('#order-form-get-qty').on('input', function() {
    selectedItemCode = $('#itemCodeOption').val();
    const selectedItem = item_db.find(item => item.itemCode === selectedItemCode);
    const getQty = parseInt($(this).val(), 10);

    if (selectedItem && getQty) {
        const updatedQty = selectedItem.qtyOnHand - getQty;
        $('#set-item-qty-on-hand').val(updatedQty >= 0 ? updatedQty : selectedItem.qtyOnHand);
    }
});

//event handler for  Add item to cart button
$('#add-to-cart-btn').on('click', function() {
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

    /!*$("#update-item-btn").prop("disabled", true);
    $("#remove-item-btn").prop("disabled",true);
    $('#add-to-cart-btn').prop("disabled", false);*!/
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
}




*/
