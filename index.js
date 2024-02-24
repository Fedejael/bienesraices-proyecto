/* const express = require("express"); */ //Utiliza commontJS

import express from 'express' // Utiliza EM6
import usuarioRoutes from "./routes/usuarioRoutes.js"

// Crear la app
const app = express();

// Habilitar Pug
app.set("view engine", "pug")
app.set("views", "./views")

// Carpeta Publica
app.use(express.static("public"))

// Routing
app.use("/auth", usuarioRoutes)

// Definir un puerto y arrancar el proyecto
const port = 3000;
app.listen(port, () => {
    console.log("El Servidor esta funcionando en el puerto ${port}")
});