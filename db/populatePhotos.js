const mongoose = require('mongoose');
const {parse} = require ('csv-parse');
const fs = require('fs');
const {Style} = require('./Style.js');


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/products');

  const photoParser = fs
  .createReadStream(__dirname + '/../raw-data/photos.csv')
  .pipe(parse({
    skip_records_with_error: true,
    columns: true,
  }));

  // const res = await Product.updateMany({}, {features: []});
  // console.log(res);
  for await (const record of photoParser) {
    const photo = {
      url: record.url,
      thumbnail_url: record.thumbnail_url,
    }
    await Style.updateOne({style_id: record.styleId}, {$push: {photos: photo}})
  }
  console.log('Photo update complete');
}

