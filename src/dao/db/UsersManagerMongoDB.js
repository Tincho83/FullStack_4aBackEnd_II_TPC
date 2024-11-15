const { UsersModel } = require("../models/UsersModel");

// Manager para la BBDD de users
class UsersManagerMongoDB {

    //*Obtener Users
    static async getUsers() {
        console.log(">DAO Get Users:");
        return await UsersModel.find().lean();
    }

    static async getUserBy(filter = {}) { //{ key:"value", key2: "value" }
        console.log(">DAO GetBy User:");
        return await UsersModel.findOne(filter).lean();
    }
    
    //*Agregar Users a la BBDD
    static async addUser(User) {
        console.log(">DAO Create Users:");
        let userNew = await UsersModel.create(User);
        return userNew.toJSON();
    }

    //*Actualizar User desde id con User con valores
    static async updateUser(id, User) {
        console.log(">DAO Update User:");
        return await UsersModel.findByIdAndUpdate(id, User, { new: true }).lean();
    }

    //Borrar User de la BBDD
    static async deleteUser(id) {
        console.log(">DAO Delete User:");
        return await UsersModel.findByIdAndDelete(id, { new: true }).lean();
    }

    //*Obtener Users por credenciales
    static async getUserCredencialesDBMongo(email, password) {
        console.log(">DAO GetCredencials Users:");
        return await UsersModel.findOne({ email, password }).lean();
    }

    //*Obtener Users por medio de filtro
    static async getUsersByDBMongo(filter = {}) { //{ key:"value", key2: "value" }
        return await UsersModel.findOne(filter).lean();
    }


    //Obtener Users con paginacion
    static async getUsersDBMongoPaginate(page = 1, limit = 10, sort, searchCriteria = {}) {
        console.log(">DAO Get Users (Paginate):");
        return await UsersModel.paginate(searchCriteria, { page: page, limit: limit, sort: sort, lean: true });
    }

    //Obtener cart por id
    static async getUserByIDDBMongo(id) {
        console.log(">DAO GetBy ID Users:");
        return await UsersModel.findOne({ _id: id }).lean();
    }

}

module.exports = { UsersManagerMongoDB };