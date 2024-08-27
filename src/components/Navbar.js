import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const { currentUser, logOut, userType } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav>
      <div className='navbar'>
        <Link className='logo' to="/">
          PG-<span>Pedia</span>
        </Link>
        <button className="menu-toggle" onClick={handleMenuToggle}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
          {currentUser ? (
            <>
              {userType === 'faculty' ? (
                <Link to="/faculty-dashboard">Dashboard</Link>
              ) : (
                <>
                  {/* if currentUser.mentorId is true then show only dashboard if false also show mentor  */}
                  {
                    currentUser.mentorId ? (
                      <Link to="/student-dashboard">Dashboard</Link>
                    ) : (
                      <>
                        <Link to="/student/select-mentor">Mentor</Link>
                        <Link to="/student-dashboard">Dashboard</Link>
                      </>
                    )
                  }
                  {/* <Link to="/student/select-mentor">Mentor</Link>
                  <Link to="/student-dashboard">Dashboard</Link> */}
                </>
              )}
              <button onClick={() => {
                logOut();
                navigate('/');
              }}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
