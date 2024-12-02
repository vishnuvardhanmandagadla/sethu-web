import React, { useState, useEffect } from 'react';
import { storage, storageRef, listAll, getDownloadURL } from '../firebase'; // Import storage functions
import './Colleges.css';

const StaticColleges = () => {
  const [collegeData, setCollegeData] = useState([
    { name: 'College A', image: '/images/sethu4.png', description: 'Top-ranked for engineering.' },
    { name: 'College B', image: '/images/SETHU1.png', description: 'Leading in business education.' },
    { name: 'College C', image: '/images/sethu3.png', description: 'Known for innovation in arts.' },
    { name: 'College D', image: '/images/SETHU.png', description: 'Renowned for medical programs.' },
  ]);

  // Fetch uploaded images on component mount
  useEffect(() => {
    const fetchUploadedImages = async () => {
      try {
        const listRef = storageRef(storage, 'colleges/');
        const res = await listAll(listRef);
        const urls = await Promise.all(
          res.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return { name: item.name, image: url, description: 'Uploaded College Image' };
          })
        );
        setCollegeData((prevData) => [...prevData, ...urls]);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchUploadedImages();
  }, []);

  return (
    <section className="collegess py-10 px-6">
      <h2 className="text-4xl font-bold mb-6 text-center">Colleges</h2>
      <p className="text-lg text-center max-w-2xl mx-auto mb-12">
        We partner with top colleges and universities to provide comprehensive training programs. Learn more about our partnerships and the benefits they offer to students.
      </p>

      <div className="logoss">
        <div className="logoss-slide">
          {collegeData.map((college, index) => (
            <div key={index} className="college-item">
              <img src={college.image} alt={college.name} />
              <div className="overlay">
                <h3>{college.name}</h3>
                <p>{college.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="logoss-slide">
          {collegeData.map((college, index) => (
            <div key={`copy-${index}`} className="college-item">
              <img src={college.image} alt={college.name} />
              <div className="overlay">
                <h3>{college.name}</h3>
                <p>{college.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaticColleges;
