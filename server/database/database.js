const mongoose = require('mongoose');

const database = mongoose.connect('mongodb://localhost:27017/products');

module.exports = database;