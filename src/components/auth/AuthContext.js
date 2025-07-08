import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: Checking localStorage...");
    const stored = localStorage.getItem("ds_isLoggedIn");
    const storedOnboarding = localStorage.getItem("ds_onboardingCompleted");
    console.log("AuthProvider: localStorage value:", stored);
    console.log("AuthProvider: onboarding value:", storedOnboarding);
    setIsLoggedIn(stored === "true");
    setOnboardingCompleted(storedOnboarding === "true");
    setLoading(false);
    console.log(
      "AuthProvider: Set loading to false, isLoggedIn:",
      stored === "true",
      "onboardingCompleted:",
      storedOnboarding === "true"
    );
  }, []);

  useEffect(() => {
    console.log("AuthProvider: isLoggedIn changed to:", isLoggedIn);
    localStorage.setItem("ds_isLoggedIn", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  useEffect(() => {
    console.log(
      "AuthProvider: onboardingCompleted changed to:",
      onboardingCompleted
    );
    localStorage.setItem(
      "ds_onboardingCompleted",
      onboardingCompleted ? "true" : "false"
    );
  }, [onboardingCompleted]);

  const login = () => {
    console.log("AuthProvider: Login called");
    setIsLoggedIn(true);
    // Reset onboarding completion on new login
    setOnboardingCompleted(false);
  };

  const logout = () => {
    console.log("AuthProvider: Logout called");
    setIsLoggedIn(false);
    setOnboardingCompleted(false);
  };

  const completeOnboarding = () => {
    console.log("AuthProvider: Onboarding completed");
    setOnboardingCompleted(true);
  };

  console.log(
    "AuthProvider: Rendering with loading:",
    loading,
    "isLoggedIn:",
    isLoggedIn,
    "onboardingCompleted:",
    onboardingCompleted
  );

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        loading,
        onboardingCompleted,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
