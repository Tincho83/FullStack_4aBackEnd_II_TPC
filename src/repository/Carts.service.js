const CartsDAO = require("../dao/db/CartsManagerMongoDB");
const { CartsDTO } = require("../dto/CartsDTO");


class CartsService {

    constructor(DAO) {
        this.cartsDAO = DAO;
    }

    // 1.Obtener todos los carritos
    async getCarts() {
        console.log(">Service Get Carts:");
        let carts = await this.cartsDAO.getCarts();

        if (Array.isArray(carts)) {
            carts = carts.map(c => new CartsDTO(c));
        } else if (carts) {
            carts = new CartsDTO(carts);
        }

        return carts;


    }

    // 2.Obtener carrito por id y sus productos
    async getCartBy(filter = {}) {
        console.log(">Service GetBy Cart:");
        let cart = await this.cartsDAO.getCartBy(filter);

        if (Array.isArray(cart)) {
            cart = cart.map(c => new CartsDTO(c));
        } else if (cart) {
            cart = new CartsDTO(cart);
        }

        return cart;
    }

    
    // 2b.Obtener carrito por id y sus productos (Sin Populate)
    async getCartsBy(filter = {}) {
        console.log(">Service GetBy Carts:");
        let cart = await this.cartsDAO.getCartsBy(filter);

        if (Array.isArray(cart)) {
            cart = cart.map(c => new CartsDTO(c));
        } else if (cart) {
            cart = new CartsDTO(cart);
        }

        return cart;
    }

    // 3.Agregar carrito
    async createCart() {
        console.log(">Service Add Cart:");
        return await this.cartsDAO.createCart();
    }

    //4.Agregar producto al carrito
    async addProdToCart(cid, cart) {
        console.log(">Service Update Cart (Add Prod to Cart):");
        return await this.cartsDAO.addProdToCart(cid, cart);
    }

    //5.Borra producto del carrito
    async updateProdToCart(cid, cart) {
        console.log(">Service Clean Cart:");
        return await this.cartsDAO.updateProdToCart(cid, cart);
    }

}

const cartsService = new CartsService(CartsDAO);

module.exports = { cartsService };