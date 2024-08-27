import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { collection, getDocs, } from "firebase/firestore";
import "../styles/mentees.css";

const Mentees = () => {
  const { currentUser } = useAuth();
  const [mentees, setMentees] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.mentees) {
      fetchMenteesData(currentUser.mentees);
    }
  }, [currentUser]);

  const fetchMenteesData = async (menteesArray) => {
    try {
      const menteesData = [];
      const studentsRef = collection(db, "students");
      const menteesSnapshot = await getDocs(studentsRef);

      menteesSnapshot.forEach((doc) => {
        if (menteesArray.includes(doc.id)) {
          menteesData.push({ id: doc.id, ...doc.data() });
        }
      });

      setMentees(menteesData);
    } catch (error) {
      console.error("Error fetching mentees data:", error);
    }
  };

  return (
    <div className="menteesPage">
      <h1>Mentees</h1>
      {mentees.length > 0 ? (
        <ul className="menteesList">
          {mentees.map((mentee) => (
            <li key={mentee.id} className="mentee">
              <h2>{mentee.name}</h2>
              <p>Email: {mentee.email}</p>
              <p>Submitted:  {mentee?.submitted?.length
                ? mentee.submitted.length
                : 0}
              </p>
              <p>Pending:
                {mentee?.pending?.length ? mentee.pending.length : 0} </p>
              <p>Rejected: {mentee?.rejected?.length
                ? mentee.rejected.length
                : 0}
              </p>


            </li>
          ))}
        </ul>
      ) : (
        <p>No mentees found.</p>
      )}
    </div>
  );
};

export default Mentees;
