// src/routes/userRoutes.js
const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const {
  registerDoctor,
  registerPatient,
  loginPatient,
  loginDoctor,
  getUsers,
  getUserById,
  deleteUser,
  getUserByEmail,
  updateDoctor,
  updatePatient,
  GetPatientsByIDdoctor,
} = require('../controllers/userController');


const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const patientValidationRules = [
  check('FullName').notEmpty().withMessage('FullName is required'),
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('DateNaissance').isDate().withMessage('Please enter a valid date'),
  check('userName').notEmpty().withMessage('UserName is required'),
  check('TypeDeMaladie').notEmpty().withMessage('TypeDeMaladie is required')
];
const doctorValidationRules = [
  check('FullName').notEmpty().withMessage('FullName is required'),
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('DateNaissance').isDate().withMessage('Please enter a valid date'),
  check('userName').notEmpty().withMessage('UserName is required'),
  check('Speciality').notEmpty().withMessage('Speciality is required')
];

const loginValidationRules = [
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('password').notEmpty().withMessage('Password is required')
];


//get all users function for fetching both types of users based on the role query parameter.
router.route('/GetUsers').get(getUsers);  // /GetUsers?role=doctor /GetUsers?role=patient
router.route('/GetUserByID/:id').get(getUserById);  // /GetUserByID/13230239092?role=doctor
router.route('/GetUserByEmail/:email').get(getUserByEmail);  // /GetUserByID/email?role=doctor
router.route('/User').get(getUserByEmail); // /User?email=test@gmail.com&role=doctor
router.route('/deleteUser/:id').delete(deleteUser) // /deleteUser/293929392?role=patient

//Doctor routes
router.route('/Doctor').post(doctorValidationRules, validate, registerDoctor);
router.route('/DoctorLogin').post(loginValidationRules, validate, loginDoctor);
router.route('/Doctor/:id').put(doctorValidationRules, validate,updateDoctor);
router.route('/DoctorPatient/:id').put(validate, updatePatient);
router.route('/Doctor/GetPatient/:id').get(GetPatientsByIDdoctor);

//Patient routes
router.route('/Patient').post(patientValidationRules, validate, registerPatient);
router.route('/PatientLogin').post(loginValidationRules, validate, loginPatient);
router.route('/Patient/:id').put(patientValidationRules, validate,updatePatient)


module.exports = router;
