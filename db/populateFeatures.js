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

async function main() {
  console.log('Start importing features');
  const records = await processData(__dirname + '/../raw-data/features.csv');
  console.log(records.length);
  const features = {};
  for (let i = 0; i < records.length; i++) {
    let record = records[i];
    let key = Number(record[1])
    if( typeof features[key] === 'undefined') features[key] = [];
    features[key].push({
      feature: record[2],
      value: record[3],
    })
  }
  await mongoose.connect('mongodb://localhost:27017/products');
  let count = 0;
  for (let key in features) {
    let res = await Product.updateOne({id: key}, {features: features[key]})
    count++;
    if(count % 1000 === 0) console.count('updated');
  }
}