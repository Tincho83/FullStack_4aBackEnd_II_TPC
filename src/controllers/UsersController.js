const { isValidObjectId } = require("mongoose");
const UsersManager = require("../dao/db/UsersManagerMongoDB");
const { UsersModel } = require("../dao/models/UsersModel.js");
const { usersService } = require("../repository/Users.service");
const { processesErrors } = require("../utils/utils");

class UsersController {

    static getUsers = async (req, res) => {
        try {
            console.log("... User Controller");
            //let users = await UsersModel.find();
            //let users = await UsersManager.getUsersDBMongo();
            let users = await usersService.getUsers();

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({ users })
            //res.send({ result: "sucess", payload: users });
        } catch (error) {
            console.log("Imposible obtener usuarios desde la BBDD. " + error);
            processesErrors(res, error);
            //res.status(500).send({ status: 'error', message: error.message });
        }
    }

    static getUser = async (req, res) => {

        let { userid } = req.params;
        console.log("req.params.userid: ", req.params.userid);
        console.log("id: ", userid);

        if (!isValidObjectId(userid)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `id: ${userid} no valido,` })
        }

        try {
            let user = await usersService.getUserBy({ _id: userid });
            if (!user) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({ error: `No existen usuarios con el id: ${userid}` });
            }

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({ user })
        } catch (error) {
            processesErrors(res, error);           
        }

    }

    static createUser = async (req, res) => {
        //{"first_name": "Operario", "last_name": "Operario", "email": "operario@test.com", "password":"ope123" }
        //{"first_name": "Admin", "last_name": "Admin", "email": "admin@test.com", "role": "admin", "password":"admin123" }

        let { first_name, last_name, email, age, role, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ status: "error", error: "Incomplete values." })
        }

        try {
            console.log("email: ", email);
            let existe = await usersService.getUserBy({ email })
            if (existe) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({ error: `Usuario ${email} existente en DB.` })
            }

            const result = await usersService.createUser({ first_name, last_name, email, age, role, password });
            res.setHeader('Content-type', 'application/json');
            return res.status(201).json({ result });
            //res.send({ status: 'success', payload: result });
        } catch (error) {
            console.log(error);

            res.setHeader('Content-type', 'application/json');
            return res.status(500).json({
                error: `Error inesperado en el servidor, vuelva a intentar mas tarde o contacte con el administrador.`,
                detalle: `${error.message}`
            });
        }
    }

    static updateUser = async (req, res) => {
        //const userid = req.params.userid;
        let { userid } = req.params;
        const { first_name, last_name, email, age, role, password } = req.body;

        if (!isValidObjectId(userid)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `id: ${userid} no valido,` })
        }

        try {
            //const user = await UsersModel.findOne({ _id: userid });
            let user = await usersService.getUserBy({ _id: userid });
            if (!user) throw new Error('User not found');

            const newUser = {
                first_name: first_name ?? user.first_name,
                last_name: last_name ?? user.last_name,
                role: role ?? user.role,
                age: age ?? user.age,
                password: password ?? user.password,
                email: email ?? user.email
            }

            //const updateUser = await UsersModel.updateOne({ _id: userid }, newUser);
            const updateUser = await usersService.updateUser({ _id: userid }, newUser);
            res.send({ status: 'success', payload: updateUser });
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message });
        }
    }

    static deleteUser = async (req, res) => {
        //const userid = req.params.userid;
        let { userid } = req.params;

        if (!isValidObjectId(userid)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `id: ${userid} no valido,` })
        }

        let user = await usersService.getUserBy({ _id: userid });
         if (!user) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `No existen usuarios con el id: ${userid}` });
        }


        try {
            //const result = await UsersModel.deleteOne({ _id: userid });
            const result = await usersService.deleteUser({ _id: userid });
            res.status(200).send({ status: 'success', payload: result });
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message });
        }
    }

}

module.exports = { UsersController };