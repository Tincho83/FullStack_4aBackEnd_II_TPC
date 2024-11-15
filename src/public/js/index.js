let pFecha = document.getElementById("DateLastAccess");

formatCurrentDate();

// Funcion para dar forma a la Fecha y Hora
function formatCurrentDate() {
    const today = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const formattedDate = formatter.format(today);

    pFecha.textContent = `Fecha de Último Acceso: ${formattedDate}`;
}

// Funcion para agregar producto al carrito
async function AddProducttoCart(productId) {

    // Obtener CartId desde Cookie 'cartUser'
    let cartId = getCookie("cartUser");

    if (!cartId || cartId == null || cartId == undefined || cartId == "undefined") {
        
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No tienes un carrito. Inicia sesion, si el problema continua contacta a nuestro soporte.',
        });
        return;

        
        // Si no hay carrito en localStorage, creamos uno nuevo
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

// Funcion para ver el carrito
function ViewCart() {

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

    // Redirigir a la pagina del carrito por el id
    window.location.href = `/carts/${cartId}`;
}

// Funcion para obtener el valor de una cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


// Funcion para ver el carrito
function ViewProduct(pid) {
    // Redirigir a la página del carrito
    window.location.href = `/products/${pid}`;
}

// Funcion para validar MongoDB id, usando expresion regular
function isValidObjectId(id) {
    return /^[a-f\d]{24}$/i.test(id);
}

