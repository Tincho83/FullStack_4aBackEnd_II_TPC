const { CartsModel } = require("../models/CartsModel");
const { ProductsModel } = require("../models/ProductsModel.js");

class CartsManagerMongoDB {

    //Obtener carts
    static async getCarts() {
        console.log(">DAO Get Carts:");
        return await CartsModel.find().lean();
    }

    //Obtener cart por id
    static async getCartBy(id) {
        console.log(">DAO GetBy Cart (Populate):");
        return await CartsModel.findOne({ _id: id }).populate('products.product').lean();
    }

    static async getCartsBy(id) {
        console.log(">DAO GetBy Cart:");
        return await CartsModel.findOne({ _id: id }).lean();
    }

    //Agregar cart a la BBDD
    static async createCart() {
        console.log(">DAO Create Cart:");
        let cartNew = await CartsModel.create({ products: [] });
        return cartNew.toJSON();
    }

    //Actualizar cart desde id con product con valores
    static async addProdToCart(id, cart) {
        console.log(">DAO Update Cart:");
        return await CartsModel.updateOne({ _id: id }, cart);
    }

    //Actualizar cart desde id
    static async updateProdToCart(id, cart) {
        console.log(">DAO Update Product in Cart:");
        return await CartsModel.findByIdAndUpdate(id, cart, { new: true }).lean();
    }

    //Borrar cart de la BBDD
    static async deleteCart(id) {
        console.log(">DAO Clean Cart:");
        return await CartsModel.findByIdAndDelete(id, { new: true }).lean();
    }

}

module.exports = CartsManagerMongoDB;