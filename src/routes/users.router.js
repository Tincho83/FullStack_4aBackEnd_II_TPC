const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { UsersManagerMongoDB } = require("../dao/db/UsersManagerMongoDB");
const { UsersModel } = require("../dao/models/UsersModel.js");
const { UsersController } = require("../controllers/UsersController.js");

const router = Router();

router.get('/', UsersController.getUsers)
/*
router.get('/', async (req, res) => {

    try {
        //let users = await UsersModel.find();
        let users = await UsersManagerMongoDB.getUsersDBMongo();
        
        res.setHeader('Content-type', 'application/json');
        return res.status(200).json({ users })
        //res.send({ result: "sucess", payload: users });
    } catch (error) {
        console.log("Imposible obtener usuarios desde la BBDD. " + error);

        res.setHeader('Content-type', 'application/json');
        return res.status(500).json({
            error: `Error inesperado en el servidor, vuelva a intentar mas tarde o contacte con el administrador.`,
            detalle: `${error.message}`
        });
        //processesErrors(res, error);
        //res.status(500).send({ status: 'error', message: error.message });
    }
});
*/

router.get('/:userid([a-f0-9]+)', UsersController.getUser)

// Seguir modificando para usar el manager y no la consulta
router.post('/', UsersController.createUser)
/*
router.post('/', async (req, res) => {

    //{"first_name": "Operario", "last_name": "Operario", "email": "operario@test.com", "password":"ope123" }
    //{"first_name": "Admin", "last_name": "Admin", "email": "admin@test.com", "role": "admin", "password":"admin123" }

    let { first_name, last_name, email, age, role, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ status: "error", error: "Incomplete values." })
    }

    try {
        const result = await UsersModel.create({ first_name, last_name, email, age, role, password });
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
});
*/

router.put('/:userid([a-f0-9]+)', UsersController.updateUser)
/*
router.put('/:userid', async (req, res) => {

    const userid = req.params.userid;
    const { first_name, last_name, email, age, role, password } = req.body;

    try {
        const user = await UsersModel.findOne({ _id: userid });
        if (!user) throw new Error('User not found');

        const newUser = {
            first_name: first_name ?? user.first_name,
            last_name: last_name ?? user.last_name,
            role: role ?? user.role,
            age: age ?? user.age,
            password: password ?? user.password,
            email: email ?? user.email
        }

        const updateUser = await UsersModel.updateOne({ _id: userid }, newUser);
        res.send({ status: 'success', payload: updateUser });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});
*/

router.delete('/:userid([a-f0-9]+)', UsersController.deleteUser)
/*
router.delete('/:userid', async (req, res) => {

    const userid = req.params.userid;

    try {
        const result = await UsersModel.deleteOne({ _id: userid });
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});
*/



module.exports = { router };