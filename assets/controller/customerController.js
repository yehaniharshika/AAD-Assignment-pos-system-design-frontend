/*Validation*/
const emailRegexPattern = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$");
const mobileRegexPattern = new RegExp("^(070|071|072|074|075|076|077|078|038)\\d{7}$");
const nameRegexPattern = new RegExp("[A-Za-z\\s]{3,}");
const addressRegexPattern = new RegExp("[0-9]{1,}\\/[A-Z]\\s[a-zA-Z]+$|[0-9]{1,}[/0-9]{1,}\\s([A-Za-z])\\w+");

function generateCustomerId() {
    // Fetch the last generated customer ID from localStorage, or start with "C00-000" if none exists.
    let lastCustomerId = localStorage.getItem('lastCustomerId') || "C00-000";

    // Extract the numeric part from the ID and increment it by 1.
    let numericPart = parseInt(lastCustomerId.split("-")[1]);
    let newCustomerId = "C00-" + ("000" + (numericPart + 1)).slice(-3);

    // Store the new ID in localStorage so that the next time it's incremented correctly.
    localStorage.setItem('lastCustomerId', newCustomerId);

    // Set the generated ID in the customer-id input field.
    document.getElementById('customer-Id').value = newCustomerId;
}
/*load when page is start*/
window.addEventListener('load', () => {
    fetchCustomerId();
    fetchCustomerData();
});

function fetchCustomerId() {
    fetch("http://localhost:8081/posSystem/customer?action=generateCustomerId")
        .then(response => response.json())
        .then(customerId => {
            document.getElementById("customer-Id").value = customerId;
            console.log(customerId);
        })
        .catch(error => console.error("Error fetching customer Id ", error));
}

/*save customer*/
$("#customer-save").click(function (){
    var customerIdValue = $('#customer-Id').val();
    var nameValue = $('#customer-name').val();
    var addressValue = $('#customer-address').val();
    var contactNumberValue = $('#contact-number').val();
    var emailValue = $('#email').val();

    if (!emailRegexPattern.test(emailValue)){
        Swal.fire({
            icon:'error',
            title: 'Invalid email',
            text: 'please add correct email'
        })
        return;
    }

    if (!mobileRegexPattern.test(contactNumberValue)){
        Swal.fire({
            icon: 'error',
            title: 'Invalid contact number',
            text: 'only numbers are allowed(07X-XXXXXXX)'
        })
        return;
    }

    if (!nameRegexPattern.test(nameValue)){
        Swal.fire({
            icon: 'error',
            title: 'Invalid name',
            text: 'add correct customer name'
        })
        return;
    }

    if (!addressRegexPattern.test(addressValue)){
        Swal.fire({
            icon: 'error',
            title: 'Invalid address',
            text: 'add correct address'
        })
        return;
    }
    console.log("customer ID",customerIdValue);
    console.log("customer name",nameValue);
    console.log("address",addressValue);
    console.log("contact number",contactNumberValue);
    console.log("email",emailValue);

    const customerData={
        customerId : customerIdValue,
        name : nameValue,
        address : addressValue,
        contactNumber : contactNumberValue,
        email : emailValue
    }

    console.log(customerData);
    // push to the array
    const customerJson = JSON.stringify(customerData);
    console.log("customerJson",customerJson);

    const http = new XMLHttpRequest();
    http.onreadystatechange=()=> {
        //check state
        if (http.readyState === 4) {
            if (http.status === 200 || http.status === 204 || http.status === 201){
                var jsonTypeResponse = JSON.stringify(http.responseText);
                console.log(jsonTypeResponse);
                Swal.fire(
                    'Save Successfully!',
                    'Customer saved successfully.',
                    'success'
                );
                fetchCustomerData();
                clearFields();
                fetchCustomerId();
                console.log("load tables saved click");
            } else {
                console.log("failed");
                console.log(http.status)
                console.log("readyState")
                console.log("------------------------------------------------------------------")
            }
        }else {

        }
    }
    http.open("POST","http://localhost:8081/posSystem/customer",true);
    http.setRequestHeader("content-type","application/json");
    http.send(customerJson);
});

/*update customer*/
$("#customer-update").on('click', () => {
    var customerIdValue = $('#customer-Id').val();
    var customerNameValue = $('#customer-name').val();
    var customerAddressValue = $('#customer-address').val();
    var contactNumberValue = $('#contact-number').val();
    var customerEmailValue = $('#email').val();


    if (!emailRegexPattern.test(customerEmailValue)){
        Swal.fire({
            icon:'error',
            title: 'Invalid email',
            text: 'please add correct email'
        })
        return;
    }

    if (!mobileRegexPattern.test(contactNumberValue)){
        Swal.fire({
            icon: 'error',
            title: 'Invalid contact number',
            text: 'only numbers are allowed(07X-XXXXXXX)'
        })
        return;
    }

    if (!nameRegexPattern.test(customerNameValue)){
        Swal.fire({
            icon: 'error',
            title: 'Invalid name',
            text: 'add correct customer name'
        })
        return;
    }

    if (!addressRegexPattern.test(customerAddressValue)){
        Swal.fire({
            icon: 'error',
            title: 'Invalid address',
            text: 'add correct address'
        })
        return;
    }
    console.log("customer ID",customerIdValue);
    console.log("customer name",customerNameValue);
    console.log("address",customerAddressValue);
    console.log("contact number",contactNumberValue);
    console.log("email",customerEmailValue);

    const customerData ={
        customerId: customerIdValue,
        name: customerNameValue,
        address: customerAddressValue,
        contactNumber: contactNumberValue,
        email: customerEmailValue
    }

    const customerJson = JSON.stringify(customerData);

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200 || http.status === 204) {
                var jsonTypeResponse = JSON.stringify(http.responseText);
                console.log("jsonTypeResponse ", jsonTypeResponse);
                console.log("------------------------------------------------------------------")
                Swal.fire(
                    'Update Successfully !',
                    'Customer updated successfully.',
                    'success'
                )
                fetchCustomerData();
                clearFields();
                fetchCustomerId();
            } else {
                console.log("Failed to update");
                console.log("HTTP Status: ", http.status);
                console.log("Ready State: ", http.readyState);
                console.log("------------------------------------------------------------------")
            }
        }
    };

    http.open("PUT", `http://localhost:8081/posSystem/customer?customerId=${customerIdValue}`, true);
    http.setRequestHeader("content-type", "application/json");
    http.send(customerJson);

    generateCustomerId();
    $("#customer-reset").click();

});

/*delete customer*/
$("#customer-delete").on('click', () => {
    var customerIdValue = $('#customer-Id').val();

    console.log("customer ID", customerIdValue);

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                console.log("Customer deleted successfully");
                Swal.fire(
                    'Deleted Successfully!',
                    'Customer deleted successfully.',
                    'success'
                );
                fetchCustomerData();
                clearFields();
                fetchCustomerId();
            } else {
                console.log("Failed to delete");
                console.log("HTTP Status: ", http.status);
                Swal.fire(
                    'Failed!',
                    'Customer could not be deleted.',
                    'error'
                );
            }
        }
    };

    http.open("DELETE", `http://localhost:8081/posSystem/customer?customerId=${customerIdValue}`, true);
    http.send();
});

function fetchCustomerData() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                // Parse the response JSON and update the table
                const customerData = JSON.parse(http.responseText);
                loadTable(customerData);
            } else {
                console.log("Failed to fetch customer data");
            }
        }
    };
    http.open("GET", "http://localhost:8081/posSystem/customer", true);
    http.send();
}

function loadTable(customerData) {
    $("#customer-tbl-tbody").empty();

    customerData.forEach((item) => {
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

$("#customer-search").on('click', () => {
    let customerSearchId = $("#customer-search-by-id").val();

    if (!customerSearchId) {
        Swal.fire(
            'Input Required',
            'Please enter a customer ID to search.',
            'warning'
        );
        return;
    }

    console.log("Searching for customer ID", customerSearchId);

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const customer = JSON.parse(http.responseText);

                $("#customer-Id").val(customer.customerId);
                $("#customer-name").val(customer.name);
                $("#customer-address").val(customer.address);
                $("#contact-number").val(customer.contactNumber);
                $("#email").val(customer.email);

                Swal.fire(
                    'Customer Found!',
                    'Customer details retrieved successfully.',
                    'success'
                );

                setTimeout(() =>{
                    $("#customer-Id").val('');
                    $("#customer-name").val('');
                    $("#customer-address").val('');
                    $("#contact-number").val('');
                    $("#email").val('');
                },6000);
            } else {
                console.log("Failed to find customer");
                console.log("HTTP Status: ", http.status);

                Swal.fire(
                    'Not Found!',
                    'Customer not found.',
                    'error'
                );

                // Clear the fields if customer not found
                $("#customer-Id").val('');
                $("#customer-name").val('');
                $("#customer-address").val('');
                $("#contact-number").val('');
                $("#email").val('');
            }
        }
    };

    http.open("GET", `http://localhost:8081/posSystem/customer?customerId=${customerSearchId}`, true);
    http.send();
});



function clearFields(){
    $("#customer-Id").val("");
    $("#customer-name").val("");
    $("#customer-address").val("");
    $("#contact-number").val("");
    $("#email").val("");

}
/*$("#customer-reset").on('click', () => {
    clearFields();
    populateCustomerIdField();
});*/
