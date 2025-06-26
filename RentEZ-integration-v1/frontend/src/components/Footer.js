import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';
import { Button } from './Button';

// Footer data structure
const footerData = [
  {
    title: "About Us",
    text: [
      { list: "How it works", link: "/sign-up" },
      { list: "Terms of Service", link: "/" }
    ]
  },
  
  {
    title: "Social Media",
    text: [
      { list: "Instagram", link: "/" },
      { list: "Facebook", link: "/" },
      { list: "Youtube", link: "/" },
      { list: "Twitter", link: "/" }
    ]
  }
];

const Footer = () => {
  const navigate = useNavigate();

  const handleSubscribe = (e) => {
    e.preventDefault();
    navigate('/premium');
  };

  return (
    <>
      {/* Hero Section */}
      <section className='footer-hero'>
        <div className='footer-hero-content'>
          <div className='footer-hero-text'>
            <h2>Do You Have Questions?</h2>
            <p>We'll help you to grow your rental business and achieve success.</p>
          </div>
          <Button buttonStyle='btn--outline'>Contact Us Today</Button>
        </div>
      </section>

      <div className='footer-container'>
        {/* Subscription Section */}
        <section className='footer-subscription'>
          <div className='subscription-content'>
            <h3>Do You Need Help With Anything?</h3>
            <p className='footer-subscription-text'>
              Receive updates, hot deals, tutorials, discounts sent straight to your inbox every month
            </p>
            <div className='input-areas'>
              <form onSubmit={handleSubscribe}>
                <input
                  className='footer-input'
                  name='email'
                  type='email'
                  placeholder='Your Email'
                />
                <Button buttonStyle='btn--outline' type='submit'>Subscribe</Button>
              </form>
            </div>
          </div>
        </section>

        {/* Links Section */}
        <div className='footer-links'>
          <div className='footer-link-wrapper'>
            {footerData.map((section, index) => (
              <div key={index} className='footer-link-items'>
                <h2>{section.title}</h2>
                {section.text.map((item, itemIndex) => (
                  <Link key={itemIndex} to={item.link}>
                    {item.list}
                  </Link>
                ))}
              </div>
            ))}
            
            {/* Contact Section */}
            <div className='footer-link-items'>
              <h2>Contact Us</h2>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <span>support@rentez.com</span>
                </div>
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <MapPin className="contact-icon" />
                  <span>Kingston, Jamaica</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <section className='social-media'>
          <div className='social-media-wrap'>
            <div className='footer-logo'>
              <Link to='/' className='social-logo'>
                RentEZ
              </Link>
            </div>
            <small className='website-rights'>© 2025 RentEZ. Designed with ❤️</small>
            <div className='social-icons'>
              <Link
                className='social-icon-link facebook'
                to='/'
                target='_blank'
                aria-label='Facebook'
              >
                <i className='fab fa-facebook-f' />
              </Link>
              <Link
                className='social-icon-link instagram'
                to='/'
                target='_blank'
                aria-label='Instagram'
              >
                <i className='fab fa-instagram' />
              </Link>
              <Link
                className='social-icon-link youtube'
                to='/'
                target='_blank'
                aria-label='Youtube'
              >
                <i className='fab fa-youtube' />
              </Link>
              <Link
                className='social-icon-link twitter'
                to='/'
                target='_blank'
                aria-label='Twitter'
              >
                <i className='fab fa-twitter' />
              </Link>
              <Link
                className='social-icon-link linkedin'
                to='/'
                target='_blank'
                aria-label='LinkedIn'
              >
                <i className='fab fa-linkedin' />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Footer;