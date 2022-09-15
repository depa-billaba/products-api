const express = require('express');
const morgan = require('morgan');
const products = require('./models/products');
require('dotenv').config()

main().catch(err => console.log(err));

async function main() {

  const app = express();
  const PORT = process.env.PORT || 8080;
  console.log(process.env.PORT)

  // app.use(morgan('dev'));
  app.use(express.static(__dirname + '/public'));

  app.get('/products', async(req, res) => {
    const page = Number(req.query.page) || 1;
    let count = Number(req.query.count) || 5;
    if(count > 20) count = 20;

    const response = await products.getPage(page, count);
    if (response === null) {
      res.status(404);
      res.send('Product not found');
      return;
    }
    res.status(200);
    res.send(response);
  })
  app.get('/products/:productId', async (req, res) => {
    const productId = req.params.productId;
    const product = await products.getOne(productId);
    if(product === null) {
      res.status(404);
      res.send('Product not found')
      return;
    }
    res.status(200);
    res.send(product);
  })
  app.get('/products/:productId/styles', async (req, res) => {
    const productId = req.params.productId;
    const response = await products.getStyles(productId);
    if (response === null) {
      res.status(404);
      res.send('Product not found');
      return;
    }
    res.status(200);
    res.send(response);
  })
  app.get('/products/:productId/related', async (req, res) => {
    const productId = req.params.productId;
    const response = await products.getRelated(productId);
    if (response === null) {
      res.status(404);
      res.send('Product not found');
    }
    res.status(200);
    res.send(response);
  })

  app.listen(PORT, () => {
    console.log(`Products service listening on port ${PORT}`);
  })
}