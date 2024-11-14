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

            console.log(`Se establecio conexion con la base de datos "${this.#conexion.db}" de manera exitosa.
                        
                        
***************************************************************************
Logs:

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