import React, { useState, useEffect } from 'react';
import { database, get, ref, onValue } from '../firebase';
import { useParams, useNavigate } from 'react-router-dom';

const EmployeeProfile = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [totalSalary, setTotalSalary] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [daysPresent, setDaysPresent] = useState(0);
  const [daysAbsent, setDaysAbsent] = useState(0); // New state for absent days
  const [numberOfReviews, setNumberOfReviews] = useState(0);
  const [employeeNodeId, setEmployeeNodeId] = useState('');
  const { employeeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const employeeRef = ref(database, 'employees');
  
    const unsubscribe = onValue(employeeRef, (snapshot) => {
      const employees = snapshot.val();
      const employeeEntry = Object.entries(employees).find(
        ([key, emp]) => emp.employeeId === employeeId
      );
  
      if (employeeEntry) {
        const [nodeId, employee] = employeeEntry;
        setEmployeeData(employee);
        setEmployeeNodeId(nodeId);
  
        calculateDaysPresent(employee.attendance);
        calculateAverageRating(employee.reviews);
        setNumberOfReviews(calculateNumberOfReviews(employee.reviews));
  
        // Fetch withdrawals and calculate total salary
        const totalWithdrawals = calculateTotalWithdrawals(employee.withdrawals || {});
        const calculatedTotalSalary = TotalEmployeeSalary(employee.perDaySalary, daysPresent);
        setTotalSalary(calculatedTotalSalary); // Set total salary based on days present and withdrawals
  
      } else {
        navigate('/employee-login');
      }
    });
  
    return () => unsubscribe();
  }, [employeeId, navigate, daysPresent]);

  const fetchTotalSalary = (nodeId) => {
    const totalSalaryRef = ref(database, `employees/${nodeId}/totalSalary`);
    get(totalSalaryRef).then((snapshot) => {
      const salary = snapshot.val();
      if (salary !== null) {
        setTotalSalary(salary);
      }
    });
  };  


  const calculateDaysPresent = (attendance) => {
    if (!attendance) {
      setDaysPresent(0);
      setDaysAbsent(0);
      return 0;
    }
    const presentDays = Object.values(attendance).filter((status) => status === 'present').length;
    const totalDays = Object.keys(attendance).length;
    const absentDays = totalDays - presentDays;
    setDaysAbsent(absentDays);
    setDaysPresent(presentDays);
    return presentDays;
  };

  const calculateAverageRating = (reviews) => {
    if (reviews) {
      const ratings = Object.values(reviews).map((review) => parseFloat(review.rating));
      const average = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
      const roundedAverage = parseFloat(average.toFixed(2));
      setAverageRating(roundedAverage);
    }
  };

  const calculateNumberOfReviews = (reviews) => {
    if (reviews) {
      return Object.values(reviews).length;
    }
    return 0;
  };

  const calculateTotalWithdrawals = (withdrawals) => {
    if (!withdrawals) return 0;
        
    // Loop through each date and withdrawal entry
    return Object.values(withdrawals).reduce((sum, dateWithdrawals) => {
      // For each date, loop through the withdrawal records
      return sum + Object.values(dateWithdrawals).reduce((innerSum, amount) => {
        const numericAmount = parseFloat(amount);
        return isNaN(numericAmount) ? innerSum : innerSum + numericAmount;
      }, 0);
    }, 0);
  };

  const flattenWithdrawals = (withdrawals) => {
    return Object.values(withdrawals).flatMap((entry) =>
      typeof entry === "object" ? Object.values(entry) : entry
    );
  };

  // New function to calculate total salary based on present days and per day salary
  const TotalEmployeeSalary = (perDaySalary, daysPresent) => {
    return daysPresent * parseFloat(perDaySalary || 0);
  };
  


  if (!employeeData) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }
  
  const { name, joiningDate, perDaySalary, profilePhoto } = employeeData;
  const totalWithdrawals = calculateTotalWithdrawals(employeeData.withdrawals || {});
  const totalCalculatedSalary = daysPresent * parseFloat(perDaySalary || 0) - totalWithdrawals;

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d001a] via-[#000033] to-[#000000] px-4 sm:px-10 py-14">
      {/* Empty Container at the top */}
      <div style={{ height: '900px' }}></div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Section */}
        <div className="bg-[#1a1a4d] shadow-lg rounded-lg p-4 sm:p-8 text-white border border-red-500">
          <div className="flex flex-col md:flex-row items-center md:space-x-8 p-4 sm:p-8">
            <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-r from-[#4c0080] to-[#000033] rounded-full overflow-hidden mb-4 md:mb-0">
              {profilePhoto === 'No profile' ? (
                <span className="flex items-center justify-center h-full text-gray-400">No Profile Photo</span>
              ) : (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover object-top" />
              )}
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold">{name}</h2>
              <p className="text-gray-400 mt-2">Joining Date: {joiningDate}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8">
            <InfoCard label="Per Day Salary" value={`₹ ${perDaySalary}/-`} />
            <InfoCard label="Days Present" value={daysPresent} />
            <InfoCard label="Absent Days" value={daysAbsent} /> {/* Display Absent Days */}
            <InfoCard label="Total Salary" value={`₹ ${totalSalary}/-`} />
            <InfoCard label="Average Rating" value={`${averageRating} / 5`} />
            <InfoCard label="Number of Reviews" value={numberOfReviews} />
            <InfoCard label="Total Withdraw" value={`₹ ${isNaN(totalWithdrawals) ? 0 : totalWithdrawals}/-`} /> 
            <InfoCard label="Remaining Salary" value={`₹ ${isNaN(totalCalculatedSalary) ? 0 : totalCalculatedSalary}/-`} />
          </div>
        </div>
        {/* Other sections */}
        <div>
          <ShareableLink nodeId={employeeNodeId} />
        </div>
        <div>
          <SectionCard title="Attendance Record" data={employeeData.attendance} />
        </div>
        <div>
          <SectionCard title="Withdrawal History" data={employeeData.withdrawals} isCurrency />
        </div>
        <div>
          <ReviewsSection reviews={employeeData.reviews} />
        </div>
      </div>
    </div>
  );
};

// InfoCard component to display individual info
const InfoCard = ({ label, value }) => (
  <div className="bg-[#2a2a5c] p-6 rounded-lg shadow-md text-white text-center">
    <h4 className="text-gray-400">{label}</h4>
    <p className="text-lg font-semibold mt-2">{value}</p>
  </div>
);

// Updated Attendance, Withdrawal History, Reviews Section, and Shareable Link UI

const SectionCard = ({ title, data, isCurrency = false }) => (
  <div className="bg-[#1a1a4d] shadow-lg rounded-lg p-6 text-white transition-all duration-300 hover:shadow-xl hover:scale-105">
    <h3 className="text-2xl font-bold text-gradient mb-6">{title}</h3>
    <div className="space-y-4 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
      {data ? (
        Object.entries(data).map(([date, entries]) =>
          typeof entries === 'object' ? (
            Object.entries(entries).map(([id, value]) => (
              <div key={id} className="flex justify-between">
                <span className="text-gray-300">{`${date} - ${new Date(
                  parseInt(id)
                ).toLocaleTimeString()}`}</span>
                <span
                  className={`font-medium ${
                    isCurrency
                      ? 'text-green-400'
                      : value === 'present'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {isCurrency ? `-₹ ${value}` : value === 'present' ? 'Present' : 'Absent'}
                </span>
              </div>
            ))
          ) : (
            <div key={date} className="flex justify-between">
              <span className="text-gray-300">{date}</span>
              <span
                className={`font-medium ${
                  isCurrency
                    ? 'text-green-400'
                    : entries === 'present'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {isCurrency ? `₹ ${entries}` : entries === 'present' ? 'Present' : 'Absent'}
              </span>
            </div>
          )
        )
      ) : (
        <p className="text-gray-400">No data available.</p>
      )}
    </div>
  </div>
);

const ReviewsSection = ({ reviews }) => (
  <div className="bg-[#1a1a4d] shadow-lg rounded-lg p-6 text-white transition-all duration-300 hover:shadow-xl hover:scale-105">
    <h3 className="text-2xl font-bold text-gradient mb-6">Reviews</h3>
    <div className="space-y-6 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
      {reviews ? (
        Object.values(reviews).map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))
      ) : (
        <p className="text-gray-400">No reviews available yet.</p>
      )}
    </div>
  </div>
);

const ReviewCard = ({ rating, text, rollNumber, branch }) => (
  <div className="bg-[#2a2a5c] p-4 rounded-lg shadow-md hover:bg-[#333399] transition-all duration-300">
    <h4 className="text-lg font-semibold text-blue-400">⭐ Rating: {rating} / 5</h4>
    <p className="text-gray-300 mt-2">Review: {text}</p>
    <p className="text-gray-500 text-sm mt-1">
      By: {rollNumber} ({branch})
    </p>
  </div>
);

const ShareableLink = ({ nodeId }) => (
  <div className="bg-[#1a1a4d] shadow-lg rounded-lg p-6 text-white mt-8">
    <h3 className="text-2xl font-bold mb-6">Shareable Link</h3>
    <p className="text-gray-400">
      Here is a link to your profile that you can share:
      <br />
      <a
        href={`https://yourwebsite.com/employee/${nodeId}`}
        className="text-blue-500 hover:text-blue-700 truncate"
        target="_blank"
        rel="noopener noreferrer"
      >
       https://vslr-demo.web.app/review 
      </a>
    </p>
  </div>
);

export default EmployeeProfile; 