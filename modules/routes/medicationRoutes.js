const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const {
  createMedication,
  getAllMedications,
  getMedicationById,
  getMedicationByIdPatient,
  updateMedication,
  getMedicationByIdPatientNameMedication,
  deleteMedication
} = require('../controllers/medicationController');
const authMiddleware = require('../middleware/authMiddleware');
const { authenticateToken } = require('../middleware/authMiddleware');


const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const medicationValidationRules = [
  check('name').notEmpty().withMessage('Medication name is required'),
  check('description').notEmpty().withMessage('Medication description is required'),
  check('doseNormale').notEmpty().withMessage('Medication Dose is required'),
  //<check('sideEffects').notEmpty().withMessage('Medication sideEffects are required'),
  check('PPV').notEmpty().withMessage('Medication price is required'),
  check('PPV').isNumeric().withMessage('Medication price must be a number'),
];

// Routes for medications
//router.route('/Doctor').post(doctorValidationRules, validate, registerDoctor);
//router.route('/').post(authenticateToken, medicationValidationRules, validate, createMedication);
router.route('/').post(medicationValidationRules, validate, createMedication);
router.route('/').get(getAllMedications);

router.route('/:id')
  .get(authenticateToken, getMedicationById)
  //.put(authenticateToken,  validate, updateMedication)
  .put(validate, updateMedication)
  .delete(deleteMedication);
router.route('/patientID/:id').get(getMedicationByIdPatient);
router.route('/patientID/:id/:name').get(getMedicationByIdPatientNameMedication);


module.exports = router;
