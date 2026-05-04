import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, addDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import {
  normalizeEducation,
  normalizeExperience,
  normalizeProject,
  normalizeResumeData,
  normalizeSkills,
} from '../utils/resumeData';

export const useFormState = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [cvId, setCvId] = useState(null);
  const [cvList, setCvList] = useState([]);
  const [isPremium, setIsPremium] = useState(true);
  const [isNewCv, setIsNewCv] = useState(false);

  // Helper function to get stored CV ID
  const getStoredCvId = (userId) => {
    return localStorage.getItem(`selectedCvId_${userId}`);
  };

  // Helper function to store CV ID
  const storeSelectedCvId = (userId, cvId) => {
    localStorage.setItem(`selectedCvId_${userId}`, cvId);
  };

  const fetchUserData = useCallback(async (currentUser) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      // Mock check for premium status
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists() && userDocSnap.data().isPremium) {
        setIsPremium(true);
      } else {
        setIsPremium(false);
      }

      const cvsCollectionRef = collection(db, "users", currentUser.uid, "resumes");
      const q = query(cvsCollectionRef, orderBy("lastModified", "desc"));
      const querySnapshot = await getDocs(q);
      const cvs = querySnapshot.docs.map(doc => normalizeResumeData({ id: doc.id, ...doc.data() }));
      setCvList(cvs);

      if (cvs.length > 0) {
        // Try to get the previously selected CV
        const storedCvId = getStoredCvId(currentUser.uid);
        let selectedCv = null;

        if (storedCvId) {
          // Check if the stored CV still exists
          selectedCv = cvs.find(cv => cv.id === storedCvId);
        }

        // If no stored CV or it doesn't exist, use the most recent one
        if (!selectedCv) {
          selectedCv = cvs[0];
          storeSelectedCvId(currentUser.uid, selectedCv.id);
        }

        setCvId(selectedCv.id);
        setFormData(normalizeResumeData(selectedCv));
      } else {
        // Create a new CV if none exist
        await createNewCv(currentUser, true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
      setDataLoaded(true);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.has('new')) {
          createNewCv(currentUser, true);
          queryParams.delete('new');
          const nextQuery = queryParams.toString();
          window.history.replaceState(
            {},
            '',
            `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}`,
          );
        } else {
          fetchUserData(currentUser);
        }
      } else {
        setDataLoaded(true);
        setUser(null);
        setCvList([]);
        setFormData({});
        setCvId(null);
        // Clear localStorage when user logs out
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('selectedCvId_')) {
            localStorage.removeItem(key);
          }
        });
      }
    });
    return () => unsubscribe();
  }, [fetchUserData]);

  const saveFormData = useCallback(async (dataToSave) => {
    if (user && cvId) {
      try {
        const normalizedData = normalizeResumeData(dataToSave);
        const cvRef = doc(db, "users", user.uid, "resumes", cvId);
        await setDoc(cvRef, { ...normalizedData, lastModified: serverTimestamp() }, { merge: true });
      } catch (error) {
        console.error("Error saving document:", error);
      }
    }
  }, [user, cvId]);

  const createNewCv = async (currentUser, isInitial = false, onSuccess) => {
    if (!currentUser) return;
    setLoading(true);
    const newCvData = {
      fullName: currentUser.displayName || "",
      email: currentUser.email || "",
      experiences: [],
      education: [],
      skills: [],
      projects: [],
      createdAt: serverTimestamp(),
      lastModified: serverTimestamp(),
      name: `Resume ${cvList.length + 1}`
    };
    try {
      const cvsCollectionRef = collection(db, "users", currentUser.uid, "resumes");
      const newDocRef = await addDoc(cvsCollectionRef, newCvData);
      setCvId(newDocRef.id);
      setFormData(normalizeResumeData(newCvData));
      setIsNewCv(true);
      
      // Store the new CV as selected
      storeSelectedCvId(currentUser.uid, newDocRef.id);
      
      await fetchUserData(currentUser); // Refresh list
      if (onSuccess) {
        onSuccess(newDocRef.id);
      }
    } catch (error) {
      console.error("Error creating new CV:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCv = async (idToDelete) => {
    if (!user) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "users", user.uid, "resumes", idToDelete));
      
      // If we're deleting the currently selected CV, clear the stored selection
      if (idToDelete === cvId) {
        localStorage.removeItem(`selectedCvId_${user.uid}`);
      }
      
      await fetchUserData(user); // Refresh list
    } catch (error) {
      console.error("Error deleting CV:", error);
    } finally {
      setLoading(false);
    }
  };

  const switchCv = async (idToSwitch) => {
    const newCv = cvList.find(cv => cv.id === idToSwitch);
    if (newCv && user) {
      setCvId(newCv.id);
      setFormData(normalizeResumeData(newCv));
      setIsNewCv(false);
      
      // Persist the selection
      storeSelectedCvId(user.uid, newCv.id);
      
      console.log('CV switched to:', newCv.id, 'and stored in localStorage');
    }
  };

  const renameCv = async (idToRename, newName) => {
    if (!user) return;
    setLoading(true);
    try {
      const cvRef = doc(db, "users", user.uid, "resumes", idToRename);
      await setDoc(cvRef, { name: newName }, { merge: true });
      await fetchUserData(user); // Refresh list
    } catch (error) {
      console.error("Error renaming CV:", error);
    } finally {
      setLoading(false);
    }
  };

  const duplicateCv = async (idToDuplicate) => {
    if (!user) return;
    setLoading(true);
    try {
      const originalCvRef = doc(db, "users", user.uid, "resumes", idToDuplicate);
      const originalCvSnap = await getDoc(originalCvRef);
      if (originalCvSnap.exists()) {
        const originalData = originalCvSnap.data();
        const newCvData = {
          ...originalData,
          name: `${originalData.name} (Copy)`,
          createdAt: serverTimestamp(),
          lastModified: serverTimestamp(),
        };
        const cvsCollectionRef = collection(db, "users", user.uid, "resumes");
        const newDocRef = await addDoc(cvsCollectionRef, newCvData);
        
        // Automatically switch to the duplicated CV
        storeSelectedCvId(user.uid, newDocRef.id);
        
        await fetchUserData(user); // Refresh list
      }
    } catch (error) {
      console.error("Error duplicating CV:", error);
    } finally {
      setLoading(false);
    }
  };

  const setPremium = async (value) => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { isPremium: value }, { merge: true });
        setIsPremium(value);
      } catch (error) {
        console.error("Error updating premium status:", error);
      }
    }
  };

  const updateFormData = (updates) => {
    const newData = normalizeResumeData({ ...formData, ...updates });
    setFormData(newData);
    saveFormData(newData);
    return newData;
  };

  const handleChange = (e, index, section) => {
    let newData = { ...formData };
    
    if (!e || typeof e !== 'object' || !e.target) {
      console.error('Invalid event object passed to handleChange:', e);
      return;
    }
    
    if (section === 'experiences' || section === 'experience') {
      const { name, value } = e.target;
      const list = [...(newData.experiences || [])];
      if (!list[index]) {
        list[index] = {};
      }
      list[index][name] = value;
      newData.experiences = list.map(normalizeExperience);
    } else if (section === 'education') {
      const { name, value } = e.target;
      const list = [...(newData.education || [])];
      list[index][name] = value;
      newData.education = list.map(normalizeEducation);
    } else if (section === 'skills') {
      newData.skills = normalizeSkills(e.target.value);
    } else if (section === 'projects') {
      const { name, value } = e.target;
      const list = [...(newData.projects || [])];
      list[index][name] = value;
      newData.projects = list.map(normalizeProject);
    } else {
      newData = { ...formData, [e.target.name]: e.target.value };
    }
    
    setFormData(newData);
    saveFormData(newData);
  };

  return {
    formData,
    setFormData,
    loading,
    setLoading,
    user,
    dataLoaded,
    updateFormData,
    handleChange,
    saveFormData,
    cvId,
    cvList,
    isPremium,
    setPremium,
    createNewCv,
    deleteCv,
    switchCv,
    renameCv,
    duplicateCv,
    isNewCv
  };
};
