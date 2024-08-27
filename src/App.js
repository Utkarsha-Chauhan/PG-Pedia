import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { AuthProvider, useAuth } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import './styles/theme.css'
import Footer from './components/Footer';
import FacultiesDashboard from './components/FacultiesDashboard';
import StudentsDashboard from './components/StudentsDashboard';
import SubmitDissertation from './components/SubmitDissertation';
import Mentees from './components/Mentees';
import SelectMentor from './components/SelectMentor';
import ViewDessertation from './components/ViewDessertation';
import SelectTopic from './components/SelectTopic';
import ViewTopics from './components/ViewTopics';
// import TeacherDashboard from './components/TeacherDashboard';



const App = () => {

  const currentUser = useAuth();

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* public screen */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* private screen */}
          <Route path="/student-dashboard"
            element={
              <ProtectedRoute element={<StudentsDashboard />} />
            }
          />
          <Route path="/faculty-dashboard"
            element={
              <ProtectedRoute element={<FacultiesDashboard />} />
            }
          />

          <Route path='/student/submit-dissertation'
            element={
              <ProtectedRoute element={<SubmitDissertation />} />
            }
          />
          <Route path='/faculty/mentees'
            element={
              <ProtectedRoute element={<Mentees />} />
            }
          />
          <Route path='/student/select-mentor'
            element={
              <ProtectedRoute element={<SelectMentor />} />
            }
          />
          <Route path='/faculty/view-dissertation'
            element={
              <ProtectedRoute element={<ViewDessertation />} />
            }
          />
          <Route path='/student/select-topic'
            element={
              <ProtectedRoute element={<SelectTopic />} />
            }
          />
          <Route path='/faculty/view-topics'
            element={
              <ProtectedRoute element={<ViewTopics />} />
            }
          />



        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;
