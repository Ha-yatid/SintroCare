import * as Yup from 'yup';

// Schéma de validation pour le login
export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

// Schéma de validation pour le Signup Docteur
export const doctorSignupValidationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  speciality: Yup.string().required('Speciality is required'),
  nameCabinet: Yup.string().required('Name of Cabinet is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

// Schéma de validation pour le Signup Patient
export const patientSignupValidationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  dateOfBirth: Yup.date().required('Date of Birth is required'),
  cin:Yup.string().required('Numero de carte national required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});


export const patientUpdateValidationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  dateOfBirth: Yup.date().required('Date of Birth is required'),
  cin: Yup.string().required('Numero de carte national required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});