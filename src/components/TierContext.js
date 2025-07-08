import React, { createContext, useContext, useState } from "react";

const TierContext = createContext();

const tierConfig = {
  "Pup Basic": { price: 0, included: 3, max: 3, extra: 10 },
  "Pup Pro": { price: 99, included: 6, max: 20, extra: 10 },
  Guardian: { price: 199, included: 9, max: 20, extra: 10 },
  Alpha: { price: 299, included: 12, max: 12, extra: 0, unlimitedSwap: true },
  Enterprise: {
    price: 2500,
    included: 15,
    max: 15,
    extra: 0,
    contact: true,
  },
};

const allProtections = [
  "AI Fraud Detection",
  "Real-Time Alerts",
  "PCI Compliance",
  "AI Assistant",
  "DDoS Protection",
  "Malware Scanning",
  "SSL Certificate",
  "Backup & Recovery",
  "Access Control",
  "Audit Logging",
  "Vulnerability Scanning",
  "Incident Response",
];

export const TierProvider = ({ children }) => {
  const [tier, setTier] = useState("Pup Basic");
  const config = tierConfig[tier];
  const [selectedProtections, setSelectedProtections] = useState(
    allProtections.slice(0, config.included)
  );

  return (
    <TierContext.Provider
      value={{
        tier,
        setTier,
        config,
        selectedProtections,
        setSelectedProtections,
        allProtections,
      }}
    >
      {children}
    </TierContext.Provider>
  );
};

export const useTier = () => useContext(TierContext);
