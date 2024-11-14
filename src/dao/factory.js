const { config } = require("../config/config.js");
const { ConnDBMongoDBSingleton: ConnectDB } = require("./Singleton/ConnDBMongoDBSingleton.js");

let DAO;

switch (config.PERSISTENCE) {
    case "MONGODB":
        ConnectDB.conectarDB(config.MONGO_URL, config.MONGO_DBNAME);
        
        const { UsersManagerMongoDB: UsersManager } = require("./db/UsersManagerMongoDB.js");
        DAO = UsersManager;
    break;

    case "FILESYSTEM":        
        const { ProductsManager } = require("./filesystem/ProductsManager.js");
        DAO = new ProductsManager();
        break;

    default:
        throw new Error("Error en la configuración de persistencia. Verificar variable.");
}

module.exports = { DAO };