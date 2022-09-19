const express = require('express');
const morgan = require('morgan');
const mountRoutes = require('./routes/index.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

mountRoutes(app);
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => {
  console.log(`Products service listening on port ${PORT}`);
});
