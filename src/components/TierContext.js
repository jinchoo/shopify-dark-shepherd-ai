import React, { createContext, useContext, useState } from "react";

const TierContext = createContext();

const tierConfig = {
  // Free plan: simple, no add-ons, no swaps
  "Pup JR.": {
    price: 0,
    included: 3,
    max: 3,
    extra: 0, // No add-ons
    swap: 0, // No swaps
    swapPrice: 0,
    addons: 0,
    addonsPrice: 0,
  },
  // Pup SR.: 6 included, max 2 add-ons @$10/protection, 1 free swap/month, then $5/swap
  "Pup SR.": {
    price: 99,
    included: 6,
    max: 8, // 6 included + 2 add-ons
    extra: 2, // Max add-ons
    addons: 2,
    addonsPrice: 10,
    swap: 1, // 1 free swap/month
    swapPrice: 5, // $5 per extra swap
  },
  // Guardian: 9 included, max 3 add-ons, unlimited swaps
  Guardian: {
    price: 199,
    included: 9,
    max: 12, // 9 included + 3 add-ons
    extra: 3,
    addons: 3,
    addonsPrice: 10,
    swap: Infinity, // Unlimited swaps
    swapPrice: 0,
    unlimitedSwap: true,
  },
  // Alpha: 12 active, unlimited add-ons, unlimited swaps
  Alpha: {
    price: 299,
    included: 12,
    max: Infinity, // Unlimited protections
    extra: Infinity,
    addons: Infinity,
    addonsPrice: 0,
    swap: Infinity,
    swapPrice: 0,
    unlimitedSwap: true,
    unlimitedProtection: true,
  },
  // Enterprise: Contact Sales
  Enterprise: {
    price: 2500,
    included: 15,
    max: Infinity, // Unlimited protections
    extra: Infinity,
    addons: Infinity,
    addonsPrice: 0,
    swap: Infinity,
    swapPrice: 0,
    unlimitedSwap: true,
    unlimitedProtection: true,
    contact: true,
  },
};

const allProtections = [
  "Basic alerts",
  "Basic fraud scan",
  "Weekly summary",
  "DDoS Protection",
  "Advanced analytics",
  "AI assistant",
  "PCI compliance tools",
  // "Priority support", // hidden for now
  "Real-time threat intelligence",
  "Account takeover (ATO) protection",
  "Bot mitigation (CAPTCHA, rate limits)",
  "Chargeback guarantee/insurance",
  "Custom rules engine",
  "API access / integrations",
  "SLA / Uptime guarantee",
  "Dedicated account manager",
  "Custom onboarding/training",
  "Multi-store/brand support",
  "Audit log export / compliance reports",
  // "Custom security consulting", // hidden for now
  // Optional extras:
  "Malware scanning",
  "SSL certificate management",
  "Backup & recovery",
  "Access control",
  "Incident response",
  "Vulnerability scanning",
  "Data encryption at rest",
  "Two-factor authentication (2FA)",
  "Web application firewall (WAF)",
  // "Security awareness training" // hidden for now
];

export const TierProvider = ({ children }) => {
  const [tier, setTier] = useState("Pup JR.");
  const config = tierConfig[tier];
  const [selectedProtections, setSelectedProtections] = useState(
    allProtections.slice(0, config.included)
  );
  const [swapCount, setSwapCount] = useState(0); // Track number of swaps used this month

  return (
    <TierContext.Provider
      value={{
        tier,
        setTier,
        config,
        selectedProtections,
        setSelectedProtections,
        allProtections,
        swapCount,
        setSwapCount,
      }}
    >
      {children}
    </TierContext.Provider>
  );
};

export const useTier = () => useContext(TierContext);
