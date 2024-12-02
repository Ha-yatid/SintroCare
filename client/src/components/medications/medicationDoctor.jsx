import { useState, useEffect } from 'react';
import {
  getMedicationsList,
  addMedication,
  updateMedication,
  deleteMedication,
  getListPatient,
} from '../../services/userService';

export default function Medications() {
  const [medicationList, setMedicationList] = useState(null);
  const [patientsList, setPatientsList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null); // Patient sélectionné
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    name: '',
    description: '',
    doseNormale: '',
    PPV: '',
    PatientId : selectedPatient,
  });
  const [editMode, setEditMode] = useState(false);

  const userDoctor = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        if (userDoctor?.userData._id) {
          const response = await getListPatient(userDoctor.userData._id);
          setPatientsList(response.patients);
        } else {
          throw new Error("Docteur non identifié");
         
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des patients:', err);
        setError(err.message || 'Une erreur est survenue');
        
      }
    };

    fetchPatients();
  }, [userDoctor]);

  useEffect(() => {
    const fetchMedications = async () => {
      if (selectedPatient) {
        try {
          const response = await getMedicationsList(selectedPatient);
          setMedicationList(response);
        } catch (err) {
          console.error('Erreur lors de la récupération des médicaments:', err);
          setError(err.message || 'Une erreur est survenue');
        }
      }
    };

    fetchMedications();
  }, [selectedPatient]);

  const handleSave = async () => {
    try {
      if (!selectedPatient) throw new Error('Aucun patient sélectionné');

      if (editMode) {
        console.log("mediaction doctor", modalData)
        const data = modalData;
        await updateMedication(data._id,data);
        setMedicationList((prev) =>
          prev.map((med) => (med._id === modalData._id ? modalData : med))
        );
      } else {
       
        const data = { ...modalData, PatientId: selectedPatient };
        //console.log('add mezddf', data)
        const newMedication = await addMedication(data);
        setMedicationList((prev) => [...prev, newMedication]);
      }
      setShowModal(false);
      setModalData({ name: '', description: '', doseNormale: '', PPV: '' });
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du médicament:', err);
      setError(err.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMedication(id);
      setMedicationList((prev) => prev.filter((med) => med._id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du médicament:', err);
      setError(err.message || 'Une erreur est survenue');
    }
  };
  const handleAdd = async() =>{
    setEditMode(false); // Mode ajout
    setModalData({ name: '', description: '', doseNormale: '', PPV: '' });
    setShowModal(true);

  };

 
  const openModal = (medication = null) => {
    if (medication) {
      setEditMode(true);
      setModalData(medication); 
    } else {
      setEditMode(false); // Mode ajout
      setModalData({ name: '', description: '', doseNormale: '', PPV: '' });
    }
    setShowModal(true); // Afficher le modal
  };
  

  const closeModal = () => {
    setShowModal(false);
    setModalData({ name: '', description: '', doseNormale: '', PPV: '' });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord du docteur</h1>

      {/* Liste déroulante pour sélectionner le patient */}
      <div className="mb-4">
        <label className="block text-gray-700">Sélectionner un patient :</label>
        <select
          value={selectedPatient || ''}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="" disabled>
            -- Choisir un patient --
          </option>
          {patientsList.map((patient) => (
            <option key={patient._id} value={patient._id}>
              {patient.FullName}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des médicaments */}
      {selectedPatient && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-2">Médicaments pour le patient sélectionné</h2>
          <button
            onClick={handleAdd}
            className="px-2 py-1 bg-emerald-600 text-white rounded shadow"
          >
            Ajouter
          </button>
          {error ? (
            <p className="text-red-500">Erreur : {error}</p>
          ) : medicationList?.length > 0 ? (
            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Nom</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Dose</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">PPV</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicationList.map((med, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{med.name}</td>
                    <td className="px-4 py-2">{med.description}</td>
                    <td className="px-4 py-2">{med.doseNormale}</td>
                    <td className="px-4 py-2">{med.PPV}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Aucun médicament enregistré pour ce patient.</p>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? 'Modifier le médicament' : 'Ajouter un médicament'}
            </h2>
            <form>
              {/* Champs pour le formulaire */}
              {['name', 'description', 'doseNormale', 'PPV'].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block text-gray-700">{field}</label>
                  <input
                    type="text"
                    value={modalData[field]}
                    onChange={(e) => setModalData({ ...modalData, [field]: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
              ))}
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
