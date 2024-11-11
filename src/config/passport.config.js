const passport = require("passport");
const local = require("passport-local");
const github = require("passport-github2");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");

const { isValidPassword, createHash } = require("../utils/utils");
const { UsersManagerMongoDB } = require("../dao/db/UsersManagerMongoDB");
const { CartsModel } = require("../dao/models/CartsModel");
const { config } = require("./config");
const { UsersDTO } = require("../dto/UsersDTO");




const cookieExtractor = req => {
    let token = null;

    if (req.cookies.currentUser) {
        token = req.cookies.currentUser;
    }
    return token;
}

const initPassport = () => {
    // Paso 1a: registro/inicio sesion local >>> signup/login        mini registro y login desde github >>> github
    passport.use("signup",
        new local.Strategy(
            {
                usernameField: "email",
                passReqToCallback: true
            },
            async (req, username, password, done) => {
                try {
                    let { first_name, last_name, age, role } = req.body

                    if (!first_name || !last_name || !age) {
                        console.log("1");
                        // return done(null, false);
                        return done(null, false, { message: `Nombre, Apellido y Edad Requerido.` });
                    }

                    if (role) {
                        role = role.toLowerCase();
                        if (role !== "admin" && role !== "user") {
                            return done(null, false, { message: `Solo se permite roles de Usuario o Admin.` });
                        }
                    }

                    //let existe = await UsersManagerMongoDB.getUsersByDBMongo({ email: username });
                    let existe = await UsersManagerMongoDB.getUserBy({ email: username });
                    if (existe) {
                        //return done(null, false);
                        return done(null, false, { message: `El usuario ${username} ya existe en la DB.` });
                    }
                    //validaciones...



                    password = createHash(password);

                    const newCart = await CartsModel.create({});
                    const cartId = newCart._id;

                    //const newuser = await UsersManagerMongoDB.addUser({ first_name, last_name, email: username, age, password });
                    const newuser = await UsersManagerMongoDB.addUser({ first_name, last_name, email: username, age, password, cart: { Id: cartId } });
                    //const newuser = await UsersManagerMongoDB.addUser({ first_name, last_name, email: username, age, role, password, cart: { Id: cartId } });


                    return done(null, newuser);


                } catch (error) {
                    return done(error)
                }
            }
        )
    );

    passport.use("login",
        new local.Strategy(
            {
                usernameField: "email",
            },
            async (username, password, done) => {
                try {
                    //let existe = await UsersManagerMongoDB.getUsersByDBMongo({ email: username });
                    let existe = await UsersManagerMongoDB.getUserBy({ email: username });
                    if (!existe) {
                        return done(null, false, { message: `Solo backend Usuario no encontrado.` });
                    }

                    if (!isValidPassword(password, existe.password)) {
                        return done(null, false, { message: `credenciales incorrectas.` });
                    }

                    console.log("1Passport.config.js: passport.user:login**************existe: ", existe);

                    //remover Datos sensibles
                    //existe = new UsersDTO(existe);
                    //existe = { ...existe };
                    //delete existe.password;

                    return done(null, existe);

                } catch (error) {
                    return done(error);
                }

            }
        )
    );

    passport.use("github",
        new github.Strategy(
            {
                clientID: config.GITHUB_CLIENTID,
                clientSecret: config.GITHUB_CLIENTSECRET,
                callbackURL: config.GITHUB_CALLBACKURL
            },
            async (token, refreshtoken, profile, done) => {
                try {
                    let { name, email } = profile._json;
                    if (!name || !email) {
                        return done(null, false);
                    }

                    //let usuario = await UsersManagerMongoDB.getUsersByDBMongo({ email });
                    let usuario = await UsersManagerMongoDB.getUserBy({ email });
                    if (!usuario) {

                        let fullName = profile._json.name;
                        let nombres = fullName.split(" ");

                        let createdAt = new Date(profile._json.created_at);
                        let currentDate = new Date();
                        let diffInMilliseconds = currentDate - createdAt;
                        let millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25;
                        let yearsDifference = diffInMilliseconds / millisecondsPerYear;
                        let age = Math.floor(yearsDifference);

                        const newCart = await CartsModel.create({});
                        const cartId = newCart._id;

                        //usuario = await UsersManagerMongoDB.addUser({ first_name: profile._json.name, last_name: "", email, age: 19, password: "", profileGithub: profile })
                          usuario = await UsersManagerMongoDB.addUser({ first_name: profile._json.name, last_name: "", email, age: 19, password: "", profileGithub: profile, cart: { Id: cartId } });
                    }

                    let token = jwt.sign(usuario, config.JWT_SECRET, { expiresIn: 660 }); // expira en 11 min

                    return done(null, usuario);

                } catch (error) {
                    return done(error);
                }

            }
        )
    );

    //cookieExtractor 
    passport.use("current",
        new passportJWT.Strategy(
            {
                secretOrKey: config.JWT_SECRET,
                jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([cookieExtractor])
            },
            async (user, done) => {
                try {
                    console.log("1passport.config.js: passport.use:current*******************user: ", user);
                    
                    if (user.status === "disable") {
                        console.log("passport.config: La cuenta esta deshabilitada momentaneamente, consulte al Administrador.");
                        return done(null, false, { message: "La cuenta esta deshabilitada momentaneamente, consulte al Administrador." })
                    }

                    if (!user) {
                        return done(null, false, { message: "Usuario no encontrado." })
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    )

}

module.exports = { initPassport };