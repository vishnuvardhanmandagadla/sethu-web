import React, { useEffect, useRef, useState } from 'react'; 
import StaticNav from './StaticNav';
import StaticAbout from './StaticAbout';
import ContactUs from './ContactUs';
import Colleges from './StaticColleges';
import StaticReviews from './StaticReviews';
import Achievements from './Achievements';
import Home from './Home';
import Profile from './Profile'; // Import the Profile component


const SethuStatic = () => {
  const sectionsRef = useRef([]);
  const [activeLink, setActiveLink] = useState('');

  // Handle section change and set active link
  const handleSectionChange = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id); // Update active link based on section id
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleSectionChange, {
      threshold: 0.4, // Adjust threshold as necessary
    });

    // Observe each section
    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-blue-900 to-gray-900 text-white">
      {/* Pass active link and setActiveLink function to StaticNav */}
      <StaticNav activeLink={activeLink} />

      {/* Sections with corresponding IDs and full height */}
      <div className="w-full">
        <section ref={(el) => (sectionsRef.current[0] = el)} id="home" className="min-h-screen flex justify-center items-center">
          <Home />
        </section>
        <section ref={(el) => (sectionsRef.current[1] = el)} id="about" className="min-h-screen flex justify-center items-center">
          <StaticAbout />
        </section>
        <section ref={(el) => (sectionsRef.current[2] = el)} id="profile" className="min-h-screen flex justify-center items-center">
          <Profile />
        </section>
        <section ref={(el) => (sectionsRef.current[3] = el)} id="achievements" className="min-h-screen flex justify-center items-center">
          <Achievements />
        </section>
        <section ref={(el) => (sectionsRef.current[4] = el)} id="colleges" className="min-h-screen flex justify-center items-center">
          <Colleges />
        </section>
        <section ref={(el) => (sectionsRef.current[5] = el)} id="StaticReviews" className="min-h-screen flex justify-center items-center">
          <StaticReviews />
        </section>
        <section ref={(el) => (sectionsRef.current[6] = el)} id="contact" className="min-h-screen flex justify-center items-center">
          <ContactUs />
        </section>
       
      </div>
    </div>
  );
};

export default SethuStatic;
