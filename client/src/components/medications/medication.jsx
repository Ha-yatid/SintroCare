/* eslint-disable react-hooks/rules-of-hooks */
import  { useState, useEffect } from 'react'
import { getMedicationsList,addMedication, updateMedication,deleteMedication, } from '../../services/userService';


export default function medication() {
  
  const [MedicationList, setMedicationList] = useState(null); 
  const [error, setError] = useState(null);
  const [isDoctor, setIsDoctor] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ name: '', description: '', doseNormale: '', PPV: '' });
  const [editMode, setEditMode] = useState(false)

  const userPatient = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        
        if (userPatient?.userData._id) { 
          const response = await getMedicationsList(userPatient.userData._id);
          setMedicationList(response);
          setIsDoctor(userPatient.userData.role === 'doctor');
        } else {
          throw new Error("Utilisateur non identifié");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des médicaments:", err);
        setError(err.message || "Une erreur est survenue");
      } 
    };
    console.log("isdoctor:",isDoctor);
    fetchMedications();
  }, [isDoctor, userPatient]); 


  // Ajout ou mise à jour de médicament
  const handleSave = async () => {
    try {
      if (editMode) {
        await updateMedication(modalData);
        setMedicationList((prev) =>
          prev.map((med) => (med._id === modalData._id ? modalData : med))
        );
      } else {
        const newMedication = await addMedication(modalData);
        setMedicationList((prev) => [...prev, newMedication]);
      }
      setShowModal(false);
      setModalData({ name: '', description: '', doseNormale: '', PPV: '' });
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du médicament:', err);
      setError(err.message || 'Une erreur est survenue');
    }
  };

  // Suppression d’un médicament
  const handleDelete = async (id) => {
    try {
      await deleteMedication(id);
      setMedicationList((prev) => prev.filter((med) => med._id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du médicament:', err);
      setError(err.message || 'Une erreur est survenue');
    }
  };

  // Ouvrir le modal
  const openModal = (medication = null) => {
    setEditMode(!!medication);
    setModalData(medication || { name: '', description: '', doseNormale: '', PPV: '' });
    setShowModal(true);
  };

  // Fermer le modal
  const closeModal = () => {
    setShowModal(false);
    setModalData({ name: '', description: '', doseNormale: '', PPV: '' });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord du patient</h1>

      {/* Affichage des médicaments */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-semibold mb-2">Medications</h2>
            <p className="text-sm text-gray-600 mb-4">
            Votre liste actuelle de médicaments
            </p>
            {isDoctor && (
            <button
                onClick={() => openModal()}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded shadow"
            >
                Ajouter un nouveau médicament
            </button>
            )}
            {error ? ( // Affichage des erreurs
            <p className="text-red-500">Erreur : {error}</p>
            ) : MedicationList?.length > 0 ? ( 
                <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <thead>
                <tr className="bg-gray-100">
                    <th className=" px-4 py-2 text-left font-semibold text-gray-700">Nom</th>
                    <th className=" px-4 py-2 text-left font-semibold text-gray-700">description </th>
                    <th className=" px-4 py-2 text-left font-semibold text-gray-700">Dose </th>
                    <th className=" px-4 py-2 text-left font-semibold text-gray-700">PPV </th>
                    {isDoctor && (
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Actions</th>
                    )}
                </tr>
                </thead>
                <tbody>
                {MedicationList.map((med, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                    <td className=" px-4 py-2">{med.name}</td>
                    <td className=" px-4 py-2">{med.description}</td>
                    <td className=" px-4 py-2">{med.doseNormale}</td>
                    <td className=" px-4 py-2">{med.PPV}</td>
                    {isDoctor && (
                        <td className="px-4 py-2 flex space-x-2">
                        <button
                            onClick={() => openModal(med)}
                            className="px-2 py-1 bg-green-500 text-white rounded shadow"
                        >
                            Modifier
                        </button>
                        <button
                            onClick={() => handleDelete(med._id)}
                            className="px-2 py-1 bg-red-500 text-white rounded shadow"
                        >
                            Supprimer
                        </button>
                        </td>
                    )}
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
            <p>Aucun médicament enregistré.</p>
            )}
        </div>
          {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? 'Modifier le médicament' : 'Ajouter un médicament'}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Nom</label>
                <input
                  type="text"
                  value={modalData.name}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  value={modalData.description}
                  onChange={(e) =>
                    setModalData({ ...modalData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Dose normale</label>
                <input
                  type="text"
                  value={modalData.doseNormale}
                  onChange={(e) =>
                    setModalData({ ...modalData, doseNormale: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">PPV</label>
                <input
                  type="text"
                  value={modalData.PPV}
                  onChange={(e) => setModalData({ ...modalData, PPV: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded shadow mr-2"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded shadow"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
