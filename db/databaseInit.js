const {processData} = require('./loadData');
const mongoose = require('mongoose');

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
  console.log('Start importing');
  const records = await processData(__dirname + '/../raw-data/product.csv');
  const products = records.map((record) => {
    return {
      id: Number(record[0]),
      name: record[1],
      slogan: record[2],
      description: record[3],
      category: record[4],
      default_price: record[5],
    }
  })
  console.log('End importing');
  await mongoose.connect('mongodb://localhost:27017/products');
  await Product.deleteMany({});
  const heapSize = 10000;
  for(let i = 0; i < records.length; i += heapSize) {
    let res = await Product.create(products.slice(i, i + heapSize))
    console.log('Saving documents');
    console.log(res);
  }
  console.log('Documents created');
}