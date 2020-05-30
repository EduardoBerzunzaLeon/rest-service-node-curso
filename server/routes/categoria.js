const express = require('express');
const Categoria = require('../models/categoria');
const { verificaToken, verificaAdmin_role } = require('../../middlewares/autenticacion');
const app = express();

// =====================================================
// ========= Trae todas las categorias =================
// =====================================================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    conteo
                })
            })
        })
        // 

    // })
});

// =====================================================
// ========= Trae una categoria por id =================
// =====================================================

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, category) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!category) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            category
        })
    })
});

// =====================================================
// ========= Crea una categoria =================
// =====================================================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});

// =====================================================
// ========= Actualiza una categoria =================
// =====================================================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe la categoria'
                }
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});

// =====================================================
// ========= Elimina una categoria =================
// =====================================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_role], (req, res) => {

    let id = req.params.id;
    Categoria.findOneAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria no encontrada"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        })
    })

});

module.exports = app;