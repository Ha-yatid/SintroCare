const mongoose = require('mongoose');
const Medications = require('../models/Medication');

// Create a new medication
const createMedication = async (req, res) => {
  try {
    const { name, description, sideEffects, PPV,PatientId,doseNormale } = req.body;
    const newMedication = new Medications({ 
      name, 
      description, 
      sideEffects, 
      PPV ,
      doseNormale,
      PatientId,
    });
    
    const savedMedication = await newMedication.save();
    res.status(201).json(savedMedication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all medications
const getAllMedications = async (req, res) => {
  try {
    const medications = await Medications.find();
    res.status(200).json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a medication by ID
const getMedicationById = async (req, res) => {
  try {
    const medication = await Medications.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.status(200).json(medication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMedicationByIdPatient = async (req, res) =>{
  try {
    const IDpatient = req.params.id;
    //console.log("patientid analyse ",IDpatient);
    const medications = await Medications.find({PatientId: IDpatient});
    
    if (!medications) {
      return res.status(200).json({ message: "Aucun médicament trouvé pour ce patient." });
    }else if(medications.length === 0){
      return res.status(200).json({ message: "Aucun médicament error ." });
    }
    res.status(200).json(medications);
  } catch (error) {
    console.error("Erreur lors de la récupération des médicaments :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des médicaments." });
  }
};
const getMedicationByIdPatientNameMedication = async(req, res) => {
  try{
    const patientID = req.params.id;
    const MedicationName = req.params.name;

    const medications = await Medications.find({PatientId: patientID,name:MedicationName}).select('_id');
    if(!medications){
      return res.status(404).json({ message: "Aucun médicament avec ce nom  trouvé pour ce patient." });
    }
    
    res.status(200).json(medications);
    
  }catch(error){
    console.error("Erreur lors de la récupération  médicament :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération de médicament." });
  }
};

 

// Update a medication by ID
const updateMedication = async (req, res) => {
  try {
    const updatedMedication = await Medications.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMedication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.status(200).json(updatedMedication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete a medication by ID
const deleteMedication = async (req, res) => {
  try {
    const medication = await Medications.findByIdAndDelete(req.params.id);

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.status(200).json({ message: 'Medication deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMedication,
  getAllMedications,
  getMedicationById,
  getMedicationByIdPatient,
  updateMedication,
  getMedicationByIdPatientNameMedication,
  deleteMedication
};
