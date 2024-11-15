//Solo se modifica para evitar enviar informacion sensible, por ahora realizar traducccion o cambiar nombre de las propiedades

class UsersDTO {
    constructor(user) {
        console.log(">DTO Users:");
        this.first_name = user.first_name.toUpperCase();
        this.last_name = user.last_name ? user.last_name.toUpperCase() : "";
        this.fullname = this.first_name + " " + this.last_name;
        this.age = user.age ? user.age : "18";
        this.email = user.email;
        this.username = user.email.split("@")[0]
        this.role = user.role ? user.role : "user"; 
        this.cartid=user.cart?user.cart.Id._id.toString() : "Sin_Cart_ID";
    }
}

module.exports = { UsersDTO };
