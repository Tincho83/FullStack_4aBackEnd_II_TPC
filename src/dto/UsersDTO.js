//Solo se modifica para evitar enviar informacion sensible, por ahora realizar traducccion o cambiar nombre de las propiedades

class UsersDTO {
    constructor(user) {
        console.log("... User DTO");
        this.first_name = user.first_name.toUpperCase();
        this.last_name = user.last_name ? user.last_name.toUpperCase() : "";
        this.fullname = this.first_name + " " + this.last_name;
        this.age = user.age ? user.age : "18";
        this.email = user.email;
        this.username = user.email.split("@")[0]
        this.role = user.role ? user.role : "user"; // this.rol=user.role || "user";        
        this.cartid=user.cart?user.cart.Id._id.toString() : "Sin_Cart_ID";
        //this.cartid = user.cart && user.cart.Id && user.cart.Id._id && user.cart.length > 0 ? user.cart.Id._id.toString() : "Sin_Cart_ID";
        //this.identity = user.alias.toUpperCase();
    }
}

module.exports = { UsersDTO };

/*
class UsersDTO {
    constructor(user) {
        console.log("... User DTO");
        this.nombre = user.first_name.toUpperCase();
        this.apellido = user.last_name?user.last_name.toUpperCase():"";
        this.nombre_completo = this.nombre +" " +this.apellido;
        this.edad = user.age?user.age:"18";
        this.correo=user.email;
        this.usuario=user.email.split("@")[0]
        this.rol=user.role?user.role:"user"; // this.rol=user.role || "user";
        //this.identity = user.alias.toUpperCase();
    }
}

module.exports = { UsersDTO };
*/
