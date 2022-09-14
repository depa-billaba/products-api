const mongoose = require('mongoose');
const {parse} = require ('csv-parse');
const fs = require('fs');
const Product = require('./Product.js');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/products');

  const relatedParser = fs
  .createReadStream(__dirname + '/../raw-data/related.csv')
  .pipe(parse({
    skip_records_with_error: true,
    columns: true,
  }));

  console.log('Start updating related');

  for await (const record of relatedParser) {
    const id = record.current_product_id;
    const item = Number(record.related_product_id);
    const res = await Product.updateOne(
      {id},
      {$push: {related: item}})
  }
  console.log('Finish updating related');
}

