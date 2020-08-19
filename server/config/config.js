//********************************
//Puerto
//********************************

process.env.PORT = process.env.PORT || 3000;


//********************************
//Entorno
//********************************

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//********************************
//Vencimiento Token
//********************************

process.env.CADUCIDAD_TOKEN = '48h';


//********************************
//SEED de autenticacion
//********************************

process.env.SEED = process.env.SEED || 'Este-es-el-seed-de-desarrollo';

//********************************
//Base de Datos
//********************************

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//********************************
//Google Client ID
//********************************

process.env.CLIENT_ID_GOOGLE = process.env.CLIENT_ID_GOOGLE || '186968622872-paqba0agtifs2aob92u585dqpp828hv1.apps.googleusercontent.com';