// src/services/userService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Fonction pour enregistrer un patient
export const registerPatient = async (patientData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/Patient`, patientData);
    console.log("registerPatient function called with values:", patientData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Fonction pour enregistrer un docteur
export const registerDoctor = async (doctorData) => {
  console.log("registerDoctor function called with values:", doctorData);
  try {
    const response = await axios.post(`${API_BASE_URL}/users/Doctor`, doctorData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

//Fonction pour verifier account registred 
export const verifyCode = async(email, code,accountType) =>{
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-email`, email,code,accountType);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }

};

// Fonction de login patient
export const loginPatient = async (loginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/PatientLogin`, loginData);
    return response.data;
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    throw error.response ? error.response.data : error;
  }
};

// Fonction de login docteur
export const loginDoctor = async (loginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/DoctorLogin`, loginData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

//get All users in bd 
export const getUsers = async (role) => {

  try {
    console.log("roel",role)
    const response = await axios.get(`${API_BASE_URL}/users/GetUsers?role=${role}`);
    console.log('responserefecrefr',response.data)
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

//getPatient by ID
export const getUserById =  async(userID,role) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/GetUserByID/${userID}?role=${role}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
 
};
//delete user by id and role
export const deleteUserById =  async(userID,role) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/deleteUser/${userID}?role=${role}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
 
};

//Update Patient by idpatient
export const updatePatientbyId =  async(patientID ,patientData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/Patient/${patientID}`,patientData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
 
};
//Update Patient by idpatient
export const linkDoctorWithPatient =  async(patientID ,patientData) => {
  try {
    console.log("dataupdhjfjezfj,", patientID,patientData)
    const response = await axios.put(`${API_BASE_URL}/users/DoctorPatient/${patientID}`,patientData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
 
};





//getDosage Du jour
export const getDAYDosages = async (daySearch,patientID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Shedules/${daySearch}/${patientID}`);

    return response.data|| null;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // Pas de données disponibles
    }
  
    throw error.response ? error.response.data : error;
  }
};

// get la derniere analyse
export const getLastAnalyse = async (patientID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analyses/patientIDLast/${patientID}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};



//Get List of analyse by patient
export const getAnalyseList= async (patientID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Analyses/patientID/${patientID}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

//add New analyse
export const postAnalyse= async (NewAnalyse) => {
  try {
    console.log("newaddSECE", NewAnalyse)
    const response = await axios.post(`${API_BASE_URL}/analyses/`,NewAnalyse);
    console.log('NewAnalyse ',response.data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

//Update Analyse  by patient
export const updateAnalyse = async (ID,data) => {
  try {
    // console.log("id analyse update", ID)
    const response = await axios.put(`${API_BASE_URL}/analyses/${ID}`,data);
    // console.log('UpdateAnalyse ',response.data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

//Delete analyse 
export const deleteAnalyse= async (IDAnalyse) => {
  try {
    
    const response = await axios.delete(`${API_BASE_URL}/analyses/${IDAnalyse}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

//get medication list of pâtient
export const getMedicationsList = async (id) => {
  try {
    
    const response = await axios.get(`${API_BASE_URL}/medications/patientID/${id}`);
    return response.data || null;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // Pas de données disponibles
    }
  
    throw error.response ? error.response.data : error;
  }
};


//add medication
export const addMedication = async (datamedication) => {
  try {
    console.log("datasave add", datamedication)
    const response = await axios.post(`${API_BASE_URL}/medications/`,datamedication);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


//update medication
export const updateMedication = async (idmedication,data) => {
  try {
    console.log("data medication",data);
    const response = await axios.put(`${API_BASE_URL}/medications/${idmedication}`,data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

//delete  medication
export const deleteMedication = async (idmedication) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/medications/${idmedication}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};



//get list patient by idDoctor
export const getListPatient = async(IDdoctor) =>{
  try {
    const response = await axios.get(`${API_BASE_URL}/users/Doctor/GetPatient/${IDdoctor}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;    
  }
};

//get last analyse for all patient of doctor connected 
export const getLastAnalysePatients = async(IDdoctor) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analyses/patientIDLastAnalyseList/${IDdoctor}`);
    console.log('res',response)
    return response.data|| null;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
  
    throw error.response ? error.response.data : error;    
  }
};

//Update Analyse  by patient
export const updateAnalyseByDoctor = async (ID,data) => {
  try {
    const datatosent = { NbreJrAnalyseProchaine: data };
    const response = await axios.put(`${API_BASE_URL}/analyses/byDoctor/${ID}`,datatosent);
    // console.log('UpdateAnalyse ',response.data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}
export const getSintromByIDpatient = async(id,nameMed) => {
  try{
    const response = await axios.get(`${API_BASE_URL}/medications/patientID/${id}/${nameMed}`);
    return response.data;
  }catch(error){
    throw error.response ? error.response.data : error;
  }
}

export const AddDosageSintromByDoctor = async (data) => {
  try {
    
    const response = await axios.post(`${API_BASE_URL}/DosageEntry/`,data);
    console.log('UpdateAnalyse ',response.data);
    const idDosage = response.data._id;
    console.log('UpdateAnDosage ID ',idDosage);
    const dataShedule = {dosageEntryId:idDosage};
    const responseShedule = await axios.post(`${API_BASE_URL}/Shedules/create`,dataShedule);
    
    return responseShedule.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}