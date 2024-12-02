import React, { useState, useEffect } from 'react';
import { database, ref, set, onValue } from '../firebase';

const About = () => {
  const [missionText, setMissionText] = useState('');
  const [visionText, setVisionText] = useState('');
  const [programs, setPrograms] = useState('');
  const [platformsText, setPlatformsText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Load existing data from Firebase
  useEffect(() => {
    const aboutRef = ref(database, 'about/');
    onValue(aboutRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMissionText(data.missionText || '');
        setVisionText(data.visionText || '');
        setPrograms(data.programs || '');
        setPlatformsText(data.platformsText || '');
      }
    });
  }, []);

  // Function to save all text fields to Firebase
  const saveAboutText = () => {
    const aboutData = {
      missionText,
      visionText,
      programs,
      platformsText,
    };
    set(ref(database, 'about/'), aboutData);
    setIsEditing(false);
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-12 flex flex-col justify-center items-center">
      <h2 className="text-5xl font-bold mb-6 text-center text-yellow-400">About Us</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl animate-fadeIn delay-100">
        {/* Mission Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-2 text-blue-300">Mission</h3>
          <textarea
            value={missionText}
            onChange={(e) => {
              setMissionText(e.target.value);
              setIsEditing(true);
            }}
            className="w-full h-24 p-2 bg-gray-700 text-gray-300 rounded-lg"
            placeholder="Enter mission statement..."
          />
        </div>

        {/* Vision Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-2 text-blue-300">Vision</h3>
          <textarea
            value={visionText}
            onChange={(e) => {
              setVisionText(e.target.value);
              setIsEditing(true);
            }}
            className="w-full h-24 p-2 bg-gray-700 text-gray-300 rounded-lg"
            placeholder="Enter vision statement..."
          />
        </div>
      </div>

      {/* Programs Section */}
      <div className="mt-10 w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-3xl font-semibold text-center mb-4 text-yellow-400">Programs</h3>
        <textarea
          value={programs}
          onChange={(e) => {
            setPrograms(e.target.value);
            setIsEditing(true);
          }}
          className="w-full h-32 p-2 bg-gray-700 text-gray-300 rounded-lg"
          placeholder="Enter programs description..."
        />
      </div>

      {/* Platforms Section */}
      <div className="mt-10 w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-3xl font-semibold text-center mb-4 text-yellow-400">Platforms</h3>
        <textarea
          value={platformsText}
          onChange={(e) => {
            setPlatformsText(e.target.value);
            setIsEditing(true);
          }}
          className="w-full h-32 p-2 bg-gray-700 text-gray-300 rounded-lg"
          placeholder="Describe platforms..."
        />
      </div>

      {/* Save Button */}
      {isEditing && (
        <button
          onClick={saveAboutText}
          className="mt-10 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105"
        >
          Save Changes
        </button>
      )}
    </section>
  );
};

export default About;
