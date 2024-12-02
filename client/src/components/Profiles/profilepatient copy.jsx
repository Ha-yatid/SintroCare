import  { useState, useEffect } from "react";
import { getUserById, updatePatientbyId, deleteUserById  } from "../../services/userService";
import { patientUpdateValidationSchema } from "../AuthFormFolder/validation";
//import * as Yup from "yup";

const ProfilePatient = () => {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const userPatient = JSON.parse(localStorage.getItem('user'));
    if(userPatient?.userData._id){
        const patientID = userPatient?.userData._id;

        const fetchProfile = async () => {
        try {
            const data = await getUserById(patientID,"patient"); 
            setProfile(data);
            setUpdatedProfile(data);
        } catch (error) {
            console.error("Erreur lors de la récupération du profil :", error);
        }
        };
        fetchProfile();
    } else {
        setErrors("Aucun utilisateur trouvé");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = async () => {
    try {
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
      const isValid = await validateInputs(); // Valider les entrées
      if (!isValid) return;

      try {
        await updatePatientbyId, deleteUserById (updatedProfile); // Mise à jour via API
        setProfile(updatedProfile);
        setIsEditing(false);
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil :", error);
      }
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile Patient</h1>
      <div className="profile-details">
        <div>
          <label>Nom : </label>
          {isEditing ? (
            <input
              type="text"
              name="fullName"
              value={updatedProfile.fullName || ""}
              onChange={handleChange}
            />
          ) : (
            <span>{profile.fullName}</span>
          )}
          {errors.fullName && <p className="error">{errors.fullName}</p>}
        </div>
        <div>
          <label>Date de naissance : </label>
          {isEditing ? (
            <input
              type="date"
              name="dateOfBirth"
              value={updatedProfile.dateOfBirth || ""}
              onChange={handleChange}
            />
          ) : (
            <span>{profile.dateOfBirth}</span>
          )}
          {errors.dateOfBirth && <p className="error">{errors.dateOfBirth}</p>}
        </div>
        <div>
          <label>CIN : </label>
          {isEditing ? (
            <input
              type="text"
              name="cin"
              value={updatedProfile.cin || ""}
              onChange={handleChange}
            />
          ) : (
            <span>{profile.cin}</span>
          )}
          {errors.cin && <p className="error">{errors.cin}</p>}
        </div>
        <div>
          <label>Email : </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={updatedProfile.email || ""}
              onChange={handleChange}
            />
          ) : (
            <span>{profile.email}</span>
          )}
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <label>Password : </label>
          {isEditing ? (
            <input
              type="password"
              name="password"
              value={updatedProfile.password || ""}
              onChange={handleChange}
            />
          ) : (
            <span>{profile.password}</span>
          )}
          {errors.password && <p className="error">{errors.email}</p>}
        </div>
      </div>
      <div className="profile-actions">
        <button onClick={handleUpdateClick}>
          {isEditing ? "Enregistrer" : "Modifier"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePatient;
