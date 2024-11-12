const jwt = require("jsonwebtoken");
const { config } = require("../config/config");
const { isValidObjectId } = require("mongoose");

const cartProtectMiddleware = (roles = []) => {
    return (req, res, next) => {

        // Verificar que el usuario tiene acceso a su propio carrito
        //const cartIdInRequest = req.params.cid || req.body.cid;
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `No existe carrito con id ${cid}` });
        }

        let ciduser = req.user.cartid;
        const role = req.user.role; //
        console.log("cartIdInRequest: ", cid);
        console.log("req.user.cartId: ", ciduser);
        console.log("req.user.role: ", role);

        //if (cartIdInRequest && cartIdInRequest !== req.user.cartid) {
        //if (ciduser !== cid) {
        if (!roles.includes(role) && ciduser !== cid) {
            console.log("Tu Carrito Id no concuerda con el indicado. No posees autorizacion para modificar el carrito id: ", cid);
            res.setHeader('Content-Type', 'application/json');
            return res.status(403).json({ error: `No tienes permisos para modificar este carrito.` });
        }

        next();
    };

};

module.exports = cartProtectMiddleware;



/*
const jwt = require("jsonwebtoken");
const { config } = require("../config/config");
const { isValidObjectId } = require("mongoose");

const cartProtectMiddleware = (req, res, next) => {

    // Verificar que el usuario tiene acceso a su propio carrito
    //const cartIdInRequest = req.params.cid || req.body.cid;
    const { cid } = req.params;

    if (!isValidObjectId(cid)) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: `No existe carrito con id ${cid}` });
    }

    let ciduser = req.user.cartid;
    const role = req.user.role; //
    console.log("cartIdInRequest: ", cid);
    console.log("req.user.cartId: ", ciduser);
    console.log("req.user.role: ", role);

    //if (cartIdInRequest && cartIdInRequest !== req.user.cartid) {
    if (ciduser !== cid) {
        console.log("Tu Carrito Id no concuerda con el indicado. No posees autorizacion para modificar el carrito id: ", cid);
        res.setHeader('Content-Type', 'application/json');
        return res.status(403).json({ error: `No tienes permisos para modificar este carrito.` });
    }

    next();
};

module.exports = cartProtectMiddleware;


*/