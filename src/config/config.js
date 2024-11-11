const dotenv = require("dotenv");
const { Command, Option } = require("commander");

let program = new Command();

program.addOption(new Option("-m, --mode <MODE>", "Modo de ejecución del script").choices(["dev", "prod"]).default("dev"));

program.parse();

const { mode } = program.opts()
//let mode = "dev" // dev para desarrollo prod produccion

dotenv.config({
    path: mode === "prod" ? "./src/.env.prod" : "./src/.env.dev",
    override: true
})

const config = {
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL,
    MONGO_URLwithDB: process.env.MONGO_URLwithDB,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASS: process.env.MONGO_PASS,
    MONGO_DBNAME: process.env.MONGO_DBNAME,
    MONGO_COLLPRODNAME: process.env.MONGO_COLLPRODNAME,
    MONGO_COLLCARTNAME: process.env.MONGO_COLLCARTNAME,
    MONGO_COLLMSGSNAME: process.env.MONGO_COLLMSGSNAME,
    MONGO_COLLUSERSNAME: process.env.MONGO_COLLUSERSNAME,
    MONGO_COLLTICKTNAME: process.env.MONGO_COLLTICKTNAME,
    CookieParser_SECRET: process.env.CookieParser_SECRET,
    ExpressSessions_SECRET: process.env.ExpressSessions_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    PATH_LOGFILE: process.env.PATH_LOGFILE,
    PATH_STOSESS: process.env.PATH_STOSESS,
    GITHUB_APPID: process.env.GITHUB_APPID,
    GITHUB_CLIENTID: process.env.GITHUB_CLIENTID,
    GITHUB_CLIENTSECRET: process.env.GITHUB_CLIENTSECRET,
    GITHUB_CALLBACKURL: process.env.GITHUB_CALLBACKURL,
    PERSISTENCE: process.env.PERSISTENCE,
    GMAIL_ACCOUNT: process.env.GMAIL_ACCOUNT,   
    GMAIL_CODE: process.env.GMAIL_CODE   
}

module.exports = { config };

/*
const config = {
    PORT: 8080,
    MONGO_URL: "mongodb+srv://tincho83:Codin33Codin33@cluster0.hhucv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    MONGO_URLwithDB: "mongodb+srv://tincho83:Codin33Codin33@cluster0.hhucv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=DB_eCommerce",
    MONGO_USER: "tincho83",
    MONGO_PASS: "Codin33Codin33",
    MONGO_DBNAME: "ecommerce",
    MONGO_COLLPRODNAME: "products",
    MONGO_COLLCARTNAME: "carts",
    MONGO_COLLMSGSNAME: "messages",
    MONGO_COLLUSERSNAME: "users",
    CookieParser_SECRET: "Tincho03$",
    ExpressSessions_SECRET: "Tincho07$",
    JWT_SECRET: "Tincho11$",
    PATH_LOGFILE: "./src/log.txt",
    PATH_STOSESS: "./src/sessions",
    GITHUB_APPID: "1021894",
    GITHUB_CLIENTID: "Iv23lio4Na64NA4Q6u86",
    GITHUB_CLIENTSECRET: "f7a7e78ba138695c859771052a19c3d1baf01a2f",
    GITHUB_CALLBACKURL: "http://localhost:8080/api/sessions/callbackGithub"
}

module.exports = { config };
*/