// eslint-disable-next-line no-unused-vars
import React,{useState} from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { loginValidationSchema } from './validation';
import { loginDoctor, loginPatient } from '../../services/userService';
import { useUser } from '../../context/context';


// eslint-disable-next-line react/prop-types
const LoginForm = ({ accountType }) => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [err, setError] = useState('');
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        let response;
        if (accountType === 'patient') {
          response = await loginPatient(values); 
          
          console.log('Login response:', response.patient);
          if (response && response.patient) {
            const { token, patient} = response;
            const userData = patient;
            console.log('Token:', token);
            console.log('User data:', userData);
          
            //const idPatient = patient._id;
            //console.log('Patient ID:', idPatient)
            if (userData) {
              const userWithRole = { userData, role: 'patient' };
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(userWithRole));
            
              setUser(userData);
              console.log(accountType)
              navigate('/patient-dashboard');
            } 
          } else {
              
              setError('Invalid login response');
          }

        
        } else if (accountType === 'doctor') {
          response = await loginDoctor(values); 
          
          console.log('Login response:', response.doctor);
          if (response && response.doctor) {
            const { token, doctor} = response;
            const userData = doctor;
            console.log('Token:', token);
            console.log('User data:', userData);
        
            if (userData) {
              const userWithRole = { userData, role: 'doctor' };
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(userWithRole));
            
              setUser(userData);
              console.log(accountType)
              navigate('/doctor-dashboard');
            } 
          } else {
              
              setError('Invalid login response');
          }
       
        }
       
         
      } catch (err) {
        console.error('Login error:', err); 
      
        if (err.response && err.response.data) {
          console.error('API error details:', err.response.data);
          setError(err.response.data.message || 'Login failed');
        } else if (err.request) {
          console.error('No response received:', err.request);
          setError('Network error. Please check your connection.');
        } else {
          console.error('Unexpected error:', err.message);
          setError('Unexpected error occurred. Please try again.');
        }
      } 
    },
  });

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div>
      
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-600">Email</label>
        <input
          type="email"
          required
          name='email'
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder={`Enter your email as a ${accountType}`}
          onChange={formik.handleChange}
          value={formik.values.email}
          autoComplete="email"
        />
        {formik.errors.email && <p>{formik.errors.email}</p>}
      </div>
      
      <div>
        <label className="block text-gray-600">Password</label>
        <input
          type="password"
          name='password'
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter your password"
          onChange={formik.handleChange}
          value={formik.values.password}
          autoComplete="password"
        />
        {formik.errors.password && <p>{formik.errors.password}</p>}
        <div className="text-right mt-1">
          <a href="#" className="text-sm text-blue-500 hover:underline">Forgot?</a>
        </div>
      </div>

      {err && <p className="text-red-500">{err}</p>}

      <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Login
      </button>
      <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2 mt-4 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600"
          >
            <img src="/google-icon.png" alt="Google icon" className="w-5 h-5 mr-2" /> {/* Adjust path to Google icon */}
            Login with Google
          </button>
    </form>
   </div>
  );
};

export default LoginForm;
