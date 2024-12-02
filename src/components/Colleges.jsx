import React, { useState, useEffect } from 'react';
import { storage, storageRef, listAll, getDownloadURL, uploadBytes } from '../firebase';
import './Colleges.css';

const Colleges = () => {
  const [collegeData, setCollegeData] = useState([
    { name: 'College A', image: '/images/sethu4.png', description: 'Top-ranked for engineering.' },
    { name: 'College B', image: '/images/SETHU1.png', description: 'Leading in business education.' },
    { name: 'College C', image: '/images/sethu3.png', description: 'Known for innovation in arts.' },
    { name: 'College D', image: '/images/SETHU.png', description: 'Renowned for medical programs.' },
  ]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const fileRef = storageRef(storage, `colleges/${selectedFile.name}`);
      await uploadBytes(fileRef, selectedFile);
      const imageUrl = await getDownloadURL(fileRef);
      setCollegeData((prevData) => [
        ...prevData,
        { name: 'New College', image: imageUrl, description: 'Description for new college' },
      ]);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setUploading(false);
    setSelectedFile(null);
  };

  return (
    <section className="collegess">
      <h2 className="text-4xl font-bold mb-6 text-center">Colleges</h2>
      <p className="text-lg text-center max-w-2xl mx-auto mb-12">
        We partner with top colleges and universities to provide comprehensive training programs. Learn more about our partnerships and the benefits they offer to students.
      </p>

      <div className="upload-section text-center mb-8">
        <input type="file" onChange={handleFileChange} />
        <button className="upload-button" onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

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

export default Colleges;