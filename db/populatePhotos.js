const mongoose = require('mongoose');
const {parse} = require ('csv-parse');
const fs = require('fs');
const Product = require('./Product.js');

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
  let currId = null;
  let photos = [];
  for await (const record of photoParser) {
    const id = Number(record.styleId);
    if(!currId) currId = id;
    if(currId !== id) {
      currId = id;
      const product = await Product.findOne({styles: {$elemMatch: {style_id: id}}})
      product.styles.forEach(style => {
        if(style.style_id === id) {
          style.photos = photos;
        }
      })
      const res = await Product.updateOne({id: product.id}, {styles: product.styles});
      console.count('Product style photos updated');
      photos = [];
    }
    photos.push({url: record.url, thumbnail_url: record.thumbnail_url})
  }
  console.log('Photo update complete');
}

