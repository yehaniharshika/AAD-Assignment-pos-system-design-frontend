export class CustomerModel{

    constructor(customerId,name,address,contactNumber,email) {
        this.customerId = customerId;
        this.name = name;
        this.address = address;
        this.contactNumber = contactNumber;
        this.email = email;
    }

    get customerId() {
        return this._customerId;
    }

    get name() {
        return this._name;
    }

    get address() {
        return this._address;
    }

    get contactNumber() {
        return this._contactNumber;
    }

    get email() {
        return this._email;
    }

    set customerId(customerId) {
        this._customerId = customerId;
    }

    set name(name) {
        this._name = name;
    }

    set address(address) {
        this._address = address;
    }

    set contactNumber(contactNumber) {
        this._contactNumber = contactNumber;
    }

    set email(email) {
        this._email = email;
    }
}