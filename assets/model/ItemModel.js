export class ItemModel{
    constructor(itemCode,itemName,unitPrice,qtyOnHand) {
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.unitPrice = unitPrice;
        this.qtyOnHand = qtyOnHand;
    }

    get itemCode() {
        return this._itemCode;
    }

    get itemName() {
        return this._itemName;
    }

    get unitPrice() {
        return this._unitPrice;
    }

    get qtyOnHand() {
        return this._qtyOnHand;
    }

    set itemCode(itemCode) {
        this._itemCode = itemCode;
    }

    set itemName(itemName) {
        this._itemName = itemName;
    }

    set unitPrice(unitPrice) {
        this._unitPrice = unitPrice;
    }

    set qtyOnHand(qtyOnHand) {
        this._qtyOnHand = qtyOnHand;
    }
}