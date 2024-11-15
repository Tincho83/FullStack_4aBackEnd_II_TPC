// Funcion para volver a la pagina de vista de products
function BackToProducts() {
    window.location.href = "/products";
}

// Funcion para borrar un producto del carrito
async function DeleteProduct(productId, cartId) {
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                // Eliminar producto del DOM
                document.querySelector(`[data-id="${productId}"]`).remove();

                // Actualizar el subtotal
                updateSubtotal();
            } else {
                console.error('Error al eliminar el producto');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Funcion para recalcular subtotal
function updateSubtotal() {
    let subtotal = 0;
    document.querySelectorAll('.divCardItem').forEach(item => {
        const price = parseFloat(item.querySelector('.ItemDataPrice').textContent.replace('Price: $', ''));
        const quantity = parseInt(item.querySelector('.ItemDataQty').textContent.replace('Quantity: ', ''));
        subtotal += price * quantity;
    });
    document.querySelector('.ItemDataSubtotal').textContent = `Subtotal: $ ${subtotal}`;
}

// Funcion para ver el detalle del producto
function ViewProduct(pid) {    
    window.location.href = `/products/${pid}`;
}

// Funcion para realizar la compra del carrito
async function CartPurchase(cartId) {
    const response = await fetch(`/api/carts/${cartId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.status >= 400) {
        let { error } = await response.json();
        alert(error);
    }

    if (response.ok) {
        const result = await response.json();
  
        const ticketCode = result.ticket.code;
        const ticketMail = result.ticket.purchaser;

        const mySwal = Swal.fire('Compra realizada',
            `Tu compra con ticket ${ticketCode} se ha realizado con exito. se envia al mail "${ticketMail}" el detalle de la compra`,
            'success');
        setTimeout(() => {
            mySwal.close();
            window.location.href = `/carts/${cartId}`; 
        }, 5000);

    } else {
        const errorResult = await response.json();
        Swal.fire('Error en la compra', errorResult.error || 'No se pudo realizar la compra', 'error');
    }

}