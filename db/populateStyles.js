const mongoose = require('mongoose');
const {parse} = require ('csv-parse');
const fs = require('fs');
const {Style} = require('./Style.js');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/products');

  const styleParser = fs
  .createReadStream(__dirname + '/../raw-data/styles.csv')
  .pipe(parse({
    skip_records_with_error: true,
    columns: true,
  }));

  const res = await Style.deleteMany({}); //Clear database
  console.log(res);

  for await (const record of styleParser) {
    const style = {
      style_id: record.id,
      productId: record.productId,
      name: record.name,
      original_price: record.original_price,
      sale_price: record.sale_price,
      'default?': record.default_style === '1',
      photos: [],
      skus: {}
    }
    const res = await new Style(style).save()
  }
  console.log('Product styles updated');
}

