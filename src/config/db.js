const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('error en mongodb');
  }

  
  await mongoose.connect(uri, {
    dbName: 'biocaqueta_db',
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`Conectado a MongoDB (base: ${mongoose.connection.name})`);
};

module.exports = connectDB;
