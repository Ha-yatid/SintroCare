import { useState, useEffect } from 'react';
import {getUsers,linkDoctorWithPatient  } from '../../services/userService';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [Doctor, setDoctor] = useState([]);
  const [error, setError] = useState(null);

  const userDoctor = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    setDoctor(userDoctor?.userData._id);
    const fetchPatients = async () => {
      try {
        const response = await getUsers("patient");
        setPatients(response);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('Erreur lors de la récupération des patients');
      }
    };

    fetchPatients();
  }, [userDoctor?.userData._id]);

  const linkDoctor = async (patientId) => {
    try {
        console.log('idpatient,', patientId);
        const doctorId = {DoctorID : Doctor }

       const response = await linkDoctorWithPatient(patientId,doctorId);
       console.log("datta",response)
      setPatients((prev) =>
        prev.map((patient) =>
          patient._id === patientId ? response.data : patient
        )
      );

    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Erreur lors de la mise à jour du patient');
    }
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-2">Patients List</h2>  
        {error && <p className="text-red-500">{error}</p>}
            <table className="table-auto w-full border-collapse ">
            <thead>
              <tr className="bg-greenblue-100 flex justify-between items-center border-b pb-2">
                <th className="px-4 py-2  text-left font-medium text-gray-700">Name</th>
                <th className="px-4 py-2  text-left font-medium text-gray-700">Age</th>
                <th className="px-4 py-2  text-left font-medium text-gray-700">Type de  maladie</th>
                <th className="px-4 py-2  text-left font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient, index) => (
                  <tr key={index} className="hover:bg-gray-50 flex justify-between items-center border-b pb-2">
                    <td className="px-4 py-2 ">{patient.FullName}</td>
                    <td className="px-4 py-2 ">{patient.age}</td>
                    <td className="px-4 py-2 ">{patient.TypeDeMaladie}</td>
                    <td>     
                        {(!patient.DoctorID || patient.DoctorID === '') && ( 
                        <button
                            onClick={() => linkDoctor(patient._id)}
                            className="px-2 py-1 bg-blue-500 text-white rounded"
                            >
                            Add
                            </button>
                        )}
                    </td>
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
      {/* <ul>
        {patients.map((patient) => (
          <li key={patient._id} className="flex items-center justify-between">
            <div>
              <p>{patient.name}</p>
              <p>{patient.email}</p>
              <p>
                Assigné à un médecin :{' '}
                {patient.doctorId ? 'Oui' : 'Non'}
              </p>
            </div>
            {!patient.doctorId && (
              <button
                onClick={() => linkDoctor(patient._id)}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                Lier au médecin
              </button>
            )}
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default PatientList;
