import React, { useState } from 'react';
import { database } from '../firebase';
import { ref, set, get } from 'firebase/database';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Add confirm password state
  const [registrationError, setRegistrationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistrationError('');
    setSuccessMessage('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setRegistrationError("Passwords do not match");
      return;
    }

    try {
      // Reference to the users list in Firebase
      const usersRef = ref(database, 'users');

      // Fetch the list of registered users
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersCount = Object.keys(usersData).length;

        if (usersCount >= 3) {
          setRegistrationError('Registration limit reached. Only 3 users can register.');
          return; // Stop further processing
        }
      }

      // Proceed with registration if user count is less than 3
      const userKey = email.replace('.', '_'); // Firebase doesn't allow dots in keys
      const userRef = ref(database, `users/${userKey}`);
      await set(userRef, { email, password });

      setSuccessMessage('Registration successful! You can now login.');
    } catch (error) {
      console.error('Error during registration:', error);
      setRegistrationError('Registration failed, please try again.');
    }
  };

  return (
    <div
  className="min-h-screen w-full flex justify-center items-center"
  style={{
    backgroundImage: 'url(/images/sethu3.png)',
    backgroundSize: 'cover',      // Adjust to cover the screen
    backgroundPosition: 'center', // Center the image
    backgroundRepeat: 'no-repeat',
    color: '#FFFFFF',
    minHeight: '100vh',           // Ensure it covers the full height
    backgroundAttachment: 'fixed' // Keeps the background fixed during scroll
  }}
>

      <div
        className="p-6 sm:p-8 lg:p-10 rounded-lg shadow-2xl"
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'rgba(240, 240, 240, 0.35)',
          borderRadius: '20px',
          border: '1px solid #333',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-4 sm:mb-6" style={{ color: '#2b2b2b', letterSpacing: '1px' }}>
          Register
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4 sm:mb-6">
            <label className="block font-semibold mb-2" style={{ color: '#7b7b7b' }}>Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{ backgroundColor: '#e0e0e0', color: '#333' }}
            />
          </div>
          <div className="mb-4 sm:mb-6">
            <label className="block font-semibold mb-2" style={{ color: '#7b7b7b' }}>Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{ backgroundColor: '#e0e0e0', color: '#333' }}
            />
          </div>
          <div className="mb-4 sm:mb-6">
            <label className="block font-semibold mb-2" style={{ color: '#7b7b7b' }}>Confirm Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              style={{ backgroundColor: '#e0e0e0', color: '#333' }}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 sm:py-3 rounded-lg font-bold text-lg sm:text-xl hover:bg-blue-700 transition duration-300"
            style={{
              backgroundColor: '#002b36',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0, 43, 54, 0.4)',
            }}
          >
            Register
          </button>
        </form>
        {/* Display registration error or success message */}
        {registrationError && (
          <p className="mt-4 text-red-600 text-center">
            {registrationError}
          </p>
        )}
        {successMessage && (
          <p className="mt-4 text-green-600 text-center">
            {successMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
