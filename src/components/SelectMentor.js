import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/selectMentor.css";

const SelectMentor = () => {
  const [faculties, setFaculties] = useState([]);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFaculties = async () => {
      const querySnapshot = await getDocs(collection(db, "faculties"));
      const facultiesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFaculties(facultiesList);
    };
    fetchFaculties();
  }, []);

  const handleSelectMentor = async (mentorId) => {
    try {
      // Update the student's document with the selected mentor
      await updateDoc(doc(db, "students", currentUser.uid), {
        mentorId: mentorId,
      });

      // Update the mentor's document with the new mentee
      await updateDoc(doc(db, "faculties", mentorId), {
        mentees: arrayUnion(currentUser.uid),
      });

      navigate("/student-dashboard");
    } catch (error) {
      setError("Failed to select mentor. Please try again.");
      console.error("Error selecting mentor: ", error);
    }
  };

  return (
    <div className="selectMentor">
      <h1>Select Your Mentor</h1>
      {error && <p className="error">{error}</p>}
      <ul>
        {faculties.map((faculty) => (
          <li key={faculty.id}>
            <div>
              <p>{faculty.name}</p>
              <p>{faculty.email}</p>
            </div>
            <button onClick={() => handleSelectMentor(faculty.id)}>
              Select as Mentor
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectMentor;
