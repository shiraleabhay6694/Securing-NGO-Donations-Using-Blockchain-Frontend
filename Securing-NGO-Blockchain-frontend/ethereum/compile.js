const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);


const contractPath = path.resolve(__dirname, 'contracts', 'NGO_contract.sol');
const source = fs.readFileSync(contractPath, 'utf8');
const output = solc.compile(source, 1).contracts;


fs.ensureDirSync(buildPath);

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}


// const solc = require('solc');
// const fs = require('fs');
// const path = require('path');

// const contractPath = path.resolve(__dirname,'NGO_contract.sol');
// const source = fs.readFileSync(contractPath, 'utf8');

// //console.log(solc.compile(source,1).contracts[':NGOList']);
// module.exports = solc.compile(source,1).contracts[':NGOList'];
