class CartsDTO {
    constructor(cart) {

        this._id=cart._id;
        this.products = cart.products;     
    }
}

module.exports = { CartsDTO };


