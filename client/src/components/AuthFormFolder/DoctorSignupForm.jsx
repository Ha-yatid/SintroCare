/* eslint-disable no-unused-vars */
 
import React,{ useState } from 'react';
import { useFormik } from 'formik';
import { doctorSignupValidationSchema } from './validation';
import { registerDoctor } from '../../services/userService';
import  VerifyAccount  from './VerifyAccount';


const DoctorSignupForm = () => {
  const [showVerify, setShowVerify] = useState(false);
  const [email, setEmail] = useState('');
  const accountType = 'doctor';

  const formik = useFormik({
    initialValues: {
      FullName: '',
      DateNaissance: '',
      email: '',
      userName:'',
      password: '',
      Speciality: '',
      NameCabinet: '',
      AddressCabinet:'',
  },
    validationSchema: doctorSignupValidationSchema,
    /*onSubmit: async (values) => {
      console.log('Doctor Form Submitted', values);
      try {
        const response = await registerDoctor(values);
        console.log('Doctor registered successfully:', response);
      } catch (error) {
        console.error('Error registering doctor:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Status:', error.response.status);
      }
      }
    },*/
  });
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    console.log('Manual Form Submitted', formik.values);
    try {
      const response = await registerDoctor(formik.values);
      console.log('Doctor registered successfully:', response);
      setEmail(formik.values.email);
      setShowVerify(true);
    } catch (error) {
      console.error('Error registering doctor:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Status:', error.response.status);
      }
    }
  };


  return showVerify ? (
    <VerifyAccount email={email} accountType={accountType} />
  ) : (
    <form onSubmit={handleManualSubmit}
    /*{(e) => { 
      console.log("Submit button clicked");
      formik.handleSubmit(e);
       }*/ 
      className="space-y-4">
      <div>
        <label className="block text-gray-600">Full Name</label>
        <input
          type="text"
          required
          name="FullName"
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter your full name"
          onChange={formik.handleChange}
          value={formik.values.FullName}
          autoComplete="name"
        />
         {formik.errors.FullName && <p>{formik.errors.FullName}</p>}
      </div>

      <div>
        <label className="block text-gray-600">Birth Day</label>
        <input
          type="date"
          name="DateNaissance"
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter your BirthDay"
          onChange={formik.handleChange}
          value={formik.values.DateNaissance}
          autoComplete="Bday"
        />
         {formik.errors.DateNaissance && <p>{formik.errors.DateNaissance}</p>}
      </div>
      <div>
        <label className="block text-gray-600">User Name</label>
        <input
          type="text"
          required
          name="userName"
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter your user name"
          onChange={formik.handleChange}
          value={formik.values.userName}
          autoComplete="userName"
        />
         {formik.errors.userName && <p>{formik.errors.userName}</p>}
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          className="w-full p-2 border border-gray-300 rounded-lg"
          onChange={formik.handleChange}
          value={formik.values.email}
          autoComplete="email"
        />
        {formik.errors.email && <p>{formik.errors.email}</p>}
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          className="w-full p-2 border border-gray-300 rounded-lg"
          onChange={formik.handleChange}
          value={formik.values.password}
          autoComplete="current-password"
        />
        {formik.errors.password && <p>{formik.errors.password}</p>}
      </div>

      <div>
        <label className="block text-gray-600">Name of Cabinet</label>
        <input
          type="text"
          required
          name="NameCabinet"
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter your Cabinet Name"
          onChange={formik.handleChange}
          value={formik.values.NameCabinet}
          autoComplete="organization"
        />
        {formik.errors.NameCabinet && <p>{formik.errors.NameCabinet}</p>}
      </div>

      <div>
        <label className="block text-gray-600">Speciality</label>
        <input
          type="text"
          required
          name="Speciality"
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter your speciality"
          onChange={formik.handleChange}
          value={formik.values.Speciality}
          autoComplete="off"
        />
        {formik.errors.Speciality && <p>{formik.errors.Speciality}</p>}
      </div>

      <div>
        <label className="block text-gray-600">Address</label>
        <input
          type="text"
          required
          name="AddressCabinet"
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter Adress cabinet"
          onChange={formik.handleChange}
          value={formik.values.AddressCabinet}
          autoComplete="address-line1"
        />
        {formik.errors.AddressCabinet && <p>{formik.errors.AddressCabinet}</p>}
      </div>


      <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Sign Up
      </button>
    </form>
  );
};

export default DoctorSignupForm;
