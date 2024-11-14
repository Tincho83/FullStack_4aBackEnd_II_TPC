const express = require("express");
const fs = require("fs");
const moment = require("moment");
const { join, path } = require("path");
const { engine } = require("express-handlebars");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const FileStore = require("session-file-store");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const { router: productsRouter } = require("../src/routes/products.router.js");
const { router: cartsRouter } = require("../src/routes/carts.router.js");
const { router: viewsRouter } = require("../src/routes/views.router.js");
const { router: usersRouter } = require("../src/routes/users.router.js");
const { router: sessionsRouter } = require("../src/routes/sessions.router.js");
const { router: cookiesRouter } = require("../src/routes/cookies.router.js");

const logMiddleware = require('./middlewares/logMiddleware.js');
const auth = require("./middlewares/authMiddleware.js");

const { connDB } = require("./dao/connDB.js");
const { config } = require("./config/config.js");
const { initPassport } = require("./config/passport.config.js");
const { passportCall } = require("./utils/utils.js");
const { ConnDBMongoDBSingleton: ConnectDB } = require("./dao/Singleton/ConnDBMongoDBSingleton.js");


const PORT = config.PORT;
let serverSocket;

const fileStore = FileStore(sessions);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(cookieParser(config.CookieParser_SECRET));

app.use(logMiddleware);

let ruta = join(__dirname, "public");
app.use(express.static(ruta));

//Paso 2:
initPassport();
app.use(passport.initialize());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
let rutaviews = join(__dirname, '/views');
app.set('views', rutaviews);

app.use("/api/products",
    (req, res, next) => {
        req.socket = serverSocket;       
        next();
    }, passportCall("current"), auth(['global', 'external']), productsRouter);

app.use("/api/carts/", cartsRouter);

app.use('/api/users', usersRouter);

app.use('/api/cookies', cookiesRouter);

app.use('/api/sessions', sessionsRouter);

app.use("/", (req, res, next) => {
    req.socket = serverSocket;
    next();
}, viewsRouter);

let servername = process.env.COMPUTERNAME;
let nodeversion = process.version;
let modversion = process.versions;
let pid = process.pid;
let apppath = process.cwd();
let memusage = process.memoryUsage();
let memttl = memusage.heapTotal / 1024 / 1024;
let memused = memusage.heapUsed / 1024 / 1024;
let procarg = `${process.argv.slice(1)} ${process.argv.slice(4)}`;
let platform = process.platform;
let envvariab = process.env;

const serverHTTP = app.listen(PORT, () => console.log(`

***************************************                                    
* Servidor en linea sobre puerto ${PORT} *
***************************************                                    

# Url:
    http://localhost:${PORT}


# Aplicacion iniciada en el servidor: ${servername}
# Aplicacion iniciada con el usuario: ${JSON.stringify(envvariab.username, null, 5)} en Dominio: ${JSON.stringify(envvariab.LOGONSERVER, null, 5)} 
# Aplicacion iniciada desde la ruta: ${apppath}
# Aplicacion iniciada con argumentos: ${procarg}
# con proceso Id principal: ${pid}
# en plataforma: ${platform}
# con uso de memoria: ${memused.toFixed(2)} MB de ${memttl.toFixed(2)} MB
# usando version de:
    NodeJS: ${nodeversion}
    OpenSSL: ${JSON.stringify(modversion.openssl, null, 5)}

`));

serverSocket = new Server(serverHTTP);

// Emision de Fecha y Hora
setInterval(() => {
    let horahhmmss = moment().format('DD/MM/yyyy hh:mm:ss A');
    serverSocket.emit("HoraServidor", horahhmmss);
}, 500);

// Funcion para cada cliente que se conecta
serverSocket.on('connection', (socket) => {

    let dato;
    let sessionTime = moment().format('DD/MM/yyyy hh:mm:ss');

    console.log(`Nuevo cliente conectado: ${socket.id} a las ${sessionTime}`);

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});