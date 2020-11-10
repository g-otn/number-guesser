const fs = require('fs');
const rimraf = require("rimraf");


// Delete ./digits folder if present
// fs.rmSync('./digits', { recursive: true, force: true });
rimraf.sync('./digits');
console.log('Removed ./digits')


// Create empty ./digits folder
fs.mkdirSync('./digits', { recursive: true });
console.log('Created ./digits');


// Generate files in ./digits folder from MNIST files located in data folder
// require('./node_modules/mnist_dl/mnist_dl.js'); // async, no promise to await returned