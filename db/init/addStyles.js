const mongoose = require('mongoose');
const Product = require('../Product.js');
const {Style} = require('../Style.js');

main().catch(err => console.log(err))

async function main() {
  await mongoose.connect('mongodb://localhost:27017/products')
  console.log('Connected');
  for await (const style of Style.find({}).cursor()) {
    console.log(style);
    const productId = style.productId;
    const res = await Product.updateOne({id: productId}, {$push: {styles: style}})
  }
  console.log('Complete associating styles');
}