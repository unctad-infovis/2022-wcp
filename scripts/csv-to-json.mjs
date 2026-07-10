import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import csvToJson from '../src/jsx/helpers/CsvToJson.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.join(__dirname, '..', 'data', '2022-wcp - Data - Data.csv');
const outPath = path.join(__dirname, '..', 'public', 'assets', 'data', '2022-wcp_data.json');

const csv = fs.readFileSync(csvPath, 'utf8');
const rows = csvToJson(csv).map(row => {
  const parsed = {};
  for (const [key, value] of Object.entries(row)) {
    if (value === '') parsed[key] = null;
    else if (/^-?\d+$/.test(value)) parsed[key] = Number(value);
    else parsed[key] = value;
  }
  return parsed;
});

fs.writeFileSync(outPath, JSON.stringify(rows));
console.log(`Wrote ${rows.length} rows to ${path.relative(process.cwd(), outPath)}`);
