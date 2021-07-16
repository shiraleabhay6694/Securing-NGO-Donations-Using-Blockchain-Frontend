const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const NGOFactory = require('./build/NGOList.json');

const provider = new HDWalletProvider(
  'art coyote emotion brother stereo jar guard crane uncle hour volcano hat',
  'https://ropsten.infura.io/v3/123adb3c6b4343999392d8fd1aec97a6'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(NGOFactory.interface)
  ).deploy({ data: NGOFactory.bytecode }).send({ gas: '2000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();



// const HDWalletProvider = require('truffle-hdwallet-provider');
// const Web3 = require('web3');
// const { interface, bytecode } = require('./compile');

// const provider = new HDWalletProvider(
//   'art coyote emotion brother stereo jar guard crane uncle hour volcano hat',
//     'https://ropsten.infura.io/v3/123adb3c6b4343999392d8fd1aec97a6'
//   );
// const web3 = new Web3(provider);

// const deploy = async () => {
//   try{
//     const accounts = await web3.eth.getAccounts();

//   console.log('Attempting to deploy from account', accounts[0]);

//   const result = await new web3.eth.Contract(JSON.parse(interface))
//     .deploy({ data: bytecode })
//     .send({ gas: '1000000', from: accounts[0] });

//   console.log('Contract deployed to', result.options.address);
//   }catch(e){
//     console.log(e);
//   }
// };
// deploy();
