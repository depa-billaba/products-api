const mongoose = require('mongoose');
const {parse} = require ('csv-parse');
const fs = require('fs');
const {Style} = require('../Style.js');


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
    if (!currId) currId = record.styleId;
    if (currId !== record.styleId) {
      const res = await Style.updateOne({style_id: currId}, {"$set": {skus: skus}});
      skus = {};
      currId = record.styleId;
    }
    skus[record.id] = {
      size: record.size,
      quantity: record.quantity,
    }
  }
  console.log('Sku update complete');
}

