const loginForm = document.getElementById('resetpassForm');

const passw = document.getElementById('newpassword');
const btnSubmitTokenMail = document.getElementById('resetpasstokenmail-btn');

const token = new URLSearchParams(window.location.search).get('token');

btnSubmitTokenMail.addEventListener("click", async (event) => {
    event.preventDefault();

    let password = passw.value;
    if (!token || !password) {
        alert('Token or password missing.');
        return;
    }

    let body = { token, password };

    try {
        let respuesta = await fetch("/api/sessions/resetpasswordtokenmail", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        let datos = await respuesta.json();

        if (respuesta.status == 400) {
            //console.log(datos.error);
            alert(datos.error);
        } else if (respuesta.status == 401) {
            //console.log(datos.error);
            alert(datos.error);
            setTimeout(() => {
                window.location.href = `/reqresetpassword`;
            }, 32);
        } else if (respuesta.ok) {
            window.location.href = `/login?mensaje=Reset Correct for: ${datos.result.email}, try login. `;
        }
    } catch (error) {
        //console.error("Error en la solicitud de restablecimiento de contraseña:", error);
        alert("Ocurrió un error al procesar la solicitud.");
    }

})
