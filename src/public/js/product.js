


// Funcion para agregar producto al carrito
async function AddProducttoCart(productId) {

    // Obtener Cartid desde LocalStorage IdCart
    //let cartId = localStorage.getItem("IdCart");

    // Obtener CartId desde Cookie 'cartUser'
    let cartId = getCookie("cartUser");

    console.log("cart id:", cartId);

    if (!cartId || cartId == null || cartId == undefined || cartId == "undefined") {

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No tienes un carrito. Inicia sesion, si el problema continua contacta a nuestro soporte.',
        });
        return;



        // Si no hay carrito en localStorage, creamos uno nuevo
        /*
        try {
            const response = await fetch('/api/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Error al crear el carrito');
            }

            const newCart = await response.json();
            cartId = newCart.cartnuevo._id;

            // Guardamos el nuevo carrito en localStorage
            localStorage.setItem("IdCart", cartId);
        } catch (error) {
            console.error("Error al crear un nuevo carrito: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear un carrito nuevo.'
            });
            return;
        }
        */
    }

    // Validar los ID
    if (!isValidObjectId(productId)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ID de producto no válido.'
        });
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ error: `ID(s) no válidos. Verifique los Is's ingresados.` });
    }

    if (cartId && !isValidObjectId(cartId)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'ID de carrito no válido.'
        });
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ error: `ID(s) no válidos. Verifique los Is's ingresados.` });
    }
    //console.log(`Carrito ID: ${cartId}, Producto ID: ${productId}`);

    try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if(response.status >= 400){
            let { error } = await response.json();
            alert(error);
        }

        if (response.ok) {
            const result = await response.json();
            Swal.fire({
                icon: 'success',
                title: 'Producto agregado al carrito',
                text: `El producto ha sido agregado correctamente`,
            });
        } else {
            const errorData = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `No se pudo agregar el producto al carrito: ${errorData.error}`,
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al agregar el producto al carrito.',
        });
    }
}

// Funcion para volver a la pagina de productos
function BackToProducts() {
    window.location.href = "/products";

}

// Funcion para validar MongoDB id, usando expresion regular
function isValidObjectId(id) {
    return /^[a-f\d]{24}$/i.test(id);
}

// Funcion para obtener el valor de una cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


// Funcion para ver el carrito
function ViewCart() {
        // Obtener Cartid desde LocalStorage IdCart
    //let cartId = localStorage.getItem("IdCart");

    // Obtener CartId desde Cookie 'cartUser'
    let cartId = getCookie("cartUser");

    if (!cartId || cartId == null || cartId == undefined || cartId == "undefined") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No tienes un carrito. Inicia sesion, si el problema continua contacta a nuestro soporte.',
        });
        return;
    }

    window.location.href = `/carts/${cartId}`;
}