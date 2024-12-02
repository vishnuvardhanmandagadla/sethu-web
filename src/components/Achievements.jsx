import React, { useEffect, useState, useRef } from 'react';
import { Tilt } from 'react-tilt';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import './Achievements.css';
import { fadeIn } from '../utils/motion';

const Counter = ({ target, startCount }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (startCount) {
      const increment = () => {
        setCount((prev) => Math.min(prev + Math.ceil(target / 100), target));
      };
      const interval = setInterval(increment, 20);
      return () => clearInterval(interval);
    }
  }, [startCount, target]);

  return (
    <span className="counter-text">
      {count}+
    </span>
  );
};


const AchievementCard = ({ title, target, icon, index, startCounting }) => (
  <motion.div variants={fadeIn('up', 'spring', index * 0.5, 0.75)}>
    <Tilt
      options={{
        max: 35,
        scale: 1.05,
        speed: 400,
      }}
      className='achievement-card bg-tertiary p-5 rounded-2xl w-full sm:w-[300px] flex flex-col items-center text-center'
    >
      <img src={icon} alt={`${title} icon`} className='w-16 h-16 mb-4' />
      <h3 className='text-white font-bold text-[20px]'>{title}</h3>
      <p className='text-secondary text-[14px]'>
        <Counter target={target} startCount={startCounting} />
      </p>
    </Tilt>
  </motion.div>
);

const Achievements = () => {
  const [startCounting, setStartCounting] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStartCounting(true);

            // Trigger confetti blast effect
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.7 },
              colors: ['#FF4500', '#FF8C00', '#FFD700', '#32CD32', '#00CED1'],
            });

            observer.disconnect(); // Stop observing after entering the viewport
          }
        });
      },
      { threshold: 0.4 } // Lowered threshold for better mobile performance
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const achievementsData = [
    { title: 'Teached Colleges', target: 120, icon: '/logos/teached.webp' },
    { title: 'Projects Completed', target: 75, icon: '/logos/projects.webp' },
    { title: 'Job No. of Students', target: 1000, icon: '/logos/student.webp' },
    { title: 'Years Experience', target: 5, icon: '/logos/years.webp' },
  ];

  return (
    <section ref={sectionRef} className='achievements-section'>
      <div className='container mx-auto'>
        <h2 className='section-title text-white'>Achievements</h2>
        <p className='section-subtitle text-secondary mb-10'>
          Celebrating milestones and successes achieved over time.
        </p>
        <div className='flex flex-wrap gap-7 justify-center'>
          {achievementsData.map((achievement, index) => (
            <AchievementCard
              key={`achievement-${index}`}
              index={index}
              startCounting={startCounting}
              {...achievement}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
