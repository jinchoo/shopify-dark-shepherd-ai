import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

const shepherdDogImg =
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=256&h=256&facepad=2";

const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showShepherdForm, setShowShepherdForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    storeUrl: "",
    billingName: "",
    billingCard: "",
    billingExp: "",
    billingCvc: "",
    billingAddress: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (selectedOption === "diy") {
      completeOnboarding();
      navigate("/dashboard");
    } else {
      setShowShepherdForm(true);
    }
  };

  const handleBack = () => {
    setShowConfirmation(false);
    setSelectedOption(null);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Here you would send the form data to your backend
  };

  // Shepherd Form Step
  if (showShepherdForm) {
    if (formSubmitted) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex items-center justify-center px-4">
          <div className="max-w-lg mx-auto w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg overflow-hidden">
                <img
                  src={shepherdDogImg}
                  alt="Shepherd Dog"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Thank You!</h2>
            <p className="text-gray-300 text-lg mb-6">
              A Shepherd will contact you soon to finalize your protection
              setup. You will not be charged until your plan is confirmed on the
              phone.
            </p>
            <button
              onClick={() => {
                completeOnboarding();
                navigate("/dashboard");
              }}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex items-center justify-center px-4">
        <div className="max-w-lg mx-auto w-full bg-gray-900/80 border border-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src={shepherdDogImg}
                alt="Shepherd Dog"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Shepherd Setup: Contact & Billing
          </h2>
          <p className="text-gray-300 text-center mb-6">
            Please provide your contact, store, and billing information.{" "}
            <span className="text-green-400 font-semibold">
              You will not be charged until your protection is finalized with
              our team on the phone.
            </span>
          </p>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Store URL</label>
              <input
                name="storeUrl"
                value={form.storeUrl}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div className="border-t border-gray-700 pt-4">
              <label className="block text-gray-300 mb-1">Billing Name</label>
              <input
                name="billingName"
                value={form.billingName}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-gray-300 mb-1">Card Number</label>
                <input
                  name="billingCard"
                  value={form.billingCard}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div className="w-1/3">
                <label className="block text-gray-300 mb-1">Exp</label>
                <input
                  name="billingExp"
                  value={form.billingExp}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div className="w-1/4">
                <label className="block text-gray-300 mb-1">CVC</label>
                <input
                  name="billingCvc"
                  value={form.billingCvc}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">
                Billing Address
              </label>
              <input
                name="billingAddress"
                value={form.billingAddress}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-4 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto w-full">
        {!showConfirmation ? (
          // Selection Screen
          <div className="text-center">
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <svg
                    className="w-16 h-16 text-green-400 drop-shadow-lg"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3l7 4v5c0 5.25-3.5 9.75-7 11-3.5-1.25-7-5.75-7-11V7l7-4z"
                    />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Choose Your <span className="text-green-400">Protection</span>{" "}
                Style
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                How would you like to set up your security protections?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* DIY Option */}
              <div
                onClick={() => handleOptionSelect("diy")}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl p-8 cursor-pointer hover:border-green-400 hover:shadow-green-500/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-6xl mb-6">🛠️</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Do It Yourself
                </h3>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  We'll walk you through, step by step, what protection you can
                  choose from. Perfect for those who want full control.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-2">✓</span>
                    Choose your own protections
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-2">✓</span>
                    Full control over settings
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-2">✓</span>
                    Learn as you go
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-2">✓</span>
                    Immediate setup
                  </div>
                </div>
                <div className="mt-6 text-green-400 text-sm font-medium">
                  Get Started Now →
                </div>
              </div>

              {/* Shepherd Option */}
              <div
                onClick={() => handleOptionSelect("shepherd")}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl p-8 cursor-pointer hover:border-green-400 hover:shadow-green-500/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg overflow-hidden">
                    <img
                      src={shepherdDogImg}
                      alt="Shepherd Dog"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Let a Shepherd Do It For You
                </h3>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  Our experts will configure the best protection for your
                  store—just enable and relax. Perfect for busy business owners.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-2">✓</span>
                    Expert configuration
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-2">✓</span>
                    Personalized setup
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-2">✓</span>
                    Ongoing support
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-2">✓</span>
                    Contact within 24h
                  </div>
                </div>
                <div className="mt-6 text-green-400 text-sm font-medium">
                  Get Expert Help →
                </div>
              </div>
            </div>

            <div className="mt-8 text-gray-400 text-sm">
              You can always change your mind later in the settings
            </div>
          </div>
        ) : (
          // Confirmation Screen
          <div className="text-center">
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                {selectedOption === "shepherd" ? (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg overflow-hidden">
                    <img
                      src={shepherdDogImg}
                      alt="Shepherd Dog"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-400 text-2xl">🛠️</span>
                  </div>
                )}
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                {selectedOption === "diy"
                  ? "DIY Setup Selected"
                  : "Shepherd Setup Selected"}
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                {selectedOption === "diy"
                  ? "Great choice! You'll have full control over your security setup. Let's get you started with choosing your protections."
                  : "Excellent! One of our security experts will contact you within 24 hours to set up your perfect protection configuration."}
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md mx-auto mb-8">
              <h3 className="text-white font-semibold mb-3">
                What happens next?
              </h3>
              {selectedOption === "diy" ? (
                <div className="space-y-2 text-left text-gray-300">
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">1.</span>
                    <span>You'll be taken to the dashboard</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">2.</span>
                    <span>Choose your protection tier</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">3.</span>
                    <span>Select specific protections</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">4.</span>
                    <span>Configure your settings</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-left text-gray-300">
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">1.</span>
                    <span>We'll contact you within 24 hours</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">2.</span>
                    <span>Discuss your security needs</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">3.</span>
                    <span>Configure optimal protection</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2 mt-1">4.</span>
                    <span>Provide ongoing support</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                {selectedOption === "diy"
                  ? "Start DIY Setup"
                  : "Confirm Shepherd Setup"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
