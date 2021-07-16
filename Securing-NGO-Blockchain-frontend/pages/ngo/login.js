import React,{useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link } from '../../routes';
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
import {useRouter} from 'next/router' 
import LoginValidator from '../../utils/LoginValidator';
import Header from '../../components/Header';


const styles = {
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://i.pinimg.com/originals/a4/b6/a1/a4b6a15eb2957d7c43e99c99a2e50fe3.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: '1px',
        //backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop:'1px',
    },
    submit: {
        margin: '3px 0px 2px',
    },
}

export default  function  NgoLogin() {
    const router=useRouter();
    //const styles = useStyles();
    const [errors , setErrors] = useState({});
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [accounts,setAccounts] = useState([]);

    useEffect(async()=>{
        if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
            await window.ethereum.enable();
          }
        const tmpAccounts= await web3.eth.getAccounts();
        setAccounts(tmpAccounts);
    },[]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const submitHandler = (event) => {
        //console.log(email,password,accounts[0]);
        const data = {
            email: email,
            password: password,
            address:accounts[0]
        };
        LoginValidator().validate(data)
            .then(()=>
                axios.post('http://localhost:8088/ngo/login',data)
                .then(async(res)=>{
                    setErrors({});
                    console.log('...',res,accounts); 
                    const tmp=await instance.methods.getNGO().call({from:accounts[0]});
                    console.log(tmp);
                    router.push(`/ngo/${accounts[0]}`);
                }).catch((err)=>{
                    console.log(err);
                    alert("Incorrect Credentials");
                })
            )
            .catch((err)=>{setErrors(err.errors)});
        
        console.log(data);
    }

    return (
        <div>
            <Header/>
            <Grid container component="main" style={styles.root}>
            <CssBaseline />
            <Grid item  xs={7} sm={7} md={7} style={styles.image} />
            <Grid item xs={5} sm={5} md={5} component={Paper} elevation={6} square>
                <div style={styles.paper}>
                    <Avatar style={styles.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form style={styles.form}>
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
                            onChange={((event) => {setEmail(event.target.value)})}
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
                            error={!!errors.password}
                            helperText={errors.password ? errors.password[0] : ' '}
                            type={showPassword ? 'text' : 'password'}
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
                            style={styles.submit}
                            onClick={(event) => submitHandler(event)}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href='/ngo/signup' variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Grid>
        </Grid>
        </div>
    );
}