const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const {
  createDosage,
  getAllDosages,
  getDosageById,
  updateDosage,
  deleteDosage,
} = require('../controllers/userDosageController');

const {verifyRole, authenticateToken } = require('../middleware/authMiddleware');


const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
};
  
const DosageValidationRules = [
    check('cycleDose').notEmpty().withMessage('Dosage List  is required')
];

// Create a new dosage (only doctors can create)
router.route('/')
    // .post(authenticateToken,verifyRole('doctor'),DosageValidationRules, validate, createDosage)
    .post(DosageValidationRules, validate, createDosage)
    // .get(authenticateToken, getAllDosages); // Get all Dosages
    .get(getAllDosages); // Get all Dosages

// Get a specific Dosage by ID
router.route('/:id')
    .get(authenticateToken, getDosageById)
    .put(authenticateToken,verifyRole('doctor'),DosageValidationRules,updateDosage) // Update a Dosage (only the doctor who created it can update)
    .delete(authenticateToken,verifyRole('doctor'), deleteDosage);

module.exports = router;
