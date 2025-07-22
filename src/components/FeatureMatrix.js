import React, { useState } from "react";
import { useTier } from "./TierContext";

// Define tierConfig locally to match TierContext
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
  // Enterprise: hidden
  Enterprise: {
    price: 2500,
    included: 15,
    max: 15,
    extra: 0,
    contact: true,
  },
};

const tiers = ["Pup JR.", "Pup SR.", "Guardian", "Alpha", "Enterprise"];

const FeatureMatrix = () => {
  const { tier, allProtections, setTier } = useTier();

  // No special CSS needed since Enterprise is now part of the main table

  // For each tier, get the set of included protections (first N from allProtections)
  const tierProtections = {};
  tiers.forEach((tierOption) => {
    const config = tierConfig[tierOption];
    tierProtections[tierOption] = allProtections.slice(0, config.included);
  });

  // Helper to render add-on and swap rules
  const renderAddonSwap = (tierOption) => {
    const config = tierConfig[tierOption];
    if (tierOption === "Pup JR.") return "No add-ons or swaps";
    if (tierOption === "Pup SR.")
      return `Up to 2 add-ons ($10 each), 1 free swap/month, $5 per extra swap`;
    if (tierOption === "Guardian")
      return `Up to 3 add-ons ($10 each), unlimited swaps`;
    if (tierOption === "Alpha") return `Unlimited add-ons, unlimited swaps`;
    if (tierOption === "Enterprise")
      return `Unlimited add-ons, unlimited swaps, Contact Sales`;
    return "-";
  };

  const handleTierClick = (tierOption) => {
    if (tierOption === "Enterprise") {
      // Enterprise opens email
      window.open(
        "mailto:sales@dark-shepherd.com?subject=Enterprise%20Inquiry",
        "_blank"
      );
    } else {
      // Other tiers switch directly
      setTier(tierOption);
    }
  };

  return (
    <div className="flex flex-col h-full flex-1 min-h-0 p-6 bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">
        Feature Matrix by Tier
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-1 feature-matrix-table">
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
                  {tierOption === "Pup JR." ? (
                    <button
                      onClick={() => handleTierClick(tierOption)}
                      className="w-full text-left hover:text-white transition-colors duration-200 cursor-pointer"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Pup JR.
                    </button>
                  ) : tierOption === "Pup SR." ? (
                    <button
                      onClick={() => handleTierClick(tierOption)}
                      className="w-full text-left hover:text-white transition-colors duration-200 cursor-pointer"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Pup SR.
                    </button>
                  ) : tierOption === "Guardian" ? (
                    <button
                      onClick={() => handleTierClick(tierOption)}
                      className="w-full text-left hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      Guardian
                    </button>
                  ) : tierOption === "Alpha" ? (
                    <button
                      onClick={() => handleTierClick(tierOption)}
                      className="w-full text-left hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      Alpha
                    </button>
                  ) : tierOption === "Enterprise" ? (
                    <div>
                      <div style={{ whiteSpace: "nowrap" }}>Enterprise</div>
                      <button
                        onClick={() => handleTierClick(tierOption)}
                        className="text-xs text-green-400 hover:text-green-300 cursor-pointer transition-colors duration-200"
                      >
                        Contact Sales
                      </button>
                    </div>
                  ) : (
                    tierOption
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Feature/protection rows */}
            {allProtections.map((protection) => (
              <tr key={protection} className="">
                <td className="bg-gray-800 text-white px-4 py-2 rounded-l-lg">
                  {protection}
                </td>
                {tiers.map((tierOption) => (
                  <td
                    key={tierOption}
                    className={`px-4 py-2 text-center ${
                      tierOption === "Enterprise" ? "rounded-r-lg" : ""
                    } ${
                      tier === tierOption
                        ? "bg-green-600/20 border border-green-500/30"
                        : ""
                    }`}
                  >
                    {tierOption === "Enterprise" ? (
                      <span className="text-green-400">-</span>
                    ) : tierProtections[tierOption].includes(protection) ? (
                      <span className="text-green-400 text-lg">&#10003;</span>
                    ) : (
                      <span className="text-gray-600">-</span>
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
