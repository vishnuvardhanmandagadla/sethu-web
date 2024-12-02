import React from 'react';
import { motion } from "framer-motion";
import './Home.css';

const Home = () => {
    return (
        <section 
            id="hero-section" 
            className="relative bg-gradient-to-r from-[#1b9ebe] to-[#008080] text-white min-h-screen w-full flex items-center justify-center"
            style={{
                backgroundImage: `url("/images/bg3.png")`,
            }}
        >
            <div className="gradient-overlay" />
            <div className="content">
                <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                    Welcome to 
                </h2>
                <h2>
                    <span className="text-[#3829bb] text-3xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                        Skill Enhancement Training and Hands-on Understanding
                    </span>
                </h2>
                <p className="text-base md:text-xl font-light mb-8 text-gray-300">
                    Empowering your potential with exceptional skills and practical knowledge.
                </p>
                <a 
                    href="#"
                    className="btn-learn-more"
                >
                    Learn More
                </a>
            </div>
        </section>
    );
};

export default Home;
