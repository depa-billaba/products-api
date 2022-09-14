const Product = require('./database/schemas/Product');
const express = require('express');
const morgan = require('morgan');

main().catch(err => console.log(err));

async function main() {
  const db = await require('./database/database');
  console.log('Connected to database');

  const app = express();
  const PORT = process.env.PORT || 8080;

  app.use(morgan('dev'));

  app.get('/products', async(req, res) => {
    const page = Number(req.query.page) || 1;
    let count = Number(req.query.count) || 5;
    if(count > 20) count = 20;
    const index = (count * page) - count + 1;
    const products = await Product.find({id: {'$gte': index}}).limit(count);
    products.forEach(product => {
      product.styles = undefined;
      product.related = undefined;
      product.features = undefined;
    })
    res.status(200);
    res.send(products);
  })
  app.get('/products/:productId', async (req, res) => {
    const productId = req.params.productId;
    const product = await Product.findOne({id: productId});
    product.styles = undefined;
    product.related = undefined;
    res.status(200);
    res.send(product);
  })
  app.get('/products/:productId/styles', async (req, res) => {
    const productId = req.params.productId;
    const product = await Product.findOne({id: productId});
    const response = {
      product_id: productId,
      results: product.styles,
    }
    res.status(200);
    res.send(response);
  })
  app.get('/products/:productId/related', async (req, res) => {
    const productId = req.params.productId;
    const product = await Product.findOne({id: productId})
    const response = product.related;
    res.status(200);
    res.send(response);
  })

  app.listen(PORT, () => {
    console.log(`Products service listening on port ${PORT}`);
  })
}