require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Cargar las rutas del usuario
app.use(require('./routes/usuario'));


mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).catch(error => handleError(error));


app.listen(process.env.PORT, () =>{
	console.log('Escuchando en puerto', process.env.PORT);
});

