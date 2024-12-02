import  { useState, useEffect } from 'react'
import { getDAYDosages,getLastAnalyse,getMedicationsList } from '../../services/userService';
import { format } from 'date-fns';


export default function PatientDashboard() {
  const [patientData, setPatientData] = useState(null)
  const [LastAnalyse, setAnalysePatient] = useState(null)
  const [MedicationList, setMedicationList] = useState(null)

  //const { user } = useUser();
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const userPatient = JSON.parse(localStorage.getItem('user'));
  //console.log("Utilisateur connecté PAT: ", userPatient.userData);
  

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const today = new Date();
        if (userPatient?.userData._id) { // Assurez-vous que l'ID utilisateur est disponible
          const response = await getDAYDosages(today, userPatient.userData._id);
          const responseLasAnalyse = await getLastAnalyse(userPatient.userData._id)
          const responseListMedication = await getMedicationsList(userPatient.userData._id);
          //console.log("Utilis id: ", today,userPatient.userData._id);

          setPatientData(response);
          setAnalysePatient(responseLasAnalyse);
          setMedicationList(responseListMedication);

        } else {
          setError("Aucun utilisateur trouvé");
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientData, LastAnalyse, userPatient.userData, MedicationList]);
  

  if (loading) return <div>Chargement...</div>
  if (error) return <div>{error}</div>
  if (!patientData) return <div>Aucune donnée disponible</div>

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Grille des informations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dernière analyse */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Recent Analysis</h2>
            <p className="text-sm text-gray-600 mb-4">Last analysis results</p>
            <p>Date: {LastAnalyse?.analysisDate ? format(new Date(LastAnalyse.analysisDate), 'yyyy/MM/dd') : 'N/A'}</p>
            <p>Result: {LastAnalyse?.tpInrResult || "N/A"}</p>
          </div>

          {/* Prochaine analyse */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Next Analysis</h2>
            <p className="text-sm text-gray-600 mb-4">Upcoming analysis date</p>
            <p>{LastAnalyse?.nextAnalysisDateRecomander ? format(new Date(LastAnalyse.nextAnalysisDateRecomander), 'yyyy/MM/dd') : 'N/A'}</p>
          </div>

          {/* Dose de Sintrom du jour */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Todays Sintrom Dose</h2>
            <p className="text-sm text-gray-600 mb-4">Current prescribed dose</p>
            <p>{patientData?.dosageAmount || "N/A"}</p>
          </div>
        </div>

        {/* Liste des médicaments */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-2">Medications</h2>
         
          <p className="text-sm text-gray-600 mb-4">
            Your current medication list
          </p>
          <ul className="space-y-2">
          {Array.isArray(MedicationList) && MedicationList.length > 0 ? (
            MedicationList?.map((med, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="font-medium">{med.name}</span>
                <span className="text-gray-600">{med.doseNormale}</span>
              </li>
            ))
          ) : (
            <p>Aucun médicament enregistré.</p>
          )}
          </ul>
        </div>
      </main>
    </div>
  );

}