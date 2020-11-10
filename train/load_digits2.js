const rimraf = require("rimraf");
const mv = require('mv');


// Remove mnist package default digits files (which contains only 10000 digits)
// fs.rmSync('./node_modules/mnist/src/digits', { recursive: true, force: true });
rimraf.sync('./node_modules/mnist/src/digits');
console.log('Removed ./node_modules/mnist/src/digits');


// Move generated digit files from ./digits folder to mnist package src folder
mv('./digits', './node_modules/mnist/src/digits', (err) => {
    if (err) throw err;
    else console.log('MNIST digits loaded at ./node_modules/mnist/src/digits');
});
