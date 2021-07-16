import web3 from './web3';
import NGO from './build/NGO.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(NGO.interface), address);
};
