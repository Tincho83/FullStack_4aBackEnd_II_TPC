const jwt = require("jsonwebtoken");
const { config } = require("../config/config");

const authMiddleware = (req, res, next) => {

    let url = req.url;
    let { web } = req.query;

    if (!req.cookies.currentUser) {

        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `Credenciales No autorizadas. Sin token` });
    }

    let token = req.cookies.currentUser;

    try {

        let usuario = jwt.verify(token, config.JWT_SECRET);
        req.user = usuario;

        // Todos redireccionan a /products pero solo role: "admin" tiene permisos para /realtimeproducts
        if (req.user.role != "admin") {

            if (url.includes("/realtimeproducts")) {
                return res.redirect("/products");
            }
        }

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            res.clearCookie('currentUser');
            return res.status(401).json({ error: "Token expirado. Por favor, actualize la pagina e inicie sesión de nuevo." });
        } else {
            console.log("Error al verificar el token: ", error.message);

            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: `Credenciales No autorizadas.`, detalle: error.message });
        }
    }

    return next();
}


const auth = (roles = []) => {
    return (req, res, next) => {

        if (!Array.isArray(roles)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error en permisos de la ruta.` });
        }

        console.log("rol/es No autorizados: ", roles );
        roles = roles.map(rol => rol.toLowerCase());

        if (roles.includes("public")) {
            return next();
        }


        //if (!req.user || !req.user?.role) {
        if (!req.user || !req.user.role) {
            console.log("!role", req.user );
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: `No posee permisos. No Autorizado.` });
        }

        if (roles.includes(req.user.role.toLowerCase())) {
            console.log("rol del usuario: ", req.user.role );
            res.setHeader('Content-Type', 'application/json');
            return res.status(403).json({ error: `No Autorizado a este recurso.` });
        }

            // Verificar que el usuario tiene acceso a su propio carrito
            //const cartIdInRequest = req.params.cid || req.body.cid;

            //console.log("cartIdInRequest", cartIdInRequest);
            //console.log("req.user.cartId", req.user.cartid);
        
            //if (cartIdInRequest && cartIdInRequest !== req.user.cartid) {
            //    res.setHeader('Content-Type', 'application/json');
            //    return res.status(403).json({ error: `No tienes permisos para modificar este carrito.` });
            //}

        next();

    }

}


module.exports =
    auth,
    authMiddleware
    ;

