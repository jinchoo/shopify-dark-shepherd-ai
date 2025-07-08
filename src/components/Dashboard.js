import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTier } from "./TierContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    tier,
    setTier,
    config,
    selectedProtections,
    setSelectedProtections,
    allProtections,
  } = useTier();
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [pendingProtection, setPendingProtection] = useState(null);

  // Calculate extra protections and pricing
  const extraProtections = Math.max(
    0,
    selectedProtections.length - config.included
  );
  const extraCost = extraProtections * config.extra;
  const totalCost = config.price + extraCost;

  // Handle toggle
  const handleToggle = (protection) => {
    if (selectedProtections.includes(protection)) {
      setSelectedProtections(
        selectedProtections.filter((p) => p !== protection)
      );
    } else {
      // Check if this would be an extra protection
      const wouldBeExtra = selectedProtections.length >= config.included;

      console.log("Protection toggle debug:", {
        protection,
        selectedProtections: selectedProtections.length,
        included: config.included,
        wouldBeExtra,
        tier,
      });

      if (wouldBeExtra) {
        // Show confirmation modal for extra protection
        console.log("Showing billing modal for:", protection);
        setPendingProtection(protection);
        setShowBillingModal(true);
      } else {
        // Allow selecting included protections (no limit)
        console.log("Adding included protection:", protection);
        setSelectedProtections([...selectedProtections, protection]);
      }
    }
  };

  // Handle confirmation of extra protection
  const handleConfirmExtra = () => {
    if (pendingProtection) {
      setSelectedProtections([...selectedProtections, pendingProtection]);
      setPendingProtection(null);
      setShowBillingModal(false);
      // Redirect to Settings page for billing management
      navigate("/settings");
    }
  };

  // Handle cancellation of extra protection
  const handleCancelExtra = () => {
    setPendingProtection(null);
    setShowBillingModal(false);
  };

  // Handle tier change
  const handleTierChange = (newTier) => {
    setTier(newTier);
    // Reset selected protections to match new tier
    const newConfig = tierConfig[newTier];
    setSelectedProtections(allProtections.slice(0, newConfig.included));
  };

  return (
    <div className="flex flex-col h-full flex-1 min-h-0 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Protection Dashboard</h2>
        <button
          onClick={() => navigate("/analytics")}
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          View Analytics →
        </button>
      </div>

      {/* Tier Selection */}
      <div className="mb-6">
        <label
          htmlFor="tier-select"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Select Your Tier:
        </label>
        <select
          id="tier-select"
          value={tier}
          onChange={(e) => handleTierChange(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
        >
          {Object.keys(tierConfig).map((tierOption) => (
            <option key={tierOption} value={tierOption}>
              {tierOption}
            </option>
          ))}
        </select>
      </div>

      {/* Pricing Information */}
      <div className="mb-6 p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300">Base Price ({tier}):</span>
          <span className="text-white font-semibold">${config.price}/mo</span>
        </div>
        {extraProtections > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">
              Extra Protections ({extraProtections} × ${config.extra}):
            </span>
            <span className="text-green-400 font-semibold">
              +${extraCost}/mo
            </span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 border-t border-gray-600">
          <span className="text-white font-bold">Total Monthly Cost:</span>
          <span className="text-green-400 font-bold text-lg">
            ${totalCost}/mo
          </span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-300 mb-2">
          Your {tier} plan includes{" "}
          <span className="text-green-400 font-semibold">
            {config.included}
          </span>{" "}
          protections.
        </p>
        <p className="text-gray-300 mb-4">
          You can select additional protections for{" "}
          <span className="text-green-400 font-semibold">
            ${config.extra} each
          </span>
          .
        </p>
        <p className="text-gray-300">
          Currently selected:{" "}
          <span className="text-green-400 font-semibold">
            {selectedProtections.length}
          </span>{" "}
          protections
          {extraProtections > 0 && (
            <span className="text-yellow-400">
              {" "}
              (+{extraProtections} extra)
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {allProtections.map((protection) => (
          <div
            key={protection}
            onClick={() => handleToggle(protection)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedProtections.includes(protection)
                ? "border-green-400 bg-green-500/10"
                : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">{protection}</span>
              <div className="flex items-center space-x-2">
                {selectedProtections.includes(protection) && (
                  <span className="text-green-400">✓</span>
                )}
                {selectedProtections.includes(protection) &&
                  selectedProtections.indexOf(protection) >=
                    config.included && (
                    <span className="text-yellow-400 text-xs">+$10</span>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProtections.length > 0 && (
        <div className="mt-auto p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <h3 className="text-green-400 font-semibold mb-2">
            Active Protections:
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedProtections.map((protection, index) => (
              <span
                key={protection}
                className={`px-3 py-1 rounded-full text-sm ${
                  index >= config.included
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {protection}
                {index >= config.included && (
                  <span className="ml-1 text-xs">(+$10)</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Billing Confirmation Modal */}
      {showBillingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-yellow-400 text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Update Billing
              </h3>
              <p className="text-gray-400">
                You're about to add{" "}
                <span className="text-yellow-400 font-semibold">
                  {pendingProtection}
                </span>{" "}
                as an extra protection.
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-600 rounded-xl p-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Monthly Cost:</span>
                  <span className="text-white font-semibold">
                    ${totalCost}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Additional Protection:</span>
                  <span className="text-yellow-400 font-semibold">
                    +${config.extra}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                  <span className="text-white font-bold">
                    New Monthly Cost:
                  </span>
                  <span className="text-green-400 font-bold">
                    ${totalCost + config.extra}/mo
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancelExtra}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExtra}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Confirm & Update Billing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

export default Dashboard;
