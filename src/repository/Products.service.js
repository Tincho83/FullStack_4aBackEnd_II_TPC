const ProductsDAO = require("../dao/db/ProductsManagerMongoDB");
const { ProductsDTO } = require("../dto/ProductsDTO");


class ProductsService {

    constructor(DAO) {
        this.productsDAO = DAO;
    }

    async getProducts() {
        console.log(">Service Get Products:");
        let Products = await this.productsDAO.getProducts();

        if (Array.isArray(Products)) {
            Products = Products.map(p => new ProductsDTO(p));
        } else if (Products) {
            Products = new ProductsDTO(Products);
        }

        return Products;



    }

    async getProductsPaginate(page, limit, sort, searchCriteria) {
        console.log(">Service Get Products (Paginate):");
        let ProductsPag = await this.productsDAO.getProductsPaginate(page, limit, sort, searchCriteria);

        // Comprobar de que docs este antes de aplicarle ProductsDTO
        if (ProductsPag && Array.isArray(ProductsPag.docs)) {
            ProductsPag.docs = ProductsPag.docs.map(p => new ProductsDTO(p));
        }

        return ProductsPag;

    }

    async getProductBy(filter = {}) {
        console.log(">Service GetBy Product:");
        let product = await this.productsDAO.getProductBy(filter);

        if (Array.isArray(product)) {
            product = product.map(p => new ProductsDTO(p));
        } else if (product) {
            product = new ProductsDTO(product);
        }

        return product;


    }

    async getProductById(product) {
        console.log(">Service GetBy Id Product:");
        return await this.productsDAO.getProductById(product);
    }

    async addProduct(product) {
        console.log(">Service Create Product:");
        return await this.productsDAO.addProduct(product);
    }

    async updateProduct(id, product) {
        console.log(">Service Update Product:");
        return await this.productsDAO.updateProduct(id, product);
    }

    async deleteProduct(id) {
        console.log(">Service Delete Product:");
        return await this.productsDAO.deleteProduct(id);
    }

}

const productsService = new ProductsService(ProductsDAO);

module.exports = { productsService };