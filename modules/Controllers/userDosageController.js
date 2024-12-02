const mongoose = require('mongoose');
const Dosages = require('../models/UserDosageEntry');

const { createScheduleFromDosageEntry } = require('./scheduleController');

// Create a new Dosage
const createDosage = async (req, res) => {
  try {
    const { medicationId, userId, cycleDose, analysisId } = req.body;
    const dosageEntry = new Dosages({
      medicationId,
      userId,
      cycleDose,
      analysisId: analysisId || null 
    });
    
    const savedDosage = await dosageEntry.save();

    console.log('id oage saved ', savedDosage._id)
    const dosageEntryId = savedDosage._id.toString();
    console.log('id oage saved ', dosageEntryId)  
   // const sheduleSaved = await createScheduleFromDosageEntry({ body: { "dosageEntryId": dosageEntryId} });

    res.status(201).json(savedDosage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all Dosages
const getAllDosages = async (req, res) => {
  try {
    const DosagesEntry = await Dosages.find();
    res.status(200).json(DosagesEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a Dosage by ID
const getDosageById = async (req, res) => {
  try {
    const DosagesEntry  = await Dosages.findById(req.params.id);
    if (!DosagesEntry ) {
      return res.status(404).json({ message: 'Dosage not found' });
    }
    res.status(200).json(DosagesEntry );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Dosage by ID
const updateDosage = async (req, res) => {
  try {
    const updatedDosage = await Dosages.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    if (!updatedDosage) {
      return res.status(404).json({ message: 'Dosage not found' });
    }

    res.status(200).json(updatedDosage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a Dosage by ID
const deleteDosage = async (req, res) => {
  try {
    const DosagesEntry  = await Dosages.findByIdAndDelete(req.params.id);

    if (!DosagesEntry ) {
      return res.status(404).json({ message: 'Dosage not found' });
    }

    res.status(200).json({ message: 'Dosage deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
    createDosage,
    getAllDosages,
    getDosageById,
    updateDosage,
    deleteDosage,
  };
  