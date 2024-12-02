/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthFormFolder/AuthForm';

import PatienthomeDashbord from './components/Dashboard/DashbordHomePatient';
import PatientDashboard from './components/Dashboard/PatientDashboard';
import Analyse from './components/analyse/analyse'
import ProfilePatient from './components/Profiles/profilepatient';
import Shedule from './components/calendar/shedule';
import Medication from './components/medications/medication';

import DoctorhomeDashboard from './components/Dashboard/DashbordHomeDoctor';
import DoctorDashboard from './components/Dashboard/DoctorDashboard';
import AnalyseDoctor from './components/analyse/analyseDoctor';
import MedicationDoctor from './components/medications/medicationDoctor';
import ListPatient from './components/Patient/patientList';
import ProfileDoctor from './components/Profiles/profiledoctor';





import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/context';


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute role="patient">
                {/*< PatientDashboard />*/}
                < PatienthomeDashbord />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<PatientDashboard />} />
            <Route path="profile" element={<ProfilePatient />} />
            <Route path="analyse" element={<Analyse />} />
            <Route path="medications" element={<Medication />} />
            <Route path="shedule" element={<Shedule />} />

            {/* <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="settings" element={<SettingsPage />} />*/}
          </Route>  

          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute role="doctor">
                <DoctorhomeDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="homeDoctor" />} />
            <Route path="homeDoctor" element={<DoctorDashboard />} />
            <Route path="analyseDoctor" element={<AnalyseDoctor />} />
            <Route path="medicationsDoctor" element={<MedicationDoctor />} />
            <Route path="listPatient" element={<ListPatient />} />
            {/*<Route path="profileDoctor" element={<ProfileDoctor />}/> */}
          </Route>  
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

