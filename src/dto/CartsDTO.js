class CartsDTO {
    constructor(cart) {
        console.log(">DTO Carts:");
        this._id=cart._id;
        this.products = cart.products;     
    }
}

module.exports = { CartsDTO };


