const divConsultas = document.querySelector("#divConsultas");
const btnConsultas = document.querySelector("#btnConsultas");

console.log("Inicio: FrondEnd Test");

btnConsultas.addEventListener("click", async (e) => {
    e.preventDefault();
    divConsultas.textContent = "Cargando datos...";

    console.log("Inicio: Clic Boton");

    try {
        const respuesta = await fetch("http://localhost:8080/api/users");

        if (respuesta.status >= 400) {
            divConsultas.textContent = `Error al cargar consulta`;
            console.error(`Error al cargar consulta: ${respuesta.statusText}`);
            return;
        }

        const datos = await respuesta.json();
        //const resp = datos.resp || datos; // Ajuste según la estructura de datos
        const users = datos.users; // Accede al array de usuarios en datos.users

        if (!Array.isArray(users)) {
            divConsultas.textContent = `Formato de respuesta inesperado`;
            console.error("Formato de respuesta inesperado:", users);
            return;
        }

        divConsultas.textContent = ""; // Limpiar contenido previo
        users.forEach(u => {
            let parrafo = document.createElement("p");
            parrafo.innerHTML = `Usuarios: <b>${u.fullname}</b> | Edad: <b>${u.age}</b> | Email Nro. Pedido: <b>${u.email}</b> - Total a Pagar: <b>$${u.age}</b>`;
            divConsultas.appendChild(parrafo);
            divConsultas.appendChild(document.createElement("hr"));
        });

        console.log("Concluido: Clic Boton");
    } catch (error) {
        console.error("Error de conexión o en la solicitud:", error);
        divConsultas.textContent = "Error de conexión o en la solicitud.";
    }

});

console.log("Concluido: FrondEnd Test");

