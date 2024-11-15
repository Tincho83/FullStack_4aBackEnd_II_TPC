const { Router } = require("express");
const passport = require("passport");
const { CartsController } = require("../controllers/CartsController.js");
const auth = require("../middlewares/authMiddleware.js");
const cartProtectMiddleware = require("../middlewares/cartProtectMiddleware.js");

const router = Router();

//EndPopints para el manejo de products

// 1.Obtener todos los carritos
router.get('/', passport.authenticate("current", { session: false }), CartsController.getCarts)

// 2.Obtener carrito por id y sus productos
router.get('/:cid([a-f0-9]+)', passport.authenticate("current", { session: false }), CartsController.getCartBy)

// 3.Agregar carrito
router.post('/', CartsController.createCart)

//4.Agregar producto al carrito
router.post('/:cid([a-f0-9]+)/product/:pid([a-f0-9]+)', passport.authenticate("current", { session: false }), auth(['none']), cartProtectMiddleware(['admin']), CartsController.addProdToCart)

//5.Borra producto del carrito
router.delete('/:cid([a-f0-9]+)/product/:pid([a-f0-9]+)', passport.authenticate("current", { session: false }), auth(['none']), cartProtectMiddleware(['admin']), CartsController.updateProdToCart)

//6.Actualizar carrito desde un arreglo
router.put('/:cid([a-f0-9]+)', passport.authenticate("current", { session: false }), cartProtectMiddleware(['admin']), CartsController.updateCart)

//7.Actualizar en el carrito la cantidad de un producto pasado por body
router.put('/:cid([a-f0-9]+)/product/:pid([a-f0-9]+)', passport.authenticate("current", { session: false }), auth(['none']), cartProtectMiddleware(['admin']), CartsController.updateQtyProdToCart)

//8.Borrar todos los productos del carrito
router.delete('/:cid([a-f0-9]+)', passport.authenticate("current", { session: false }), cartProtectMiddleware(['admin']), CartsController.deleteCart)

//9.Ticket
router.post('/:cid([a-f0-9]+)/purchase', passport.authenticate("current", { session: false }), cartProtectMiddleware(['admin']), CartsController.purchaseCart)

module.exports = { router };

