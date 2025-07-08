import React, { useState } from "react";
import "./index.css";
import FeatureMatrix from "./components/FeatureMatrix";
import { TierProvider } from "./components/TierContext";
import NavBar from "./components/NavBar";
import { AuthProvider, useAuth } from "./components/auth/AuthContext";
import LoginPage from "./components/auth/LoginPage";
import Analytics from "./components/Analytics";
import Onboarding from "./components/Onboarding";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Pricing from "./components/Pricing";
import Settings from "./components/Settings";

const featureDetails = {
  "AI Fraud Detection": {
    icon: "🛡️",
    title: "AI Fraud Detection",
    desc: "Our advanced AI models analyze every transaction in real time, blocking fraud before it happens. Machine learning adapts to new threats, keeping your store safe 24/7.",
  },
  "Real-Time Alerts": {
    icon: "⚡",
    title: "Real-Time Alerts",
    desc: "Get instant notifications for suspicious activity, so you can act fast. Customize alert thresholds and channels (email, SMS, dashboard).",
  },
  "PCI Compliance": {
    icon: "🔒",
    title: "PCI Compliance",
    desc: "Stay compliant with the latest PCI standards. Automated tools help you pass audits and avoid costly fines, with easy-to-understand reports.",
  },
  "AI Assistant": {
    icon: "🤖",
    title: "AI Assistant",
    desc: "Your personal security expert, always on. Get actionable insights, recommendations, and answers to your security questions—powered by AI.",
  },
};

function HeroSection({ onLoginClick }) {
  const scrollToFeatures = () => {
    const featuresSection = document.querySelector("#features-section");
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex items-center justify-center px-4 relative">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo and Branding */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <svg
              className="w-20 h-20 text-green-400 drop-shadow-lg"
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
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
          Guard Your Store with{" "}
          <span className="text-green-400">DarkShepherd.ai</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          AI-powered security for modern e-commerce. Protect your business from
          fraud, threats, and compliance risks—effortlessly.
        </p>
        <button
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          onClick={onLoginClick}
        >
          Get Started
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <button
          onClick={scrollToFeatures}
          className="text-gray-400 hover:text-green-400 text-sm mb-2 animate-pulse transition-colors duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
        >
          Scroll to explore
        </button>
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-green-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function FeaturesSection({ onFeatureClick }) {
  const features = [
    {
      key: "AI Fraud Detection",
      icon: "🛡️",
      title: "AI Fraud Detection",
      desc: "Stop threats before they reach your store.",
    },
    {
      key: "Real-Time Alerts",
      icon: "⚡",
      title: "Real-Time Alerts",
      desc: "Instant notifications for suspicious activity.",
    },
    {
      key: "PCI Compliance",
      icon: "🔒",
      title: "PCI Compliance",
      desc: "Stay compliant with automated tools.",
    },
    {
      key: "AI Assistant",
      icon: "🤖",
      title: "AI Assistant",
      desc: "Get security insights and recommendations.",
    },
  ];

  const scrollToTestimonials = () => {
    const testimonialsSection = document.querySelector("#testimonials-section");
    if (testimonialsSection) {
      testimonialsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section
      id="features-section"
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 py-20 px-4 flex items-center relative"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful <span className="text-green-400">Protection</span> Features
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to secure your e-commerce business with
            AI-powered intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f) => (
            <button
              key={f.key}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center hover:border-green-400 hover:shadow-green-500/20 transition-all duration-300 transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => onFeatureClick(f.key)}
            >
              <div className="text-6xl mb-6 drop-shadow-lg">{f.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-4">{f.title}</h3>
              <p className="text-gray-300 text-lg leading-relaxed">{f.desc}</p>
              <div className="mt-6 text-green-400 text-sm font-medium">
                Learn More →
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <button
          onClick={scrollToTestimonials}
          className="text-gray-400 hover:text-green-400 text-sm mb-2 animate-pulse transition-colors duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
        >
          See what customers say
        </button>
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-green-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

function FeatureModal({ feature, onClose }) {
  if (!feature) return null;
  const { icon, title, desc } = featureDetails[feature];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl p-8 relative w-full max-w-lg">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors duration-200"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="text-6xl mb-6 drop-shadow-lg">{icon}</div>
          <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
          <p className="text-gray-200 mb-8 text-lg leading-relaxed">{desc}</p>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-left w-full">
            <div className="font-semibold text-green-400 mb-3 text-lg">
              Choose Your Protection Style
            </div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="font-semibold text-white mr-2">
                  Do it yourself:
                </span>
                We'll walk you through, step by step, what protection you can
                choose from.
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-white mr-2">
                  Let one of our Shepherds do it for you:
                </span>
                Our experts will configure the best protection for your
                store—just enable and relax.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "DarkShepherd.ai gave us peace of mind and stopped fraud in its tracks!",
      author: "Jane, Store Owner",
      role: "E-commerce Entrepreneur",
    },
    {
      quote: "The AI assistant is a game changer for our security team.",
      author: "Mike, CTO",
      role: "Technology Leader",
    },
    {
      quote: "Finally, security that doesn't slow down our business.",
      author: "Sarah, Operations Manager",
      role: "Business Operations",
    },
  ];
  return (
    <section
      id="testimonials-section"
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 py-20 px-4 flex items-center"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by <span className="text-green-400">Businesses</span>{" "}
            Worldwide
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See what our customers say about their experience with
            DarkShepherd.ai
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl p-8 text-center hover:border-green-400/30 transition-all duration-300"
            >
              <div className="text-4xl mb-4">⭐</div>
              <p className="text-lg text-gray-200 italic mb-6 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="text-green-400 font-semibold text-lg">
                {t.author}
              </div>
              <div className="text-gray-400 text-sm">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PublicLanding() {
  const [showLogin, setShowLogin] = useState(false);
  const [featureModal, setFeatureModal] = useState(null);
  const navigate = useNavigate();
  const handleLoginSuccess = () => {
    setShowLogin(false);
    navigate("/onboarding");
  };
  return (
    <div>
      <HeroSection onLoginClick={() => setShowLogin(true)} />
      <FeaturesSection onFeatureClick={setFeatureModal} />
      <TestimonialsSection />
      {featureModal && (
        <FeatureModal
          feature={featureModal}
          onClose={() => setFeatureModal(null)}
        />
      )}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl shadow-lg p-8 relative w-full max-w-sm">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
              onClick={() => setShowLogin(false)}
            >
              &times;
            </button>
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  console.log("ProtectedRoute: loading:", loading, "isLoggedIn:", isLoggedIn);

  if (loading) {
    console.log("ProtectedRoute: Showing loading spinner");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  console.log("ProtectedRoute: Loading complete, isLoggedIn:", isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/" />;
};

const OnboardingProtectedRoute = ({ children }) => {
  const { isLoggedIn, onboardingCompleted, loading } = useAuth();
  console.log(
    "OnboardingProtectedRoute: loading:",
    loading,
    "isLoggedIn:",
    isLoggedIn,
    "onboardingCompleted:",
    onboardingCompleted
  );

  if (loading) {
    console.log("OnboardingProtectedRoute: Showing loading spinner");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    console.log("OnboardingProtectedRoute: Not logged in, redirecting to home");
    return <Navigate to="/" />;
  }

  if (!onboardingCompleted) {
    console.log(
      "OnboardingProtectedRoute: Onboarding not completed, redirecting to onboarding"
    );
    return <Navigate to="/onboarding" />;
  }

  console.log("OnboardingProtectedRoute: All checks passed, showing children");
  return children;
};

function App() {
  return (
    <AuthProvider>
      <TierProvider>
        <Router>
          <NavBar />
          <div className="App">
            <Routes>
              <Route path="/" element={<PublicLanding />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route
                path="/settings"
                element={
                  <OnboardingProtectedRoute>
                    <Settings />
                  </OnboardingProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <OnboardingProtectedRoute>
                    <Analytics />
                  </OnboardingProtectedRoute>
                }
              />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <OnboardingProtectedRoute>
                    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 py-8 px-4">
                      <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-8">
                          <h1 className="text-3xl font-bold text-white mb-2">
                            Dashboard
                          </h1>
                          <p className="text-gray-400">
                            Manage your security protections and monitor your
                            store
                          </p>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-8 items-stretch min-h-[500px]">
                          <div className="flex-1 h-full">
                            <FeatureMatrix />
                          </div>
                          <div className="flex-1 h-full">
                            <Dashboard />
                          </div>
                        </div>
                      </div>
                    </div>
                  </OnboardingProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </TierProvider>
    </AuthProvider>
  );
}

export default App;
