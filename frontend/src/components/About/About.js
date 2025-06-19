import React from 'react';
import Back from "../Back";
import Navbar from "../Navbar";
import ashleyImage from "../images/p8.jpg";
import tamaricaImage from "../images/p6.jpg";
import kimanieImage from "../images/p7.jpg";
import janPaulImage from "../images/p4.jpg";
import "./about.css";

const About = () => {
  const creators = [
    {
      name: "Ashley Reid",
      image: ashleyImage
    },
    {
      name: "Tamarica Shaw",
      image: tamaricaImage
    },
    {
      name: "Kimanie Prendergast",
      image: kimanieImage
    },
    {
      name: "Jan-Paul Boland",
      image: janPaulImage
    }
  ];

  return (
    <>
      <section className='about'>
        <Back name='About Us' title='About Us - Who We Are?' />
        <div className='container flex mtop'>
          <div className='left row'>
            <header title='Our Story' subtitle='RentZ - Your Personal Pocket Realtor' />

            <p>
              RentZ is a rental platform created by four aspiring Software Engineers 
              to help college students, working professionals and property owners. 
              The website acts as a user personal pocket realtor, to alleviate the stress 
              and hassle that tenant and landlords normally face to find or list rental 
              properties without the use of a licensed real estate agent.
            </p>
            <button className='btn2'>More About Us</button>
          </div>
          <div className='right row'>
            <div className='creators-section'>
              <h3>Meet Our Creators</h3>
              <div className='creators-list'>
                {creators.map((creator, index) => (
                  <div key={index} className='creator-item'>
                    <div className='creator-image'>
                      <img 
                        src={creator.image} 
                        alt={creator.name}
                      />
                    </div>
                    <div className='creator-name'>{creator.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default About;