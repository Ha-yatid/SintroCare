const UserPatient = require('../models/UserPatient');
const UserDoctor = require('../models/UserDoctor');
const authToken = require('./authController');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

//Create Patient
const registerPatient = async (req, res) => {
  const { FullName, email, password,userName,DateNaissance,Ncin,Address, TypeDeMaladie } = req.body;
  const emailPVerificationCode = Math.random().toString(36).substring(2, 15);

  try {
    const existingPatient = await UserPatient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = new UserPatient({
      FullName:FullName,
      email:email,
      password: hashedPassword,
      emailVerificationCode: emailPVerificationCode,
      TypeDeMaladie: TypeDeMaladie,
      Address: Address,
      Ncin: Ncin,
      DateNaissance: DateNaissance,
      userName: userName,
    });

    const savedPatient = await newPatient.save();
    authToken.sendVerificationEmail(newPatient, emailPVerificationCode);

    res.status(201).json(savedPatient);
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


//create Doctor
const registerDoctor = async (req, res) => {
  const { FullName, email, NameCabinet, AddressCabinet, Speciality, userName, password, DateNaissance } = req.body;
  const emailVerificationCode = Math.random().toString(36).substring(2, 15);

  try {
    const existingDoctor = await UserDoctor.findOne({ email }); // Consistent use of UsersDocteur
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    //const nextId = await UserDoctor.countDocuments() + 1;

    const newDoctor = new UserDoctor({
      FullName,
      email,
      password: hashedPassword,
      Speciality,
      AddressCabinet,
      NameCabinet,
      userName,
      DateNaissance,
      emailVerificationCode: emailVerificationCode,
    });
    //console.error(UserDoctor.countDocuments(),nextId);
    const savedDoctor = await newDoctor.save();

    authToken.sendVerificationEmail(newDoctor, emailVerificationCode);

    res.status(201).json(savedDoctor);


  } catch (error) {
    console.error('Error registering doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login for Patient
const loginPatient = async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await UserPatient.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, patient.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const accessToken = authToken.generateAccessToken({ _id: patient._id, role: 'patient' });
    const refreshToken = authToken.generateRefreshToken({ _id: patient._id, role: 'patient' });

    res.cookie('accessToken', accessToken, { httpOnly: true, secure:process.env.NODE_ENV === 'production'});
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure:process.env.NODE_ENV === 'production'});
    
    authToken.sendLoginNotification(patient);

    //res.status(200).json({ patient });
    // console.log("login id   ", patient._id);
    // console.log("login id pylpo  ", patient._id.toString());

    const token = jwt.sign({ id: patient._id.toString(), role: 'patient' }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    // console.log("Generated Token lpogin:", token)

    res.status(200).json({ token, patient });

  } catch (error) {
    // console.error('Error logging in patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login for Doctor
const loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await UserDoctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }


    const accessToken = authToken.generateAccessToken({ _id: doctor._id, role: 'doctor' });
    const refreshToken = authToken.generateRefreshToken({ _id: doctor._id, role: 'doctor' });

    res.cookie('accessToken', accessToken,{ httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    authToken.sendLoginNotification(doctor);

    const token = jwt.sign({ id: doctor._id, role: 'doctor' }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, doctor });
  } catch (error) {
    console.error('Error logging in doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get All Users (Patients or Doctors)
const getUsers = async (req, res) => {
  const { role } = req.query; // Query parameter to specify whether to fetch patients or doctors

  try {
    let users;
    if (role === 'doctor') {
      users = await UserDoctor.find(); // Fetch all doctors
    } else if (role === 'patient') {
      users = await UserPatient.find().select('FullName age DateNaissance TypeDeMaladie  DoctorID');; // Fetch all patients
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get User by ID (Doctor or Patient)
const getUserById = async (req, res) => {
  const { id } = req.params;
  const { role } = req.query; // Query parameter to specify patient or doctor

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ message: 'Invalid user ID format' });
  }

  try {
    let user;
    if (role === 'doctor') {
      user = await UserDoctor.findById(id); // Fetch doctor by ID
    } else if (role === 'patient') {
      user = await UserPatient.findById(id); // Fetch patient by ID
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get User By Email
const getUserByEmail = async (req, res) => {
  const { email } = req.query; // Get email from query parameter
  const { role } = req.query; // Get role from query parameter

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    let user;
    if (role === 'doctor') {
      user = await UserDoctor.findOne({ email }); 
    } else if (role === 'patient') {
      user = await UserPatient.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Patient Information
const updatePatient = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ message: 'Invalid user ID format' });
  }

  try {
    const updatedPatient = await UserPatient.findByIdAndUpdate(
      id,
      { $set: req.body }, 
      { new: true, runValidators: true }
    );

    if (!updatedPatient) return res.status(404).json({ message: 'Patient not found' });

    res.json(updatedPatient);
  } catch (err) {
    console.error('Error updating patient:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Doctor Information
const updateDoctor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ message: 'Invalid user ID format' });
  }

  try {
    const updatedDoctor = await UserDoctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) return res.status(404).json({ message: 'Doctor not found' });

    res.json(updatedDoctor);
  } catch (err) {
    console.error('Error updating doctor:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Delete User (Doctor or Patient)
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { role } = req.query; // Query parameter to specify patient or doctor

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ message: 'Invalid user ID format' });
  }

  try {
    let user;
    if (role === 'doctor') {
      user = await UserDoctor.findById(id);
    } else if (role === 'patient') {
      user = await UserPatient.findById(id);
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.remove();
    res.json({ message: 'User removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const GetPatientsByIDdoctor = async (req, res) => {
  try {
      const  doctorId  = req.params.id;
      //console.log("doctor id ",doctorId)
      
      if (!doctorId) {
          return res.status(400).json({ message: 'doctorId est requis' });
      }
    
      const patients = await UserPatient.find( {DoctorID: doctorId} ).select('FullName age DateNaissance TypeDeMaladie');
 
      //console.log("patient : " ,patients)
      const count = patients.length;

      // Vérifier si des patients ont été trouvés
      if (count === 0) {
          return res.status(404).json({ message: 'Aucun patient trouvé pour ce médecin' });
      }

      // Répondre avec la liste des patients et leur nombre
      res.status(200).json({
          count,
          patients 
      });
  } catch (error) {
      res.status(500).json({ message: 'Erreur interne', error });
  }
};






module.exports = {
  registerDoctor,
  registerPatient,
  loginPatient,
  loginDoctor,
  getUsers,
  getUserById,
  getUserByEmail,
  updateDoctor,
  updatePatient,
  deleteUser,
  GetPatientsByIDdoctor,
};