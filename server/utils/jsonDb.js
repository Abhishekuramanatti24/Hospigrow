// utils/jsonDb.js
// Minimal helper for reading (and, where needed, writing) the JSON files that act
// as our "database" for this project. Centralizing this means every module reads
// files the same way and we only have one place to change if storage evolves later.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const readJson = (fileName) => {
  const filePath = path.join(DATA_DIR, fileName);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
};

const writeJson = (fileName, data) => {
  const filePath = path.join(DATA_DIR, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

module.exports = { readJson, writeJson };
