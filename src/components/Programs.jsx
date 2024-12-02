import React, { useState } from "react";
import "./Programs.css";

const Programs = () => {
  const [programsData, setProgramsData] = useState([
    {
      name: "AI & ML",
      image: "/logos/aiml.jpg",
      description: "AI & ML",
      amount: "$199",
    },
    {
      name: "Problem Solving",
      image: "/logos/problem solving.png",
      description: "Problem Solving.",
      amount: "$299",
    },
    {
      name: "Fullstack",
      image: "/logos/fullstack.png",
      description: "Fullstack",
      amount: "$399",
    },
    {
      name: "Backend",
      image: "/logos/Frontend.png",
      description: "Frontend",
      amount: "$499",
    },
    {
      name: "Backend",
      image: "/logos/Backend.jpg",
      description: "Specialized in AI and machine learning.",
      amount: "$399",
    },
    {
      name: "Fullstack",
      image: "/logos/fullstack.png",
      description: "Fullstack",
      amount: "$399",
    },
    // minimum 6 cards details need
    
  ]);

  return (
    <section className="programs">
      <h2 className="text-4xl font-bold mb-6 text-center">Programs</h2>
      <p className="text-lg text-center max-w-2xl mx-auto mb-12">
        Discover our programs designed to enhance learning, creativity, and innovation.
      </p>

      <div className="scrolling-programs">
        <div className="programs-slide">
          {programsData.map((program, index) => (
            <div key={index} className="program-card">
              <img src={program.image} alt={program.name} />
              <div className="card-content">
                <h3 className="text-lg font-bold">{program.name}</h3>
                <p>{program.description}</p>
                <span className="amount">{program.amount}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="programs-slide">
          {/* Duplicate cards for seamless scrolling */}
          {programsData.map((program, index) => (
            <div key={`duplicate-${index}`} className="program-card">
              <img src={program.image} alt={program.name} />
              <div className="card-content">
                <h3 className="text-lg font-bold">{program.name}</h3>
                <p>{program.description}</p>
                <span className="amount">{program.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
