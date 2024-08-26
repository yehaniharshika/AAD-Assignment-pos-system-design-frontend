/*
import { order_db } from "../db/db.js";

export function populateTableOrderDetails() {
    const tbody = $('#order-details-section #item-details-table tbody');
    tbody.empty();
    order_db.forEach(orderDetails => {
        tbody.append(
            `<tr>
                <th scope="row">${orderDetails.orderId}</th>
                <td>${orderDetails.orderDate}</td>
                <td>${orderDetails.customerId}</td>
                <td>${orderDetails.total}</td>
                <td>${orderDetails.discount}</td>
                <td>${calculateSubtotal(orderDetails.total, orderDetails.discount)}</td>
                <td>${orderDetails.cash}</td>
                <td>${calculateBalance(orderDetails.cash, orderDetails.total, orderDetails.discount)}</td>                
            </tr>`
        );
    });
}

function calculateSubtotal(total, discount) {
    const discountValue = parseFloat(discount) || 0;
    const subtotal = total - (total * (discountValue / 100));
    return subtotal.toFixed(2);
}

function calculateBalance(cash, total, discount) {
    const discountValue = parseFloat(discount) || 0;
    const subtotal = calculateSubtotal(total, discount);
    const balance = cash - subtotal;
    return balance.toFixed(2);
}

// Initial population of the order details table when the page loads
$(document).ready(() => {
    populateTableOrderDetails();
});

*/
