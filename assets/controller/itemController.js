const itemNameRegexPattern = new RegExp("[A-Za-z\\s]{3,}");
const  qtyOnHandRegexPattern = new RegExp("^\\d+$");

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
                // fetchCustomerData();
                // clearFields();
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



/*
function loadTable() {

    $("#item-tbl-tbody").empty();

    item_db.map((item, index) => {
        console.log(item);

        let record = `<tr>
                <td class="item-code-value">${item.itemCode}</td>
                <td class="item-name-value">${item.itemName}</td>
                <td class="item-unitPrice-value">${item.unitPrice}</td>
                <td class="qty-on-hand-value">${item.qtyOnHand}</td>
            </tr>`;
        $("#item-tbl-tbody").append(record);
    });
}
*/

/*$("#item-tbl-tbody").on('click', 'tr', function() {
    let index = $(this).index();
    recordIndex = index;

    console.log("index: ", index);

    let itemCode = $(this).find(".item-code-value").text();
    let itemName = $(this).find(".item-name-value").text();
    let unitPrice = $(this).find(".item-unitPrice-value").text();
    let qtyOnHand = $(this).find(".qty-on-hand-value").text();

    $("#item-code").val(itemCode);
    $("#item-name").val(itemName);
    $("#unit-price").val(unitPrice);
    $("#qty-on-hand").val(qtyOnHand);

});*/


/*function generateItemCode() {
    let highestItemCode = 0;

    // Find the highest numeric part of existing customer IDs
    for (let i = 0; i < item_db.length; i++) {
        const numericPart = parseInt(item_db[i].itemCode.split('-')[1]);
        if (!isNaN(numericPart) && numericPart > highestItemCode) {
            highestItemCode = numericPart;
        }
    }

    // Generate a new item code by incrementing the highest numeric part
    const newItemCode = highestItemCode + 1;

    // Insert the new item code into the #customer-id text field
    $('#item-code').val('I00-00' + newItemCode);

    // Return the generated customer ID
    return 'I00-00' + newItemCode;
}*/

/*
/!*Auto-generate the item code when navigating to the main section*!/
function populateItemCodeField() {
    const itemCodeField = document.getElementById('item-code');
    const generatedItemCode = generateItemCode();
    itemCodeField.value = generatedItemCode;
}

// Event listener for when the page loads
window.addEventListener('load', function() {
    populateItemCodeField();
});

/!*update item*!/
$("#item-update").on('click', () => {
    var itemCode = $('#item-code').val();
    var itemName = $('#item-name').val();
    var itemUnitPrice = $('#unit-price').val();
    var itemQtyOnHand = $('#qty-on-hand').val();


    let itemObj = item_db[recordIndex];

    itemObj.itemCode = itemCode;
    itemObj.itemName = itemName;
    itemObj.unitPrice = itemUnitPrice;
    itemObj.qtyOnHand = itemQtyOnHand;

    Swal.fire(
        'Update Successfully !',
        'item updated successfully.',
        'success'
    )

    loadTable();
    $("#item-reset").click();
    populateItemCodeField();
});

/!*delete item*!/
$("#item-delete").on('click', () => {

    item_db.splice(recordIndex, 1);

    Swal.fire(
        'delete Successfully !',
        'Item deleted successfully.',
        'success'
    )

    loadTable();
    $("#item-reset").click();
    populateItemCodeField();
});

/!*search item*!/
$("#item-search").on('click', () => {
    let itemSearchCode = $("#item-search-code").val();
    let item = item_db.find((item) => item.itemCode === itemSearchCode);

    if (item) {
        $("#item-code").val(item.itemCode);
        $("#item-name").val(item.itemName);
        $("#unit-price").val(item.unitPrice);
        $("#qty-on-hand").val(item.qtyOnHand);
    } else {
        Swal.fire(
            'not found!',
            'item not found..'
        );
    }

    $("#item-search-code").val("");
    //delay the generation of the next item code by 2 seconds (2000 milliseconds)
    setTimeout(() => {
        populateItemCodeField();
        $("#item-name").val("");
        $("#unit-price").val("");
        $("#qty-on-hand").val("");
    }, 2000);
});

/!*$("#item-reset").on('click', () => {
    $("#customer-Id").val(generateItemCode());
});*!/

*/
