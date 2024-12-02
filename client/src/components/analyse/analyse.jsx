import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import {postAnalyse,deleteAnalyse, getAnalyseList, updateAnalyse } from '../../services/userService';


const AnalysesList = () => {
  const [analyses, setAnalyses] = useState([]);
  //const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [Error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 

  const [newAnalysis, setNewAnalysis] = useState({
    analysisDate: '',
    tpInrResult: ''
  });
 

  const userPatient = JSON.parse(localStorage.getItem('user'));
  const role = JSON.parse(localStorage.getItem('role'));

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        if (userPatient?.userData._id) {
            //console.log("patient analyse ",userPatient?.userData._id)
            const response = await getAnalyseList(userPatient?.userData._id);
            setAnalyses(response);
            //console.log("response analyse", response);            
        } else {
            setError("Aucun utilisateur trouvé");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des analyses :", error);
      }
    };

    fetchAnalyses();
  }, [userPatient?.userData._id]);

  const handleAddAnalysis = async () => {
    try {
      if (!newAnalysis.analysisDate || !newAnalysis.tpInrResult ) {
        alert('Veuillez remplir tous les champs');
        return;
      }
     const analysisToSend = {
        ...newAnalysis,
        tpInrResult: parseFloat(newAnalysis.tpInrResult), // Conversion en nombre
        PatientId: userPatient?.userData._id, // Ajout de l'ID du patient
     };

      console.log("Payload envoyé :", analysisToSend);

      const response = await postAnalyse(analysisToSend);
      setAnalyses([response, ...analyses]);
      setShowModal(false);
      resetModal();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'analyse:', error);
    }
  };



 

  const handleUpdateAnalysis =async () => {
    // console.log("Update analysis:", newAnalysis._id);
    try{
      const { _id, analysisDate, tpInrResult} = newAnalysis;
      const payload = { analysisDate, tpInrResult};

      const updatedAnalyse = await updateAnalyse(_id,payload);
      // console.log("updatedAnalyse", updatedAnalyse);
      setAnalyses((prevAnalyses) =>
        prevAnalyses.map((analysis) =>
          analysis._id === updatedAnalyse._id ? updatedAnalyse : analysis
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de modifier  l\'analyse:', error);
    }
  };

  const handleUpdateClick = (id) => {
    // console.log('id analyse click 1', id)
    const analysisToUpdate = analyses.find(analysis => analysis._id === id);
    setModalMode('update');
    setNewAnalysis({
      _id: analysisToUpdate._id,
      analysisDate: analysisToUpdate.analysisDate,
      tpInrResult: analysisToUpdate.tpInrResult,
      IdAnalyse:analysisToUpdate._id,
      NbreJrAnalyseProchaine: analysisToUpdate.NbreJrAnalyseProchaine || ''
    });
    setShowModal(true);
  };

  
  const handleDelete = async(id) => {
    try {
      console.log("Delete analysis:", id);
      await deleteAnalyse(id);  // Assuming deleteAnalyse is async
      // Optionally refresh the list after deletion
      setAnalyses(analyses.filter((analysis) => analysis._id !== id));
    } catch (error) {
      console.error('Erreur lors de suppression d\'analyse:', error);
    }
  };

  const resetModal = () => {
    setNewAnalysis({
      analysisDate: '',
      tpInrResult: '',
      dosageRecomand: '',
      NbreJrAnalyseProchaine: '',
    });
    setModalMode('add'); 
  };
  
  return (
    <div className="container mx-auto p-6 space-y-8 bg-blue-50">
      <h2 className="text-3xl font-bold text-blue-800">Liste des Analyses</h2>

      <button
        onClick={() => setShowModal(true)}
        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
      >
        Ajouter une analyse
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Ajouter une analyse</h3>
              {modalMode === 'add' ? 'Ajouter une Analyse' : 'Mettre à jour l\'Analyse'}
              <div className="mt-2 px-7 py-3">
                <input
                  type="date"
                  value={newAnalysis.analysisDate}
                  onChange={(e) => setNewAnalysis({ ...newAnalysis, analysisDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                />
                <input
                  type="number"
                  value={newAnalysis.tpInrResult}
                  onChange={(e) => setNewAnalysis({ ...newAnalysis, tpInrResult: e.target.value })}
                  placeholder="Résultat INR"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                />
                {modalMode === 'update' && role === 'doctor' && (
                  <>
                    <input
                      type="number"
                      value={newAnalysis.NbreJrAnalyseProchaine}
                      onChange={(e) => setNewAnalysis({ ...newAnalysis, NbreJrAnalyseProchaine: e.target.value })}
                      placeholder="Nombre de jours avant prochaine analyse"
                      className="w-full p-2 mb-3 border rounded"
                    />
                  </>
                )}
              </div>
              <div className="items-center px-4 py-3">
              <button
                onClick={modalMode === 'add' ? handleAddAnalysis : () => handleUpdateAnalysis()}
                className="bg-teal-500 text-white p-2 w-full rounded"
              >
                {modalMode === 'add' ? 'Ajouter' : 'Mettre à jour'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetModal();
                }}
                className="bg-gray-500 text-white p-2 w-full rounded mt-2"
              >
                    Fermer
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-teal-400 text-white">
            <tr>
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
                key={analysis._id}
                //onClick={() => handleRowClick(analysis)}
                className={`cursor-pointer transition-colors hover:bg-blue-50 `}
              >
               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {new Date(analysis.analysisDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {analysis.tpInrResult}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {analysis.NbreJrAnalyseProchaine}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(analysis.nextAnalysisDateRecomander).toLocaleDateString()}
                </td>
                <td>
                  <button
                     onClick={() => handleUpdateClick(analysis._id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <PencilIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleDelete(analysis._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </td>
              </tr>  
            ))}
        </tbody>
      </table>
      </div>

      
    </div>
  );
};

export default AnalysesList;
