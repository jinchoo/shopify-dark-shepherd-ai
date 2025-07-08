import React from "react";
import { useTier } from "./TierContext";

const features = [
  {
    name: "Basic fraud scan",
    tiers: ["Pup Basic", "Pup Pro", "Guardian", "Alpha", "Enterprise"],
  },
  {
    name: "Weekly summary",
    tiers: ["Pup Basic", "Pup Pro", "Guardian", "Alpha", "Enterprise"],
  },
  {
    name: "Basic alerts",
    tiers: ["Pup Basic", "Pup Pro", "Guardian", "Alpha", "Enterprise"],
  },
  {
    name: "Advanced analytics",
    tiers: ["Pup Pro", "Guardian", "Alpha", "Enterprise"],
  },
  {
    name: "AI assistant",
    tiers: ["Pup Pro", "Guardian", "Alpha", "Enterprise"],
  },
  {
    name: "PCI compliance tools",
    tiers: ["Pup Pro", "Guardian", "Alpha", "Enterprise"],
  },
  {
    name: "Priority support",
    tiers: ["Pup Pro", "Guardian", "Alpha", "Enterprise"],
  },
  {
    name: "Real-time threat intelligence",
    tiers: ["Guardian", "Alpha", "Enterprise"],
  },
  {
    name: "Account takeover (ATO) protection",
    tiers: ["Guardian", "Alpha", "Enterprise"],
  },
  {
    name: "Bot mitigation (CAPTCHA, rate limits)",
    tiers: ["Guardian", "Alpha", "Enterprise"],
  },
  { name: "Chargeback guarantee/insurance", tiers: ["Alpha", "Enterprise"] },
  { name: "Custom rules engine", tiers: ["Alpha", "Enterprise"] },
  { name: "API access / integrations", tiers: ["Alpha", "Enterprise"] },
  { name: "SLA / Uptime guarantee", tiers: ["Alpha", "Enterprise"] },
  { name: "Dedicated account manager", tiers: ["Enterprise"] },
  { name: "Custom onboarding/training", tiers: ["Enterprise"] },
  { name: "Multi-store/brand support", tiers: ["Enterprise"] },
  { name: "Audit log export / compliance reports", tiers: ["Enterprise"] },
  { name: "Custom security consulting", tiers: ["Enterprise"] },
];

const tiers = ["Pup Basic", "Pup Pro", "Guardian", "Alpha", "Enterprise"];

const FeatureMatrix = () => {
  const { tier } = useTier();
  return (
    <div className="flex flex-col h-full flex-1 min-h-0 p-6 bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">
        Feature Matrix by Tier
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-1">
          <thead>
            <tr>
              <th className="bg-gray-800 text-white px-4 py-2 rounded-tl-lg">
                Feature/Protection
              </th>
              {tiers.map((tierOption) => (
                <th
                  key={tierOption}
                  className={`px-4 py-2 font-semibold ${
                    tier === tierOption
                      ? "bg-green-600 text-white"
                      : "bg-gray-800 text-gray-200"
                  }`}
                >
                  {tierOption}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.name} className="">
                <td className="bg-gray-800 text-white px-4 py-2 rounded-l-lg">
                  {feature.name}
                </td>
                {tiers.map((tierOption) => (
                  <td
                    key={tierOption}
                    className={`text-center px-4 py-2 ${
                      tier === tierOption
                        ? "bg-green-900 text-green-200"
                        : "bg-gray-800 text-gray-100"
                    } ${tierOption === "Enterprise" ? "rounded-r-lg" : ""}`}
                  >
                    {feature.tiers.includes(tierOption) ? (
                      <span className="text-green-400 text-lg">&#10003;</span>
                    ) : (
                      ""
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeatureMatrix;
