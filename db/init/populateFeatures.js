const mongoose = require('mongoose');
const {parse} = require ('csv-parse');
const fs = require('fs');
const Product = require('../Product.js');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/products');

  const featureParser = fs
  .createReadStream(__dirname + '/../raw-data/features.csv')
  .pipe(parse({
    skip_records_with_error: true,
    columns: true,
  }));

  // const res = await Product.updateMany({}, {features: []});
  // console.log(res);
  console.log('Start adding features');

  for await (const record of featureParser) {
    const id = record.product_id;
    const feature = {feature: record.feature, value: record.value};
    await Product.updateOne({id: id}, {$push: {features: feature}})
  }
  console.log('Finish adding features');
}

