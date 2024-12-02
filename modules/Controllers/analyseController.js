const mongoose = require('mongoose');
const Analyses = require('../models/Analyse');
const {GetPatientsByIDdoctor} = require('./userController') 
const axios = require('axios');


const addAnalysisByPatient = async (req, res) => {
  try {
      // const PatientId = req.user._id;
      // //const PatientId = "671e7db33f3811b0c5861c0d";
      // console.log("PatientId in addAnalysisByPatient:", PatientId);

      const { analysisDate, tpInrResult,PatientId } = req.body;

      const newAnalysis = new Analyses({
          PatientId,
          analysisDate,
          tpInrResult,
      });

      const savedAnalysis = await newAnalysis.save();
      res.status(201).json(savedAnalysis);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

const createanalyse = async(req, res) => { 
    try {
        const { PatientId, analysisDate, tpInrResult} = req.body;
        const newAnalyse = new Analyses({ 
            PatientId, 
            analysisDate, 
            tpInrResult,
        });
        
        const savedAnalyse = await newAnalyse.save();
        res.status(201).json(savedAnalyse);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }

};

const getAllanalyses = async(req, res) => { 
    try {
        const analyses = await Analyses.find();
        res.status(200).json(analyses);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }

};

const getanalyseById = async(req, res) => { 
    try {
        const analyse = await Analyses.findById(req.params.id);
        if (!analyse) {
          return res.status(404).json({ message: 'analyse not found' });
        }
        res.status(200).json(analyse);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

const updateAnalysisByDoctor = async (req, res) => {
  try {
      const { PatientId, analysisDate, AnalyseId, nextAnalysisDateRecomander, NbreJrAnalyseProchaine } = req.body;
      //console.log("idclientanalyse  ", PatientId,AnalyseId ,analysisDate)

      const searchCriteria = { PatientId };
      if (analysisDate) {
        searchCriteria.analysisDate = analysisDate;
      } else if (AnalysisId) {
        searchCriteria._id = analysisId;
      }

      const analysis = await Analyses.findOne(searchCriteria);
      //console.log(analysis)
      if (!analysis) {
          return res.status(404).json({ message: 'Analyse introuvable' });
      }

      analysis.nextAnalysisDateRecomander = nextAnalysisDateRecomander;
      analysis.NbreJrAnalyseProchaine = NbreJrAnalyseProchaine;

      const updatedAnalysis = await analysis.save();
      res.status(200).json(updatedAnalysis);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

// Update a medication by ID
const updateAnalyseByDoctorById = async (req, res) => {
  try {
    const updatedAnalyse = await Analyses.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    //console.log('analyseupdate : ',updatedAnalyse)
    if (!updatedAnalyse) {
      return res.status(404).json({ message: 'Analyse not found' });
    }

    res.status(200).json(updatedAnalyse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getanalyseByIdPatient = async (req, res) => { 
  try {
      const patientId = req.params.idPatient;
      //console.log("patientid analyse ",patientId);
      const analyse = await Analyses.find({ PatientId: patientId })
          //.sort({ analysisDate: -1 }) 
          //.limit(1); 

      if (!analyse || analyse.length === 0) {
        return res.status(404).json({ message: 'No analysis found for this patient' });
      }
      res.status(200).json(analyse);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const getLastanalyseByIdPatient = async (req, res) => {
  try {
      const patientId = req.params.idPatient;
      if (!patientId) {
          return res.status(400).json({ message: 'Patient ID is required' });
      }

      const latestAnalysis = await Analyses.findOne({ PatientId: patientId })
          .sort({ analysisDate: -1 });
      if (!latestAnalysis) {
        return res.status(200).json({ 
          message: 'No analysis found for this patient', 
          data: null 
        });
          //return res.status(404).json({ message: 'No analysis found for this patient' });
      }
      res.status(200).json(latestAnalysis);
  } catch (error) {
      console.error("Erreur dans le backend :", error);
      res.status(500).json({ message: 'Erreur interne', error: error.message });
  }
};

const getPatientsWithLastAnalyse = async (req, res) => {
  try {
      
      const doctorId = req.params.idPatient;
      //console.log("doctor id patlist:",doctorId);

      const response = await axios.get(`http://localhost:3000/api/users/Doctor/GetPatient/${doctorId}`);
      //console.log("response pat",response.data);
      if (response.count === 0) {
          return res.status(404).json({ message: 'Aucun patient trouvé pour ce médecin' });
      }

      const patients = response.data.patients;
      //console.log("patientlisr ",patients)

      const results = await Promise.all(
          patients.map(async (patient) => {
            //console.log("Patient Inex", patient._id)
              try {
                  // const lastAnalysis = await  getLastanalyseByIdPatient(patient._id);
                  const lastAnalysis = await axios.get(`http://localhost:3000/api/analyses/patientIDLast/${patient._id}`)
                  //console.log("last analyse", lastAnalysis.data)
                  return {
                      patient,
                      lastAnalysis: lastAnalysis.data || null,
                  };
              } catch (error) {
                  console.error(`Erreur pour le patient ${patient._id}:`, error);
                  return { patient, lastAnalysis: null };
              }
          })
      );
      //console.log("result",results)
      // Étape 3: Retourner les résultats combinés
      res.status(200).json(results);
  } catch (error) {
      console.error('Erreur lors de la récupération des patients et analyses:', error);
      res.status(500).json({ message: 'Erreur interne', error: error.message });
  }
};



const updateAnalysisByPatient = async(req, res) => { 
    try {
        const updatedAnalyse = await Analyses.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true, runValidators: true }
        );
    
        if (!updatedAnalyse) {
          return res.status(404).json({ message: 'Analyse not found' });
        }
    
        res.status(200).json(updatedAnalyse);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
};

const deleteanalyse = async(req, res) => { 
    try {
        const analyse = await Analyses.findByIdAndDelete(req.params.id);
    
        if (!analyse) {
          return res.status(404).json({ message: 'Analyse not found' });
        }
    
        res.status(200).json({ message: 'Analyse deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

module.exports = {
    addAnalysisByPatient,
    createanalyse,
    getAllanalyses,
    getanalyseById,
    getanalyseByIdPatient,
    getLastanalyseByIdPatient,
    updateAnalysisByDoctor,
    updateAnalysisByPatient,
    updateAnalyseByDoctorById,
    deleteanalyse,
    getPatientsWithLastAnalyse
  };
