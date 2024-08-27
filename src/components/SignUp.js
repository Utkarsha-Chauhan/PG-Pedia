import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/signup.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState(''); // Default to 'student'
  const [department, setDepartment] = useState(''); // Default department
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Set loading state to true when sign-up process starts
      await signUp(email, password, name, userType, department);
      // Navigate to the dashboard after successful sign up
      if (userType === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/faculty-dashboard');
      }
    } catch (error) {
      setError('Failed to sign up. Please try again.');
      console.error("Failed to sign up", error);
    } finally {
      setLoading(false); // Set loading state to false after sign-up process completes
    }
  };

  return (
    <div className='signup'>
      <div className="content">
        <h1>Welcome to <span>PG-Pedia</span></h1>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <select 
            value={userType} 
            onChange={(e) => setUserType(e.target.value)} 
            required
          >
            <option value="">Select User Type</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
          {userType === 'student' && (
            <select 
              value={department} 
              onChange={(e) => setDepartment(e.target.value)} 
              required
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electric Engineering">Electric Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Chemical Engineering">Chemical Engineering</option>
              <option value="Biomedical Engineering">Biomedical Engineering</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Economics">Economics</option>
              <option value="Psychology">Psychology</option>
              <option value="Sociology">Sociology</option>
              <option value="Political Science">Political Science</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Environment Science">Environment Science</option>
            </select>
          )}
          <input 
            type="text" 
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
