const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const crypto = require("crypto");
const { UsersManagerMongoDB: UsersManager } = require("../dao/db/UsersManagerMongoDB");
const { UsersModel } = require("../dao/models/UsersModel.js");
const { usersService } = require("../repository/Users.service");
const { config } = require("../config/config");
const { createHash, isValidPassword, passportCall, processesErrors } = require("../utils/utils");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { UsersDTO } = require("../dto/UsersDTO");
const nodemailer = require('nodemailer');

const router = Router();

let erroresCodigo = {
    e760: "Error en software Cliente.",
    e830: "Error en hardware.",
    e960: "Error en hora del equipo cliente."
}

//Paso 3:
router.get("/error", (req, res) => {
    res.setHeader('Content-type', 'application/json');
    return res.status(401).json({ error: "Error al autenticar" });
});

router.param("codigo", (req, res, next, codigo) => {
    let descriptionError = "Error no identificado";

    if (erroresCodigo[codigo]) {
        descriptionError = erroresCodigo[codigo];
    }

    req.descriptionError = descriptionError;
    next();
});


router.get("/error/:codigo(e[0-9]+)", (req, res) => {


    let { codigo } = req.params;

    console.log("ecode: ", req.descriptionError);

    //res.setHeader('Content-type', 'application/json');
    //return res.status(401).json(`Codigo de error recibido: ${ecode}`);
    res.status(200).send({ message: `Codigo de error recibido: ${req.descriptionError}` });
});

router.get("/error/:codigo(e[0-9]+)/:usuario", (req, res) => {

    let { usuario } = req.params;

    console.log("ecode: ", req.email, req.descriptionError);

    //res.setHeader('Content-type', 'application/json');
    //return res.status(401).json(`Codigo de error recibido: ${ecode}`);
    res.status(200).send({ message: `Codigo de error recibido: ${req.descriptionError}, por parte de ${usuario}` });
});

router.post("/signup",    
    passportCall("signup"),

    (req, res) => {
        res.setHeader('Content-type', 'application/json');
        return res.status(201).json({ result: "Registro Ok", newuser: req.user });
    });

router.post("/login",    
    passportCall("login"),
    (req, res) => {

        try {

            req.user = new UsersDTO(req.user);

            let existe = { ...req.user };


            let cartid = existe.cartid.toString();
            if (cartid === "Sin_Cart_ID") {
                console.log(`Usuario: ${existe.email} no tiene un carrito asociado, se recomienda asociar un Cart Id a este usuario o borrar y volver a crear el usuario.`);
            }


            res.cookie("cartUser", cartid, {});


            let token = jwt.sign(existe, config.JWT_SECRET, { expiresIn: 1920 }); //exp 32min

            res.cookie("currentUser", token, { httpOnly: true });

            res.setHeader('Content-type', 'application/json');
            //return res.status(200).json({ payload: `Login Ok para ${req.user.first_name} ${JSON.stringify(req.user, null, 5)} token: ${token}`, existe });
            return res.status(200).json({ payload: `Login Ok para ${req.user.email} (${existe.fullname}) token: ${token}`, existe });
        } catch (error) {
            processesErrors(res, error);
        }
    });

router.get('/logout', async (req, res) => {

    let { web } = req.query;

    res.clearCookie('currentUser');
    res.clearCookie('cartUser');


    if (web) {
        return res.redirect("/login?mensaje=Logout Success.")
    } else {
        res.setHeader('Content-type', 'application/json');
        return res.status(200).json({ payload: "Logout Success" });
    }

});

router.put("/resetpassword", async (req, res) => {

    let { email, password } = req.body;

    if (!email || !password) {
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ status: "error", error: "Incomplete values." })
    }

    try {
        let existe = await usersService.getUserByFilter({ email });
        if (!existe) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ status: "error", error: `No existe un usuario con el email '${email}'.` })
        }

        password = createHash(password);

        const result = await usersService.updateUser(existe._id, { password });

        res.setHeader('Content-type', 'application/json');
        return res.status(201).json({ result: "Reseteo password Ok", result });
    } catch (error) {
        processesErrors(res, error);
    }
});

// Config transporte de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.GMAIL_ACCOUNT,
        pass: config.GMAIL_CODE
    }
});

router.put("/resetpasswordmail", async (req, res) => {

    const { email } = req.body;

    if (!email) {
        res.setHeader('Content-type', 'application/json');
        return res.status(400).json({ status: "error", error: "Email is required." });
    }

    try {
        let existe = await usersService.getUserByFilter({ email });
        if (!existe) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ status: "error", error: "User not found." });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: 3599 });

        const resetLink = `http://localhost:8080/resetpassword?token=${token}`;
        await transporter.sendMail({
            from: config.GMAIL_ACCOUNT,
            to: email,
            subject: "Password Reset",
            html: `
            <p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>
            <p>or</p>
            <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
            <a href="${resetLink}" style=" display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff;
            background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email.</p>
            `
        });


        res.setHeader('Content-type', 'application/json');
        res.status(200).json({ status: "success", message: "Reset password email sent." });
    } catch (error) {
        processesErrors(res, error);
    }
});

router.put("/resetpasswordtokenmail", async (req, res) => {

    const { token, password } = req.body;


    if (!token || !password) {
        return res.status(400).json({ status: "error", error: "Token and password are required." });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const { email } = decoded;



        let user = await usersService.getUserByFilter({ email });
        if (!user) {
            return res.status(400).json({ status: "error", error: "User not found." });
        }



        // Verificar si la nueva contraseña es la misma que la actual
        const isSamePassword = isValidPassword(password, user.password);

        if (isSamePassword) {

            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ status: "error", error: "New password cannot be the same as the current password. Enter a diferent password.", email });
        }

        // Actualizar la contraseña
        const hashedPassword = createHash(password);


       
        const result = await usersService.updateUser(user._id, { password: hashedPassword });


        res.setHeader('Content-type', 'application/json');
        res.status(201).json({ status: "success", message: "Password has been reset. You can now log in with the new password.", result });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.setHeader('Content-type', 'application/json');
            res.status(401).json({ status: "error", error: "Token expired. Please request a new password reset link." });
        } else {
            processesErrors(res, error);
        }
    }
});



//Paso 3:
router.get("/github",
    passport.authenticate("github", { session: false }),
    (req, res) => {

        let token = jwt.sign(req.user, config.JWT_SECRET, { expiresIn: 1920 }); //exp 32min
        res.cookie("currentUser", token, { httpOnly: true });

    });


router.get("/callbackGithub",
    passport.authenticate("github", { session: false, failureRedirect: "/api/sessions/error" }),
    (req, res) => {

        let user = req.user;
        delete user.profileGithub._raw;

        user = new UsersDTO(user);

        user = { ...user };

        let cartid = user.cartid.toString();
        if (cartid === "Sin_Cart_ID") {
            console.log(`Usuario: ${user.email} no tiene un carrito asociado, se recomienda asociar un Cart Id a este usuario o borrar y volver a crear el usuario.`);
        }

        res.cookie("cartUser", cartid, {});


        let token = jwt.sign(user, config.JWT_SECRET, { expiresIn: 1920 }); //exp 32min

        if (!token) {
            return res.status(500).json({ error: "Token no encontrado." });
        }


        try {
            res.cookie("currentUser", encodeURIComponent(token), { httpOnly: true });
        } catch (error) {
            console.log("creando currentUser: error: ", error);
        }

        return res.redirect("/profile");

    });

router.get("/current",
    passport.authenticate("current", { session: false, failureRedirect: "/api/sessions/error" }),
    (req, res) => {
        try {
            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({ message: 'User Current Logged.', user: req.user, });
        } catch (error) {
            processesErrors(res, error);
        }
    });

module.exports = { router };