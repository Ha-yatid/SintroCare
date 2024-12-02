const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const {
    createanalyse,
    addAnalysisByPatient,
    getAllanalyses,
    getanalyseById,
    getanalyseByIdPatient,
    getLastanalyseByIdPatient,
    updateAnalysisByDoctor,
    updateAnalysisByPatient,
    updateAnalyseByDoctorById,
    deleteanalyse,
    getPatientsWithLastAnalyse ,
} = require('../controllers/analyseController');

//const Islogged = require('../middleware/authMiddleware');
const {verifyRole, authenticateToken } = require('../middleware/authMiddleware');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
};
  
const AnalyseValidationRules = [
    //check('PatientId').notEmpty().withMessage('Patient is required'),
    check('analysisDate').isDate().withMessage('Analyse Date must be a valide date'),
    check('tpInrResult').notEmpty().withMessage('Analyse sideEffects is required'),
];


router.route('/')
    .post(/*authenticateToken, verifyRole('patient'),*/AnalyseValidationRules, validate,addAnalysisByPatient )
    .put (authenticateToken, verifyRole('doctor'),AnalyseValidationRules,updateAnalysisByDoctor)
    .get(authenticateToken, getAllanalyses); // Get all analyses

// Get a specific analyse by ID
router.route('/:id')
    .get(authenticateToken, getanalyseById)
    .put(AnalyseValidationRules,updateAnalysisByPatient) 
    .delete(deleteanalyse)
router.route('/patientID/:idPatient').get(getanalyseByIdPatient)
router.route('/patientIDLast/:idPatient').get(getLastanalyseByIdPatient)
router.route('/patientIDLastAnalyseList/:idPatient').get(getPatientsWithLastAnalyse )
router.route('/byDoctor/:id').put(updateAnalyseByDoctorById)
module.exports = router;




  