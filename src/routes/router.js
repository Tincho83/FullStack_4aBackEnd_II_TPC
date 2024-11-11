const { Router } = require("express");

class CustomRouter {

    #router = null;

    constructor() {
        this.#router = Router();
        this.init();
    }

    init() {

    }

    getRouter() {
        return this.#router;
    }

    get(path, ...functions) {
        this.#router.get(path, functions)
    }

    post(path, ...functions) {
        this.#router.post(path, functions);
    }

    put(path, ...functions) {
        this.#router.put(path, functions);
    }

    delete(path, ...functions) {
        this.#router.delete(path, ...functions);
    }
}

module.exports = { CustomRouter };