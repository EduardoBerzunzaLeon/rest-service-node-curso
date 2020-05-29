// ====================
// Puerto 
// ====================

process.env.PORT = process.env.PORT || 3000;

// ====================
// Entorno 
// ====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ====================
// Vencimiento del TOKEN
// ====================
// 60 Segundos
// 60 Minutos
// 24 horas
// 30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// ====================
// SEED de autenticación
// ====================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

// ====================
// Base de datos 
// ====================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ====================
// Google Client ID 
// ====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '452046646505-br8klpdko7578gmhlln3uapq7ulb6qrp.apps.googleusercontent.com';