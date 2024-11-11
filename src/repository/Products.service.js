const ProductsDAO = require("../dao/db/ProductsManagerMongoDB");
const { ProductsDTO } = require("../dto/ProductsDTO");


class ProductsService {

    constructor(DAO) {
        this.productsDAO = DAO;
    }

    async getProducts() {
        console.log("... Products Service");
        //return await this.productsDAO.getProducts();

        let Products = await this.productsDAO.getProducts();

        if (Array.isArray(Products)) {
            Products = Products.map(p => new ProductsDTO(p));
        } else if (Products) {
            Products = new ProductsDTO(Products);
        }

        return Products;



    }

    async getProductsPaginate(page, limit, sort, searchCriteria) {
        console.log("... Products Pag Service");
        //return await this.productsDAO.getProductsPaginate(page, limit, sort, searchCriteria);

        let ProductsPag = await this.productsDAO.getProductsPaginate(page, limit, sort, searchCriteria);

        if (Array.isArray(ProductsPag)) {
            ProductsPag = ProductsPag.map(p => new ProductsDTO(p));
        } else if (ProductsPag) {
            ProductsPag = new ProductsDTO(ProductsPag);
        }

        return ProductsPag;

    }

    async getProductBy(filter = {}) {

        console.log("... Product Service");
        //return await this.productsDAO.getProductBy(filter);

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

    /*
    async getProductByNombre(nombre) {
        let prods = await this.productsDAO.get()
        let prod = prods.find(p => p.code === nombre)
        return prod
    }

    async getProductByEmail(email) {
        let prods = await this.productsDAO.get()
        let prod = prods.find(p => p.email === email)
        return prod
    }
    */

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