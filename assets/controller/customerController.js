import {CustomerModel} from "../model/CustomerModel.js";
import {customer_db, item_db} from "../db/db.js";

var recordIndex;

/*Validation*/
const emailRegexPattern = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$");
const mobileRegexPattern = new RegExp("^(070|071|072|074|075|076|077|078|038)\\d{7}$");
const nameRegexPattern = new RegExp("[A-Za-z\\s]{3,}");
const addressRegexPattern = new RegExp("[0-9]{1,}\\/[A-Z]\\s[a-zA-Z]+$|[0-9]{1,}[/0-9]{1,}\\s([A-Za-z])\\w+");

/*save customer*/
$("#customer-save").on('click', (e) => {
    var customerId = $('#customer-Id').val();
    var name = $('#customer-name').val();
    var address = $('#customer-address').val();
    var contactNumber = $('#contact-number').val();
    var email = $('#email').val();

    if (!emailRegexPattern.test(email)){
        Swal.fire({
            icon:'error',
            title: 'Invalid email',
            text: 'please add correct email'
        })
        return;
    }

    if (!mobileRegexPattern.test(contactNumber)){
        Swal.fire({
            icon: 'error',
            title: 'Invalid contact number',
            text: 'only numbers are allowed(07X-XXXXXXX)'
        })
        return;
    }

    if (!nameRegexPattern.test(name)){
        Swal.fire({
            icon: 'error',
            title: 'Invalid name',
            text: 'add correct customer name'
        })
        return;
    }

    if (!addressRegexPattern.test(address)){
        Swal.fire({
            icon: 'error',
            title: 'Invalid address',
            text: 'add correct address'
        })
        return;
    }

    let customer = new CustomerModel(
        customerId,
        name,
        address,
        contactNumber,
        email
    );

    // push to the array
    customer_db.push(customer);
    Swal.fire(
        'Save Successfully!',
        'Customer saved successfully.',
        'success'
    );

    loadTable();
    clearFields();
    populateCustomerIdField();

});

/*load customer for table*/
function loadTable() {
    $("#customer-tbl-tbody").empty();

    customer_db.map((item, index) => {
        console.log(item);

        let record = `<tr>
                <td class="customer-id-value">${item.customerId}</td>
                <td class="customer-name-value">${item.name}</td>
                <td class="customer-address-value">${item.address}</td>
                <td class="customer-contact-value">${item.contactNumber}</td>
                <td class="customer-email-value">${item.email}</td>
            </tr>`;
        $("#customer-tbl-tbody").append(record);
    });
}


$("#customer-tbl-tbody").on('click', 'tr', function() {
    let index = $(this).index();
    recordIndex = index;

    console.log("index: ", index);

    let customerId = $(this).find(".customer-id-value").text();
    let name = $(this).find(".customer-name-value").text();
    let address = $(this).find(".customer-address-value").text();
    let contactNumber = $(this).find(".customer-contact-value").text();
    let email = $(this).find(".customer-email-value").text();

    $("#customer-Id").val(customerId);
    $("#customer-name").val(name);
    $("#customer-address").val(address);
    $("#contact-number").val(contactNumber);
    $("#email").val(email);

});


function generateCustomerId() {
    let highestCustomerId = 0;

    // Find the highest numeric part of existing customer IDs
    for (let i = 0; i < customer_db.length; i++) {
        const numericPart = parseInt(customer_db[i].customerId.split('-')[1]);
        if (!isNaN(numericPart) && numericPart > highestCustomerId) {
            highestCustomerId = numericPart;
        }
    }

    // Generate a new customer ID by incrementing the highest numeric part
    const newCustomerId = highestCustomerId + 1;

    // Insert the new customer ID into the #customer-id text field
    $('#customer-id').val('C00-00' + newCustomerId);

    // Return the generated customer ID
    return 'C00-00' + newCustomerId;
}

/*Auto-generate the customer ID when navigating to the main section*/
function populateCustomerIdField() {
    const customerIdField = document.getElementById('customer-Id');
    const generatedCustomerId = generateCustomerId();
    customerIdField.value = generatedCustomerId;
}

// Event listener for when the page loads
window.addEventListener('load', function() {
    // Call the function to populate the customer ID field
    populateCustomerIdField();
});

/*update customer*/
$("#customer-update").on('click', () => {
    var customerId = $('#customer-Id').val();
    var customerName = $('#customer-name').val();
    var customerAddress = $('#customer-address').val();
    var customerContactNum = $('#contact-number').val();
    var customerEmail = $('#email').val();

    let customerObj = customer_db[recordIndex];
    // let studentObj = {...students[recordIndex]}; // clone object
    customerObj.customerId = customerId;
    customerObj.name = customerName;
    customerObj.address = customerAddress;
    customerObj.contactNumber = customerContactNum;
    customerObj.email = customerEmail;

    Swal.fire(
        'Update Successfully !',
        'Customer updated successfully.',
        'success'
    )


    loadTable();
    $("#customer-reset").click();
    populateCustomerIdField();

});

/*delete customer*/
$("#customer-delete").on('click', () => {

    customer_db.splice(recordIndex, 1);

    Swal.fire(
        'delete Successfully !',
        'Customer deleted successfully.',
        'success'
    )

    loadTable();
    $("#customer-reset").click();
    populateCustomerIdField();
});


$("#customer-search").on('click', () => {
    let customerSearchId = $("#customer-search-by-id").val();
    let item =customer_db.find((item) => item.customerId === customerSearchId);

    if (item) {
        $("#customer-Id").val(item.customerId);
        $("#customer-name").val(item.name);
        $("#customer-address").val(item.address);
        $("#contact-number").val(item.contactNumber);
        $("#email").val(item.email);
    } else {
        Swal.fire(
            'not found!',
            'customer not found..'
        );
    }

    $("#customer-search-by-id").val("");
    setTimeout(() => {
        populateCustomerIdField()
        $("#customer-name").val("");
        $("#customer-address").val("");
        $("#contact-number").val("");
        $("#email").val("");
    }, 2000);
});

function clearFields(){
    $("#customer-Id").val("");
    $("#customer-name").val("");
    $("#customer-address").val("");
    $("#contact-number").val("");
    $("#email").val("");

}
$("#customer-reset").on('click', () => {
    clearFields();
    populateCustomerIdField();
});