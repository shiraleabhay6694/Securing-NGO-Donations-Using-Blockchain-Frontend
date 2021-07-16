// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { useEffect, useState } from "react";
import axios from 'axios';
import web3 from '../../ethereum/web3';
import instance from '../../ethereum/factory';
import Header from '../../components/Header';
import NGOHelper from '../../ethereum/NGO';
import {Button, Form, Table} from 'react-bootstrap';
import Head from 'next/head';
import CircularProgress from '@material-ui/core/CircularProgress';
import Footer from '../../components/Footer';

export default function Address(props){
    const [commentList , setCommentList] = useState([]);
    const [requestList , setRequestList] = useState([]);
    const [ngo_name ,setName] = useState('');
    const [founder ,setFounder] = useState('');
    const [vision ,setVision] = useState('');
    const [about ,setAbout] = useState('');
    const [address ,setAddress] = useState(props.address);
    const [ngoAddress,setNgoAddress]=useState('');
    const [email , setEmail] = useState('');
    const [donorsCount ,setDonorsCount] = useState();
    const [helpCount ,setHelpCount] = useState();
    const [accounts , setAccounts] = useState([]);
    const [recievedList , setRecievedList] = useState([]);
    const [sentList , setSentList] = useState([]);
    const [balance , setBalance] = useState();
    const [recieverName , setRecieverName] = useState('');
    const [transPurpose , setTransPurpose] = useState('');
    const [metaMaskAssress , setMetaMaskAssress] = useState('');
    const [transAmmount , setTransAmmount] = useState('');
    const [residentialAddress , setResidentialAddress] = useState('');
    const [recFlag , setRecFlag] = useState(true);
    const [sendFlag , setSendFlag] = useState(true);

    useEffect(async()=>{
        await axios.get('http://localhost:8088/ngo/getFeedback?ngoAddress='+address)
            .then((res)=>{
                console.log(res.data);
                setCommentList(res.data);
            }).catch((err)=>alert(err));
        await axios.get('http://localhost:8088/ngo/getHelp?ngoAddress='+address)
            .then((res)=>{
                console.log(res.data);
                setRequestList(res.data);
            }).catch((err)=>alert(err));
        console.log(address);
        var tmpAccounts = await web3.eth.getAccounts();
        setAccounts(tmpAccounts);
        await axios.get('http://localhost:8088/ngo/byAddress?address='+address)
            .then(async(result)=>{
                console.log(result.data[0]);
                setName(result.data[0].ngo_name);
                setFounder(result.data[0].founder);
                setVision(result.data[0].vision);
                setAbout(result.data[0].about);
                setEmail(result.data[0].email);
            }).catch((err)=>alert(err)); 
            try{
                var tmpNGOAddress = await instance.methods.getNGO().call({from:address});
                setNgoAddress(tmpNGOAddress);

                const NGOInstance = await NGOHelper(tmpNGOAddress);
                var tmpdonorCount;
                var tmpHelpCount;
                var tmpbalance;
                //await NGOInstance.methods.contribute().send({from:tmpAccounts[0],value:web3.utils.toWei('0.001', 'ether')});
                
                let    Transacdetails = await NGOInstance.methods.getDetails().call({from:tmpAccounts[0]});
                console.log(Transacdetails);
                tmpdonorCount = Transacdetails[0];
                tmpHelpCount = Transacdetails[1];
                tmpbalance =  await web3.utils.fromWei(Transacdetails[2].toString(), 'ether');
                setDonorsCount(tmpdonorCount);
                setHelpCount(tmpHelpCount);
                setBalance(tmpbalance);
                var tmpDList = [],i;
                for(i=0;i<tmpdonorCount;i++){
                    setRecFlag(false);
                    var tmpObject = await NGOInstance.methods.donorsList(i).call({from:tmpAccounts[0]});
                    tmpObject.value = await web3.utils.fromWei(tmpObject.value.toString(), 'ether');
                    tmpObject.valRemaining = await web3.utils.fromWei(tmpObject.valRemaining.toString(), 'ether');
                    tmpObject.valueUsed = await web3.utils.fromWei(tmpObject.valueUsed.toString(), 'ether');
                    let unix_timestamp = tmpObject.createdAt;
                    // Create a new JavaScript Date object based on the timestamp
                    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                    var date = new Date(unix_timestamp * 1000);
                    date = date.toString();
                    tmpObject.createdAt = date.substring(0,24);
                    tmpDList.push(tmpObject);
                }
                console.log(tmpDList);
                //await NGOInstance.methods.sendMoneyByNGO("Help for Covid 19","Dinesh Bhor","Katraj,Pune",web3.utils.toWei('0.000001', 'ether'),"0x603AC1D18Ebb99249cF5139d282e8f7cF8836B92").send({from:tmpAccounts[0]});
                var tmpSList = [],i;
                for(i=0;i<tmpHelpCount;i++){
                    setSendFlag(false);
                    var tmpObject = await NGOInstance.methods.transactionByNGOList(i).call({from:tmpAccounts[0]});
                    tmpObject.amount = await web3.utils.fromWei(tmpObject.amount.toString(), 'ether');
                    let unix_timestamp = tmpObject.createdAt;
                    // Create a new JavaScript Date object based on the timestamp
                    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                    var date = new Date(unix_timestamp * 1000);
                    date = date.toString();
                    tmpObject.createdAt = date.substring(0,24);
                    tmpSList.push(tmpObject);
                }
                setRecievedList(tmpDList);
                setSentList(tmpSList);
            }catch(err){
                alert("Meta Mask is Not connect or ",err);
            }

    },[]);

    var Rloader,Sloader;
    if (recievedList.length == 0) {
        if(recFlag){
            Rloader = <h1 style={{textAlign: 'center'}}>No transaction Recieved yet...</h1>
        }else
            Rloader = <CircularProgress style={{}} size='120px'/>;
    }else{
        Rloader =<Table responsive="true" hover="true" className="table table-sm" style={{fontSize:'25px',marginLeft: 'auto', marginRight: 'auto',maxWidth:'80%' ,  border: '3px solid purple',backgroundColor:'lightblue'}} >
                    <thead className="thead-dark">
                        <tr style={{backgroundColor:'black',color:'white'}}>
                        <th scope="col">Id</th>
                        <th scope="col">Sender Address</th>
                        <th scope="col">Sender Email</th>
                        <th scope="col">Amount in Ethers</th>
                        <th scope="col">Amount Used</th>
                        <th scope="col">Amount Remaining</th>
                        <th scope="col">Date</th>
                        </tr>
                    </thead>
                    
                    {recievedList.map((e,index)=>{
                        return (
                            <tbody>
                                <tr>
                                <th scope="row">{index+1}</th>
                                <td>{e[0]}</td>
                                <td>{e.email}</td>
                                <td>{e.value}</td>
                                <td>{e.valueUsed}</td>
                                <td>{e.valRemaining}</td>
                                <td>{e.createdAt}</td>
                                </tr>
                            </tbody>
                        );
                    })}
                    
                </Table>;
    }

    if (sentList.length == 0) {
        if(sendFlag){
            Sloader = <h1 style={{textAlign: 'center'}}>No transaction Done yet...</h1>
        }else
            Sloader = <CircularProgress style={{}} size='120px'/>;
    }else{
        Sloader =<Table responsive="true" hover="true" className="table table-sm" style={{fontSize:'25px',maxWidth:'80%' ,  border: '3px solid purple',marginLeft: 'auto', marginRight: 'auto',backgroundColor:'lightblue' }} >
                    <thead className="thead-dark">
                        <tr style={{backgroundColor:'black',color:'white'}}>
                        <th scope="col">Id</th>
                        <th scope="col">Reciever Name</th>
                        <th scope="col">Ethereum Address</th>
                        <th scope="col">Reciever Address</th>
                        <th scope="col">Reason Of Donation </th>
                        <th scope="col">Amount in ether</th>
                        <th scope="col">Date</th>
                        </tr>
                    </thead>
                    {sentList.map((e,index)=>{
                        return (
                            <tbody>
                                <tr>
                                <th scope="row">{index+1}</th>
                                <td>{e.recipientName}</td>
                                <td>{e.recipient}</td>
                                <td>{e.recipientAddress}</td>
                                <td>{e.description}</td>
                                <td>{e.amount}</td>
                                <td>{e.createdAt}</td>
                                </tr>
                            </tbody>
                        );
                    })}
                    
                </Table>;
    }

    const submitHandler = async(event) => {
        try{
            var i;
            const value = await web3.utils.toWei(transAmmount, 'ether');
            const NGOInstance = await NGOHelper(ngoAddress);
            await NGOInstance.methods.sendMoneyByNGO(transPurpose,recieverName,residentialAddress,value,metaMaskAssress).send({from:accounts[0]});
            const updateResult = await NGOInstance.methods.sendMoneyRecord().call({from:accounts[0]});
            console.log(updateResult);
            var emailData=[];
            for(i=updateResult[0];i<=updateResult[1];i++){
                const record = await NGOInstance.methods.donorsList(i).call({from:accounts[0]});
                console.log(record);
                const amountEther = await web3.utils.fromWei(record.valueUsed , 'ether');
                const emailEntry={
                    from:email,
                    to:record.email,
                    amount:amountEther,
                    ngo_name : ngo_name,
                    transactionId : parseInt(helpCount)+1,
                    reciever : recieverName,
                }
                emailData.push(emailEntry);
            }
            console.log(emailData);
            await axios.post('http://localhost:8088/ngo/sendMail',emailData)
                .then((res)=>{
                    console.log(res.data);
                }).catch((err)=>alert(err));
            alert('Transaction Successful');
            var    Transacdetails = await NGOInstance.methods.getDetails().call({from:accounts[0]});
            console.log(Transacdetails);
            var tmpdonorCount = Transacdetails[0];
            var tmpHelpCount = Transacdetails[1];
            var tmpbalance =  await web3.utils.fromWei(Transacdetails[2].toString(), 'ether');
            setDonorsCount(tmpdonorCount);
            setHelpCount(tmpHelpCount);
            setBalance(tmpbalance);
            var tmpSList = [];
                for(i=0;i<tmpHelpCount;i++){
                    setSendFlag(false);
                    var tmpObject = await NGOInstance.methods.transactionByNGOList(i).call({from:accounts[0]});
                    tmpObject.amount = await web3.utils.fromWei(tmpObject.amount.toString(), 'ether');
                    let unix_timestamp = tmpObject.createdAt;
                    // Create a new JavaScript Date object based on the timestamp
                    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                    var date = new Date(unix_timestamp * 1000);
                    date = date.toString();
                    tmpObject.createdAt = date.substring(0,24);
                    tmpSList.push(tmpObject);
                }
                setSentList(tmpSList);
            setRecieverName('');
            setTransPurpose('');
            setMetaMaskAssress('');
            setTransAmmount('');
            setResidentialAddress('');
        }catch(err){
            alert(err);
        }
    }


    return (
        <div style={{}}>
            <Head>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"/>    
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
            </Head>
            <Header/>
            <div style={{ display:'flex',flexGrow:'row',flexDirection:'row'}}>
                <div style={{ width:'40%',height:'500px',paddingTop:'15px'}}>
                    <img src="https://www.motocms.com/blog/wp-content/uploads/2017/11/1040-563-3.jpg" style={{height:'460px',width:'80%',display: 'block' , marginLeft:'auto',marginRight: 'auto'}}></img>
                </div>
                <div style={{width:'40%',height:'500px',padding:'20px'}}>
                    <h1 style={{color:'blue' , fontSize:'80px' , fontFamily : 'sans-serif'}}><b>{ngo_name}</b></h1>
                    <br></br>
                    <div style={{fontSize:'25px'}}>
                    <h2><b>Our Vision :</b> <span style={{color:''}}>{vision}</span></h2> 
                    <h2><b>About Us :</b> <span style={{color:''}}>{about}</span></h2>
                    <h2><b>Founder :</b> <span style={{color:''}}>{founder}</span></h2>
                    <h2><b>Contact Us :</b> <span style={{color:''}}>{email}</span></h2>
                    </div>

                     
                </div>
                <div style={{width:'20%',height:'500px',paddingLeft:'50px',paddingTop:'40px'}}>
                    <div >
                        <p style={{ fontSize: '30px',paddingTop:'30px', backgroundColor: '#00b3e7', borderRadius: '5px',color: '#ffffff',textAlign: 'center',width : '150px',height: '92px',display: 'inline-block'}}>{donorsCount}</p><p style={{display: 'inline',fontSize:'30px',paddingLeft:'10px'}}>Donors Count</p><br/>
                        <p style={{ fontSize: '30px',paddingTop:'30px', backgroundColor: '#00b3e7', borderRadius: '5px',color: '#ffffff',textAlign: 'center',width : '150px',height: '92px',display: 'inline-block'}}>{helpCount}</p><p style={{display: 'inline',fontSize:'30px',paddingLeft:'10px'}}>Provided help </p><br/>
                        <p style={{ fontSize: '24px',paddingTop:'30px', backgroundColor: '#00b3e7', borderRadius: '5px',color: '#ffffff',textAlign: 'center',width : '150px',height: '92px',display: 'inline-block'}}>{balance}</p><p style={{display: 'inline',fontSize:'30px',paddingLeft:'10px'}}>Balance in Ethers</p>
                    </div>
                </div>
            </div>    
            <div style={{padding:'20px 20px 20px 20px',paddingTop:'50px',width:'100%',margin:'5px'}}>
                <h1 style={{textAlign: 'center'}}>Donations Received By NGO</h1>
                {Rloader}
            </div>
            <div style={{padding:'20px 20px 20px 20px',width:'100%',alignItems:'center',margin:'5px'}}>
                <h1 style={{textAlign: 'center'}}>Donations Made By NGO</h1>
                {Sloader}
            </div>
            
            <div style={{padding:'20px 20px 20px 20px',width:'100%',alignItems:'center',margin:'5px'}}>
                <h1 style={{textAlign: 'center'}}>Comments</h1>
                <Table responsive="true" hover="true" className="table table-sm" style={{fontSize:'25px',maxWidth:'80%' ,  border: '3px solid purple',marginLeft: 'auto', marginRight: 'auto',backgroundColor:'rgb(179, 255, 255)' }} >
                    <thead className="thead-dark">
                        <tr style={{backgroundColor:'black',color:'white'}}>
                        <th scope="col">Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Comment</th>
                        </tr>
                    </thead>
                    {commentList.map((e,index)=>{
                        return (
                            <tbody>
                                <tr>
                                <th scope="row">{index+1}</th>
                                <td>{e.name}</td>
                                <td>{e.rating}</td>
                                <td>{e.comment}</td>
                                </tr>
                            </tbody>
                        );
                    })}
                    
                </Table>;
            </div>
            <div style={{padding:'20px 20px 20px 20px',width:'100%',alignItems:'center',margin:'5px'}}>
                <h1 style={{textAlign: 'center'}}>Requested For Help</h1>
                <Table responsive="true" hover="true" className="table table-sm" style={{fontSize:'25px',maxWidth:'80%' ,  border: '3px solid purple',marginLeft: 'auto', marginRight: 'auto',backgroundColor:'rgb(179, 255, 255)' }} >
                    <thead className="thead-dark">
                        <tr style={{backgroundColor:'black',color:'white'}}>
                        <th scope="col">Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">email</th>
                        <th scope="col">contact</th>
                        <th scope="col">Reason</th>
                        <th scope="col">Metamask Address</th>
                        <th scope="col">Residential Address</th>
                        <th scope="col">Amount</th>
                        </tr>
                    </thead>
                    {requestList.map((e,index)=>{
                        return (
                            <tbody>
                                <tr>
                                <th scope="row">{index+1}</th>
                                <td>{e.firstName} {e.lastName}</td>
                                <td>{e.email}</td>
                                <td>{e.contact_no}</td>
                                <td>{e.reason}</td>
                                <td>{e.metaAddress}</td>
                                <td>{e.resAddress}</td>
                                <td>{e.amount}</td>
                                </tr>
                            </tbody>
                        );
                    })}
                    
                </Table>;
            </div>
            <div style={{display:'flex',idth:'100%',height:'auto'}}>
                <div style={{width:'50%',padding:'20px 20px 20px 20px',fontSize:'30px',display: 'block',textAlign:'center'}}>
                    <h1>Help Needy</h1>    
                    <Form style={{display: 'inline-block',marginLeft: 'auto' , marginRight :'auto',textAlign:'left'}}>
                        <Form.Group controlId="recieverName">
                            <Form.Label>Name of Reciever</Form.Label>
                            <Form.Control type="string" placeholder="Full Name" value={recieverName} onChange={((event) => {setRecieverName(event.target.value)})} style={{fontSize:'28px',width:'600px',height:'50px'}} />
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Reason for Help</Form.Label>
                            <Form.Control type="string" placeholder="Reason" value={transPurpose} onChange={((event) => {setTransPurpose(event.target.value)})}  style={{fontSize:'28px',width:'600px',height:'50px'}} />
                        </Form.Group>
                        <Form.Group controlId="metaMaskAddress">
                            <Form.Label>Metamask Address</Form.Label>
                            <Form.Control type="string" placeholder="Metamask address" value={metaMaskAssress} onChange={((event) => {setMetaMaskAssress(event.target.value)})}  style={{fontSize:'28px',width:'600px',height:'50px'}}/>
                        </Form.Group>
                        <Form.Group controlId="ammount">
                            <Form.Label>Amount in Ethers</Form.Label>
                            <Form.Control type="string" placeholder="Amount" value={transAmmount} onChange={((event) => {setTransAmmount(event.target.value)})}  style={{fontSize:'28px',width:'600px',height:'50px'}}/>
                        </Form.Group>
                        <Form.Group controlId="residentialAddress">
                            <Form.Label>Residential Address</Form.Label>
                            <Form.Control type="string" placeholder="Like Ravjiv Nagar, Navi Mumbai" value={residentialAddress} onChange={((event) => {setResidentialAddress(event.target.value)})}  style={{fontSize:'28px',width:'600px',height:'50px'}} />
                        </Form.Group>
                        <Button variant="primary" onClick={(event) => submitHandler(event)} style={{width:'100px',height:'50px'}}>
                            Submit
                        </Button>
                    </Form>
                </div>
                <div style={{width:'50%',display:'block'}}>
                    <img style={{marginLeft: 'auto' , marginRight :'auto' , width:'80%' , height:'80%'}} src="https://image.shutterstock.com/image-vector/volunteers-collecting-goods-charity-into-260nw-1537715486.jpg"></img>

                </div>

            </div>
            <Footer/>
        </div>
        
    );
}

export async function getServerSideProps(context) {
    
    return {props:{address : context.query.address}};
}
  