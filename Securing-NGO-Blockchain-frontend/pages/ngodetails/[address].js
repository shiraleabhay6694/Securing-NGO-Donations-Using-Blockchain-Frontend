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
    const [senderEmail , setSenderEmail] = useState('');
    const [ senderAmount, setSenderAmount] = useState('');
    const [recFlag , setRecFlag] = useState(true);
    const [sendFlag , setSendFlag] = useState(true);
    const [helpFirstName,setHelpFirstName] = useState('');
    const [helpLastName,setHelpLastName] = useState('');
    const [helpEmail , setHelpEmail] = useState('');
    const [helpContact , setHelpContact] = useState('');
    const [helpResAddress,setHelpResAddress] = useState('');
    const [helpMeta , setHelpMeta] = useState('');
    const [helpAmount ,setHelpAmount] = useState('');
    const [helpReason ,setHelpReason] = useState('');
    const [feedbackName ,setFeedbackName] = useState('');
    const [feedbackRating , setFeedbackRating] = useState('');
    const [feedbackComment ,setfeedbackComment] = useState('');
    const [commentList , setCommentList] = useState([]);

    useEffect(async()=>{
        
        await axios.get('http://localhost:8088/ngo/getFeedback?ngoAddress='+address)
            .then((res)=>{
                console.log(res.data);
                setCommentList(res.data);
            }).catch((err)=>alert(err));

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
                var tmpNGOAddress = await instance.methods.getNGOByAddress(address).call({from:tmpAccounts[0]});
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
                    //console.log("1");
                    var tmpObject = await NGOInstance.methods.donorsList(i).call({from:tmpAccounts[0]});
                    console.log(tmpObject);
                    tmpObject.value = await web3.utils.fromWei(tmpObject.value.toString(), 'ether');
                    tmpObject.valRemaining = await web3.utils.fromWei(tmpObject.valRemaining.toString(), 'ether');
                    tmpObject.valueUsed = await web3.utils.fromWei(tmpObject.valueUsed.toString(), 'ether');
                    //console.log("3");
                    let unix_timestamp = tmpObject.createdAt;
                    //console.log("4");
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
                setSenderEmail('');
                setSenderAmount('');
            }catch(err){
                console.log("Error: ",err);
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
        Rloader =<Table responsive="true" hover="true" class="table table-sm" style={{fontSize:'25px',marginLeft: 'auto', marginRight: 'auto',maxWidth:'80%' ,  border: '3px solid purple',backgroundColor:'rgb(179, 255, 255)'}} >
                    <thead class="thead-dark">
                        <tr style={{backgroundColor:'black',color:'white'}}>
                        <th scope="col">#</th>
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
        Sloader =<Table responsive="true" hover="true" class="table table-sm" style={{fontSize:'25px',maxWidth:'80%' ,  border: '3px solid purple',marginLeft: 'auto', marginRight: 'auto',backgroundColor:'rgb(179, 255, 255)' }} >
                    <thead class="thead-dark">
                        <tr style={{backgroundColor:'black',color:'white'}}>
                        <th scope="col">#</th>
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
            const amount = await web3.utils.toWei(senderAmount, 'ether');
            const NGOInstance = await NGOHelper(ngoAddress);
            await NGOInstance.methods.contribute(senderEmail).send({gas: '1000000',from:accounts[0],value:amount})
            alert('Transaction Successful');
            setSenderEmail('');
            setSenderAmount('');
            const data={
                user:accounts[0],
                ngo_name : ngo_name,
                ngo_address : ngoAddress,
                amount : senderAmount,
                date : new Date()
            }
            await axios.post('http://localhost:8088/users/transaction',data)
            .then(async(result)=>{
                console.log("Successfully data added");
            }).catch((err)=>alert(err));
            var    Transacdetails = await NGOInstance.methods.getDetails().call({from:accounts[0]});
            console.log(Transacdetails);
            var tmpdonorCount = Transacdetails[0];
            var tmpHelpCount = Transacdetails[1];
            var tmpbalance =  await web3.utils.fromWei(Transacdetails[2].toString(), 'ether');
            setDonorsCount(tmpdonorCount);
            setHelpCount(tmpHelpCount);
            setBalance(tmpbalance);
            var tmpDList = [],i;
                for(i=0;i<tmpdonorCount;i++){
                    //console.log("1");
                    var tmpObject = await NGOInstance.methods.donorsList(i).call({from:accounts[0]});
                    console.log(tmpObject);
                    tmpObject.value = await web3.utils.fromWei(tmpObject.value.toString(), 'ether');
                    tmpObject.valRemaining = await web3.utils.fromWei(tmpObject.valRemaining.toString(), 'ether');
                    tmpObject.valueUsed = await web3.utils.fromWei(tmpObject.valueUsed.toString(), 'ether');
                    //console.log("3");
                    let unix_timestamp = tmpObject.createdAt;
                    //console.log("4");
                    // Create a new JavaScript Date object based on the timestamp
                    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                    var date = new Date(unix_timestamp * 1000);
                    date = date.toString();
                    tmpObject.createdAt = date.substring(0,24);
                    tmpDList.push(tmpObject);
                }
                console.log(tmpDList);
                setRecievedList(tmpDList);
        }catch(err){
            alert("Insufficient funds or ",err);
        }
    }

    const submitHandlerHelp = async(event)=>{
        const data={
            ngoAddress : address,
            firstName : helpFirstName,
            lastName : helpLastName,
            email : helpEmail,
            contact_no : helpContact,
            metaAddress : helpMeta,
            resAddress : helpResAddress,
            reason : helpReason,
            amount : helpAmount
        }
        console.log(data);
        await axios.post('http://localhost:8088/ngo/help',data)
            .then(async(result)=>{
                console.log(result);
                alert("Successfully Requested");
            }).catch((err)=>alert(err));
        setHelpAmount('');
        setHelpContact('');
        setHelpEmail('');
        setHelpFirstName('');
        setHelpLastName('');
        setHelpMeta('');
        setHelpReason('');
        setHelpResAddress('');
    }

    const submitHandlerFeedback = async (event)=>{
        const data={
            ngoAddress : address,
            name : feedbackName,
            rating : feedbackRating,
            comment : feedbackComment
        }
        await axios.post('http://localhost:8088/ngo/feedback',data)
            .then(async(result)=>{
                console.log(result);
                alert("Successfully commented");
            }).catch((err)=>alert(err));
            setFeedbackRating('');
            setfeedbackComment('');
            setFeedbackName('');
        await axios.get('http://localhost:8088/ngo/getFeedback?ngoAddress='+address)
            .then((res)=>{
                console.log(res.data);
                setCommentList(res.data);
            }).catch((err)=>alert(err));
    }

    return (
        // <div style={{backgroundColor:'rgb(73, 97, 133)'}}>
        <div>
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
                    <h1 style={{color:'blue' , fontSize:'40px' , fontFamily : 'sans-serif'}}><b>{ngo_name}</b></h1>
                    <br></br>
                    <h2><b>Our Vision :</b> {vision}</h2> 
                    <h2><b>About Us :</b> {about}</h2>
                    <h2><b>Founder :</b> {founder}</h2>
                    <h2><b>Contact Us :</b> {email}</h2>
                     
                </div>
                <div style={{width:'20%',height:'500px',paddingLeft:'50px',paddingTop:'40px'}}>
                    <div >
                        <p style={{ fontSize: '30px',paddingTop:'30px', backgroundColor: '#00b3e7', borderRadius: '5px',color: '#ffffff',textAlign: 'center',width : '150px',height: '92px',display: 'inline-block'}}>{donorsCount}</p><p style={{display: 'inline',fontSize:'30px',paddingLeft:'10px'}}>Donors Count</p><br/>
                        <p style={{ fontSize: '30px',paddingTop:'30px', backgroundColor: '#00b3e7', borderRadius: '5px',color: '#ffffff',textAlign: 'center',width : '150px',height: '92px',display: 'inline-block'}}>{helpCount}</p><p style={{display: 'inline',fontSize:'30px',paddingLeft:'10px'}}>Provided help </p><br/>
                        <p style={{ fontSize: '24px',paddingTop:'30px', backgroundColor: '#00b3e7', borderRadius: '5px',color: '#ffffff',textAlign: 'center',width : '150px',height: '92px',display: 'inline-block'}}>{balance}</p><p style={{display: 'inline',fontSize:'30px',paddingLeft:'10px'}}>Balance in Ethers</p>
                    </div>
                </div>
            </div>        
            <div style={{padding:'20px 20px 20px 20px',paddingTop:'20px',width:'100%',margin:'5px'}}>
                <h1 style={{textAlign: 'center'}}>Donations Received By NGO</h1>
                {Rloader}
            </div>
            <div style={{padding:'20px 20px 20px 20px',width:'100%',alignItems:'center',margin:'5px'}}>
                <h1 style={{textAlign: 'center'}}>Donations Made By NGO</h1>
                {Sloader}
            </div>
            <div style={{padding:'20px 20px 20px 20px',width:'100%',alignItems:'center',margin:'5px'}}>
                <h1 style={{textAlign: 'center'}}>Comments</h1>
                <Table responsive="true" hover="true" class="table table-sm" style={{fontSize:'25px',maxWidth:'80%' ,  border: '3px solid purple',marginLeft: 'auto', marginRight: 'auto',backgroundColor:'rgb(179, 255, 255)' }} >
                    <thead class="thead-dark">
                        <tr style={{backgroundColor:'black',color:'white'}}>
                        <th scope="col">#</th>
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
            <div style={{display:'flex',idth:'100%',height:'auto',border:'2px solid black'}}>
                <div style={{width:'50%',padding:'20px 20px 20px 20px',fontSize:'30px',display: 'block',textAlign:'center'}}>
                    <h1>Contribute</h1>    
                    <Form style={{display: 'inline-block',marginLeft: 'auto' , marginRight :'auto',textAlign:'left'}}>
                        <Form.Group controlId="recieverName">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="string" placeholder="Email" value={senderEmail} onChange={((event) => {setSenderEmail(event.target.value)})} style={{fontSize:'28px',width:'600px',height:'50px'}} />
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="string" placeholder="Amount in ethers" value={senderAmount} onChange={((event) => {setSenderAmount(event.target.value)})}  style={{fontSize:'28px',width:'600px',height:'50px'}} />
                        </Form.Group>
                        <Button variant="primary" onClick={(event) => submitHandler(event)} style={{width:'100px',height:'50px'}}>
                            Submit
                        </Button>
                    </Form>
                </div>
                <div style={{width:'50%',display:'block',paddingTop:'30px'}}>
                    <img style={{marginLeft: 'auto' , marginRight :'auto' , width:'80%' , height:'80%'}} src="https://www.aanoorglobal.com/wp-content/themes/aanoor/assets/images/services/trust-ngo-registration-img.jpg"></img>

                </div>

            </div>
            <div style={{display:'flex',idth:'100%',height:'auto',border:'2px solid black'}}>
                <div style={{width:'50%',padding:'20px 20px 20px 20px',fontSize:'30px',display: 'block',textAlign:'center'}}>
                    <h1>Request for Help</h1>    
                    <Form style={{display: 'inline-block',marginLeft: 'auto' , marginRight :'auto',textAlign:'left'}}>
                        <Form.Group controlId="recieverName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="string" placeholder="First name" value={helpFirstName} onChange={((event) => {setHelpFirstName(event.target.value)})} style={{fontSize:'28px',width:'600px',height:'50px'}} />
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="string" placeholder="Last name" value={helpLastName} onChange={((event) => {setHelpLastName(event.target.value)})}  style={{fontSize:'28px',width:'600px',height:'50px'}} />
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Reason for Help</Form.Label>
                            <Form.Control type="string" placeholder="Reason" value={helpReason} onChange={((event) => {setHelpReason(event.target.value)})}  style={{fontSize:'28px',width:'600px',height:'50px'}} />
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>email</Form.Label>
                            <Form.Control type="email" placeholder="mail" value={helpEmail} onChange={((event) => {setHelpEmail(event.target.value)})}  style={{fontSize:'28px',width:'600px',height:'50px'}} />
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control type="string" placeholder="" value={helpContact} onChange={((event) => {setHelpContact(event.target.value)})}  style={{fontSize:'28px',width:'600px',height:'50px'}} />
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Residential Address</Form.Label>
                            <Form.Control type="string" placeholder="Like Flat no. 5-12,Gandinagar, Mumbai" value={helpResAddress} onChange={((event) => {setHelpResAddress(event.target.value)})}  style={{fontSize:'28px',width:'600px',height:'50px'}} />
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Metamask Address</Form.Label>
                            <Form.Control type="string" placeholder="0x...." value={helpMeta} onChange={((event) => {setHelpMeta(event.target.value)})}  style={{fontSize:'28px',width:'600px',height:'50px'}} />
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Amount Needed</Form.Label>
                            <Form.Control type="string" placeholder="Amount in ethers" value={helpAmount} onChange={((event) => {setHelpAmount(event.target.value)})}  style={{fontSize:'28px',width:'600px',height:'50px'}} />
                        </Form.Group>

                        <Button variant="primary" onClick={(event) => submitHandlerHelp(event)} style={{width:'100px',height:'50px'}}>
                            Submit
                        </Button>
                    </Form>
                </div>
                <div style={{width:'50%',display:'block',paddingTop:'30px'}}>
                    <img style={{marginLeft: 'auto' , marginRight :'auto' , width:'80%' , height:'80%'}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQXAdf_N27MS-iS5hRufFJ8KIzOKuAI0MHQw&usqp=CAU"></img>

                </div>

            </div>
            <div style={{display:'flex',idth:'100%',height:'auto',border:'2px solid black'}}>
                <div style={{width:'50%',padding:'20px 20px 20px 20px',fontSize:'30px',display: 'block',textAlign:'center'}}>
                    <h1>Feedback</h1>    
                    <Form style={{display: 'inline-block',marginLeft: 'auto' , marginRight :'auto',textAlign:'left'}}>
                        <Form.Group controlId="recieverName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="string" placeholder="" value={feedbackName} onChange={((event) => {setFeedbackName(event.target.value)})} style={{fontSize:'28px',width:'600px',height:'50px'}} />
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control type="string" placeholder="In the scale of 1 to 5" value={feedbackRating} onChange={((event) => {setFeedbackRating(event.target.value)})}  style={{fontSize:'28px',width:'600px',height:'50px'}} />
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control type="string" placeholder="comment" value={feedbackComment} onChange={((event) => {setfeedbackComment(event.target.value)})}  style={{fontSize:'28px',width:'600px',height:'50px'}} />
                        </Form.Group>

                        <Button variant="primary" onClick={(event) => submitHandlerFeedback(event)} style={{width:'100px',height:'50px'}}>
                            Submit
                        </Button>
                    </Form>
                </div>
                <div style={{width:'50%',display:'block',paddingTop:'30px'}}>
                    <img style={{marginLeft: 'auto' , marginRight :'auto' , width:'80%' , height:'80%'}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQXAdf_N27MS-iS5hRufFJ8KIzOKuAI0MHQw&usqp=CAU"></img>

                </div>

            </div>
            <Footer/>
        </div>
        
    );
}

export async function getServerSideProps(context) {
    
    return {props:{address : context.query.address}};
}
  