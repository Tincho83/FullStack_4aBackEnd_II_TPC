const cargarDatosToken = async () => {
    let respuestatoken = await fetch("/api/products", {
    });

    if (respuestatoken.status >= 400) {
        alert("Error al cargar los productos.");
        alert(respuestatoken.statusText);
    } else {
        let datos = await respuestatoken.json();
    }
};

const loginForm = document.getElementById('loginForm');

const e_mail = document.getElementById('email');
const passw = document.getElementById('password');
const btnSubmit = document.getElementById('login-btn');
const btnLoginGitHub = document.getElementById('logingithub-btn');


const params = new URLSearchParams(window.location.search);

let mensaje = params.get("mensaje");
if (mensaje) {
    alert(mensaje);
}

btnLoginGitHub.addEventListener("click", async (event) => {
    btnLoginGitHub.disabled = true;
    window.location.href = `/api/sessions/github`;
})

btnSubmit.addEventListener("click", async (event) => {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    let email = e_mail.value;
    let password = passw.value;

    if (!email || !password) {
        alert('Complete Datos');
        return;
    }

    let body = { email, password }

    let respuesta = await fetch("/api/sessions/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })

    let datos = await respuesta.json();
    if (respuesta.status >= 400) {
        alert("Credenciales Invalidas.");
        let { error } = await respuesta.json();
        console.log("error: ", error);
        //alert(respuesta.error);
    } else {

        // Obtener CartId desde Cookie 'cartUser'
        let cartId = getCookie("cartUser");

        if (cartId === "Sin_Cart_ID") {
            console.log(`Usuario: ${email} no tiene un carrito asociado, se recomienda asociar un Cart Id a este usuario o borrar y volver a crear el usuario.`);
                
        }

        cargarDatosToken();
        window.location.href = `/products`;
    }

    // Funcion para obtener el valor de una cookie
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

})