const { CartsModel } = require("../models/CartsModel");
const { ProductsModel } = require("../models/ProductsModel.js");

class CartsManagerMongoDB {

    //Obtener carts
    static async getCarts() {
        return await CartsModel.find().lean();
    }
    /*
    static async getCartsDBMongo() {
        return await CartsModel.find().lean();
    }
    */



    //Obtener cart por id
    static async getCartBy(id) {
        return await CartsModel.findOne({ _id: id }).populate('products.product').lean();
    }
    /*
    static async getCartByDBMongo(id) {
        return await CartsModel.findOne({ _id: id }).populate('products.product').lean();
    }
    */

    static async getCartsBy(id) {
        return await CartsModel.findOne({ _id: id }).lean();
    }

    //Agregar cart a la BBDD
    static async createCart() {
        let cartNew = await CartsModel.create({ products: [] });
        return cartNew.toJSON();
    }
    /*
        static async addCartDBMongo() {
            let cartNew = await CartsModel.create({ products: [] });
            return cartNew.toJSON();
        }
    */




    //Actualizar cart desde id con product con valores
    static async addProdToCart(id, cart) {
        return await CartsModel.updateOne({ _id: id }, cart);
    }
    /*
    static async updateCartsDBMongo(id, cart) {
        return await CartsModel.updateOne({ _id: id }, cart);
    }
    */

    //Actualizar cart desde id
    static async updateProdToCart(id, cart) {
        return await CartsModel.findByIdAndUpdate(id, cart, { new: true }).lean();
    }
    /*
    static async updateCartDBMongo(id, cart) {
        return await CartsModel.findByIdAndUpdate(id, cart, { new: true }).lean();
    }
    */



    //Borrar cart de la BBDD
    static async deleteCart(id) {
        return await CartsModel.findByIdAndDelete(id, { new: true }).lean();
    }

}

module.exports = CartsManagerMongoDB;