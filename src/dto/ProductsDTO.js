class ProductsDTO {
    constructor(product) {
        console.log(">DTO Products:");
        this._id = product._id;
        this.title = product.title;
        this.description = product.description?product.description.toUpperCase():"";
        this.code = product.code;
        this.price = product.price;
        this.status=product.status;
        this.stock=product.stock;
        this.category=product.category;
        // Verificar si `product.thumbnails` tiene al menos una URL; si no, asignar las URLs predeterminadas
        this.thumbnails = (product.thumbnails && product.thumbnails.length > 0) 
            ? product.thumbnails.map(thumbnail => ({
                urlmain: thumbnail.urlmain || thumbnail,
                urlsec: thumbnail.urlsec || thumbnail
            }))
            : [{
                urlmain: "https://media.istockphoto.com/id/1216251206/vector/no-image-available-icon.jpg?s=612x612&w=0&k=20&c=6C0wzKp_NZgexxoECc8HD4jRpXATfcu__peSYecAwt0=",
                urlsec: "https://media.istockphoto.com/id/1216251206/vector/no-image-available-icon.jpg?s=612x612&w=0&k=20&c=6C0wzKp_NZgexxoECc8HD4jRpXATfcu__peSYecAwt0="
            }];
    
    }
}

module.exports = { ProductsDTO };