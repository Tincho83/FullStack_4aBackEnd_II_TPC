//const UsersDAO = require("../dao/db/UsersManagerMongoDB");
const { DAO: UsersDAO } = require("../dao/factory");
const { UsersDTO } = require("../dto/UsersDTO");


class UsersService {

    constructor(DAO) {
        this.usersDAO = DAO;
    }

    async getUsers() {
        console.log("... User Service");
        //return await this.usersDAO.getUsers();
        let users = await this.usersDAO.getUsers();

        users = users.map(u => new UsersDTO(u))
        return users;

    }

    async getUserBy(filter = {}) {
        console.log("... User Service");
        //return await this.usersDAO.getUserBy(filter);

        let user = await this.usersDAO.getUserBy(filter);

        if (Array.isArray(user)) {
            user = user.map(u => new UsersDTO(u));
        } else if (user) {
            user = new UsersDTO(user);
        }        
        
        return user;
    }

    /*
        async getUsuarioByNombre(nombre){
            let usuarios=await this.usuariosDAO.get()
            let usuario=usuarios.find(u=>u.nombre===nombre)
            return usuario
        }
    
        async getUsuarioByEmail(email){
            let usuarios=await this.usuariosDAO.get()
            let usuario=usuarios.find(u=>u.email===email)
            return usuario
        }
    */

    async createUser(user) {
        return await this.usersDAO.addUser(user);
    }

    async updateUser(id, User) {
        return await this.usersDAO.updateUser(id, User);
    }

    async deleteUser(id) {
        return await this.usersDAO.deleteUser(id);
    }


}

const usersService = new UsersService(UsersDAO);

module.exports = { usersService };