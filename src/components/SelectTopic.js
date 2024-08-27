import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import '../styles/SelectTopic.css';
import categories from './categories';

const SelectTopic = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !file  || !category) {
      setError("All fields are required");
      return;
    }
  
    setLoading(true);
    setError("");
  
    const fileRef = ref(storage, `topics/${currentUser.uid}/${file.name}`);
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
          const topicData = {
            title,
            description,
            fileURL,
            createdAt: new Date().toISOString()
          };
  
          // Store topic data in Firestore
          const docRef = await addDoc(collection(db, "studentTopics"), {
            userId: currentUser.uid,
            department: currentUser.department,
            category,
            status:"pending",
            ...topicData
          });
  
          // Add topic ID to currentUser's pendingTopic array
          const userDocRef = doc(db, "students", currentUser.uid);
          await updateDoc(userDocRef, {
            pendingTopic: arrayUnion(docRef.id)
          });
  
          navigate("/student-dashboard");
        } catch (error) {
          console.error("Failed to submit topic", error);
          setError("Failed to submit topic. Please try again.");
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
    <div className="selectTopic">
      <form onSubmit={handleSubmit}>
        <h1>Select Topic</h1>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* select category */}
        <p>
          This categories are coming based on your department
        </p>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {Object.keys(categories).map((dept) => (
            categories[dept].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))
          ))}
        </select>
        
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input type="file" onChange={handleFileChange} required />
      
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default SelectTopic;
