const Router = require('express-promise-router')
const products = require('../models/products')

const router = new Router();

module.exports = router;

router.get('/', async(req, res) => {
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

router.get('/:productId/styles', async (req, res) => {
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
router.get('/:productId/related', async (req, res) => {
  const productId = req.params.productId;
  const response = await products.getRelated(productId);
  if (response === null) {
    res.status(404);
    res.send('Product not found');
    return;
  }
  res.status(200);
  res.send(response);
})