import web3 from './web3';
import NGOFactory from './build/NGOList.json';

const instance = new web3.eth.Contract(
  JSON.parse(NGOFactory.interface),
  '0xA69757bCc0D44dfEFB2E66D0534b0F7A0d5dB646'
);

export default instance;
