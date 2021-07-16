import React, {useState} from 'react'
import {SliderData2} from './SliderData2'
import {FaArrowAltCircleRight,FaArrowAltCircleLeft} from 'react-icons/fa'

const Slider2 = ({slides}) => {

    const [current,setCurrent]=useState(0)
    const length=slides.length;

    const nextSlide=()=>{
        setCurrent(current === length-1 ? 0 : current+1)
    }

    const prevSlide=()=>{
        setCurrent(current === 0 ? length-1 : current-1)
    }

    if(!Array.isArray(slides) || slides.length<=0)
    {
        return null;
    }
    return (
        <div>
        <h1 style={{textAlign:'center',paddingTop:'50px',fontSize:'40'}}>Why to choose Make a Donation</h1>
       <section style={{marginTop:0,paddingTop:'20px'}} className='slider'>
        <FaArrowAltCircleLeft className="left-arrow" onClick={prevSlide}/>
        <FaArrowAltCircleRight className="right-arrow" onClick={nextSlide} />
        {SliderData2.map((slide,index)=>{
            return (
                <div className={index===current ? 'slide active' : 'slide'} key={index}>
                    {index===current && (<img src={slide.image} alt="Image1" className="image"/>)}
                    
                </div>
            )
            
        })}
       </section>
       </div>
    )
}

export default Slider2
