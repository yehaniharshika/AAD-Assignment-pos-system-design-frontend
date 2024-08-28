/*import {item_db} from "../db/db.js";*/
const itemNameRegexPattern = new RegExp("[A-Za-z\\s]{3,}");
const  qtyOnHandRegexPattern = new RegExp("^\\d+$");


// Call the function when the page loads or when you need to generate a new code
window.addEventListener('load', () => {
    fetchItemData();
    fetchItemCode();
});

function fetchItemCode() {
    fetch("http://localhost:8081/posSystem/item?action=generateItemCode")
        .then(response => response.json())
        .then(itemCode => {
            document.getElementById("item-code").value = itemCode;
            console.log(itemCode);
        })
        .catch(error => console.error("Error fetching item Code ", error));
}
/*save item*/
$("#item-save").on('click', () => {
    var itemCodeValue = $('#item-code').val();
    var itemNameValue = $('#item-name').val();
    var unitPriceValue = $('#unit-price').val();
    var qtyOnHandValue = $('#qty-on-hand').val();

    if (!itemNameRegexPattern.test(itemNameValue)){
        Swal.fire({
            icon: 'error',
            title: 'Invalid item name',
            text: 'only letters allowed'
        })
        return;
    }

    if (!qtyOnHandRegexPattern.test(qtyOnHandValue)){
        Swal.fire({
            icon: 'error',
            title: 'Invalid item QtyOnHand',
            text: 'only numbers allowed'
        })
        return;
    }

    console.log("item code: ",itemCodeValue);
    console.log("item name: ",itemNameValue);
    console.log("unit price: ",unitPriceValue);
    console.log("qty on hand: ",qtyOnHandValue);


    const itemData={
        itemCode : itemCodeValue,
        itemName : itemNameValue,
        unitPrice : unitPriceValue,
        qtyOnHand : qtyOnHandValue
    }

    console.log(itemData);

    const itemJson = JSON.stringify(itemData);
    console.log("itemJson",itemJson);

    const http = new XMLHttpRequest();
    http.onreadystatechange=()=> {
        //check state
        if (http.readyState === 4) {
            if (http.status === 200 || http.status === 204 || http.status === 201){
                var jsonTypeResponse = JSON.stringify(http.responseText);
                console.log(jsonTypeResponse);
                Swal.fire(
                    'Save Successfully!',
                    'Item saved successfully.',
                    'success'
                );
                fetchItemData();
                clearFields();
                fetchItemCode();

                // console.log("load tables saved click");
            } else {
                console.log("failed");
                console.log(http.status)
                console.log("readyState")
                console.log("------------------------------------------------------------------")
            }
        }else {

        }
    }
    http.open("POST","http://localhost:8081/posSystem/item",true);
    http.setRequestHeader("content-type","application/json");
    http.send(itemJson);
});

/*update item*/
$("#item-update").on('click', () => {
    var itemCodeValue = $('#item-code').val();
    var itemNameValue = $('#item-name').val();
    var unitPriceValue = $('#unit-price').val();
    var qtyOnHandValue = $('#qty-on-hand').val();

    if (!itemNameRegexPattern.test(itemNameValue)){
        Swal.fire({
            icon: 'error',
            title: 'Invalid item name',
            text: 'only letters allowed'
        })
        return;
    }

    if (!qtyOnHandRegexPattern.test(qtyOnHandValue)){
        Swal.fire({
            icon: 'error',
            title: 'Invalid item QtyOnHand',
            text: 'only numbers allowed'
        })
        return;
    }

    console.log("item code: ",itemCodeValue);
    console.log("item name: ",itemNameValue);
    console.log("unit price: ",unitPriceValue);
    console.log("qty on hand: ",qtyOnHandValue);


    const itemData={
        itemCode : itemCodeValue,
        itemName : itemNameValue,
        unitPrice : unitPriceValue,
        qtyOnHand : qtyOnHandValue
    }

    const itemJson = JSON.stringify(itemData);

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200 || http.status === 204) {
                var jsonTypeResponse = JSON.stringify(http.responseText);
                console.log("jsonTypeResponse ", jsonTypeResponse);
                console.log("------------------------------------------------------------------")
                Swal.fire(
                    'Update Successfully !',
                    'Item updated successfully.',
                    'success'
                )
                fetchItemData();
                clearFields();
                fetchItemCode();
            } else {
                console.log("Failed to update");
                console.log("HTTP Status: ", http.status);
                console.log("Ready State: ", http.readyState);
                console.log("------------------------------------------------------------------")
            }
        }
    };
    http.open("PUT", `http://localhost:8081/posSystem/item?itemCode=${itemCodeValue}`, true);
    http.setRequestHeader("content-type", "application/json");
    http.send(itemJson);
});

$("#item-delete").on('click', () => {
    var itemCodeValue = $('#item-code').val();
    console.log("item code: ",itemCodeValue);

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                console.log("item deleted successfully");
                Swal.fire(
                    'Deleted Successfully!',
                    'Item deleted successfully.',
                    'success'
                );
                fetchItemData();
                fetchItemCode();
            } else {
                console.log("Failed to delete");
                console.log("HTTP Status: ", http.status);
                Swal.fire(
                    'Failed!',
                    'Item could not be deleted.',
                    'error'
                );
            }
        }
    };

    http.open("DELETE", `http://localhost:8081/posSystem/item?itemCode=${itemCodeValue}`, true);
    http.send();
});


function fetchItemData() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                // Parse the response JSON and update the table
                const itemData = JSON.parse(http.responseText);
                loadTable(itemData);
            } else {
                console.log("Failed to fetch customer data");
            }
        }
    };
    http.open("GET", "http://localhost:8081/posSystem/item", true);
    http.send();
}
function loadTable(itemData) {

    $("#item-tbl-tbody").empty();

    itemData.forEach((item) => {

        let record = `<tr>
                <td class="item-code-value">${item.itemCode}</td>
                <td class="item-name-value">${item.itemName}</td>
                <td class="item-unitPrice-value">${item.unitPrice}</td>
                <td class="qty-on-hand-value">${item.qtyOnHand}</td>
            </tr>`;
        $("#item-tbl-tbody").append(record);
    });
}

function clearFields() {
    $("#item-code").val('');
    $("#item-name").val('');
    $("#unit-price").val('');
    $("#qty-on-hand").val('');
}

$("#item-tbl-tbody").on('click', 'tr', function() {
    let itemCode = $(this).find(".item-code-value").text();
    let itemName = $(this).find(".item-name-value").text();
    let unitPrice = $(this).find(".item-unitPrice-value").text();
    let qtyOnHand = $(this).find(".qty-on-hand-value").text();

    $("#item-code").val(itemCode);
    $("#item-name").val(itemName);
    $("#unit-price").val(unitPrice);
    $("#qty-on-hand").val(qtyOnHand);

});

/*search item*/
$("#item-search").on('click', () => {
    let itemSearchCode = $("#item-search-code").val();

    if (!itemSearchCode) {
        Swal.fire(
            'Input Required',
            'Please enter a item code to search.',
            'warning'
        );
        return;
    }
    console.log("Searching for Item code", itemSearchCode);

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const item = JSON.parse(http.responseText);

                $("#item-code").val(item.itemCode);
                $("#item-name").val(item.itemName);
                $("#unit-price").val(item.unitPrice);
                $("#qty-on-hand").val(item.qtyOnHand);

                Swal.fire(
                    'Item Found!',
                    'Item details retrieved successfully.',
                    'success'
                );

                setTimeout(() =>{
                    $("#item-code").val('');
                    $("#item-name").val('');
                    $("#unit-price").val('');
                    $("#qty-on-hand").val('');
                },6000);
            } else {
                console.log("Failed to find item");
                console.log("HTTP Status: ", http.status);

                Swal.fire(
                    'Not Found!',
                    'Item not found.',
                    'error'
                );

                // Clear the fields if item not found
                $("#item-code").val('');
                $("#item-name").val('');
                $("#unit-price").val('');
                $("#qty-on-hand").val('');
            }
        }
    };

    http.open("GET", `http://localhost:8081/posSystem/item?itemCode=${itemSearchCode}`, true);
    http.send();
});









