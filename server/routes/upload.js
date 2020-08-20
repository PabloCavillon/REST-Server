const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se seleccionó ningún archivo'
                }
            });
    }

    // Validar tipos
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', '),
                tipo
            }
        })
    }


    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extencion = nombreCortado[nombreCortado.length - 1]

    //Extenciones permitidas
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extencionesValidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extenciones permitidas son: ' + extencionesValidas.join(', '),
                ext: extencion
            }
        })
    }

    //cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extencion }`;


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        //Acá la imagen ya se cargo

        switch (tipo) {
            case 'productos':
                imagenProducto(id, res, nombreArchivo);
                break;
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
        }


    });
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            })
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })

    });

}

function imagenProducto(id, res, nombreArchivo) {

    Usuario.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        })

    });

}

function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;