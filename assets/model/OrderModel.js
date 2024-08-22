export default class OrderModel{

    constructor(orderId,orderDate,customerId,total,discount,cash) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.customerId = customerId;
        this.total = total;
        this.discount = discount;
        this.cash = cash;
    }

    get orderId() {
        return this._orderId;
    }

    get orderDate() {
        return this._orderDate;
    }

    get customerId() {
        return this._customerId;
    }

    get total() {
        return this._total;
    }

    get discount() {
        return this._discount;
    }

    get cash() {
        return this._cash;
    }

    set orderId(orderId) {
        this._orderId = orderId;
    }

    set orderDate(orderDate) {
        this._orderDate = orderDate;
    }

    set customerId(customerId) {
        this._customerId = customerId;
    }

    set total(total) {
        this._total = total;
    }

    set discount(discount) {
        this._discount = discount;
    }

    set cash(cash) {
        this._cash = cash;
    }

}