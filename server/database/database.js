const mongoose = require('mongoose');
const Product = require('./schemas/Product');
const database = mongoose.connect('mongodb://localhost:27017/products');

module.exports = database;