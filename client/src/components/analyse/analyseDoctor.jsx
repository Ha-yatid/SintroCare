import { useState, useEffect } from 'react';
import { PencilIcon,PlusIcon } from "@heroicons/react/24/solid";
import {getLastAnalysePatients,updateAnalyseByDoctor ,getSintromByIDpatient, AddDosageSintromByDoctor  } from '../../services/userService';


const AnalysesListDoctor = () => {
  const [analyses, setAnalyses] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [cycleInputs, setCycleInputs] = useState([]);
  //const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  //const [cycleInputs, setCycleInputs] = useState([]);
  //const [selectedPatient, setSelectedPatient] = useState('');

  // eslint-disable-next-line no-unused-vars
  const [error,seterror] = useState(null)


 

  const userDoctor = JSON.parse(localStorage.getItem('user'));
  const fetchAnalyses = async () => {
    try {
      if (userDoctor?.userData._id) {
          //console.log("patient analyse ",userDoctor?.userData._id)
          const response = await getLastAnalysePatients(userDoctor?.userData._id);
          setAnalyses(response);
          //console.log("response analyse", response);            
      } else {
          seterror("Aucun utilisateur trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des analyses :", error);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  });

  const handleEditClick = (analysis) => {
    setSelectedAnalysis(analysis);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit =async () => {
    const analyseID = selectedAnalysis.lastAnalysis._id;
    const nbreJour = selectedAnalysis.lastAnalysis.NbreJrAnalyseProchaine;
    try {
        const response = await updateAnalyseByDoctor (analyseID, nbreJour);
        console.log("Modifications enregistrées pour l'analyse ID:", analyseID, "avec NbreJrAnalyseProchaine:", nbreJour);
        console.log("reponse update analyse: ", response)
      
        setIsEditModalOpen(false);
        await fetchAnalyses();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des modifications :", error);
    }

    console.log("Modifications enregistrées", selectedAnalysis);
    setIsEditModalOpen(false);
  };
  const handleAddClick = (analysis) => {
    setSelectedAnalysis(analysis);
    setCycleInputs([])
    setIsAddModalOpen(true);
  };
  const handleCycleChange = (e) => {
    const cycleCount = parseInt(e.target.value, 10);
    const inputs = Array.from({ length: cycleCount }, () => ({ dosage: '' }));
    setCycleInputs(inputs);
  };

  const handleDosageChange = (index, value) => {
    const updatedInputs = [...cycleInputs];
    updatedInputs[index].dosage = value;
    setCycleInputs(updatedInputs);
    
  };

  const handleAddDosage = async() => {
    try {
      const medicationname = "sintrom"
      const userId = selectedAnalysis.patient._id; 

      const medication = await getSintromByIDpatient(userId,medicationname);

      const medicationId  = medication[0]._id

      const analysisId = selectedAnalysis?.lastAnalysis?._id; 
      
      const cycleDose = cycleInputs.map((input) => input.dosage); 
  
      const requestData = {
        medicationId,
        userId,
        cycleDose,
        analysisId,
      };
      //console.log('request sent for dosage ,',requestData)
  
      // eslint-disable-next-line no-unused-vars
      const response = await  AddDosageSintromByDoctor(requestData);
      //console.log("Dosage ajouté :", response);
  
      setIsAddModalOpen(false);
      await fetchAnalyses(); 
    } catch (error) {
      console.error("Erreur lors de l'ajout du dosage :", error);
    }
  
  };

  
  return (
    <div className="container mx-auto p-6 space-y-8 bg-white  rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-graybold-800">Liste des Analyses des patients</h2>    

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-cyan-100 text-gray">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type de maladie</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Résultat INR</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nbre du jour</th>
              
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Next Analyse</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {analyses.map((analysis) => (
              <tr
                key={analysis.lastAnalysis._id}
                //onClick={() => handleRowClick(analysis)}
                className={`cursor-pointer transition-colors hover:bg-blue-50 `}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {analysis.patient.FullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {analysis.patient.TypeDeMaladie}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {new Date(analysis.lastAnalysis.analysisDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {analysis.lastAnalysis.tpInrResult}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {analysis.lastAnalysis.NbreJrAnalyseProchaine}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(analysis.lastAnalysis.nextAnalysisDateRecomander).toLocaleDateString()}
                </td>
               <td className='item-left w-lg padding-2'>
               <button
                    className="text-teal-300  hover:text-blue-700"
                    onClick={() => handleEditClick(analysis)}
                  >
                    <PencilIcon className="w-6 h-6" />
                  </button>
                  <button
                    className="text-teal-700  hover:text-red-700"
                    onClick={() => handleAddClick(analysis)}
                  >
                    <PlusIcon className="w-6 h-6" />
                  </button>
                  
               </td>
              </tr>  
            ))}
        </tbody>
      </table>
      </div>


      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Modifier lanalyse</h3>
            <p><strong>Nom :</strong> {selectedAnalysis.patient.FullName}</p>
            <p><strong>Date :</strong> {new Date(selectedAnalysis.lastAnalysis.analysisDate).toLocaleDateString()}</p>
            <p><strong>Résultat INR :</strong> {selectedAnalysis.lastAnalysis.tpInrResult}</p>
            <div>
              <label>Nbre du jour :</label>
              <input
                type="number"
                className="border border-gray-300 p-2 w-full rounded-lg"
                value={selectedAnalysis.lastAnalysis.NbreJrAnalyseProchaine}
                onChange={(e) =>
                  setSelectedAnalysis({
                    ...selectedAnalysis,
                    lastAnalysis: { ...selectedAnalysis.lastAnalysis, NbreJrAnalyseProchaine: e.target.value },
                  })
                }
              />
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              onClick={handleSaveEdit}
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}
        {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Ajouter un cycle de dosage</h3>
            <div>
              <label>Nombre de jours dans le cycle :</label>
              <input
                type="number"
                className="border border-gray-300 p-2 w-full rounded-lg"
                onChange={handleCycleChange}
              />
            </div>
            {cycleInputs.map((input, index) => (
              <div key={index} className="mt-2">
                <label>Jour {input.day} :</label>
                <input
                  type="Number"
                  className="border border-gray-300 p-2 w-full rounded-lg"
                  value={input.dosage}
                  onChange={(e) => handleDosageChange(index, e.target.value)}
                />
              </div>
            ))}
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
              onClick={handleAddDosage}
            >
              Ajouter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysesListDoctor;
