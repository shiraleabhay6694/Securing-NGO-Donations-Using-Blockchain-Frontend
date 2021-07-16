import React,{ Component} from 'react';
import Image from 'next/image';
import { Link } from '../routes';


class Header extends Component{
    styles={
        
    }
    render(){
        return(
            <div className="headerContainer">
                <div className="ImageContainer">
                    <Image  src="/download.jpg" height='240px' width='240px'></Image>
                </div>
                <div className="nameOfNgo">
                    <h1 className="name">Make a Donation</h1>
                </div>
                <div className="navBar" >
                    <Link className="links" route='/'>
                        <a>Home</a>
                    </Link>
                    <Link className="links" route='/donor/login'>
                        <a>Donate</a>
                    </Link>
                    <Link className="links" route='/ngo/signup'>
                        <a>Organisation</a>
                    </Link>
                </div>
                <style jsx>{`
                    .headerContainer{
                        width:100%;
                        height:200px;
                        display:flex;
                        flex-grow:row;
                        background:#e4e8f0;
                        color:black;
                    }
                    .ImageContainer{
                        width:10.5%;
                        height:200px;
                        display:flex;
                        padding:10px 10px 10px 10px;
                    }
                    .nameOfNgo{
                        display:flex;
                        height:200px;
                        width:45%;
                        margin: auto;
                        padding-top:45px;  
                        color:black; 
                    }
                    .name{
                        padding-left:100px;
                        color:black;
                        font-size: 60px;
                    }
                    .navBar{
                        padding-top:70px;
                        display:flex;
                        justigy-content:center;
                        align-item:center;
                        height:200px;
                        margin:auto;
                        width:39.5%;
                        color:black;
                    }
                    a{
                        font-size:50px;
                        padding-left:60px;
                    }
                    a:hover{
                        font-size:55px;
                    }
                `}</style>
            </div>
        );
    }
}

export default Header;