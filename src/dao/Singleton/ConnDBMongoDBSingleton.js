const { mongoose } = require("mongoose");

class ConnDBMongoDBSingleton {
  
    static #conexion = null;
   
    constructor(url, db){

        this.url = url;
        this.db = db;
      
    }

    static async conectarDB(url, db){
        try {
            // Si ya existe una conexión, la retornamos
            if (this.#conexion) {
                console.log(`Conexión con la base de datos "${this.#conexion.db}" establecida previamente...`);
                return this.#conexion;
            }

            // Crear nueva instancia
            this.#conexion = new ConnDBMongoDBSingleton(url, db);        
            
            // Intentar conectar a MongoDB
            await mongoose.connect(this.#conexion.url, {
                dbName: this.#conexion.db
            });

            //console.log(`Conexión establecida exitosamente a la base de datos: ${this.#conexion.db}`);
            console.log(`Se establecio conexion con la base de datos "${this.#conexion.db}" de manera exitosa.
                        
                        
                        `);

            return this.#conexion;

        } catch (error) {
            console.error(`Error al conectar a MongoDB: ${error.message}`);
            // Reseteamos la conexión en caso de error
            this.#conexion = null;
            throw error; // Relanzamos el error para manejarlo en la app principal
        }

    }

}

module.exports = { ConnDBMongoDBSingleton };

/*
const { mongoose } = require("mongoose");
const { config } = require("../../config/config");


class SingletonMongoDB {
    static conexion = null;

    constructor() {
        if (SingletonMongoDB.conexion) {
            return SingletonMongoDB.conexion;
        }
        throw new Error("Usa SingletonMongoDB.conectarDB para obtener la instancia.");
    }

    static async conectarDB() {
        if (this.conexion) {
            console.log("Conexión establecida previamente...");
            return this.conexion;
        }

        try {
            this.conexion = await mongoose.connect(config.MONGO_URL, {
                dbName: config.MONGO_DBNAME,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log(`Se establecio conexion con la base de datos "${config.MONGO_DBNAME}" de manera exitosa.`);
            return this.conexion;
        } catch (error) {
            console.error(`Error al conectar con la DB: ${error.message}`);
            throw error;
        }
    }

}
*/

/*

//1.Importar modulo MongoDB: importar modulo mongoose que permite la conexion a MongoDB.
const { mongoose } = require("mongoose");
const { config } = require("../../config/config");


//2.Definicion de la clase "SingletonMongoDB"que sera nuestro patron de diseño Singleton.
class SingletonMongoDB {

    //SingletonMongoDB tiene dos propiedades static, url y db.

    //4.static conexion en null, almacenara la única instancia de la clase (de manera global Clase 10 01:30min aprox ).    
    static conexion = null;

    //5.Constructor de la clase "SingletonMongoDB". Recibe los parametros url y db, los asigna a las propiedades correspondientes y luego llama al metodo connect().
    constructor(url, db) {

        //6.url, db, almacenaran la URL de conexion a MongoDB y el nombre de la base de datos.
        this.url = url;
        this.db = db;

        //7.El metodo connect() se encarga de establecer la conexión a MongoDB usando los valores de url y db.
        this.connect();
    }

    //3.Metodo estatico conectarDB(): punto de entrada principal para utilizar el patron Singleton.
    static conectarDB(url = null, db = null) {
        // Si no se proporcionan argumentos, usar valores por defecto
        url = url || process.env.MONGO_URL;
        db = db || process.env.MONGO_DBNAME;

        //3a. verifica si ya existe una instancia de SingletonMongoDB (es decir, si SingletonMongoDB.instance es null).
        if (!SingletonMongoDB.conexion) {
            //3b. Si no existe una instancia, crea una nueva de SingletonMongoDB usando los valores de url y db proporcionados como argumentos (o los valores por defecto de las variables de entorno MONGO_URL y MONGO_DBNAME).
            console.log(`Conectando...`)
            SingletonMongoDB.conexion = new SingletonMongoDB(url, db);
        }
        //3c.Finalmente, retorna la instancia de SingletonMongoDB.
        console.log(`Conexión establecida previamente...`)
        return SingletonMongoDB.conexion;
    }

    //8.
    async connect() {
        try {
            await mongoose.connect(this.url, { dbName: this.db });
            console.log(`Se estableció conexión con la base de datos "${this.db}" de manera exitosa.`);
        } catch (error) {
            console.log(`Error: No se pudo establecer conexión con la base de datos "${this.db}". Motivo: ${error.message}`);
        }
    }

}

module.exports = { SingletonMongoDB };
*/


/*Ultimo andando...

const { mongoose } = require("mongoose");

class SingletonMongoDB {
  
    static #conexion = null;
   
    constructor(url, db){

        this.url = url;
        this.db = db;
      
    }

    static async conectarDB(url, db){
        try {
            // Si ya existe una conexión, la retornamos
            if (this.#conexion) {
                console.log(`Conexión establecida previamente...`);
                return this.#conexion;
            }

            // Crear nueva instancia
            this.#conexion = new SingletonMongoDB(url, db);
            
            console.log(`Conectando a la base de datos: ${this.#conexion.db} ...`);

            // Intentar conectar a MongoDB
            await mongoose.connect(this.#conexion.url, {
                dbName: this.#conexion.db
            });

            console.log(`Conexión establecida exitosamente a la base de datos: ${this.#conexion.db}`);
            return this.#conexion;

        } catch (error) {
            console.error(`Error al conectar a MongoDB: ${error.message}`);
            // Reseteamos la conexión en caso de error
            this.#conexion = null;
            throw error; // Relanzamos el error para manejarlo en la app principal
        }

    }

}

module.exports = { SingletonMongoDB };

*/