import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import { collection, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "../styles/SubmitDissertation.css";

const SubmitDissertation = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !file) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    const fileRef = ref(storage, `dissertations/${currentUser.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // You can implement a progress indicator if needed
      },
      (error) => {
        console.error("File upload failed", error);
        setError("File upload failed. Please try again.");
        setLoading(false);
      },
      async () => {
        try {
          const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
          const dissertationData = {
            title,
            description,
            fileURL,
            status: "Pending", // You can set the status to "Submitted" if you want to auto-accept submissions
            createdAt: new Date().toISOString()
          };
          const docRef = await addDoc(collection(db, "dissertations"), {
            userId: currentUser.uid,
            ...dissertationData
          });

          const studentDocRef = doc(db, "students", currentUser.uid);
          await updateDoc(studentDocRef, {
            pending: arrayUnion(docRef.id)
          });

          navigate("/student-dashboard");
        } catch (error) {
          console.error("Failed to submit dissertation", error);
          setError("Failed to submit dissertation. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="submitForm">
      <div className="submit-dissertation">
        <h1>Submit Dissertation</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <p>Upload your dissertation</p>
          <input 
            type="file" 
            onChange={handleFileChange}
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SubmitDissertation;
