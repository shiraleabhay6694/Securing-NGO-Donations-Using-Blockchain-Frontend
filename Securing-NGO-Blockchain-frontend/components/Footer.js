import React from 'react'
import styled from 'styled-components'
import Image from 'next/image';

 function Footer() {
    return (
        <FooterContainer style={{fontSize:'20px',backgroundColor:'#e4e8f0',padding:'20px 20px 20px 20px'}} >
            
            <div style={{display:'flex' , height:'170px'}} >

                <div style={{width:'30%',padding:'20px 20px 200px 20px'}}>
                    <Image  src="/download.jpg" height='150px' width='150px'></Image>
                </div>
                <div style={{width:'70%',display:'flex'}} className="row">

                    <div style={{width:'50%'}} >
                    <h2 style={{textDecoration:'underline'}}>Contact Us</h2>
                    <ul className="list-unstyled">
                        <li>Walchand College of Engineering</li>
                        <li>Sangli</li>
                        <li>phone: 789654123 </li>
                        <li>happyfaces@gmail.com</li>
                    </ul>
                    </div>

                    <div style={{width:'50%',paddingTop:'70px'}} className="text-center" >
                        <p className="text-xs-center">
                            &copy;{new Date().getFullYear()} Donation Guide App - All Rights Reserved
                        </p>
                    </div>

                    
                   
                </div>  

                
                
            </div> 
            
              
        </FooterContainer>
    )
}

export default Footer

const FooterContainer=styled.footer`
    .footer-middle{
        background: #32036b;
        padding-top:3rem;
        color:white;
        
    }
    .footer-bottom{
        padding-top:3rem;
        padding-bottom:2rem;
    }
    ul li a{
        color:gray;
    }
    ul li a:hover{
        color:lightgray;
    }
`