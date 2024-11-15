const { DAO: UsersDAO } = require("../dao/factory");
const { UsersDTO } = require("../dto/UsersDTO");


class UsersService {

    constructor(DAO) {
        this.usersDAO = DAO;
    }

    async getUsers() {
        console.log(">Service Get Users:");
        let users = await this.usersDAO.getUsers();

        users = users.map(u => new UsersDTO(u))
        return users;

    }

    async getUserByFilter(filter = {}) {
        console.log(">Service GetBy Filter User:");
        let user = await this.usersDAO.getUserBy(filter);
      
        return user;
    }

    async getUserBy(filter = {}) {
        console.log(">Service GetBy User:");
        let user = await this.usersDAO.getUserBy(filter);

        if (Array.isArray(user)) {
            user = user.map(u => new UsersDTO(u));
        } else if (user) {
            user = new UsersDTO(user);
        }        
        return user;
    }

    async createUser(user) {
        console.log(">Service Create User:");
        return await this.usersDAO.addUser(user);
    }

    async updateUser(id, User) {
        console.log(">Service Update User:");
        return await this.usersDAO.updateUser(id, User);
    }

    async deleteUser(id) {
        console.log(">Service Delete User:");
        return await this.usersDAO.deleteUser(id);
    }
}

const usersService = new UsersService(UsersDAO);

module.exports = { usersService };