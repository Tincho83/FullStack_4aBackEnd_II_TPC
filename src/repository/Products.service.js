const ProductsDAO = require("../dao/db/ProductsManagerMongoDB");
const { ProductsDTO } = require("../dto/ProductsDTO");


class ProductsService {

    constructor(DAO) {
        this.productsDAO = DAO;
    }

    async getProducts() {
        let Products = await this.productsDAO.getProducts();

        if (Array.isArray(Products)) {
            Products = Products.map(p => new ProductsDTO(p));
        } else if (Products) {
            Products = new ProductsDTO(Products);
        }

        return Products;



    }

    async getProductsPaginate(page, limit, sort, searchCriteria) {
        let ProductsPag = await this.productsDAO.getProductsPaginate(page, limit, sort, searchCriteria);

        // Comprobar de que docs este antes de aplicarle ProductsDTO
        if (ProductsPag && Array.isArray(ProductsPag.docs)) {
            ProductsPag.docs = ProductsPag.docs.map(p => new ProductsDTO(p));
        }

        return ProductsPag;

    }

    async getProductBy(filter = {}) {
        let product = await this.productsDAO.getProductBy(filter);

        if (Array.isArray(product)) {
            product = product.map(p => new ProductsDTO(p));
        } else if (product) {
            product = new ProductsDTO(product);
        }

        return product;


    }

    async getProductById(product) {
        return await this.productsDAO.getProductById(product);
    }

    async addProduct(product) {
        return await this.productsDAO.addProduct(product);
    }

    async updateProduct(id, product) {
        return await this.productsDAO.updateProduct(id, product);
    }

    async deleteProduct(id) {
        return await this.productsDAO.deleteProduct(id);
    }

}

const productsService = new ProductsService(ProductsDAO);

module.exports = { productsService };