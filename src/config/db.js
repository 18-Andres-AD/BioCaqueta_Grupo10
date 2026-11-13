const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Falta la variable MONGODB_URI en el archivo .env');
  }

  // dbName fuerza el uso de la base biocaqueta_db aunque la URI no la incluya
  await mongoose.connect(uri, {
    dbName: 'biocaqueta_db',
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`✔ Conectado a MongoDB Atlas (base: ${mongoose.connection.name})`);
};

module.exports = connectDB;
