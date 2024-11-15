const { isValidObjectId } = require("mongoose");
const { usersService } = require("../repository/Users.service");
const { processesErrors } = require("../utils/utils");

class UsersController {

    static getUsers = async (req, res) => {
        try {
            let users = await usersService.getUsers();

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({ users })

        } catch (error) {
            console.log("Imposible obtener usuarios desde la BBDD. " + error);
            processesErrors(res, error);
        }
    }

    static getUser = async (req, res) => {

        let { userid } = req.params;

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
       
        let { first_name, last_name, email, age, role, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ status: "error", error: "Incomplete values." })
        }

        try {
       
            let existe = await usersService.getUserBy({ email })
            if (existe) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({ error: `Usuario ${email} existente en DB.` })
            }

            const result = await usersService.createUser({ first_name, last_name, email, age, role, password });
            res.setHeader('Content-type', 'application/json');
            return res.status(201).json({ result });
         
        } catch (error) {
            processesErrors(res, error);
        }
    }

    static updateUser = async (req, res) => {

        let { userid } = req.params;
        const { first_name, last_name, email, age, role, password } = req.body;

        if (!isValidObjectId(userid)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `id: ${userid} no valido,` })
        }

        try {
     
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

       
            const updateUser = await usersService.updateUser({ _id: userid }, newUser);
            res.send({ status: 'success', payload: updateUser });
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message });
        }
    }

    static deleteUser = async (req, res) => {
      
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
         
            const result = await usersService.deleteUser({ _id: userid });
            res.status(200).send({ status: 'success', payload: result });
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message });
        }
    }

}

module.exports = { UsersController };