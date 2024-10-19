import React, { createContext, useEffect, useState } from "react";
import { app } from "../../config/firebase.init";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import axios from "axios";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState("");
  const auth = getAuth(app);

  //   Sign Up New User
  const signUp = async (email, password) => {
    try {
      setLoader(true);
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.code);
      throw error;
    }
  };

  //   Login User
  const login = async (email, password) => {
    try {
      setLoader(true);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.code);
      throw error;
    }
  };

  //   Logout User
  const logout = async () => {
    try {
      return await signOut(auth);
    } catch (error) {
      setError(error.code);
      throw error;
    }
  };

  //   Update Users Profile
  const updateUser = async (name, photo) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });
      setUser(auth.currentUser);
    } catch (error) {
      setError(error.code);
      throw error;
    }
  };

  //   Using Google Login
  const googleProvider = new GoogleAuthProvider();
  const googleLogin = async () => {
    try {
      setLoader(true);
      return await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setError(error.code);
      throw error;
    }
  };

  //   Observers For Users
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        axios
          .post("http://localhost:3000/api/set-token", {
            email: user.email,
            name: user.displayName,
          })
          .then((data) => {
            if (data.data.token) {
              localStorage.setItem("token", data.data.token);
              setLoader(false);
            }
          });
      } else {
        localStorage.removeItem("token");
        setLoader(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const contextValue = {
    user,
    signUp,
    setUser,
    login,
    logout,
    updateUser,
    googleLogin,
    error,
    setError,
    loader,
    setLoader,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
