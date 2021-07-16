import React, { Component } from 'react'
 

export class Aboutus extends Component {
    render() {
        return (
            
                <div className="" style={{fontSize:'20px',display: 'flex',justifyContent: 'center'}}>
                    <div  style={{backgroundColor:'lightblue',width:'90%',paddingLeft:'30px',paddingRight:'30px'}} >
                    <div className="row gap100">
                            <div className="col-md-6" >
                                <h2>Our Mission</h2>
                                <p style={{paddingTop:'20px',fontSize:'30px', width:'80%'}}>
                                    To show the world that every person , regardless of their needs , 
                                    deserves to have a good life and to be treated with dignity and care.
                                    A world where everyone has a decent place to live , A world in which
                                    all people have pathways to health and opportunity. A world of hope ,
                                    tolerance and social justice , where poverty has been overcome and all
                                    people live in dignity and security.
                                </p>
                                </div>
                            <div className="col-md-6" >
                                <img className="img-thumbnail" src="/photoSlide1.jpg"/>
                            </div>
                    </div>
                    </div>
                </div>
        
        )
    }
}

export default Aboutus;