export default class OrderDetailsModel{

    constructor(orderId,itemCode,price,qty) {
        this.orderId = orderId;
        this.itemCode = itemCode;
        this.price = price;
        this.qty = qty;
    }

    get orderId() {
        return this._orderId;
    }

    get itemCode() {
        return this._itemCode;
    }

    get price() {
        return this._price;
    }

    get qty() {
        return this._qty;
    }

    set orderId(orderId) {
        this._orderId = orderId;
    }

    set itemCode(itemCode) {
        this._itemCode = itemCode;
    }

    set qty(qty) {
        this._qty = qty;
    }

}