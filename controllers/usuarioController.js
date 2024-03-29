import { check, validationResult } from "express-validator"
import Usuario from "../models/Usuario.js"
import { generarId } from "../helpers/tokens.js"
import { emailRegistro } from "../helpers/emails.js"

const formularioLogin = (req, res) => {
    res.render("auth/login", {
        pagina: "Iniciar Sesión"
    })
}

const formularioRegistro = (req, res) => {
    res.render("auth/registro", {
        pagina: "Crear Cuenta"
    })
}

const registrar = async (req, res) => {
    // Validación
    await check("nombre").notEmpty().withMessage("El nombre no puede ir vacio").run(req)
    await check("email").isEmail().withMessage("Eso no parece un email").run(req)
    await check("password").isLength({min: 6}).withMessage("El Password debe ser de al menos 6 caracteres").run(req)
    await check("repetir_password").equals("password").withMessage("Los Passwords no son iguales").run(req)

    let resultado = validationResult(req)

    // Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        // Errores
        return res.render("auth/registro", {
            pagina: "Crear Cuenta",
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // Extraer los datos
    const { nombre, email, password } = req.body

    // Verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne({ where : { email }})
    if(existeUsuario){
        return res.render("auth/registro", {
            pagina: "Crear Cuenta",
            errores: [{msg: "El usuario ya esta registrado"}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // Almacenar un usuario 
    const usuario =  await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    // Envia email de confirmacion
    emailRegistro({
        nombre: usuario.nombre, 
        email: usuario.email,
        token: usuario.token
    })


    // Mostar mensaje de confirmacion
    
    
    res.render("templates/mensaje", {
        pagina: "Cuenta creada correctamente",
        mensaje: "Hemos enviado un email de confirmaciónm presiona en el enlace"
    })
}

const formularioOlvidePassword = (req, res) => {
    res.render("auth/olvide-password", {
        pagina: "Repura tu acceso a Bienes Raices"
    })
}

export{
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
}