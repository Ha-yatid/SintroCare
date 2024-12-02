import  { useState, useEffect } from "react";
import { getUserById, updatePatientbyId, deleteUserById  } from "../../services/userService";
import { patientUpdateValidationSchema } from "../AuthFormFolder/validation";
import { format } from 'date-fns';
//import * as Yup from "yup";


const ProfilePatient = () => {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [errors, setErrors] = useState({});

  const [patientID, setPatientID] = useState(null);

  useEffect(() => {
    const userPatient = JSON.parse(localStorage.getItem("user"));
    if (userPatient?.userData?._id) {
      setPatientID(userPatient.userData._id); 
      console.log('patient set',patientID);
    } else {
      setErrors("Aucun utilisateur trouvé");
    }
  }, [patientID]); 

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            console.log('getpatient', patientID)
            const data = await getUserById(patientID,"patient"); 
            setProfile(data);
            setUpdatedProfile(data);
        } catch (error) {
            console.error("Erreur lors de la récupération du profil :", error);
        }
        };
        fetchProfile();
    
  }, [patientID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };
  

  const validateInputs = async () => {
    try {
      console.log('updateprofile   ', updatedProfile)  ;
      await patientUpdateValidationSchema.validate(updatedProfile, {
        abortEarly: false,
      });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const formattedErrors = {};
      validationErrors.inner.forEach((err) => {
        formattedErrors[err.path] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleUpdateClick = async () => {
    if (isEditing) {
        const isValid = await validateInputs();
        if (!isValid) return;
    
        try {
          console.log('Updating profile:', updatedProfile);
          await updatePatientbyId(patientID, updatedProfile);
          console.log('Profile updated successfully:', patientID);
          
          // Update local state with new profile data
          setProfile(updatedProfile);
    
          // Exit edit mode
          setIsEditing(false);
    
        } catch (error) {
          console.error("Erreur lors de la mise à jour du profil :", error);
        }
      } else {
        setIsEditing(true);
      }
  };
  const handleDeleteClick = async () => {
    try {
      await deleteUserById(profile._id);
      console.log("Profil supprimé !");
      // Ajouter une redirection ou un autre traitement ici
    } catch (error) {
      console.error("Erreur lors de la suppression du profil :", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile Patient</h1>
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
      {Object.keys(errors).length > 0 && (
        <div className="text-red-500 text-sm mb-4">
          {Object.values(errors).map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      <div className="mb-4">
        <label className="block text-gray-700">Full Name :</label>
        {isEditing ? (
          <input
            type="text"
            name="FullName"
            value={updatedProfile.FullName || ""}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2 mt-1"
          />
        ) : (
          <p className="text-gray-800">{profile.FullName}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Date de naissance :</label>
        {isEditing ? (
          <input
            type="date"
            name="DateNaissance"
            value={updatedProfile.DateNaissance || ""}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2 mt-1"
          />
        ) : (
          <p className="text-gray-800">{profile.DateNaissance?format(new Date(profile.DateNaissance), 'yyyy/MM/dd'): "Date non disponible"}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">CIN :</label>
        {isEditing ? (
          <input
            type="text"
            name="Ncin"
            value={updatedProfile.Ncin || ""}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2 mt-1"
          />
        ) : (
          <p className="text-gray-800">{profile.Ncin}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email :</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={updatedProfile.email || ""}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2 mt-1"
          />
        ) : (
          <p className="text-gray-800">{profile.email}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">User Name :</label>
        {isEditing ? (
          <input
            type="text"
            name="username"
            value={updatedProfile.username || ""}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2 mt-1"
          />
        ) : (
          <p className="text-gray-800">{profile.username}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Password :</label>
        {isEditing ? (
          <input
            type="password"
            name="password"
            value={updatedProfile.password || ""}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2 mt-1"
          />
        ) : (
          <p type="password" className="text-gray-800">{profile.password}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Type Maladie :</label>
        {isEditing ? (
          <input
            type="text"
            name="TypeDeMaladie"
            value={updatedProfile.TypeDeMaladie || ""}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2 mt-1"
          />
        ) : (
          <p className="text-gray-800">{profile.TypeDeMaladie}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Date Operation :</label>
        {isEditing ? (
          <input
            type="date"
            name="DateOpertion"
            value={updatedProfile.DateOpertion?format(new Date(updatedProfile.DateOpertion), 'yyyy-MM-dd'): ""}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2 mt-1"
          />
        ) : (
          <p className="text-gray-800">{profile.DateOpertion?format(new Date(profile.DateOpertion), 'yyyy-MM-dd'): "Date non disponible"}</p>
        )}
      </div>
      <div className="flex justify-between mt-6">
        <button
          onClick={handleUpdateClick}
          className={`px-4 py-2 rounded-lg text-white ${
            isEditing ? "bg-green-500" : "bg-blue-500"
          }`}
        >
          {isEditing ? "Enregistrer" : "Modifier"}
        </button>
        <button
          onClick={handleDeleteClick}
          className="px-4 py-2 rounded-lg bg-red-500 text-white"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
  );
};

export default ProfilePatient;
