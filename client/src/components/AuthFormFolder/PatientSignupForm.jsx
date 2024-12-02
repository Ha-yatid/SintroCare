// eslint-disable-next-line no-unused-vars
import React,{useState} from 'react';
import { useFormik } from 'formik';
import { patientSignupValidationSchema } from './validation';
import { registerPatient } from '../../services/userService';
import  VerifyAccount  from './VerifyAccount';

const PatientSignupForm = () => {
  const [showVerify, setShowVerify] = useState(false);
  const [email, setEmail] = useState('');
  const accountType = 'patient';

  const formik = useFormik({
    initialValues: {
      FullName : '',
      DateNaissance : '',
      email : '',
      userName : '',
      password : '', 
      TypeDeMaladie : '', 
      Address : '', 
      Ncin : '', 
      DateOperation : '',
  },
    validationSchema: patientSignupValidationSchema,
  });  
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    console.log('Manual Form Submitted', formik.values);
    try {
      const response = await registerPatient(formik.values);
      console.log('Patient registered successfully:', response);
      setEmail(formik.values.email);
      setShowVerify(true);
    } catch (error) {
      console.error('Error registering patient:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Status:', error.response.status);
      }
    }
  };
  return showVerify ? (
    <VerifyAccount email={email} accountType={accountType} />
  ) : (
    <form onSubmit  = {handleManualSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-600">Full Name</label>
        <input
          type="text"
          name= "FullName"
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter your full name"
          onChange={formik.handleChange}
          value={formik.values.FullName}
          autoComplete="FullName"
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
        <label className="block text-gray-600">CIN</label>
        <input
          type="text"
          name="Ncin"
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter CIN"
          onChange={formik.handleChange}
          value={formik.values.Ncin}
        />
        {formik.errors.Ncin && <p>{formik.errors.Ncin}</p>}
      </div>

      <div>
        <label className="block text-gray-600">Address</label>
        <input
          type="text"
          required
          name="Address"
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter Adress"
          onChange={formik.handleChange}
          value={formik.values.Address}
          autoComplete="address-line1"
        />
        {formik.errors.Address && <p>{formik.errors.Address}</p>}
      </div>

      <div>
        <label className="block text-gray-600">TypeDeMaladie</label>
        <input
          type="text"
          required
          name="TypeDeMaladie"
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter your TypeDeMaladie"
          onChange={formik.handleChange}
          value={formik.values.TypeDeMaladie}
          autoComplete="TypeDeMaladie"
        />
        {formik.errors.TypeDeMaladie && <p>{formik.errors.TypeDeMaladie}</p>}
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
     

 

      <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Sign Up
      </button>
    </form>
  );
};

export default PatientSignupForm;
