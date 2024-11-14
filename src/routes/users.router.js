const { Router } = require("express");

const { UsersController } = require("../controllers/UsersController.js");
const auth = require("../middlewares/authMiddleware.js");
const passport = require("passport");

const router = Router();

router.get('/', UsersController.getUsers)

router.get('/:userid([a-f0-9]+)', UsersController.getUser)

router.post('/', UsersController.createUser)

router.put('/:userid([a-f0-9]+)', passport.authenticate("current", { session: false }), auth(['user']), UsersController.updateUser)

router.delete('/:userid([a-f0-9]+)', passport.authenticate("current", { session: false }), auth(['user']), UsersController.deleteUser)

module.exports = { router };