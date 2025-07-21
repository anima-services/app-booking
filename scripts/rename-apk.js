const fs = require('fs');
const path = require('path');

const version = require('../package.json').version;
const now = new Date();
const pad = n => n.toString().padStart(2, '0');
const time = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.apk'));
if (files.length === 0) {
  console.error('No APK file found!');
  process.exit(1);
}
const apk = files.sort((a, b) => fs.statSync(b).mtime - fs.statSync(a).mtime)[0];
const newName = `app-booking-v${version}-${time}.apk`;

fs.renameSync(apk, newName);
console.log(`Renamed ${apk} to ${newName}`); 