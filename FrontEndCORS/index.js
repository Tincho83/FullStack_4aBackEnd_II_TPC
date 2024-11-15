const divConsultas = document.querySelector("#divConsultas");
const btnConsultas = document.querySelector("#btnConsultas");



btnConsultas.addEventListener("click", async (e) => {
    e.preventDefault();
    divConsultas.textContent = "Cargando datos...";


    try {
        const respuesta = await fetch("http://localhost:8080/api/users");

        if (respuesta.status >= 400) {
            divConsultas.textContent = `Error al cargar consulta`;
            console.error(`Error al cargar consulta: ${respuesta.statusText}`);
            return;
        }

        const datos = await respuesta.json();

        const users = datos.users;

        if (!Array.isArray(users)) {
            divConsultas.textContent = `Formato de respuesta inesperado`;
            console.error("Formato de respuesta inesperado:", users);
            return;
        }

        divConsultas.textContent = "";
        users.forEach(u => {
            let parrafo = document.createElement("p");
            parrafo.innerHTML = `Usuarios: <b>${u.fullname}</b> | Edad: <b>${u.age}</b> | Email Nro. Pedido: <b>${u.email}</b> - Total a Pagar: <b>$${u.age}</b>`;
            divConsultas.appendChild(parrafo);
            divConsultas.appendChild(document.createElement("hr"));
        });

    } catch (error) {
        console.error("Error de conexión o en la solicitud:", error);
        divConsultas.textContent = "Error de conexión o en la solicitud.";
    }

});


