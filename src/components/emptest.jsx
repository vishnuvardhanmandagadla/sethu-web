import React, { useState, useEffect } from 'react';
import { database, ref, set, push, onValue } from '../firebase';

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
  const [employeeRatings, setEmployeeRatings] = useState({});

  useEffect(() => {
    const employeeRef = ref(database, 'employees');
    onValue(employeeRef, (snapshot) => {
      const data = snapshot.val();
      setEmployeesData(data || {});
    });

    // Fetch ratings for employees
    const ratingsRef = ref(database, 'reviews');
    onValue(ratingsRef, (snapshot) => {
      const ratingsData = snapshot.val();
      setEmployeeRatings(ratingsData || {});
    });
  }, []);

  const addEmployee = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (employeeName && joiningDate && perDaySalary && employeeId && employeePassword) {
      if (Object.values(employeesData).some(emp => emp.employeeId === employeeId)) {
        setErrorMessage('Employee ID must be unique. Please choose another ID.');
        return;
      }

      const newEmployeeRef = push(ref(database, 'employees'));
      set(newEmployeeRef, {
        name: employeeName,
        joiningDate: joiningDate,
        perDaySalary: parseInt(perDaySalary),
        employeeId: employeeId,
        employeePassword: employeePassword,
        profilePhoto: profilePhoto || "No profile",
        attendance: {},
        totalSalary: 0,
        withdrawals: {}
      });

      setEmployeeName('');
      setJoiningDate('');
      setPerDaySalary('');
      setEmployeeId('');
      setEmployeePassword('');
      setProfilePhoto(null);
    }
  };

  const calculateTotalSalary = (attendance, perDaySalary, withdrawals) => {
    const attendanceTotal = Object.values(attendance || {}).reduce((total, status) => {
      return total + (status === 'present' ? perDaySalary : 0);
    }, 0);

    const totalWithdrawn = Object.values(withdrawals || {}).reduce((total, amount) => total + amount, 0);

    return attendanceTotal - totalWithdrawn;
  };

  const calculateAverageRating = (employeeKey) => {
    const ratings = employeeRatings[employeeKey];
    if (!ratings) return 0;

    const totalRating = Object.values(ratings).reduce((sum, rating) => sum + rating, 0);
    const numberOfRatings = Object.values(ratings).length;

    return numberOfRatings > 0 ? (totalRating / numberOfRatings).toFixed(2) : 0;
  };

  const markAttendance = (employeeKey, attendanceDate) => {
    if (attendanceDate) {
      const employee = employeesData[employeeKey];
      const currentStatus = employee.attendance?.[attendanceDate] === 'present' ? 'absent' : 'present';
      set(ref(database, `employees/${employeeKey}/attendance/${attendanceDate}`), currentStatus);
    }
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
        const newWithdrawalRef = ref(database, `employees/${employeeKey}/withdrawals/${withdrawDate}`);
        set(newWithdrawalRef, parseInt(withdrawAmount));

        setWithdrawals(prev => ({
          ...prev,
          [employeeKey]: { date: '', amount: 0 }
        }));
      } else {
        alert("Insufficient funds for this withdrawal.");
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

  return (
    <div className="w-full p-8 min-h-screen bg-gradient-to-b from-[#0d001a] via-[#000033] to-[#000000] flex flex-col items-center">
      <div className="max-w-xl w-full bg-[#0d001a] shadow-xl rounded-lg p-6 mb-10">
        <h2 className="text-3xl font-bold mb-6 text-[#ccff33] text-center">Add New Employee</h2>
        <form onSubmit={addEmployee} className="space-y-5">
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          {/* Form Inputs */}
        </form>
      </div>

      <div className="w-full bg-[#0c063d] shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-[#ccff33] text-center">Employee List</h2>
        <table className="table-auto w-full text-left border-separate border-spacing-2">
          <thead>
            <tr>
              {/* Table Headers */}
              <th className="border-b-2 border-[#333366] px-4 py-2 text-[#ccff33]">Employee Average Rating</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(employeesData).map((key) => {
              const employee = employeesData[key];
              const totalSalary = calculateTotalSalary(
                employee.attendance,
                employee.perDaySalary,
                employee.withdrawals
              );
              const daysPresent = countDaysPresent(employee.attendance);
              const averageRating = calculateAverageRating(key);
              return (
                <tr key={key} className="hover:bg-[#1a002b] transition-colors">
                  <td className="border-b border-[#333366] px-4 py-2 text-white">
                    {employee.profilePhoto === "No profile" ? (
                      <span>No profile</span>
                    ) : (
                      <img src={employee.profilePhoto} alt="Profile" className="w-12 h-12 rounded-full" />
                    )}
                  </td>
                  <td className="border-b border-[#333366] px-4 py-2 text-white">{employee.name}</td>
                  <td className="border-b border-[#333366] px-4 py-2 text-white">{employee.joiningDate}</td>
                  <td className="border-b border-[#333366] px-4 py-2 text-white">{employee.perDaySalary}</td>
                  <td className="border-b border-[#333366] px-4 py-2 text-white">{employee.employeeId}</td>
                  <td className="border-b border-[#333366] px-4 py-2 text-white">
                    {/* Attendance Inputs */}
                  </td>
                  <td className="border-b border-[#333366] px-4 py-2 text-white">{daysPresent}</td>
                  <td className="border-b border-[#333366] px-4 py-2 text-white">
                    {/* Withdrawals Inputs */}
                  </td>
                  <td className="border-b border-[#333366] px-4 py-2 text-white">{totalSalary}</td>
                  <td className="border-b border-[#333366] px-4 py-2 text-white">{averageRating}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
