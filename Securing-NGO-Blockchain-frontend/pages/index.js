import Head from 'next/head'
import  Home_Styles from '../styles/Home.module.css';
import { Link } from '../routes';
import Image from 'next/image';
import Header from '../components/Header';
import PhotoSlides from '../components/PhotoSlide';
import NgoCards from '../components/NgoCards';
import AboutUs from '../components/AboutUs';
import FeaturesSlides from '../components/FeaturesSlides';
import { SliderData } from '../Components/SliderData'
import { SliderData2 } from '../Components/SliderData2'
import Footer from '../components/Footer';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

export default function Home() {
  return (
    <div style={{backgroundColor:'rgb(73, 97, 133)'}}>
      <Header/>
      <PhotoSlides slides={SliderData}/>
      <AboutUs></AboutUs>
      <FeaturesSlides slides={SliderData2}/>
      <NgoCards/>
      <Footer></Footer>
    </div>
  )
}
