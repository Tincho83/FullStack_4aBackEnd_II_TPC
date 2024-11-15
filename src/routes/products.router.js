const { Router } = require("express");
const passport = require("passport");


const { ProductsController } = require("../controllers/ProductsController.js");
const auth = require("../middlewares/authMiddleware.js");

const router = Router();

//EndPopints para el manejo de products

// 1.Obtener todos los productos
router.get('/', passport.authenticate("current", { session: false }), ProductsController.getProducts)

// 2.Obtener producto por id
router.get('/:id([a-f0-9]+)', passport.authenticate("current", { session: false }), ProductsController.getProduct)

// 3.Agregar producto
router.post('/', passport.authenticate("current", { session: false }), auth(['user']), ProductsController.createProduct)

//4.Actualizar producto
router.put('/:id([a-f0-9]+)', passport.authenticate("current", { session: false }), auth(['user']), ProductsController.updateProduct)

//5.Borrar producto
router.delete('/:id([a-f0-9]+)', passport.authenticate("current", { session: false }), auth(['user']), ProductsController.deleteProduct)

module.exports = { router };