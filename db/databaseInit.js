const mongoose = require('mongoose');
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');


const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    index: true,
  },
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: String,
  features: Array,
  styles: Array,
  related: Array,
});
const Product = mongoose.model('Product', productSchema);

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
    product.features = [];
    product.styles = [];
    product.related = [];
    const newProduct = new Product(product);
    await newProduct.save();
    console.count('Saved product');
  }
}