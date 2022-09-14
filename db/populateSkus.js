const mongoose = require('mongoose');
const {parse} = require ('csv-parse');
const fs = require('fs');
const Product = require('./Product.js');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/products');

  const skuParser = fs
  .createReadStream(__dirname + '/../raw-data/skus.csv')
  .pipe(parse({
    skip_records_with_error: true,
    columns: true,
  }));

  // const res = await Product.updateMany({}, {features: []});
  // console.log(res);
  let currId = null;
  let skus = {};
  for await (const record of skuParser) {
    const id = Number(record.styleId);
    if(!currId) currId = id;
    if(currId !== id) {
      currId = id;
      const product = await Product.findOne({styles: {$elemMatch: {style_id: id}}})
      product.styles.forEach(style => {
        if(style.style_id === id) {
          style.skus = skus;
        }
      })
      const res = await Product.updateOne({id: product.id}, {styles: product.styles});
      console.count('Product style skus updated');
      skus = {};
    }
    skus[record.id] = {size: record.size, quantity: record.quantity}
  }
  console.log('Sku update complete');
}

