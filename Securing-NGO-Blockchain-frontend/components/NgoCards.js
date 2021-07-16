import Recat , {Component} from 'react';
import axios from 'axios';
import web3 from '../ethereum/web3';
import instance from '../ethereum/factory';
import NGOHelper from '../ethereum/NGO';
import {Card,Row,Col} from 'react-bootstrap';
import { Button } from '@material-ui/core';
import Router from 'next/router';

class NgoCards extends Component{
    constructor(props){
        super(props);

        this.state={
            list:[],
            accounts:'',
            extraDetails:[]
        }
    
        this.getAdminView = this.getAdminView.bind(this);
        this.getDetails = this.getDetails.bind(this);
    }
    


    async componentWillMount(){
        if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
            await window.ethereum.enable();
          }
        const tmpAccounts= await web3.eth.getAccounts();
        this.setState({accounts:tmpAccounts});
        await axios.get('http://localhost:8088/ngo')
                .then((res)=>{
                    console.log(res);
                    this.setState({list:res.data});
                }).catch((err)=>{
                    console.log(err);
                    alert("Incorrect Credentials");
                });
        
        console.log(this.state.list);

        let temp = []
        for(var i=0;i<this.state.list.length;i++){
            const NGOAddress = await instance.methods.getNGOByAddress(this.state.list[i].address).call({from:this.state.accounts[0]});
            const NGOInstance = NGOHelper(NGOAddress);
            //await NGOInstance.methods.contribute().send({from:accounts[0]});
            let    Transacdetails = await NGOInstance.methods.getDetails().call({from:this.state.accounts[0]});
            console.log(Transacdetails);
            temp.push(this.state.list[i]);
            temp[i].donorsCount = Transacdetails[0];
            temp[i].helpCount = Transacdetails[1];
            temp[i].balance = await web3.utils.fromWei(Transacdetails[2].toString(), 'ether');  
        }
        this.setState({list:temp});
        console.log(this.state.list)
    }

    async  getAdminView(event,e){
        const accounts =await web3.eth.getAccounts();
        if(e.address == accounts){
            const url='/ngo/'+e.address;
            Router.push(url);
        } else{
            alert("MetaMask address doesn't match Admin address");
        } 
        
    }

    async  getDetails(event,e){
        const url='/ngodetails/'+e.address;
        Router.push(url);
    }

    render(){
        return(
            <div style={{border:'5px solid white',margin:'50px'}}>
                <div style={{justifyContent:'center',textAlign:'center',height:'100px',backgroundColor:'rgb(37, 56, 84)'}}>
                    <h1 style={{color:'white', paddingTop:'30px',fontSize:'40px'}}>LIST OF NGO'S SERVING FOR BETTERMENT OF SOCIETY</h1>
                </div>
                <div class="row" style={{paddingTop:'30px'}}>
                    {this.state.list.map(e=>{
                        return  (
                            <div class="col-md-4"  style={{paddingRight:'100px',paddingLeft:'100px'}}>
                                <div class="card mb-4  " style={{backgroundColor:'lightblue'}}>
                                    <img class="card-img-top" src="https://d1ns4ht6ytuzzo.cloudfront.net/oxfamdata/oxfamdatapublic/styles/news_detail_748x373/public/2019-08/donation.jpg?itok=7o5EyVLj" alt="Card image cap"/>
                                    <div class="card-body">
                                        <h5 class="card-title"></h5>
                                        <p>Founder : <b>{e.founder}</b></p>
                                        <p>Our Vision : <b>{e.vision}</b></p>
                                        <p>About us :<b>{e.about}</b></p>
                                        <p>Number of donors <b>{e.donorsCount}</b></p>
                                        <p>Provided help to <b>{e.helpCount}</b> needy people</p>
                                        <p>Balance : {e.balance}</p>
                                        <div style={{alignItems:'center'}}>
                                        <Button style={{backgroundColor:'rgb(73, 97, 133)'}} onClick={event => this.getDetails(event, e)}>Contribute</Button>
                                        <Button style={{marginLeft:'50px', backgroundColor:'rgb(73, 97, 133)'}} onClick={event => this.getAdminView(event, e)}>Organisation Admin</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );

                    })}
                    
                </div>
                
                
            </div>
        );
    }
}

export default NgoCards;