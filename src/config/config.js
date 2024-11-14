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