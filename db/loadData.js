const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const processFile = async (filePath) => {
  const records = [];
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({
      skip_records_with_error: true,
      columns: true,
    }));
  for await (const record of parser) {
    records.push(record);
  }
  return records;
};

const process = async (filePath) => {
  const records = await processFile(filePath);
  return records;
};

exports.processData = process;