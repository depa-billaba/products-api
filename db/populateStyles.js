const mongoose = require('mongoose');
const {parse} = require ('csv-parse');
const fs = require('fs');
const Product = require('./Product.js');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/products');

  const styleParser = fs
  .createReadStream(__dirname + '/../raw-data/styles.csv')
  .pipe(parse({
    skip_records_with_error: true,
    columns: true,
  }));


  let currId = null;
  let styles = [];
  for await (const record of styleParser) {
    const id = Number(record.productId);
    if(!currId) currId = id;
    if(currId !== id) {
      currId = id;
      await Product.updateOne({id}, {styles: styles})
      styles = [];
    }
    const style = {
      style_id: Number(record.id),
      name: record.name,
      original_price: record.original_price,
      sale_price: record.sale_price,
      'default?': record.default_style === 1,
      photos: [],
      skus: {},
    }
    styles.push(style);
  }
  console.log('Product styles updated');
}

