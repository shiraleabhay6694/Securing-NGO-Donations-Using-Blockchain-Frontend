import React,{useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link} from '../../routes';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {IconButton,InputAdornment} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import web3 from '../../ethereum/web3';
import instance from '../../ethereum/factory';
import axios from 'axios';
import SignupValidator from '../../utils/SignupValidator';
//import { Route } from 'react-router-dom';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';


const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://image.shutterstock.com/image-vector/ngo-nongovernmental-organization-concept-keywords-260nw-1247512159.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function ngoSignup() {
    const classes = useStyles();
    const [ngo_name,setName] = useState('');
    const [founder,setFounder] = useState('');
    const [email, setEmail] = useState('');
    const [vision , setVision] = useState('');
    const [about , setabout] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [accounts,setAccounts] = useState([]);
    const [errors , setErrors] = useState({});
    const [loader , setLoader] = useState(false);

    useEffect(async()=>{
        const tmpAccounts = await web3.eth.getAccounts();
        setAccounts(tmpAccounts);
    },[]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const submitHandler = async(event) => {
        setLoader(true);
        console.log(accounts);
        const data = {
            ngo_name:ngo_name,
            founder:founder,
            email: email,
            vision:vision,
            about:about,
            password: password,
            address:accounts[0]
        };
        SignupValidator().validate(data)
            .then(async()=>{
                setErrors({});
                await instance.methods.createNewNGO(ngo_name).send({ from: accounts[0] },async(err,hash)=>{
                    if(err){
                        window.alert(err);
                    }else{
                        await axios.post('http://localhost:8088/ngo/signUp',data)
                                .then(async(res)=>{
                                    console.log(res);
                                    setName('');
                                    setPassword('');
                                    setVision('');
                                    setabout('');
                                    setFounder('');
                                    setEmail('');
                                    setLoader(false);
                                    alert("Successfully Sign Up. Now you can log in");
                                    
                                }).catch((err)=>{
                                    setLoader(false);
                                    console.log(err);
                                    alert("Email should be unique or MetaMask Address should be unique");
                                });
                    }
                });
            }).catch((err)=>setErrors(err.errors));
        
        console.log(accounts);
    }



    return (

        <div>
            <Head>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"/>    
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
            </Head>
            <Header/>
            <Grid container component="main" className={classes.root} >
            <CssBaseline />
            <Grid item xs={7}   className={classes.image} />
            <Grid item xs={5}  component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <form className={classes.form}>
                        <TextField
                            type='string'
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="ngo_name"
                            label="NGO Name"
                            name="ngo_name"
                            autoComplete="text"
                            autoFocus
                            error={!!errors.ngo_name}
                            helperText={errors.ngo_name ? errors.ngo_name[0] : ' '}
                            value={ngo_name}
                            onChange={((event) => setName(event.target.value))}
                        />
                        <TextField
                            type='string'
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="founder"
                            label="Founder Name"
                            name="founder"
                            autoComplete="text"
                            autoFocus
                            error={!!errors.founder}
                            helperText={errors.founder ? errors.founder[0] : ' '}
                            value={founder}
                            onChange={((event) => setFounder(event.target.value))}
                        />
                        <TextField
                            type='email'
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            error={!!errors.email}
                            helperText={errors.email ? errors.email[0] : ' '}
                            value={email}
                            onChange={((event) => setEmail(event.target.value))}
                        />
                        <TextField
                            type='string'
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="vision"
                            label="Your Vision"
                            name="vision"
                            autoComplete="text"
                            autoFocus
                            error={!!errors.vision}
                            helperText={errors.vision ? errors.vision[0] : ' '}
                            value={vision}
                            onChange={((event) => setVision(event.target.value))}
                        />
                        <TextField
                            type='string'
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="about"
                            label="Description"
                            name="about"
                            autoComplete="text"
                            autoFocus
                            error={!!errors.about}
                            helperText={errors.about ? errors.about[0] : ' '}
                            value={about}
                            onChange={((event) => setabout(event.target.value))}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            id="password"
                            autoComplete="current-password"
                            type={showPassword ? 'text' : 'password'}
                            error={!!errors.password}
                            helperText={errors.password ? errors.password[0] : ' '}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton
                                            data-testid='password-visibility'
                                            onClick={togglePasswordVisibility}
                                            edge='end'
                                            title={
                                                showPassword
                                                    ? 'Hide Password'
                                                    : 'Show Password'
                                            }>
                                            {showPassword ? (
                                                <Visibility fontSize='small' />
                                            ) : (
                                                <VisibilityOff fontSize='small' />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={(event) => submitHandler(event)}
                        >
                            Sign Up
                        </Button>
                        
                        
                    </form>
                </div>
            </Grid>
        </Grid>
        <Footer/>
        <style jsx>{`
            .loader {
                border: 15px solid #f3f3f3;
                border-radius: 50%;
                border-top: 16px solid #3498db;
                width: 120px;
                height: 120px;
                -webkit-animation: spin 2s linear infinite; /* Safari */
                animation: spin 2s linear infinite;
              }
              
              /* Safari */
              @-webkit-keyframes spin {
                0% { -webkit-transform: rotate(0deg); }
                100% { -webkit-transform: rotate(360deg); }
              }
              
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
        `}</style>
        </div>
        
    );
}