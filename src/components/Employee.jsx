import React, { useState, useEffect } from 'react';
import { database, ref, set, push, onValue } from '../firebase';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
const storage = getStorage(); // Ensure Firebase storage is initialized


const Employee = () => {
  const [employeesData, setEmployeesData] = useState({});
  const [employeeName, setEmployeeName] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [perDaySalary, setPerDaySalary] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [withdrawals, setWithdrawals] = useState({});

  useEffect(() => {
    const employeeRef = ref(database, 'employees');
    
    onValue(employeeRef, (snapshot) => {
      const employeesData = snapshot.val() || {};
      const updatedEmployees = {};
  
      Object.keys(employeesData).forEach((employeeKey) => {
        const employee = employeesData[employeeKey];
        const reviewsRef = ref(database, `employees/${employeeKey}/reviews`);
        
        // Fetch reviews for each employee
        onValue(reviewsRef, (reviewsSnapshot) => {
          const reviews = reviewsSnapshot.val() || {};
          const totalRating = Object.values(reviews).reduce(
            (sum, review) => sum + parseInt(review.rating || 0, 10),
            0
          );
          const averageRating = totalRating > 0 ? (totalRating / Object.keys(reviews).length).toFixed(1) : 0;
  
          // Update employee's averageRating
          updatedEmployees[employeeKey] = { ...employee, averageRating };
          setEmployeesData(updatedEmployees);
        });
      });
    });
  }, [database]);
  

  const addEmployee = async (e) => {
    e.preventDefault();
    setErrorMessage('');
  
    if (employeeName && joiningDate && perDaySalary && employeeId && employeePassword) {
      if (Object.values(employeesData).some(emp => emp.employeeId === employeeId)) {
        setErrorMessage('Employee ID must be unique. Please choose another ID.');
        return;
      }
  
      try {
        let profilePhotoUrl = "No profile";
  
        // Upload profile photo to Firebase Storage
        if (profilePhoto) {
          try {
            const storagePath = `EmployeesProfiles/${employeeId}`;
            const photoRef = storageRef(storage, storagePath);
            await uploadBytes(photoRef, profilePhoto);
            profilePhotoUrl = await getDownloadURL(photoRef); // Get the download URL
          } catch (err) {
            console.error("Error uploading profile photo:", err);
            setErrorMessage("Failed to upload profile photo. Please try again.");
            return;
          }
        }
  
        const newEmployeeRef = push(ref(database, 'employees'));
        await set(newEmployeeRef, {
          name: employeeName,
          joiningDate: joiningDate,
          perDaySalary: parseInt(perDaySalary),
          employeeId: employeeId,
          employeePassword: employeePassword,
          profilePhoto: profilePhotoUrl, // Store the profile photo URL
          attendance: {},
          totalSalary: 0,
          withdrawals: {},
          averageRating: 0,
        });
  
        // Reset form fields
        setEmployeeName('');
        setJoiningDate('');
        setPerDaySalary('');
        setEmployeeId('');
        setEmployeePassword('');
        setProfilePhoto(null);
      } catch (error) {
        console.error("Error adding employee:", error);
        setErrorMessage('Failed to add employee. Please try again.');
      }
    } else {
      setErrorMessage("Please fill out all required fields.");
    }
  };
  
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePhoto(file); // Store the file for later upload in addEmployee
    } else {
      setErrorMessage("Please upload a valid image file.");
    }
  };
  
  
  const calculateTotalSalary = (attendance, perDaySalary, withdrawals, isPresent) => {
    // Calculate total earned based on attendance
    let totalPresentDays = 0;
  
    // Count the number of present days
    Object.values(attendance || {}).forEach((status) => {
      if (status === 'present') {
        totalPresentDays++;
      }
    });
  
    // If the employee is marked present, increment the present days count
    if (isPresent) {
      totalPresentDays++;
    }
  
    // Calculate the total salary based on present days
    const attendanceTotal = totalPresentDays * perDaySalary;
  
    // Calculate total withdrawn amount (handling multiple withdrawals per date)
    const totalWithdrawn = Object.values(withdrawals || {}).reduce((total, dailyWithdrawals) => {
      return (
        total +
        Object.values(dailyWithdrawals || {}).reduce((dailyTotal, amount) => dailyTotal + amount, 0)
      );
    }, 0);
  
    // Return the total salary minus any withdrawals
    return attendanceTotal - totalWithdrawn;
  };
  
  
  const [selectedDate, setSelectedDate] = useState(null); // State to store the selected date

  const updateAttendanceStatus = (employeeKey, attendanceDate, status) => {
    if (!attendanceDate) {
      console.log('No date selected for attendance');
      alert("Please select a date before marking attendance.");
      return;
    }
  
    console.log(`Updating attendance for ${employeeKey} on ${attendanceDate} to ${status}`);
  
    // Update the attendance status for the selected date
    set(ref(database, `employees/${employeeKey}/attendance/${attendanceDate}`), status)
      .then(() => {
        console.log('Attendance status updated successfully.');
  
        // Fetch the employee data after updating attendance
        const employee = employeesData[employeeKey];
  
        if (employee) {
          console.log('Employee data:', employee);
  
          // Determine if the employee is present or absent
          const isPresent = status === 'present';
  
          // Calculate the total salary
          const totalSalary = calculateTotalSalary(
            employee.attendance,
            employee.perDaySalary,
            employee.withdrawals,
            isPresent
          );
          console.log('Calculated total salary:', totalSalary);
  
          // Update the total salary in the database
          set(ref(database, `employees/${employeeKey}/totalSalary`), totalSalary)
            .then(() => {
              console.log('Total salary updated successfully in the database.');
            })
            .catch((error) => {
              console.error('Error updating total salary:', error);
            });
        } else {
          console.error('Employee data not found');
        }
      })
      .catch((error) => {
        console.error('Error updating attendance:', error);
      });
  };
  


const handleWithdraw = (employeeKey) => {
  const withdrawAmount = withdrawals[employeeKey]?.amount;
  const withdrawDate = withdrawals[employeeKey]?.date;

  if (withdrawAmount > 0 && withdrawDate) {
    const employee = employeesData[employeeKey];
    const totalSalary = calculateTotalSalary(
      employee.attendance,
      employee.perDaySalary,
      employee.withdrawals
    );

    if (withdrawAmount <= totalSalary) {
      // Generate a unique ID for this withdrawal
      const withdrawalId = new Date().getTime();

      const newWithdrawalRef = ref(
        database,
        `employees/${employeeKey}/withdrawals/${withdrawDate}/${withdrawalId}`
      );
      set(newWithdrawalRef, parseInt(withdrawAmount));

      // Recalculate and update total salary after withdrawal
      const newTotalSalary = totalSalary - withdrawAmount;
      set(ref(database, `employees/${employeeKey}/totalSalary`), newTotalSalary);

      // Reset the input fields for the employee
      setWithdrawals((prev) => ({
        ...prev,
        [employeeKey]: { date: '', amount: 0 },
      }));
    } else {
      alert('Insufficient funds for this withdrawal.');
    }
  }
};



  const handleWithdrawInputChange = (employeeKey, type, value) => {
    setWithdrawals(prev => ({
      ...prev,
      [employeeKey]: {
        ...prev[employeeKey],
        [type]: type === 'amount' ? parseInt(value) : value,
      },
    }));
  };

  const countDaysPresent = (attendance) => {
    return Object.values(attendance || {}).filter(status => status === 'present').length;
  };

  const countAbsentDays = (attendance) => {
    if (!attendance) return 0;
    return Object.values(attendance).filter(status => status === 'absent').length;
  };

  return (
    <div className="w-full p-8 min-h-screen bg-gradient-to-b from-[#0d001a] via-[#000033] to-[#000000] flex flex-col items-center">
      <div className="max-w-xl w-full bg-[#0d001a] shadow-xl rounded-lg p-6 mb-10">
  <h2 className="text-3xl font-bold mb-6 text-[#ccff33] text-center">Add New Employee</h2>
  <form onSubmit={addEmployee} className="space-y-5">
    {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
    <input
      type="text"
      value={employeeName}
      onChange={(e) => setEmployeeName(e.target.value)}
      placeholder="Employee Name"
      required
      className="w-full p-3 border border-[#333366] rounded bg-[#1a002b] text-white placeholder-gray-400"
    />
    <input
      type="date"
      value={joiningDate}
      onChange={(e) => setJoiningDate(e.target.value)}
      required
      className="w-full p-3 border border-[#333366] rounded bg-[#1a002b] text-white placeholder-gray-400"
    />
    <input
      type="number"
      value={perDaySalary}
      onChange={(e) => setPerDaySalary(e.target.value)}
      placeholder="Per Day Salary"
      min="0"
      required
      className="w-full p-3 border border-[#333366] rounded bg-[#1a002b] text-white placeholder-gray-400"
    />
    <input
      type="text"
      value={employeeId}
      onChange={(e) => setEmployeeId(e.target.value)}
      placeholder="Employee ID"
      required
      className="w-full p-3 border border-[#333366] rounded bg-[#1a002b] text-white placeholder-gray-400"
    />
    <input
      type="password"
      value={employeePassword}
      onChange={(e) => setEmployeePassword(e.target.value)}
      placeholder="Employee Password"
      required
      className="w-full p-3 border border-[#333366] rounded bg-[#1a002b] text-white placeholder-gray-400"
    />
    <input
      type="file"
      onChange={handleProfilePhotoChange}
      className="w-full p-3 border border-[#333366] rounded bg-[#1a002b] text-white"
    />
    <button
      type="submit"
      className="w-full bg-[#000033] text-white font-semibold p-3 rounded hover:bg-[#1a1a4d]"
    >
      Add Employee
    </button>
  </form>
</div>


<div className="w-full bg-[#0c063d] shadow-xl rounded-lg p-8">
  <h2 className="text-3xl font-bold mb-6 text-[#ccff33] text-center">Employee List</h2>
  <div className="overflow-x-auto">
  <table className="table-auto w-full text-left border-separate border-spacing-2">
    <thead>
      <tr>
        <th className="border-b-2 border-[#333366] px-4 py-2 text-[#ccff33]">Profile</th>
        <th className="border-b-2 border-[#333366] px-4 py-2 text-[#ccff33]">Name</th>
        <th className="border-b-2 border-[#333366] px-4 py-2 text-[#ccff33]">Joining Date</th>
        <th className="border-b-2 border-[#333366] px-4 py-2 text-[#ccff33]">Per Day Salary</th>
        <th className="border-b-2 border-[#333366] px-4 py-2 text-[#ccff33]">Employee ID and Password</th>
        <th className="border-b-2 border-[#333366] px-4 py-2 text-[#ccff33]">Attendance</th>
        <th className="border-b-2 border-[#333366] px-4 py-2 text-[#ccff33]">Presented Days</th>
        <th className="border-b-2 border-[#333366] px-4 py-2 text-[#ccff33]">Absented Days</th>
        <th className="border-b-2 border-[#333366] px-4 py-2 text-[#ccff33]">Withdrawals</th>
        <th className="border-b-2 border-[#333366] px-4 py-2 text-[#ccff33]">Total Salary</th>
        <th className="border-b-2 border-[#333366] px-4 py-2 text-[#ccff33]">Employee Average Rating</th>
        <th className="border-b-2 border-[#333366] px-4 py-2 text-[#ccff33]">number of reviews</th>
      </tr>
    </thead>
    <tbody>
  {Object.keys(employeesData).map((key) => {
    const employee = employeesData[key];
    const totalSalary = calculateTotalSalary(
      employee.attendance,
      employee.perDaySalary,
      employee.withdrawals,
      employee.averageRating
    );
    const daysPresent = countDaysPresent(employee.attendance);

    return (
      <tr key={key} className="hover:bg-[#1a002b] transition-colors">
        <td className="border-b border-[#333366] px-4 py-2 text-white">
  {employee.profilePhoto === "No profile" ? (
    <span>No profile</span>
  ) : (
    <img
      src={employee.profilePhoto}
      alt="Profile"
      className="w-12 h-12 rounded-full object-cover"
    />
  )}
</td>


        <td className="border-b border-[#333366] px-4 py-2 text-white">{employee.name}</td>
        <td className="border-b border-[#333366] px-4 py-2 text-white">{employee.joiningDate}</td>
        <td className="border-b border-[#333366] px-4 py-2 text-white">{employee.perDaySalary}</td>
        <td className="border-b border-[#333366] px-4 py-2 text-white">{employee.employeeId} ,{employee.employeePassword}</td>
        <td className="border-b border-[#333366] px-4 py-2 text-white">
  {/* Track selected date */}
  <input
    type="date"
    onChange={(e) => setSelectedDate(e.target.value)} // Update state with selected date
    className="w-full p-2 border border-[#4c005c] rounded bg-[#1a002b] text-white"
  />

  {/* Buttons for Present and Absent */}
  <div className="flex gap-2 mt-2">
    <button
      onClick={() => updateAttendanceStatus(key, selectedDate, "present")} // Use selected date
      className="w-full bg-green-600 text-white font-semibold p-2 rounded hover:bg-green-800"
      disabled={!selectedDate} // Disable button if no date is selected
    >
      Present
    </button>
    <button
      onClick={() => updateAttendanceStatus(key, selectedDate, "absent")} // Use selected date
      className="w-full bg-red-600 text-white font-semibold p-2 rounded hover:bg-red-800"
      disabled={!selectedDate} // Disable button if no date is selected
    >
      Absent
    </button>
  </div>

  {/* Attendance History */}
  <div className="mt-4 space-y-1">
    <div className="overflow-y-auto h-32 w-64 border border-gray-300 p-2">
      {Object.entries(employee.attendance || {}).map(([date, status]) => (
        <div key={date} className="flex justify-between items-center">
          <span className="text-gray-300">{date}</span>
          <span className={`text-sm font-semibold ${status === 'present' ? 'text-green-500' : 'text-red-500'}`}>
            {status === 'present' ? 'Present' : 'Absent'}
          </span>
        </div>
      ))}
    </div>
  </div>
</td>
        <td className="border-b border-[#333366] px-4 py-2 text-white">{daysPresent}</td>
        <td className="border-b border-[#333366] px-4 py-2 text-white">{countAbsentDays(employee.attendance)}</td>
        <td className="border-b border-[#333366] px-4 py-2 text-white">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="number"
                placeholder="Amount"
                value={withdrawals[key]?.amount || ''}
                onChange={(e) => handleWithdrawInputChange(key, 'amount', e.target.value)}
                className="p-1 border border-[#4c005c] rounded w-24 bg-[#1a002b] text-white"
              />
              <input
                type="date"
                value={withdrawals[key]?.date || ''}
                onChange={(e) => handleWithdrawInputChange(key, 'date', e.target.value)}
                className="p-1 border border-[#4c005c] rounded w-32 bg-[#1a002b] text-white"
              />
              <button
                onClick={() => handleWithdraw(key)}
                className="bg-[#000033] text-white font-semibold p-2 rounded hover:bg-[#333366]"
              >
                Withdraw
              </button>
            </div>
            <div className="mt-4 space-y-1">
            <div className="mt-4 space-y-1">
  <div className="overflow-y-auto h-32 w-64 border border-gray-300 p-2">
    {Object.entries(employee.withdrawals || {}).map(([date, dailyWithdrawals]) => (
      <div key={date} className="text-sm text-gray-300">
        <span className="font-bold">{date}:</span>
        {typeof dailyWithdrawals === 'object' ? (
          // Handle multiple withdrawals on the same date
          <ul className="list-disc ml-4">
            {Object.values(dailyWithdrawals).map((amount, index) => (
              <li key={index} className="text-gray-300">
                ${amount}
              </li>
            ))}
          </ul>
        ) : (
          // Handle a single withdrawal (for backward compatibility)
          <span className="ml-2">${dailyWithdrawals}</span>
        )}
      </div>
    ))}
  </div>
</div>

            </div>

          </div>
        </td>
        <td className="border-b border-[#333366] px-4 py-2 text-white">{totalSalary}</td>
        <td className="p-4">{employee.averageRating ? `${employee.averageRating} / 5` : 'Not Available'}</td> {/* Display average rating */}
        <td className="p-4">
          {employee.reviews ? Object.values(employee.reviews).length : 0} {/* Display number of reviews */}
        </td>
        

      </tr>
    );
  })}
</tbody>

  </table>
  </div>
</div>

    </div>
  );
};

export default Employee;