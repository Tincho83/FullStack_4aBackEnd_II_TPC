const { ProductsModel } = require("../models/ProductsModel");

// Manager para la BBDD de products
class ProductsManagerMongoDB {

    //Obtener products
    static async getProducts() {
        console.log(">DAO Get Products:");
        return await ProductsModel.find().lean();
    }

    //Obtener products con paginacion
    static async getProductsPaginate(page = 1, limit = 10, sort, searchCriteria = {}) {
        console.log(">DAO Get Products (Paginate):");
        return await ProductsModel.paginate(searchCriteria, { page: page, limit: limit, sort: sort, lean: true });
    }

    //Obtener products por medio de filtro
    static async getProductBy(filter = {}) {
        console.log(">DAO GetBy Filter Product:");
        return await ProductsModel.findOne(filter).lean();
    }

    //Obtener products por ID
    static async getProductById(product) {
        console.log(">DAO GetBy Id Product:");
        return await ProductsModel.findById(product).lean();
    }


    //Agregar product a la BBDD
    static async addProduct(product) {
        console.log(">DAO Create Product:");
        let prodNew = await ProductsModel.create(product);
        return prodNew.toJSON();
    }

    //Actualizar product desde id con product con valores
    static async updateProduct(id, product) {
        console.log(">DAO Update Product:");
        return await ProductsModel.findByIdAndUpdate(id, product, { new: true }).lean();
    }

    //Borrar product de la BBDD
    static async deleteProduct(id) {
        console.log(">DAO Delete Product:");
        return await ProductsModel.findByIdAndDelete(id, { new: true }).lean();
    }

}

module.exports = ProductsManagerMongoDB;