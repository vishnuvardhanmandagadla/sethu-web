// SethuDynamic.jsx
import React from 'react';
import Nav from './Nav';
import About from './About';
import Curriculums from './Curriculums';
import Employee from './Employee';
import Colleges from './Colleges';
import ContactUs from './ContactUs';
import Achievements from './Achievements';
import Home from './Home';

const SethuDynamic = () => {
  return (
    <div className="w-screen h-screen bg-gradient-to-r from-blue-900 to-gray-900 text-white">
      {/* Use Nav Component */}
      <Nav />

      {/* Sections with corresponding IDs and full height */}
      <div className="w-full">
        <section id="home" className="min-h-screen flex justify-center items-center">
          <Home />
        </section>
        <section id="about" className="min-h-screen flex justify-center items-center">
          <About />
        </section>
        <section id="curriculums" className="min-h-screen flex justify-center items-center">
          <Curriculums />
        </section>
        <section id="employee" className="min-h-screen flex justify-center items-center">
          <Employee />
        </section>
        <section id="achievements" className="min-h-screen flex justify-center items-center">
          <Achievements />
        </section>
        <section id="colleges" className="min-h-screen flex justify-center items-center">
          <Colleges />
        </section>
        <section id="contact" className="min-h-screen flex justify-center items-center">
          <ContactUs />
        </section>
      </div>
    </div>
  );
};

export default SethuDynamic;
