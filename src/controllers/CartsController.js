const { isValidObjectId } = require("mongoose");
const { cartsService } = require("../repository/Carts.service");
const { productsService } = require("../repository/Products.service");
const { ticketsService } = require("../repository/Tickets.service");
const { processesErrors } = require("../utils/utils");
const nodemailer = require("nodemailer");
const { config } = require("../config/config");



class CartsController {

    // 1.Obtener todos los carritos
    static getCarts = async (req, res) => {

        try {
            let carts = await cartsService.getCarts();

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({ carts })
        } catch (error) {
            processesErrors(res, error);
        }

    }

    // 2.Obtener carrito por id y sus productos
    static getCartBy = async (req, res) => {

        let { cid } = req.params;

        if (!isValidObjectId(cid)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `id: ${cid} no valido,` })
        }

        try {
            // Llamamos al metodo con populate para obtener los datos completos de los productos
            let cart = await cartsService.getCartBy(cid);
            if (!cart) {
                res.setHeader('Content-type', 'application/json');
                return res.status(404).json({ error: `Carrito con id: ${cid} no encontrado.` });
            }

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({ cart });
        } catch (error) {
            processesErrors(res, error);
        }


    }

    // 3.Agregar carrito
    static createCart = async (req, res) => {
        try {

            let cartnuevo = await cartsService.createCart();
            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({ cartnuevo });

        } catch (error) {
            processesErrors(res, error);
        }
    }

    //4.Agregar producto al carrito
    static addProdToCart = async (req, res) => {
        let { cid, pid } = req.params;

        // Validar los ID
        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `ID(s) no validos. Verifique los Id's ingresados.` });
        }

        try {
            const cart = await cartsService.getCartBy(cid);
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Carrito inexistente ${cid}` });
            }

            const product = await productsService.getProductBy({ _id: pid });
            if (!product) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Producto ${pid} inexistente.` });
            }

            let indexProduct = cart.products.findIndex(p => p.product._id == pid);
            if (indexProduct === -1) {
                cart.products.push({
                    product: pid, quantity: 1
                })
            } else {
                cart.products[indexProduct].quantity++;
            }

            let resultado = await cartsService.addProdToCart(cid, cart);
            if (resultado.modifiedCount > 0) {
                res.setHeader('Content-type', 'application/json');
                res.status(200).json({ message: "Producto agregado al carrito" });
            } else {
                res.setHeader('Content-type', 'application/json');
                res.status(400).json({ error: "Error al agregar un producto al carrito" });
            }

        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            res.setHeader('Content-type', 'application/json');
            res.status(500).send('Error al agregar el producto al carrito');
        }
    }

    //5.Borra producto del carrito
    static updateProdToCart = async (req, res) => {
        let { cid, pid } = req.params;

        // Validar los ID
        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `ID(s) no válidos. Verifique los Is's ingresados.` });
        }

        try {
            // Obtener el carrito actual
            let cart = await cartsService.getCartBy(cid);
            if (!cart) {
                res.setHeader('Content-type', 'application/json');
                return res.status(404).json({ error: `Carrito no encontrado con ID: ${cid}` });
            }


            // Filtrar los productos para eliminar el producto especificado
            const updatedProducts = cart.products.filter(item => item.product._id.toString() !== pid);
            // Si no se modifica nada, es porque el producto no estaba en el carrito
            if (updatedProducts.length === cart.products.length) {

                res.setHeader('Content-type', 'application/json');
                return res.status(404).json({ error: `Producto con ID: ${pid} no encontrado en el carrito.` });
            }

            // Actualizar el carrito con la nueva lista de productos
            cart.products = updatedProducts;

            let prodDelete = await cartsService.updateProdToCart(cid, cart);

            if (!prodDelete) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({ error: `No se pudo eliminar el producto id: ${cid}` })
            } else {
                req.socket.emit("ProductoBorrado", pid);
                console.log("Evento *ProductoBorrado* emitido");

                res.setHeader('Content-type', 'application/json');
                return res.status(200).json({ message: `Producto id: ${pid} eliminado del carrito ${cid} exitosamente.` });
            }
        } catch (error) {
            processesErrors(res, error);
        }
    }

    //6.Actualizar carrito desde un arreglo
    static updateCart = async (req, res) => {
        
        const { cid } = req.params;
        // Validar el ID del carrito
        if (!isValidObjectId(cid)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `id: ${cid} no valido,` })
        }

        const products = req.body;

        // Validar que el body contiene un arreglo de productos
        if (!Array.isArray(products)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: "Se esperaba un arreglo de productos en el body" });
        }

        try {
            // Verificar si el carrito existe
            let cart = await cartsService.getCartBy(cid);
            if (!cart) {
                res.setHeader('Content-type', 'application/json');
                return res.status(404).json({ error: `Carrito no encontrado con ID: ${cid}` });
            }

            // Validar que los productos existen en la base de datos de productos
            for (let product of products) {
                if (!isValidObjectId(product.product)) {
                    res.setHeader('Content-type', 'application/json');
                    return res.status(400).json({ error: `ID de producto no válido: ${product.product}` });
                }

                let existingProduct = await productsService.getProductById(product.product);
                if (!existingProduct) {
                    res.setHeader('Content-type', 'application/json');
                    return res.status(404).json({ error: `Producto no encontrado con ID: ${product.product}` });
                }
            }

            // Actualizar el carrito con los nuevos productos
            cart.products = products;

            // Actualizar el carrito en la base de datos
            const updatedCart = await cartsService.updateProdToCart(cid, cart);

            if (!updatedCart) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({ error: `No se a podido actualizar el producto id: ${cid}, ${prodModified}` })
            }

            // Emitir el evento de actualización
            req.socket.emit("CarritoActualizado", updatedCart);
            console.log("Evento *CarritoActualizado* emitido");

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({ success: "Carrito actualizado correctamente", updatedCart });

        } catch (error) {
            processesErrors(res, error);
        }
    }

    static updateQtyProdToCart = async (req, res) => {
        const { cid, pid } = req.params;
        // Validar el ID del carrito y del producto
        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: "ID de carrito o producto no válido" });
        }

        const { quantity } = req.body;
        // Validar que la cantidad sea un número mayor que 0
        if (!quantity || typeof quantity !== "number" || quantity <= 0) {
            return res.status(400).json({ error: "Cantidad no válida, debe ser un número mayor que 0" });
        }

        try {
            // Verificar si el carrito existe en la base de datos
            const cart = await cartsService.getCartBy(cid);
            if (!cart) {
                res.setHeader('Content-type', 'application/json');
                return res.status(404).json({ error: `Carrito no encontrado con ID: ${cid}` });
            }
            // Verificar si el producto existe en la base de datos

            const product = await productsService.getProductBy({ _id: pid });
            if (!product) {
                res.setHeader('Content-type', 'application/json');
                return res.status(404).json({ error: `Producto no encontrado con ID: ${pid}` });
            }

            let indexProduct = cart.products.findIndex(p => p.product._id == pid);
            if (indexProduct === -1) {
                res.setHeader('Content-type', 'application/json');
                return res.status(404).json({ error: `Producto con ID: ${pid} no encontrado en el carrito ID: ${cid}.` });
            } else {
                cart.products[indexProduct].quantity = quantity;
            }

            // Guardar el carrito actualizado
            const updatedCart = await cartsService.updateProdToCart(cid, cart);


            if (!updatedCart) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({ error: `No se pudo actualizar el carrito con ID: ${cid}` });
            }

            // Emitir el evento de actualización
            req.socket.emit("CarritoActualizado", updatedCart);
            console.log("Evento *CarritoActualizado* emitido");

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({ success: "Cantidad de producto actualizada correctamente", updatedCart });

        } catch (error) {
            console.error(error);
            processesErrors(res, error);
        }
    }

    static deleteCart = async (req, res) => {
        let { cid } = req.params;

        if (!isValidObjectId(cid)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `id: ${cid} no valido,` })
        }

        try {
            // Buscar el carrito en la base de datos
            const cart = await cartsService.getCartBy(cid);
            if (!cart) {
                res.setHeader('Content-type', 'application/json');
                return res.status(404).json({ error: `Carrito no encontrado con ID: ${cid}` });
            }

            // Eliminar todos los productos del carrito
            cart.products = [];

            // Guardar el carrito actualizado
            const updatedCart = await cartsService.updateProdToCart(cid, cart);

            if (!updatedCart) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({ error: `No se pudo eliminar los productos del carrito id: ${cid}` })
            } else {
                req.socket.emit("ProductoBorrado", cid);
                console.log("Evento *ProductoBorrado* emitido");

                res.setHeader('Content-type', 'application/json');
                return res.status(200).json({ updatedCart })
            }
        } catch (error) {
            processesErrors(res, error);
        }
    }

    static purchaseCart = async (req, res) => {

        // Validar Carrito
        const { cid } = req.params;
        if (!isValidObjectId(cid)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `Carrito id: ${cid} no valido,` })
        }

        //Obtener carrito desde la BBDD, si se encuentra sigue, caso contrario sale.
        try {
            let cart = await cartsService.getCartBy({ _id: cid });
            if (!cart) {
                res.setHeader("Content-Type", "application/json");
                return res.status(404).json({ error: `Carrito con id: ${cid} no encontrado.` });
            }

            // Arreglos para almacenar productos constock o sin stock suficiente.
            const prodconStock = [];
            const prodsinStock = [];
            let error = false;

            // Verificar existencia de cada producto del carrito
            for (let i = 0; i < cart.products.length; i++) {
                const codigo = cart.products[i].product._id;
                const cantidad = cart.products[i].quantity;
                const producto = await productsService.getProductBy({ _id: codigo });

                // Si producto no existe o no tiene el stock suficiente (Producto sin stock suficiente)
                if (!producto || producto.stock < cantidad) {
                    //Almaceno el producto en el arreglo de prod sin stock
                    prodsinStock.push({ product: codigo, quantity: cantidad });
                    //Bandera para determinar que hubo un error en el stock del producto
                    error = true;
                } else {
                    // Producto con stock suficiente,
                    if (producto.stock >= cantidad) {
                        //Almaceno el producto en el arreglo de prod con stock. Este arreglo es con el que se continua la compra
                        prodconStock.push({
                            codigo,
                            cantidad,
                            precio: producto.price,
                            descrip: producto.title,
                            subtotal: producto.price * cantidad,
                        });
                        // restarlo del inventario de la BBDD
                        producto.stock -= cantidad;
                        await productsService.updateProduct(codigo, producto);
                    } else {
                        error = true;
                        prodsinStock.push({ product: codigo, quantity: cantidad });
                    }
                }
            }

            // Si no hay productos con stock suficiente
            if (prodconStock.length == 0) {
                res.setHeader("Content-Type", "application/json");
                return res.status(400).json({ error: `No existen ítems en condiciones de ser facturados` });
            }

            // Crear el ticket con los productos comprados
            // Obtener la fecha en formato YYYYMMDD
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Mes en formato 2 dígitos
            const day = String(now.getDate()).padStart(2, '0'); // Día en formato 2 dígitos
            const datePart = `${year}${month}${day}`;

            // Generar número aleatorio de 5 dígitos
            const randomPart = Math.floor(10000 + Math.random() * 90000);

            let tcode = `TCKT-${datePart}-${randomPart}`;
            let tamount = prodconStock.reduce((acum, item) => acum += item.subtotal, 0);
       
            const ticket = await ticketsService.createTicket({ code: tcode, purchase_datetime: new Date(), amount: tamount, purchaser: req.user.email });

            console.log(`ticket: ${ticket.code}
Productos sin stock: ${prodsinStock.map(p => p.product._id)} `);

            // Actualizar carrito del usuario solo con productos sin stock
            cart.products = prodsinStock;
            await cartsService.updateProdToCart({ _id: cid }, cart);


            // Enviar respuesta según si hubo algún error
            const response = error
                ? { ticket, alerta: `Algunos ítems no pudieron procesarse por falta de inventario.` }
                : { ticket };



            // Config transporte de Nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user: config.GMAIL_ACCOUNT,
                    pass: config.GMAIL_CODE
                }
            });

            // Configuración del correo
            const mailOptions = {
                from: config.GMAIL_ACCOUNT,
                to: req.user.email,
                subject: "Confirmación de Compra",
                html: `
                <h1>Gracias por tu compra</h1>
                <p>Tu ticket de compra es: ${ticket.code}</p>
                <p>Total pagado: $${tamount.toFixed(2)}</p>
                ${error ? `<p>Algunos productos no pudieron comprarse debido a falta de stock:</p>
                <ul>${prodsinStock.map(item => `<li>${item.product._id}</li>`).join('')}</ul>` : ''}
            `
            };



            // enviar un mail
            try {
            // Enviar el correo
            await transporter.sendMail(mailOptions);
            } catch (error) {
                console.error("Error al enviar el correo de confirmación:", error);
                // Si falla el envio del mail
                // Se avisa con un mensaje en la response
                response.alerta = "Compra realizada, pero hubo un problema al enviar el correo de confirmación.";
            }

            if (error) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({
                    ticket,
                    alerta: `Atencion: algún/os ítem/s no se pudieron procesar por falta de stock al momento de la compra.
Intente comprar los productos restantes mas tarde o llamemos.`,
                    "Prods_sin_Stock": prodsinStock.map(p => p.product._id, ),
                    aviso: response.alerta
                });
            } else {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json( { ticket, aviso: response.alerta || null });
            }
        } catch (error) {
            console.log("Error en el proceso de compra.");
            processesErrors(res, error);
        }

    }

}


module.exports = { CartsController };