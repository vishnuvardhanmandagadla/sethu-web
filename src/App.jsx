import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Registration from './components/registration';
import SethuDynamic from './components/sethu_dynamic';
import EmployeeLogin from './components/EmployeeLogin'; // Import EmployeeLogin
import EmployeeProfile from './components/EmployeeProfile'; // Import EmployeeProfile
import ReviewPage from './components/ReviewPage';
import SethuStatic from './components/sethu_Static';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login status
  const [loggedInUser, setLoggedInUser] = useState(null); // Manage the logged-in employee user

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SethuStatic/>} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Registration />} />

        {/* Protected Route for SethuDynamic */}
        <Route
          path="/:employeeId/sethu" // Changed placeholder to employeeId for consistency
          element={isLoggedIn ? <SethuDynamic /> : <Navigate to="/login" />}
        />

        {/* Employee Login Route */}
        <Route
          path="/employee-login"
          element={<EmployeeLogin setLoggedInUser={setLoggedInUser} />}
        />

        {/* Employee Profile Route with employeeId in URL */}
        <Route
          path="/employee-profile/:employeeId"
          element={loggedInUser ? <EmployeeProfile loggedInUser={loggedInUser} /> : <Navigate to="/employee-login" />}
        />
        <Route path="/employee/:employeeId" element={<EmployeeProfile />} />
        <Route path="/review" element={<ReviewPage />} />
        {/* Redirect for any unknown routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
