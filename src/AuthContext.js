import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Try to fetch user data from both collections
        let userDoc = await getDoc(doc(db, "students", user.uid));
        if (!userDoc.exists()) {
          userDoc = await getDoc(doc(db, "faculties", user.uid));
          setUserType('faculty');
        } else {
          setUserType('student');
        }
        
        if (userDoc.exists()) {
          setCurrentUser({ ...user, ...userDoc.data() });
        } else {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
        setUserType(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);


  // const signUp = async (email, password, name, userType, department) => {
  //   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //   const user = userCredential.user;
  
  //   // Initialize common user data
  //   const userData = {
  //     uid: user.uid,
  //     email: user.email,
  //     name: name,
  //     userType: userType,
  //     department: department,
  //     createdAt: new Date().toISOString(),
  //   };
  
  //   // Add user-specific fields
  //   if (userType === 'student') {
  //     userData.submitted = [];
  //     userData.rejected = [];
  //     userData.pending = [];
  //     userData.mentorId = null; // Track the mentor
  //   } else if (userType === 'faculty') {
  //     userData.mentees = [];
  //   }
  
  //   // Determine the collection to use
  //   const collectionName = userType === 'student' ? 'students' : 'faculties';
  
  //   // Store user data in Firestore
  //   await setDoc(doc(db, collectionName, user.uid), userData);
  
  //   // Update currentUser state with additional data
  //   setCurrentUser({ ...user, ...userData });
  //   setUserType(userType);
  // };
  

  const signUp = async (email, password, name, userType, department) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  
    // Initialize common user data
    const userData = {
      uid: user.uid,
      email: user.email,
      name: name,
      userType: userType,
      createdAt: new Date().toISOString(),
    };
  
    // Add user-specific fields
    if (userType === 'student') {
      userData.department = department;
      userData.submitted = [];
      userData.rejected = [];
      userData.pending = [];
      userData.mentorId = null; // Track the mentor
      userData.pendingTopic = [];
      userData.acceptedTopic = [];
      userData.rejectedTopic = [];
    } else if (userType === 'faculty') {
      userData.mentees = [];
    }
  
    // Determine the collection to use
    const collectionName = userType === 'student' ? 'students' : 'faculties';
  
    // Store user data in Firestore
    await setDoc(doc(db, collectionName, user.uid), userData);
  
    // Update currentUser state with additional data
    setCurrentUser({ ...user, ...userData });
    setUserType(userType);
  };

  const logIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  
    // Try to fetch user data from both collections
    let userDoc = await getDoc(doc(db, "students", user.uid));
    if (!userDoc.exists()) {
      userDoc = await getDoc(doc(db, "faculties", user.uid));
      setUserType('faculty');
    } else {
      setUserType('student');
    }
  
    if (userDoc.exists()) {
      setCurrentUser({ ...user, ...userDoc.data() });
    } else {
      setCurrentUser(null);
    }
  };
  

  const logOut = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    userType,
    signUp,
    logIn,
    logOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
