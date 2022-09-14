const {parse} = require('csv-parse');
const fs = require('fs');
const {Pool, Client} = require('pg');
require('dotenv').config();

main().catch(err => console.log(err))

async function main() {
  const client = new Client();
  await client.connect();
  console.log('Connected');
}