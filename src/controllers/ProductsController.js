const { isValidObjectId } = require("mongoose");
const { productsService } = require("../repository/Products.service");
const { processesErrors } = require("../utils/utils");


class ProductsController {

    static getProducts = async (req, res) => {

        let prodss;
        let dataObject = {};
        let cSort = {};

        let { page, limit, sort, query, type } = req.query;

        // Validacion de parametros
        if (type && !['category', 'price', 'title', 'status', 'stock'].includes(type)) {
            dataObject = {
                status: 'error',
                message: 'Tipo de búsqueda inválido.'
            };

            // Retornar error 400 (Bad Request) indicando que el tipo no es valido
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json(dataObject);
        }

        if (!page || isNaN(Number(page))) {
            page = 1;
        }

        if (!limit || isNaN(Number(limit))) {
            limit = 10;
        }

        if (!sort) {

        } else {
            let criteriosSep = sort.split(',');

            criteriosSep.forEach(element => {
                let [criterio, orden] = element.split(':');

                let valorOrden = (orden === 'asc') ? 1 : (orden === 'desc') ? -1 : null;

                if (valorOrden !== null) {
                    cSort[criterio] = valorOrden;
                }
            });
        }

        let searchCriteria = {};

        try {
            if (!query) {
                prodss = await productsService.getProductsPaginate(page, limit, cSort);
                                               
            } else {
                // Criterio de busqueda con base en el tipo de filtro
                if (type === 'category') {
                    searchCriteria = { category: new RegExp(query, 'i') };
                } else if (type === 'price') {
                    searchCriteria = { price: query };
                } else if (type === 'title') {
                    searchCriteria = { title: new RegExp(query, 'i') }; // Insensible a mayus/minus
                } else if (type === 'status') {
                    searchCriteria = { status: query.toLowerCase() === 'true' };
                } else if (type === 'stock') {
                    searchCriteria = { stock: query }; // Insensible a mayus/minus
                }

                prodss = await productsService.getProductsPaginate(page, limit, cSort, searchCriteria);
                console.log('Resultado de prods:', prodss);

                if (prodss.docs.length === 0) {
                    dataObject = {
                        status: 'Sin Resultados.',
                        message: 'No se encontraron productos que coincidan con la busqueda.'
                    };

                    res.setHeader('Content-type', 'application/json');
                    return res.status(404).json(dataObject);
                }
            }

            let prevLink;
            let nextLink;
            let pageLink;
            let lastLink;
            let showLastPage;

            const baseUrl = `/products?page=${prodss.page}&limit=${limit}`;
            const filters = `&sort=${sort || ''}&query=${query || ''}&type=${type || ''}`.trim();

            if (prodss.hasPrevPage) {
                prevLink = `${baseUrl.replace(`page=${prodss.page}`, `page=${prodss.prevPage}`)}${filters}`;
            } else {
                prevLink = null;
            }

            if (prodss.hasNextPage) {
                nextLink = `${baseUrl.replace(`page=${prodss.page}`, `page=${prodss.nextPage}`)}${filters}`;
            } else {
                nextLink = null;
            }

            pageLink = `${baseUrl}${filters}`;
            lastLink = `/products?page=${prodss.totalPages}&limit=${limit}${filters}`;

            if (prodss.nextPage == prodss.totalPages || !prodss.nextPage) {
                showLastPage = false;
            } else {
                showLastPage = true;
            }

            dataObject = {
                status: 'success',
                payload: prodss.docs,
                totalPages: prodss.totalPages,
                prevPage: prodss.prevPage,
                nextPage: prodss.nextPage,
                page: prodss.page,
                hasPrevPage: prodss.hasPrevPage,
                hasNextPage: prodss.hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink,
            };

        } catch (error) {

            dataObject = {
                status: 'error',
                message: 'Error inesperado en el servidor, vuelva a intentar mas tarde o contacte con el administrador.'
            };

            processesErrors(res, error);
        }
        res.setHeader('Content-type', 'application/json');
        return res.status(200).json({ dataObject })

    }

    static getProduct = async (req, res) => {

        let { id } = req.params;
        if (!isValidObjectId(id)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `id: ${id} no valido,` })
        }

        try {
            let product = await productsService.getProductBy({ _id: id });
            if (!product) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({ error: `No existen productos con el id: ${id}` });
            }

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({ product })
        } catch (error) {
            processesErrors(res, error);
        }

    }

    static createProduct = async (req, res) => {

        let { title, description, code, price, stock, category } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ status: "error", error: "Incomplete values." })
        }

        try {
            //console.log("code: ", code);
            let existe = await productsService.getProductBy({ code })
            if (existe) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({ error: `Producto ${code} existente en DB.` })
            }

            let prodNew = await productsService.addProduct({ title, description, code, price, stock, category })

            req.socket.emit("nuevoProducto", prodNew);
            console.log("Evento *nuevoProducto* emitido");

            res.setHeader('Content-type', 'application/json');
            return res.status(201).json({ prodNew })

        } catch (error) {
            processesErrors(res, error);
        }

    }

    static updateProduct = async (req, res) => {
        let { id } = req.params;

        if (!isValidObjectId(id)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `id: ${id} no valido,` })
        }

        let prodToModify = req.body;
        
        let existingProduct = await productsService.getProductBy({ _id: id });

        if (existingProduct && existingProduct._id.toString() !== id) {
            res.setHeader('Content-type', 'application/json');
            return res.send({ status: "error", error: "Duplicate ID found" });
        }

        // Comprobar si codigo existe en otro producto
        if (prodToModify.code) {
            let productWithSameCode = await productsService.getProductBy({ code: prodToModify.code, _id: { $ne: id } });

            if (productWithSameCode) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({ error: `El código ${prodToModify.code} ya está en uso por otro producto.` });
            }
        }

        try {
            let prodModified = await productsService.updateProduct(id, prodToModify)
            if (!prodModified) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({ error: `No se a podido actualizar el producto id: ${id}, ${prodModified}` })
            }

            req.socket.emit("ProductoActualizado", prodModified);
            console.log("Evento *ProductoActualizado* emitido");

            res.setHeader('Content-type', 'application/json');
            return res.status(200).json({ success: `producto actualizado id: ${id}` })

        } catch (error) {
            processesErrors(res, error);
        }
    }

    static deleteProduct = async (req, res) => {
        let { id } = req.params;
        if (!isValidObjectId(id)) {
            res.setHeader('Content-type', 'application/json');
            return res.status(400).json({ error: `id: ${id} no valido,` })
        }
    
        try {
            let prodDelete = await productsService.deleteProduct(id);
            if (!prodDelete) {
                res.setHeader('Content-type', 'application/json');
                return res.status(400).json({ error: `No se pudo eliminar el producto id: ${id}` })
            } else {
    
                req.socket.emit("ProductoBorrado", id);
                console.log("Evento *ProductoBorrado* emitido");
    
                res.setHeader('Content-type', 'application/json');
                return res.status(200).json({ prodDelete })
            }
        } catch (error) {
            processesErrors(res, error);
        }
    }

}

module.exports = { ProductsController };