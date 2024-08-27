import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import "../styles/viewDessertation.css";

const ViewDessertation = () => {
  const { currentUser } = useAuth();
  const [dissertations, setDissertations] = useState([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDissertations = async () => {
      try {
        const dissertationsRef = collection(db, "dissertations");
        const q = query(dissertationsRef, where("userId", "in", currentUser.mentees));
        const snapshot = await getDocs(q);
        const data = [];
        for (const doc of snapshot.docs) {
          const dissertationData = doc.data();
          const userData = await getUserData(dissertationData.userId);
          data.push({ id: doc.id, studentName: userData.name, ...dissertationData });
        }
        setDissertations(data);
      } catch (error) {
        console.error("Error fetching dissertations:", error);
      }
    };

    if (currentUser) {
      fetchDissertations();
    }
  }, [currentUser]);

  const getUserData = async (userId) => {
    try {
      const userRef = doc(db, "students", userId); // Assuming students collection for now
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data();
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const handleAccept = async (dissertationId, studentUid) => {
    setLoading(true);
    try {
      const userRef = doc(db, "students", studentUid); // Assuming students collection for now
      await updateDoc(userRef, {
        pending: arrayRemove(dissertationId),
        submitted: arrayUnion(dissertationId)
      });
      // Optional: You can also update the status of the dissertation to "Accepted" in the dissertations collection
      const dissertationRef = doc(db, "dissertations", dissertationId);
      await updateDoc(dissertationRef, {
        status: "Accepted"
      });
      
    } catch (error) {
      console.error("Error accepting dissertation:", error);
    }
    setLoading(false);
  };

  const handleReject = async (dissertationId, studentUid) => {
    if (!rejectionReason) {
      alert("Please provide a rejection reason");
      return;
    }
    setLoading(true);
    try {
      const userRef = doc(db, "students", studentUid); // Assuming students collection for now
      await updateDoc(userRef, {
        pending: arrayRemove(dissertationId),
        rejected: arrayUnion(dissertationId)
      });
      // Optional: You can also update the status of the dissertation to "Rejected" and save the rejection reason in the dissertations collection
      const dissertationRef = doc(db, "dissertations", dissertationId);
      await updateDoc(dissertationRef, {
        status: "Rejected",
        rejectionReason
      });
      setRejectionReason("");
      
    } catch (error) {
      console.error("Error rejecting dissertation:", error);
    }
    setLoading(false);
  };

  if
  (!currentUser) {
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
        Loading...
      </p>
    );
  }

  if(loading){
    // 3 sec rload
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
        Loading...
      </p>
    );
  }

  return (
    <div className="viewDissertation">
      <h1>View Dissertation</h1>
      {dissertations?.length > 0 ? (
        <ul>
          {dissertations.map((dissertation) => (
            <li key={dissertation.userId}>
              <div>

              <p>Student Name: {dissertation.studentName}</p>
              <p>Title: {dissertation.title}</p>
              <p>Submitted on: {dissertation.submittedOn}</p>
              <p>Status: {dissertation.status}</p>
              <p>Description: {dissertation.description}</p>
              </div>

              <div className="right">

              {dissertation.status === "Pending" && (
                <>
                  <button
                    disabled={loading}
                    onClick={() => handleAccept(dissertation.id, dissertation.userId)}
                  >
                  Accept
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => handleReject(dissertation.id, dissertation.userId)}
                  >
                  Reject
                  </button>
                  <input
                    type="text"
                    placeholder="Rejection reason"
                    // value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    />
                </>
              )}

              {/* <br /> */}
              {dissertation.fileURL && (
                <a href={dissertation
                  .fileURL} target="_blank" rel="noreferrer">
                  View submission
                </a>
              )}

              {dissertation.status === "Rejected" && (
                <p>Rejection Reason: {dissertation.rejectionReason}</p>
              )}
              
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No dissertations found.</p>
      )}
    </div>
  );
};

export default ViewDessertation;
