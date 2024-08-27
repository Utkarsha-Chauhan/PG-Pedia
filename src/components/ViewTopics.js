import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import "../styles/viewTopics.css";

const ViewTopics = () => {
  const { currentUser } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsRef = collection(db, "studentTopics");
        const q = query(topicsRef, where("userId", "in", currentUser.mentees));
        const snapshot = await getDocs(q);
        const data = [];
        for (const doc of snapshot.docs) {
          const topicData = doc.data();
          const userData = await getUserData(topicData.userId);
          data.push({ id: doc.id, studentName: userData.name, ...topicData });
        }
        setTopics(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    if (currentUser) {
      fetchTopics();
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

  if (!currentUser) {
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
        Loading...
      </p>
    );
  }

  if (loading) {
    // Handle loading state
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
        Loading...
      </p>
    );
  }

  const rejectTopic = async (topicId,studentId) => {
    setLoading(true);
    try {
      const userRef = doc(db, "students", studentId);
      await updateDoc(userRef, {
        pendingTopic: arrayRemove(topicId),
        rejectedTopic: arrayUnion(topicId),
      });

      // Optional: You can also update the status of the topic to "Rejected" in the studentTopics collection
      const topicRef = doc(db, "studentTopics", topicId);
      await updateDoc(topicRef, {
        status: "Rejected",
        rejectionReason: rejectionReason,
      });

    } catch (error) {
      console.error("Error rejecting topic:", error);
    }

    setLoading(false);
  };

  const acceptTopic = async (topicId,studentUid) => {
    setLoading(true);
    try {
      const userRef = doc(db, "students", studentUid);
      await updateDoc(userRef, {
        pendingTopic: arrayRemove(topicId),
        acceptedTopic: arrayUnion(topicId),
      });

      // Optional: You can also update the status of the topic to "Accepted" in the studentTopics collection
      const topicRef = doc(db, "studentTopics", topicId);
      await updateDoc(topicRef, {
        status: "Accepted",
      });
    } catch (error) {
      console.error("Error accepting topic:", error);
    }

    setLoading(false);
  };



  return (
    <div className="viewTopics">
      <h1>View Pending Topics  

        {/* reload */}
        <button className="reload" onClick={() => window.location.reload()}>
            Reload
        </button>
      </h1>
      {topics.length > 0 ? (
        <ul>
          {topics.map((topic) => (
            <li key={topic.id}
            // whose topic is Rejected or accepted diplay none
            style={topic.status === "Rejected" || topic.status === "Accepted" ? {display: "none"} : {
                display: "flex",
                justifyContent: "space-between",
            }}
            >
              <div className="left"
            //   whose topic is Rejected diplay none
            
              >
                <p>Student Name: {topic.studentName}</p>
                <p>Title: {topic.title}</p>
                <p>Topic: {topic.category}</p>
                {/* <p>Submitted on: {topic.createdAt}</p> */}
                <p>Description: {topic.description}</p>
                <p>Topic Status: {topic.status}</p>
              </div>
              <div className="right">
                {topic.fileURL && (
                  <a href={topic.fileURL} target="_blank" rel="noreferrer">
                    View Topic File
                  </a>
                )}

                {/* <button onClick={() => rejectTopic(topic.id)}>Reject</button> */}
                {/* need a text box for reject reson */}
                <button onClick={() => rejectTopic(topic.id,
                topic.userId
                )}>Reject</button>
                <input
                  type="text"
                //   value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Rejection Reason"
                />
                <br />
                <button onClick={() => acceptTopic(topic.id,
                topic.userId
                )}>Accept</button>

                
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No topics found.</p>
      )}
    </div>
  );
};

export default ViewTopics;
