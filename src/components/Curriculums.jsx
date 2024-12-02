import React, { useState, useEffect } from 'react';
import { storage } from '../firebase';
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';

// Function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Curriculums = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');

  const fetchFolders = async () => {
    const storageRef = ref(storage, '/Curriculums');
    const folderList = await listAll(storageRef);
    const folderData = await Promise.all(
      folderList.prefixes.map(async (folderRef) => {
        const folderContent = await listAll(folderRef);
        const files = await Promise.all(
          folderContent.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return { name: itemRef.name, url };
          })
        );
        return { name: folderRef.name, files };
      })
    );
    setFolders(folderData);
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile || !selectedFolder) return;
    setUploading(true);

    const fileRef = ref(storage, `Curriculums/${selectedFolder}/${selectedFile.name}`);
    try {
      await uploadBytes(fileRef, selectedFile);
      console.log(`Uploaded ${selectedFile.name} to Curriculums/${selectedFolder}`);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
      setSelectedFile(null);
      fetchFolders();
    }
  };

  const handleCreateFolder = () => {
    if (!newFolderName) return;

    setFolders((prevFolders) => [...prevFolders, { name: newFolderName, files: [] }]);
    setNewFolderName('');
  };

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-[rgba(75,30,133,1)]">
        Curriculums
      </h2>

      {/* New Folder Section */}
      <div className="text-black mb-6 flex flex-col items-center">
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New Folder Name"
          className="border-2 border-gray-300 rounded-lg p-2 mb-2"
        />
        <button
          onClick={handleCreateFolder}
          className="px-4 py-2 rounded-full text-white font-semibold bg-[rgba(75,30,133,1)] hover:bg-[rgba(75,30,133,0.8)]"
        >
          Create Folder
        </button>
      </div>

      {/* Folder Selection Section */}
      <div className="mb-6 text-black">
        <label htmlFor="folderSelect" className="block mb-2 font-semibold text-lg">
          Select Folder:
        </label>
        <select
          id="folderSelect"
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          className="block appearance-none w-full bg-white border-2 border-gray-300 rounded-lg p-2 pr-8 focus:outline-none focus:border-[rgba(75,30,133,1)]"
        >
          <option value="">-- Select a Folder --</option>
          {folders.map((folder, index) => (
            <option key={index} value={folder.name}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Section */}
      <div className="mb-6 flex flex-col items-center">
        <label className="flex flex-col items-center border-2 border-dashed border-[rgba(75,30,133,0.5)] rounded-lg p-4 cursor-pointer hover:bg-[rgba(75,30,133,0.1)]">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              handleFileChange(e);
              setSelectedFile(e.target.files[0]);
            }}
            className="hidden"
          />
          <span className="text-lg text-[rgba(75,30,133,1)]">
            {selectedFile ? selectedFile.name : 'Upload PDF'}
          </span>
          <p className="text-sm text-gray-500">
            {selectedFile ? '' : 'Drag and drop a PDF file here or click to select one'}
          </p>
        </label>
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading || !selectedFolder}
          className={`mt-4 px-4 py-2 rounded-full text-white font-semibold ${
            uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[rgba(75,30,133,1)] hover:bg-[rgba(75,30,133,0.8)]'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {/* Folder Content Display */}
      <div className="flex flex-wrap gap-4 justify-center">
        {folders.map((folder, index) => (
          <div
            key={index}
            className="w-64 p-4 rounded-lg shadow-lg bg-[rgba(75,30,133,0.8)] text-white transition-all duration-200 transform hover:scale-105 hover:shadow-2xl"
            style={{ border: `2px solid ${getRandomColor()}` }}
          >
            <h3 className="text-xl font-semibold mb-4 text-center text-white">{folder.name}</h3>
            <ul className="space-y-2">
              {folder.files.length > 0 ? (
                folder.files.map((file, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-gray-900 p-2 rounded hover:bg-gray-700">
                    <span className="text-sm">{file.name}</span>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-500 font-medium underline"
                    >
                      Download
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No PDFs available</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Curriculums;