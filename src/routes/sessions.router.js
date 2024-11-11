const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const crypto = require("crypto");

const { UsersManagerMongoDB } = require("../dao/db/UsersManagerMongoDB");
const { UsersModel } = require("../dao/models/UsersModel.js");
const { config } = require("../config/config");
const { createHash, isValidPassword, passportCall, processesErrors } = require("../utils/utils");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { UsersDTO } = require("../dto/UsersDTO");

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

    //const ecode = req.params.codigo;
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
    // passport.authenticate("signup", { session: false, failureRedirect: "/api/sessions/error" }), // add "session: false" si no se usa sessions
    passportCall("signup"),

    (req, res) => {
        res.setHeader('Content-type', 'application/json');
        return res.status(201).json({ result: "Registro Ok", newuser: req.user });
    });

router.post("/login",
    //passport.authenticate("login", { session: false, failureRedirect: "/api/sessions/error" }), // add "session: false" si no se usa sessions
    passportCall("login"),
    (req, res) => {

        try {
            console.log("1sessions.router.js: router:/login passportcall:login**********req.user: ", req.user);

            req.user = new UsersDTO(req.user);

            let existe = { ...req.user };

            console.log("2sessions.router.js: router:/login passportcall:login**********req.user: ", req.user);
            
            //remover Datos sensibles
            //delete existe.password;

            console.log("usuario: ", existe);

            //let cartid =  existe.cart.Id._id.toString();
            //let cartid = existe.cart ? existe.cart.Id._id.toString() : "Sin_Cart_ID";
            let cartid = existe.cartid.toString();
            if (cartid === "Sin_Cart_ID") {
                console.log(`Usuario: ${existe.email} no tiene un carrito asociado, se recomienda asociar un Cart Id a este usuario o borrar y volver a crear el usuario.`);
            }


            console.log("cart id:", cartid);

            res.cookie("cartUser", cartid, {});


            //let token = jwt.sign(req.user, config.JWT_SECRET, { expiresIn: 660 }); //exp 11min
            let token = jwt.sign(existe, config.JWT_SECRET, { expiresIn: 660 }); //exp 11min

            res.cookie("currentUser", token, { httpOnly: true });

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({ payload: `Login Ok para ${req.user.first_name} ${JSON.stringify(req.user, null, 5)} token: ${token}`, existe });
        } catch (error) {
            processesErrors(res, error);
        }
    });

router.get('/logout', async (req, res) => {

    let { web } = req.query;

    res.clearCookie('currentUser');
    res.clearCookie('cartUser');

    /*
        req.session.destroy(error => {
            if (error) {
                res.setHeader('Content-type', 'application/json');
                return res.status(500).json({
                    error: `Error inesperado en el servidor, no se pudo realizar cierre de sesion.`,
                    detalle: `${error.message}`
                });
            }    
    
            if (web) {
                return res.redirect("/login?mensaje=Logout Success.")
            } else {
                res.setHeader('Content-type', 'application/json');
                return res.status(200).json({ payload: "Logout Success" });
            }
        })
        */

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
        //let existe = await UsersManagerMongoDB.getUsersByDBMongo({ email });
        let existe = await UsersManagerMongoDB.getUserBy({ email });
        if (!existe) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ status: "error", error: `No existe un usuario con el email '${email}'.` })
        }

        password = createHash(password);

        const result = await UsersManagerMongoDB.updateUser(existe._id, { password });

        res.setHeader('Content-type', 'application/json');
        return res.status(201).json({ result: "Reseteo password Ok", result });
    } catch (error) {
        console.log(error);

        res.setHeader('Content-type', 'application/json');
        return res.status(500).json({
            error: `Error inesperado en el servidor, vuelva a intentar mas tarde o contacte con el administrador.`,
            detalle: `${error.message}`
        });
    }
});

//Paso 3:
router.get("/github",
    passport.authenticate("github", { session: false }),
    (req, res) => {

        let token = jwt.sign(req.user, config.JWT_SECRET, { expiresIn: 660 }); //exp 5min
        res.cookie("currentUser", token, { httpOnly: true });

    });


router.get("/callbackGithub",
    passport.authenticate("github", { session: false, failureRedirect: "/api/sessions/error" }),
    (req, res) => {

        let user = req.user;
        delete user.profileGithub._raw;

        // ***********************

        console.log("1sessions.router.js: router:/callbackGithub passportcall:github**********req.user: ", user);

        user = new UsersDTO(user);

        user = { ...user };

        console.log("2sessions.router.js: router:/callbackGithub passportcall:github**********req.user: ", user);
        
        //remover Datos sensibles
        //delete existe.password;

        console.log("usuario: ", user);

        //let cartid =  existe.cart.Id._id.toString();
        //let cartid = existe.cart ? existe.cart.Id._id.toString() : "Sin_Cart_ID";
        let cartid = user.cartid.toString();
        if (cartid === "Sin_Cart_ID") {
            console.log(`Usuario: ${user.email} no tiene un carrito asociado, se recomienda asociar un Cart Id a este usuario o borrar y volver a crear el usuario.`);
        }

        console.log("cart id:", cartid);

        res.cookie("cartUser", cartid, {});


        // ******************
    

        let token = jwt.sign(user, config.JWT_SECRET, { expiresIn: 660 }); //exp 5min

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
            console.error("Error en el endpoint /current:", error);

            res.setHeader('Content-type', 'application/json');
            return res.status(500).json({
                error: "Error inesperado en el servidor.",
                detalle: error.message
            });
        }
    });

module.exports = { router };