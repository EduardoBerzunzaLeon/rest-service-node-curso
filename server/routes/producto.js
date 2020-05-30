const express = require('express');
const Producto = require('../models/producto');
const { verificaToken } = require('../../middlewares/autenticacion');
const app = express();

// =====================================================
// ========= Mostrar todos los productos paginados =====
// =====================================================
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 0;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // if (!productos) {
            //     return res.status(400).json({
            //         ok: false,
            //         err: {
            //             message: 'Productos no encontrados'
            //         }
            //     })
            // }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    conteo
                });
            });

        });
});

// =====================================================
// ========= Buscar productos  =========================
// =====================================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: products
            })
        })

});


app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, product) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!product) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            product
        })
    })
});

app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, product) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!product) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: product
        })
    })

});

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Producto.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, (err, product) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!product) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe la categoria'
                }
            });
        }


        res.json({
            ok: true,
            producto: product
        })
    })

})

app.delete('/producto/:id', (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: true }, { new: true }, (err, product) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!product) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            });
        }

        res.json({
            ok: true,
            producto: product
        });
    })
})

module.exports = app;