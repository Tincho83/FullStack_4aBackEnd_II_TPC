![image](/src/public/img/demo.PNG)
# BackEnd II - Entrega TP Conclusivo 
## _Servidor con endpoints y servicios para gestionar los productos y carritos de compra de un e-commerce integrando vistas Handlebars, websocket y BD, entre otras tecnicas._  
  
### Vista previa / Preview
![image](/src/public/img/demo.gif)

### Depliegue / Deploy
[BackEnd II Entrega TP (Conclusivo)](https://ecommbackend1b.netlify.app/) (No disponible por el momento.)

### Descripcion / Description
Aplicativo Backend para e-commerce realizado en javascript, express, Handlebars, websocket y BD para el curso de Backend II Arquitectura en CoderHouse.  


### Construccion / Building
-  Javascript
-  node 19.9

# Install nodejs and verify version
   - Install node (recommended version LTS)
   - node --version
   - npm --version

### Dependecias / Dependencies
-  bcrypt
-  commander
-  connect-mongo
-  cookie-parser
-  cors
-  dotenv
-  express
-  express-handlebars
-  express-session
-  jsonwebtoken
-  moment
-  mongoose
-  mongoose-paginate-v2
-  multer
-  nodemailer
-  passport
-  passport-github2
-  passport-jwt
-  passport-local
-  session-file-store
-  socket.io

## Instalacion / Installation
### Pasos / Steps
- Abrir VS Code / Open Vs Code
- Clonar repositorio / Clone Repository
   -  **git clone https://github.com/Tincho83/FullStack_4aBackEnd_II_TPC.git**
   o  
   -  **git clone git@github.com:Tincho83/FullStack_4aBackEnd_II_TPC.git** 

- Acceder a la carpeta del proyecto / Access to project folder
   - **cd FullStack_4aBackEnd_II_TPC-main**

- Copiar archivos .env (Para Desarrollo o Produccion) dentro de la carpeta "src" (FullStack_4aBackEnd_II_TPC-main\src)

- Instalar todas las dependecias del proyecto/ Install dependencies
   - **npm install**
   o instalar dependencias individualmente
   - **npm install bcrypt**
   - **npm install commander**
   - **npm install connect-mongo**
   - **npm install cookie-parser**
   - **npm install cors**
   - **npm install dotenv**
   - **npm install express**
   - **npm install express-handlebars@7.1.3**
   - **npm install express-session**
   - **npm install jsonwebtoken**
   - **npm install moment**
   - **npm install mongoose**
   - **npm install mongoose-paginate-v2**
   - **npm install multer**
   - **npm install nodemailer**
   - **npm install passport**
   - **npm install passport-github2**
   - **npm install passport-jwt**
   - **npm install passport-local**
   - **npm install session-file-store**
   - **npm install socket.io**

   
- Instalar otras herramientas / Install others tools
   - **npm install -g nodemon** (instala nodemon de manera global. Esta herramienta reinicia el servidor cuando detecta cambios en el codigo.)
   
- Compilar / Compile
   - **npm run dev** (Para ejecutar en modo desarrollo)
   - **npm run start** (Para ejecutar en modo produccion)

### Estructura del proyecto / Project structure

#### Carpeta raiz del proyecto 
   -  **FrontEndCORS** Pagina Web basica para consumir recurso desde el backend y corroborrar el uso de CORS.
   -  **node_modules** (No disponible en el repositorio, aparecera cuando instalen las dependencias del   proyecto.)
   -  **src** (Carpeta que contiene los fuentes del proyecto)
   -  **.gitignore** (No disponible en el Repositorio. Solo para uso de git. Crear archivo .gitignore y agregar el texto (sin comillas): "node_modules" )
   -  **nodemon.json**  (Utilizado por nodemon. Contiene la exclusion del monitoreo a archivos ".json" para evitar reiniciar el servidor cuando detecta cambios en estas extensiones de archivo.)
   -  **package.json** (Informacion y configuracion del proyecto. Se genera cuando se ejecuta el comando "npm init -y")
   -  **Readme.md** (Este archivo)   
      

#### Carpeta "src" (En Proceso)
   - **config** contiene las rutas para los endpoints
         - **config.js** contiene en variables informacion a usar en la aplicacion.
   -  **dao** (Data Access Object, contiene los administradores para acceso a datos):
      -  **db** (Administradores para acceso a datos de BBDD):
            - **CartsManagerMongoDB.js** (Administrador de acceso a datos para ABM del carrito.)
            - **MessagesManagerMongoDB.js**  (Administrador de acceso a datos de mensajeria.)
            - **ProductsManagerMongoDB.js**  (Administrador de acceso a datos para ABM de los productos.)
      -  **filesystem** (Administradores para acceso a datos en archivos .json):
            - **CartsManager.js** (Administrador de acceso a datos para ABM del carrito.)            
            - **ProductsManager.js**  (Administrador de acceso a datos para ABM de los productos.)
      -  **models** (Esquema de modelo para acceso a datos en DDBB):
            - **CartsModel.js** (Esquema de modelo para los carritos en MongoDB.)
            - **MessagesModel.js** (Esquema de modelo para la mesajeria en MongoDB.)
            - **ProductsModel.js**  (Esquema de modelo para los productos en MongoDB.)
   -  **data** (Contiene la informacion en persistencia de archivos)
      -  **carrito.json** (datos de carritos y sus productos)
      -  **products.json** (datos de los productos)
   -  **middlewares** (Contiene los middleware de la aplicacion)
      -  **logMiddleware.js** (middleware para registrar acceso a metodos CRUD)
   - **public** contiene archivos de acceso publico
      - **css** hoja de estilos.
      - **img** imagenes.
      -  **js** logica de las paginas.
   - **routes** contiene las rutas para los endpoints
      - **carts.router.js** rutas para los endpoints del carrito.
      - **products.router.js** rutas para los endpoints de los productos.
      - **views.router.js** rutas para los endpoints de las vistas handlebars.
   - **views** contiene las vistas handlebars
   - **app.js** (aplicativo principal)
   - **connDB.js** (aplicativo para la conexion a BBDD)


### Contacto
[![N|Solid](/src/public/img/linkedin.png)](https://www.linkedin.com/in/martin-hernandez-9b7154215)
