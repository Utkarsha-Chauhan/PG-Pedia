import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import "../styles/StudentsDashboard.css";
import { Link, Navigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const StudentsDashboard = () => {
  const { currentUser } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [loadingMentor, setLoadingMentor] = useState(true);
  const [dissertations, setDissertations] = useState([]);
  const [topic,setTopic] = useState([]);


  useEffect(() => {
    const fetchMentorDetails = async () => {
      if (currentUser && currentUser.mentorId) {
        const mentorDoc = await getDoc(
          doc(db, "faculties", currentUser.mentorId)
        );
        if (mentorDoc.exists()) {
          setMentor(mentorDoc.data());
        }
      }
      setLoadingMentor(false);
    };
  
    const fetchDissertations = async () => {
      try {
        const dissertationsRef = collection(db, "dissertations");
        const q = query(dissertationsRef, where("userId", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        const data = [];
        for (const doc of snapshot.docs) {
          const dissertationData = doc.data();
          data.push({ id: doc.id, ...dissertationData });
        }
        setDissertations(data);
      } catch (error) {
        console.error("Error fetching dissertations:", error);
      }
    };

    const fetchTopic = async () => {
      try {
        const topicsRef = collection(db, "studentTopics");
        const q = query(topicsRef, where("userId", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        const data = [];
        for (const doc of snapshot.docs) {
          const topicData = doc.data();
          data.push({ id: doc.id, ...topicData });
        }
        setTopic(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };




  
    fetchMentorDetails();
    fetchDissertations();
    fetchTopic();


    const intervalId = setInterval(() => {
      fetchMentorDetails();
      fetchDissertations();
    }, 1000);
  
    return () => clearInterval(intervalId);
  }, [currentUser]); // Empty dependency array to run effect only once
  
  // ...
  

  const [hasSubmission, setHasSubmission] = useState(false);

  useEffect(() => {
    // Check if currentUser has any existing submissions
    if (
      currentUser.pending.length > 0 ||
      currentUser.submitted.length > 0 ||
      currentUser.rejected.length > 0
    ) {
      setHasSubmission(true);
    } else {
      setHasSubmission(false);
    }
  }, [currentUser]);

  const submittedCount = currentUser.submitted
    ? currentUser.submitted.length
    : 0;
  const pendingCount = currentUser.pending ? currentUser.pending.length : 0;
  const rejectedCount = currentUser.rejected ? currentUser.rejected.length : 0;

  if (!currentUser) {
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
        Loading...
      </p>
    ); // or handle the case where currentUser is null
  }

  const handleLinkClick = (e) => {
    if (!currentUser.mentorId) {
      e.preventDefault();
      alert("Please select a mentor before submitting your dissertation.");
    }
  };

  const handleSelectTopic = (e) => {
    if (!currentUser.mentorId) {
      e.preventDefault();
      alert("Please select a mentor before submitting your topic.");
    }
  };

  return (
    <div className="student_dashboard">
      <div className="userDetails">
        <h1>Dashboard</h1>
        <p>
          🌟Welcome <span>{currentUser.name} </span>
          to <span>PG-Pedia🌟 </span>
        </p>

        <p>
          {/* write description */}
          PG-Pedia is a platform for students to learn about the various
          postgraduate courses available in India. It also provides information
          about the entrance exams and the colleges offering these courses. The
          platform is designed to help students make informed decisions about
          their future.
        </p>
      </div>

      <div className="mentor">
        <h2>Mentor Details :</h2>
        {loadingMentor ? (
          <p>Loading mentor details...</p>
        ) : mentor ? (
          <p>
            Your mentor is {mentor.name}.<br />
            You can contact them at {mentor.email}.
          </p>
        ) : (
          <p>No mentor assigned.</p>
        )}
      </div>

      <div className="selectTopicButton submitDessertationButton"
        style={{ display: currentUser?.acceptedTopic?.length === 0 ? 'flex' : 'none' }}
      >
        <h2>Select Topic</h2>
        <p>Click the button below to select a topic for your dissertation.</p>
        <Link
          to="/student/select-topic"
        onClick={handleSelectTopic} className="selectTopicBtn">
          Select Topic
        </Link>
      </div>

      {/* if topics are rejected */}
      <div className="rejectedTopics topicDetails" style={{ 
        // margin bottom
        // display: currentUser?.acceptedTopic?.length === 0 ? 'flex;' : 'none;'
        display: currentUser?.acceptedTopic?.length === 0 ? 'flex' : 'none',
        margin: "20px auto",
        
      }}>
        <h2
          style={{
            color:currentUser?.rejectedTopic?.length === 0 ? "#DED4E8":'red',
          }}
        >Rejected Topics</h2>
        <ul
          style={{
            background:currentUser?.rejectedTopic?.length === 0 ? "#DED4E8":'red',
          }}
        >
          {topic.filter(topic => topic.status === "Rejected").map((topic, index) => (
            <li key={index}>
              <p>Title: {topic.title}</p>
              <p>Description: {topic.description}</p>
              <p>Rejection Reason: {topic.rejectionReason}</p>
              <Link to={topic.fileURL} target="_blank">
                View Topic
              </Link>
            </li>
          ))}
        </ul>
      </div>


      {/* show topic details */}
      <div className="topicDetails" style={{ display: currentUser?.acceptedTopic?.length === 0 ? 'none' : 'flex' }}>
        <h2>Selected Topic</h2>
        <ul>
          {topic.filter(topic => topic.status === "Accepted").map((topic, index) => (
            <li key={index}>
              <p>Title: {topic.title}</p>
              <p>Description: {topic.description}</p>
              <Link to={topic.fileURL} target="_blank">
                View Topic
              </Link>
            </li>
          ))}
        </ul>

      </div>


      <div className="progressReport" style={{ display: currentUser?.acceptedTopic?.length === 0 ? 'none' : 'flex' }}>
        <div className="box">
          <span>{submittedCount}</span>
          <p>No. Of Submission</p>
        </div>
        <div className="box">
          <span>{pendingCount}</span>
          <p>No. Of Pending</p>
        </div>
        <div className="box">
          <span>{rejectedCount}</span>
          <p>No. Of Rejections</p>
        </div>
      </div>



      <div className="listOfAcceptedAndRejectedOrPending" style={{ display: currentUser?.acceptedTopic?.length === 0 ? 'none' : 'flex' }}>
        <div className="box">
          <h2>Accepted</h2>
          {/* those dissertations whose status= "Accepted" */}
          {
            dissertations.filter(dissertation => dissertation.status === "Accepted").map((dissertation, index) => (
              <ul className="dissertation" key={index}>
                <li>Title: {dissertation.title}</li>
                <li>Submitted on: {dissertation.submittedOn}</li>
                <li>Status: Accepted</li>
                <li>
                  Description:
                  {dissertation.description}
                </li>
                <Link to={dissertation.fileURL} target="_blank">
                  View submission
                </Link>
              </ul>
            ))
          }
        </div>
        <div className="box">
          <h2>Pending or Rejected</h2>
          {/* those dissertations whose status= "Pending" or "Rejected" */}
          {
            dissertations.filter(dissertation => dissertation.status === "Pending" || dissertation.status === "Rejected").map((dissertation, index) => (
              <ul className="dissertation" key={index}>
                <li>Title: {dissertation.title}</li>
                <li>Submitted on: {dissertation.submittedOn}</li>
                <li>Status: {dissertation.status}</li>
                <li>
                  Description:
                  {dissertation.description}
                </li>
                {dissertation.status === "Rejected" && (
                  <li>Rejection Reason: {dissertation.rejectionReason}</li>
                )}
                <Link to={dissertation.fileURL} target="_blank">
                  View submission
                </Link>
              </ul>
            ))
          }
        </div>
      </div>




      <div className="submitDessertationButton" style={{ display: currentUser?.acceptedTopic?.length === 0 ? 'none' : 'flex' }}>
        <h2>
          {hasSubmission
            ? "Submit Another Dissertation"
            : "Submit Dissertation"}
        </h2>
        <p>
          Click the button below to{" "}
          {hasSubmission ? "submit another" : "submit your"} dissertation.
        </p>
        <Link to="/student/submit-dissertation" className="submitDissertation">
          {hasSubmission
            ? "Submit Another Dissertation"
            : "Submit Dissertation"}
        </Link>
      </div>

    </div>
  );
};

export default StudentsDashboard;
