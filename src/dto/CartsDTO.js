class CartsDTO {
    constructor(cart) {
        console.log("... Cart DTO");
        this._id=cart._id;
        this.products = cart.products;     
    }
}

module.exports = { CartsDTO };


