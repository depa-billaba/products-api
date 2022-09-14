const mongoose = require('mongoose');
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const Product = require('./Product.js');

main().catch(err => console.log(err));

async function main () {
  await mongoose.connect('mongodb://localhost:27017/products');

  const res = await Product.deleteMany({}); //Clear database
  console.log(res);

  const productParser = fs
    .createReadStream(__dirname + '/../raw-data/product.csv')
    .pipe(parse({
      skip_records_with_error: true,
      columns: true,
    }));

  for await (const record of productParser) {
    const product = record;
    product.id = Number(product.id);
    const newProduct = new Product(product);
    await newProduct.save();
  }
  console.log('Updated products');
}