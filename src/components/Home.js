import React from "react";
import "../styles/home.css";
import img from "../assets/health-check.png";
import easy from "../assets/easy.png";
import free from "../assets/free.png";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import img1 from "../assets/home img.jpeg";
import secure from "../assets/secure.png";

const Home = () => {
  const { currentUser, use } = useAuth();
  console.log(currentUser);
  return (
    <>
      <div className="hero">
        <div className="content">
          <h1>
            Welcome to <span>PG-Pedia</span>
          </h1>
          <p>A PG dissertation management system</p>
          <p>
            PG-Pedia is a platform that helps students and faculties manage
            their postgraduate dissertations with ease.
          </p>
          <p>Get started by creating an account today.</p>

          <Link to={"/login"} className="btn">
            Get Started
          </Link>
        </div>
        <div className="images">
          <img src={img1} alt="" />
        </div>
      </div>

      <div className="whychooseus">
        <h2>Why Choose Us?</h2>
        <div className="content">
          <div className="box">
            <img src={easy} alt="easy" />
            <h3>Easy to Use</h3>
            <p>
              Our platform is easy to use and provides a seamless experience for
              all users.
            </p>
          </div>
          <div className="box">
            <img src={secure} alt="secure" />
            <h3>Secure</h3>
            <p>
              We take security seriously and ensure that your data is safe with
              us.
            </p>
          </div>
          <div className="box">
            <img src={free} alt="free" />
            <h3>Free to Use</h3>
            <p>
              Our platform is free to use and does not require any subscription
              fees.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
