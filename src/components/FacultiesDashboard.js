import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import "../styles/facultyDashboard.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const FacultyDashboard = () => {
  const { currentUser } = useAuth();
  
  const [dissertations, setDissertations] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchDissertations = async () => {
      try {
        const dissertationsRef = collection(db, "dissertations");
        const q = query(dissertationsRef, where("userId", "in", currentUser.mentees));
        const snapshot = await getDocs(q);
        const data = [];
        for (const doc of snapshot.docs) {
          const dissertationData = doc.data();
          data.push({ id: doc.id,  ...dissertationData });
        }
        setDissertations(data);
      } catch (error) {
        console.error("Error fetching dissertations:", error);
      }
    };

    const fetchTopics = async () => {
      try {
        const topicsRef = collection(db, "studentTopics");
        const q = query(topicsRef, where("userId", "in", currentUser.mentees));
        const snapshot = await getDocs(q);
        const data = [];
        for (const doc of snapshot.docs) {
          const topicData = doc.data();
          data.push({ id: doc.id,  ...topicData });
        }
        setTopics(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    if (currentUser) {
      fetchDissertations();
      fetchTopics();
    }
  }, [currentUser]);

  if (!currentUser) {
    return <p>Loading...</p>; // or handle the case where currentUser is null
  }

  return (
    <div className="facultyDashboard">
      <div className="userDetails">
        <h1>Dashboard

        <button onClick={() => window.location.reload()}>Reload</button>
        </h1>
        <p>
          {/* welcome message to faculty */}
          🌟Welcome,<span>{currentUser.name}!</span> to <span>PG-Pedia</span>
          🌟
          <br />
        </p>
        {/* reload button */}
      </div>

      <div className="numberMenteesAndRequestsPending">
        <div className="menteesBox">
          <h2>Mentees List</h2>
          <p>{currentUser.mentees?.length}</p>
          <Link
            to={"/faculty/mentees"}
          >
            View Mentees
          </Link>
        </div>
        <div className="requestsPending">
          <h2>See Your Mentees Dessertations</h2>
          <p>{dissertations.length}</p>
          <Link
            to={"/faculty/view-dissertation"}
          >
            View Dissertations
          </Link>
        </div>
        <div className="topicsPending">
          <h2>See Pending Topics of Mentees</h2>
          {/* <p>{topics.length}</p> */}
          {/* length of topics whose status === pending */}
          <p>{topics.filter(topic => topic.status === "pending").length}</p>
          <Link
            to={"/faculty/view-topics"}
          >
            View Topics
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
