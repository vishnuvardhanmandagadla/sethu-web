import React, { useState } from 'react';
import { database, ref, get } from '../firebase'; // Import Firebase functionalities
import { useNavigate } from 'react-router-dom'; // Import navigation

const EmployeeLogin = ({ setLoggedInUser }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Check if employee exists
      const employeeRef = ref(database, 'employees');
      const snapshot = await get(employeeRef);
      const employees = snapshot.val();

      if (employees) {
        const employee = Object.values(employees).find(
          (emp) => emp.employeeId === employeeId && emp.employeePassword === password
        );

        if (employee) {
          setLoggedInUser(employee);
          navigate(`/employee-profile/${employeeId}`); // Redirect to profile page
        } else {
          setError('Invalid Employee ID or Password');
        }
      } else {
        setError('No employee data found.');
      }
    } catch (error) {
      setError('Login failed.');
    }
  };

  return (
    <div
      className="w-full flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(135deg, #0A0D1A, #1B3D5F, #6C3BA3, #2E2E48, #345781)',
      }}
    >
      <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
          Employee Login
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Employee ID"
            required
            className="w-full p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#345781] sm:text-base text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#345781] sm:text-base text-sm"
          />
          <button
            type="submit"
            className="w-full py-2 sm:py-3 bg-[#6C3BA3] text-white font-semibold rounded-md hover:bg-[#2E2E48] transition duration-200 sm:text-base text-sm"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLogin;
