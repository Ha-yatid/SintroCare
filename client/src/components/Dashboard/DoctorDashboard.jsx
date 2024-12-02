/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { getListPatient } from '../../services/userService';

export default function DoctorDashboard() {
  const [doctorData, setDoctorData] = useState(null); // Holds the doctor information if needed
  const [patientList, setPatientList] = useState([]); // Holds the list of patients
  const [patientCount, setPatientCount] = useState(0); // Holds the total number of patients
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userDoctor = JSON.parse(localStorage.getItem('user')); // Doctor's user data from local storage

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const today = new Date();
        if (userDoctor?.userData._id) {
          const response = await getListPatient(userDoctor.userData._id);
          console.log("patientlist :", response.patients)
          setPatientList(response.patients || []); // Extract the list of patients
          setPatientCount(response.count || 0); // Extract the count of patients
        } else {
          setError("No doctor data found");
        }
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [userDoctor.userData._id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
        {/* Grid for displaying data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Patients */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Total Patients</h2>
            <p className="text-3xl font-bold text-blue-500">{patientCount}</p>
          </div>

          {/* Recent Analysis (Placeholder for future enhancements) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Recent Analysis</h2>
            <p className="text-sm text-gray-600 mb-4">Placeholder for latest analysis</p>
          </div>

          {/* Appointments (Placeholder for future enhancements) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Appointments</h2>
            <p className="text-sm text-gray-600 mb-4">Placeholder for upcoming appointments</p>
          </div>
        </div>

        {/* List of Patients */}

        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-2">Patients List</h2>
          <p className="text-sm text-gray-600 mb-4">
            Your current patient list
          </p>
          <table className="table-auto w-full border-collapse ">
            <thead>
              <tr className="bg-greenblue-100 flex justify-between items-center border-b pb-2">
                <th className="px-4 py-2  text-left font-medium text-gray-700">Name</th>
                <th className="px-4 py-2  text-left font-medium text-gray-700">Age</th>
                <th className="px-4 py-2  text-left font-medium text-gray-700">Type de  maladie</th>
              </tr>
            </thead>
            <tbody>
              {patientList.length > 0 ? (
                patientList.map((patient, index) => (
                  <tr key={index} className="hover:bg-gray-50 flex justify-between items-center border-b pb-2">
                    <td className="px-4 py-2 ">{patient.FullName}</td>
                    <td className="px-4 py-2 ">{patient.age}</td>
                    <td className="px-4 py-2 ">{patient.TypeDeMaladie}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-4 py-2  text-center text-gray-500"
                  >
                    Aucun patient trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
