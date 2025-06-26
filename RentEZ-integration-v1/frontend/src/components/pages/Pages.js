import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Temporary inline components to test
const TempHome = () => <div><h1>Home Page</h1></div>;
const TempAbout = () => <div><h1>About Page</h1></div>;
const TempServices = () => <div><h1>Services Page</h1></div>;
const TempContact = () => <div><h1>Contact Page</h1></div>;
const TempNavbar = () => (
  <nav style={{padding: '20px', background: '#f0f0f0'}}>
    <a href="/" style={{margin: '0 10px'}}>Home</a>
    <a href="/About" style={{margin: '0 10px'}}>About</a>
    <a href="/Services" style={{margin: '0 10px'}}>Services</a>
    <a href="/Contact" style={{margin: '0 10px'}}>Contact</a>
  </nav>
);
const TempFooter = () => (
  <footer style={{padding: '20px', background: '#f0f0f0', marginTop: '50px'}}>
    <p>&copy; 2024 Your Company</p>
  </footer>
);

const Pages = () => {
  return (
    <Router>
      <TempNavbar />
      <div style={{minHeight: '400px', padding: '20px'}}>
        <Routes>
          <Route path='/' element={<TempHome />} />
          <Route path='/About' element={<TempAbout />} />
          <Route path='/Services' element={<TempServices />} />
          <Route path='/Contact' element={<TempContact />} />
        </Routes>
      </div>
      <TempFooter />
    </Router>
  );
};

export default Pages;