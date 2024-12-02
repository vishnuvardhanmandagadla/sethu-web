import React, { useState, useEffect } from 'react';
import { database, ref, onValue, push } from '../firebase';
import { useParams } from 'react-router-dom';

const ReviewPage = () => {
  const { employeeId } = useParams(); // Employee ID from URL
  const [rating, setRating] = useState(1); // Default rating
  const [text, setText] = useState(''); // Review text
  const [rollNumber, setRollNumber] = useState(''); // Student Roll Number
  const [branch, setBranch] = useState(''); // Branch
  const [employeesData, setEmployeesData] = useState({}); // Employee data from Firebase
  const [selectedEmployee, setSelectedEmployee] = useState(''); // To select employee for review
  const [submissionStatus, setSubmissionStatus] = useState(''); // State for submission status

  // Load employee data on component mount
  useEffect(() => {
    const employeeRef = ref(database, 'employees');
    onValue(employeeRef, (snapshot) => {
      const data = snapshot.val();
      setEmployeesData(data || {}); // Store employee data
    });
  }, []);

  // Handle review submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedEmployee) {
      const reviewsRef = ref(database, `employees/${selectedEmployee}/reviews`);

      // Check if a review with the same Roll Number already exists
      const existingReviewsSnapshot = await new Promise((resolve) =>
        onValue(reviewsRef, resolve, { onlyOnce: true })
      );
      const existingReviews = existingReviewsSnapshot.val();

      const duplicateReview = Object.values(existingReviews || {}).find(
        (review) => review.rollNumber === rollNumber
      );

      if (duplicateReview) {
        setSubmissionStatus('Review with this Roll Number already exists.');
        setTimeout(() => setSubmissionStatus(''), 2000); // Clear message after delay
        return; // Exit without submitting
      }

      const review = { rating, text, rollNumber, branch };
      await push(reviewsRef, review); // Push review to Firebase under selected employee

      // Set the success message and clear the form
      setSubmissionStatus('Review successfully submitted!');
      setRating(1); // Reset rating
      setText(''); // Reset review text
      setRollNumber(''); // Reset roll number
      setBranch(''); // Reset branch

      // Clear the success message after 2 seconds
      setTimeout(() => {
        setSubmissionStatus(''); // Clear the message after a delay
      }, 2000); // 2-second delay
    }
  };

  return (
    <div className="w-full p-6 min-h-screen flex items-center justify-center bg-gradient-to-r from-[#D1FAFF] via-[#6A8EAE] to-[#157145] animate-bg-shift">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8 transform transition duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold mb-6 text-[#57A773] text-center">Write a Review</h2>

        {/* Employee Selection Dropdown */}
        <select
          className="w-full p-3 mb-4 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-[#9BD1E5]"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Select an Employee</option>
          {Object.keys(employeesData).map((key) => (
            <option key={key} value={key}>
              {employeesData[key].name} (ID: {employeesData[key].employeeId})
            </option>
          ))}
        </select>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700">Roll Number:</label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="Enter Roll Number"
              required
              className="w-full p-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-[#9BD1E5]"
            />
          </div>

          <div>
            <label className="block text-gray-700">Branch:</label>
            <select
              className="w-full p-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-[#9BD1E5]"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Rating:</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min="1"
              max="5"
              required
              className="w-full p-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-[#9BD1E5]"
            />
          </div>

          <div>
            <label className="block text-gray-700">Review:</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your review here..."
              required
              className="w-full p-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-[#9BD1E5]"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#57A773] text-white p-3 rounded transition duration-300 transform hover:scale-105"
            disabled={!selectedEmployee} // Disable if no employee selected
          >
            Submit Review
          </button>
        </form>

        {/* Display submission status */}
        {submissionStatus && (
          <p className="text-[#157145] mt-4 font-bold text-center">{submissionStatus}</p>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
