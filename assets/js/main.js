/*import {loadAllCustomerId} from '../controller/orderController.js';
import {loadAllItemCodes} from '../controller/orderController.js';*/

$('#dashboard-section').css({display: 'block'});
$('#customer-section').css({display: 'none'});
$('#item-section').css({display: 'none'});
$('#order-section').css({display: 'none'});
$('#order-details-section').css({display: 'none'});

// dashboard nav management
$('#nav-dashboard').on('click', () => {
    $('#dashboard-section').css({display: 'block'});
    $('#customer-section').css({display: 'none'});
    $('#item-section').css({display: 'none'});
    $('#order-section').css({display: 'none'});
    $('#order-details-section').css({display: 'none'});
});

//customer nav management
$('#nav-customer').on('click', () => {
    $('#customer-section').css({display: 'block'});
    $('#dashboard-section').css({display: 'none'});
    $('#item-section').css({display: 'none'});
    $('#order-section').css({display: 'none'});
    $('#order-details-section').css({display: 'none'});
});

//item nav management
$('#nav-item').on('click', () => {
    $('#dashboard-section').css({display: 'none'});
    $('#customer-section').css({display: 'none'});
    $('#item-section').css({display: 'block'});
    $('#order-section').css({display: 'none'});
    $('#order-details-section').css({display: 'none'});
});

//order nav management
$('#nav-orders').on('click', () => {
    $('#dashboard-section').css({display: 'none'});
    $('#customer-section').css({display: 'none'});
    $('#item-section').css({display: 'none'});
    $('#order-section').css({display: 'block'});
    $('#order-details-section').css({display: 'none'});
    /*loadAllCustomerId();
    loadAllItemCodes();*/
});

// order details nav management
$('#nav-orderDetails').on('click', () => {
    $('#dashboard-section').css({display: 'none'});
    $('#customer-section').css({display: 'none'});
    $('#item-section').css({display: 'none'});
    $('#order-section').css({display: 'none'});
    $('#order-details-section').css({display: 'block'});
});

