import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTier } from "./TierContext";

// Import tierConfig directly
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

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    tier,
    setTier,
    config,
    selectedProtections,
    setSelectedProtections,
    allProtections,
    swapCount,
    setSwapCount,
  } = useTier();
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showSwapChargeModal, setShowSwapChargeModal] = useState(false);
  const [showSwapSelectionModal, setShowSwapSelectionModal] = useState(false);
  const [showAddOnConfirmationModal, setShowAddOnConfirmationModal] =
    useState(false);
  const [pendingProtection, setPendingProtection] = useState(null);
  const [originalProtections, setOriginalProtections] = useState([]);
  const [isInSwapMode, setIsInSwapMode] = useState(false);
  const [removedProtection, setRemovedProtection] = useState(null);
  const [paidSwapProtections, setPaidSwapProtections] = useState([]);
  const [addOnProtections, setAddOnProtections] = useState([]);

  // Initialize add-on protections based on current selection
  useEffect(() => {
    const currentAddOns = selectedProtections.filter(
      (_, index) => index >= config.included
    );
    setAddOnProtections(currentAddOns);
  }, [selectedProtections, config.included]);

  // Calculate extra protections and pricing
  // If in swap mode, maintain the original add-on count until swap is completed
  const originalAddOnCount =
    isInSwapMode && removedProtection
      ? Math.max(0, selectedProtections.length + 1 - config.included)
      : Math.max(0, selectedProtections.length - config.included);

  const extraProtections =
    isInSwapMode && removedProtection
      ? originalAddOnCount
      : Math.max(0, selectedProtections.length - config.included);

  const extraCost = extraProtections * config.addonsPrice;

  // Calculate swap charges
  const freeSwaps = tier === "Pup SR." ? 1 : 0;
  const paidSwaps = Math.max(0, swapCount - freeSwaps);
  const swapCharges = paidSwaps * config.swapPrice;

  const totalCost = config.price + extraCost + swapCharges;

  // Debug pricing
  console.log("Pricing debug:", {
    tier,
    selectedProtectionsLength: selectedProtections.length,
    included: config.included,
    extraProtections,
    extraCost,
    basePrice: config.price,
    totalCost,
    addonsPrice: config.addonsPrice,
  });

  // Helper function to determine if a protection should show add-on indicator
  const shouldShowAddOnIndicator = (protection) => {
    // Check if this protection is tracked as an add-on
    if (addOnProtections.includes(protection)) {
      return true;
    }

    // If in swap mode, show indicator on protections that were add-ons before the swap
    if (isInSwapMode && removedProtection && originalProtections.length > 0) {
      // Show on protections that were originally add-ons (beyond included count)
      const originalAddOnIndex = originalProtections.indexOf(protection);
      return originalAddOnIndex >= config.included;
    }

    // Normal case: show on protections beyond included count
    const isSelected = selectedProtections.includes(protection);
    return (
      isSelected && selectedProtections.indexOf(protection) >= config.included
    );
  };

  // Handle toggle
  const handleToggle = (protection) => {
    const isSelected = selectedProtections.includes(protection);
    const includedCount = config.included;
    const maxProtections = tier === "Alpha" ? Infinity : tierConfig[tier].max;
    const currentCount = selectedProtections.length;
    const isNotCurrentlySelected = !isSelected;

    // Debug logging
    console.log("handleToggle debug:", {
      protection,
      tier,
      includedCount,
      maxProtections,
      currentCount,
      isSelected,
      isNotCurrentlySelected,
      tierConfig: tierConfig[tier],
    });

    // Check if we're in swap mode (user just unclicked a protection)
    if (isInSwapMode && removedProtection && isNotCurrentlySelected) {
      // This is a swap operation
      const isFreeSwap = swapCount === 0 && tier === "Pup SR.";
      const isUnlimitedSwap = tier === "Guardian" || tier === "Alpha";

      if (isFreeSwap || isUnlimitedSwap) {
        setOriginalProtections([...selectedProtections]);
        setPendingProtection(protection);
        setShowSwapModal(true);
      } else {
        setOriginalProtections([...selectedProtections]);
        setPendingProtection(protection);
        setShowSwapChargeModal(true);
      }
      // Reset swap mode
      setIsInSwapMode(false);
      setRemovedProtection(null);
      return;
    }

    // If we're in swap mode but shouldn't be, reset it
    if (isInSwapMode && !removedProtection) {
      setIsInSwapMode(false);
      setRemovedProtection(null);
      setOriginalProtections([]);
    }

    // 1. If user has < included protections and clicks a new protection: Add directly
    if (currentCount < includedCount && isNotCurrentlySelected) {
      setSelectedProtections([...selectedProtections, protection]);
      return;
    }
    // 2. If user has < included protections and clicks a protection already selected: Remove directly
    if (currentCount < includedCount && isSelected) {
      setSelectedProtections(
        selectedProtections.filter((p) => p !== protection)
      );
      return;
    }
    // 3. If user has exactly included protections
    if (currentCount === includedCount) {
      if (isNotCurrentlySelected) {
        // Clicking a new protection: show billing modal (add-on)
        setPendingProtection(protection);
        setShowBillingModal(true);
        return;
      } else {
        // Unclicking a selected protection: just remove it (no swap during add-on selection)
        setSelectedProtections(
          selectedProtections.filter((p) => p !== protection)
        );
        return;
      }
    }
    // 4. If user has > included protections (add-ons) - this means they've already paid for add-ons
    if (currentCount > includedCount) {
      // Check if this protection is a paid add-on (beyond included count)
      const protectionIndex = selectedProtections.indexOf(protection);
      const isPaidAddOn = protectionIndex >= includedCount;

      // If clicking a selected protection: this creates a swap opportunity (only for paid add-ons)
      if (isSelected && isPaidAddOn) {
        const newProtections = selectedProtections.filter(
          (p) => p !== protection
        );
        setSelectedProtections(newProtections);
        // Store the removed protection for potential swap
        setRemovedProtection(protection);
        setIsInSwapMode(true);
        return;
      }

      // If clicking a selected protection that's included (not paid): just remove it
      if (isSelected && !isPaidAddOn) {
        setSelectedProtections(
          selectedProtections.filter((p) => p !== protection)
        );
        return;
      }

      // If not at max, check if we're in swap mode first
      if (currentCount < maxProtections) {
        // If we just removed a protection (creating swap opportunity), treat as swap
        if (removedProtection) {
          const isFreeSwap = swapCount === 0 && tier === "Pup SR.";
          const isUnlimitedSwap = tier === "Guardian" || tier === "Alpha";

          console.log("Swap logic triggered:", {
            removedProtection,
            isFreeSwap,
            isUnlimitedSwap,
            swapCount,
            tier,
          });

          if (isFreeSwap || isUnlimitedSwap) {
            setOriginalProtections([...selectedProtections]);
            setPendingProtection(protection);
            setShowSwapModal(true);
          } else {
            setOriginalProtections([...selectedProtections]);
            setPendingProtection(protection);
            setShowSwapChargeModal(true);
          }
          // Reset swap mode
          setIsInSwapMode(false);
          setRemovedProtection(null);
          return;
        }

        // Otherwise, treat as a new add-on
        setPendingProtection(protection);
        setShowBillingModal(true);
        return;
      }
      // If at max and clicking a new protection: show billing modal (user can choose add-on or swap)
      if (currentCount === maxProtections && isNotCurrentlySelected) {
        setPendingProtection(protection);
        setShowBillingModal(true);
        return;
      }
    }
    // 5. If user has includedCount - 1 protections and clicks a new protection: show billing modal
    if (currentCount === includedCount - 1 && isNotCurrentlySelected) {
      setPendingProtection(protection);
      setShowBillingModal(true);
      return;
    }
  };

  // Handle protection selection for swap
  const handleSelectProtectionForSwap = (protectionToAdd) => {
    setPendingProtection(protectionToAdd);
    setShowSwapSelectionModal(false);
    setShowSwapModal(true);
  };

  // Handle swap confirmation (free swap)
  const handleConfirmSwap = () => {
    if (pendingProtection) {
      // Add the protection as a free swap
      setSelectedProtections([...selectedProtections, pendingProtection]);

      setPendingProtection(null);
      setShowSwapModal(false);
      setOriginalProtections([]);
      setIsInSwapMode(false);
      setRemovedProtection(null);
      // Increment swap count for Pup SR.
      if (tier === "Pup SR.") {
        setSwapCount(swapCount + 1);
      }
      // No navigation needed for free swaps
    }
  };

  // Handle swap cancellation
  const handleCancelSwap = () => {
    // If we're in swap mode with a removed protection, restore original protections
    if (isInSwapMode && removedProtection) {
      setSelectedProtections(originalProtections);
    }
    // If we're in swap mode without a removed protection (from billing modal),
    // restore original protections if they were modified in swap selection modal
    if (isInSwapMode && !removedProtection && originalProtections.length > 0) {
      setSelectedProtections(originalProtections);
    }

    setPendingProtection(null);
    setShowSwapModal(false);
    setShowSwapChargeModal(false);
    setShowSwapSelectionModal(false);
    setShowBillingModal(false); // Ensure billing modal is also closed
    setShowAddOnConfirmationModal(false);
    setOriginalProtections([]);
    setIsInSwapMode(false);
    setRemovedProtection(null);
  };

  // Handle paid swap confirmation ($5 charge)
  const handleConfirmPaidSwap = () => {
    if (pendingProtection) {
      setSelectedProtections([...selectedProtections, pendingProtection]);
      setPendingProtection(null);
      setShowSwapChargeModal(false);
      setOriginalProtections([]);
      setIsInSwapMode(false);
      setRemovedProtection(null);
      // Track this protection as a paid swap
      setPaidSwapProtections([...paidSwapProtections, pendingProtection]);
      // Increment swap count for Pup SR.
      if (tier === "Pup SR.") {
        setSwapCount(swapCount + 1);
      }
      // Redirect to settings for billing update
      navigate("/settings");
    }
  };

  // Handle confirmation of extra protection
  const handleConfirmExtra = () => {
    if (pendingProtection) {
      setShowBillingModal(false);
      setShowAddOnConfirmationModal(true);
    }
  };

  // Handle cancellation of extra protection
  const handleCancelExtra = () => {
    setPendingProtection(null);
    setShowBillingModal(false);
  };

  // Handle final confirmation of add-on and navigate to billing
  const handleConfirmAddOnAndBilling = () => {
    if (pendingProtection) {
      setSelectedProtections([...selectedProtections, pendingProtection]);
      setPendingProtection(null);
      setShowAddOnConfirmationModal(false);
      // Navigate to settings for billing update with state
      navigate("/settings", { state: { fromAddOnConfirmation: true } });
    }
  };

  // Handle payment for add-on
  const handlePayForAddOn = () => {
    if (pendingProtection) {
      setSelectedProtections([...selectedProtections, pendingProtection]);
      setPendingProtection(null);
      setShowAddOnConfirmationModal(false);
      // Navigate to payment page with add-on details
      navigate("/payment", {
        state: {
          fromAddOnConfirmation: true,
          addOnProtection: pendingProtection,
          addOnCost: config.addonsPrice,
          currentTier: tier,
          totalCost: totalCost + config.addonsPrice,
        },
      });
    }
  };

  // Handle cancellation of add-on confirmation
  const handleCancelAddOnConfirmation = () => {
    setPendingProtection(null);
    setShowAddOnConfirmationModal(false);
  };

  // For Pup SR.: Add one more add-on without updating billing
  const handleAddOneMoreAddon = () => {
    console.log("handleAddOneMoreAddon called with:", {
      pendingProtection,
      selectedProtections: selectedProtections.length,
      tier,
      max: tierConfig[tier].max,
    });

    if (pendingProtection) {
      setSelectedProtections([...selectedProtections, pendingProtection]);
      setPendingProtection(null);
      setShowBillingModal(false);
      // Don't increment swap count for add-ons - only for swaps
      // Reset swap mode if we were in it
      setIsInSwapMode(false);
      setRemovedProtection(null);
      setOriginalProtections([]);
    }
  };

  // Handle tier change
  const handleTierChange = (newTier) => {
    setTier(newTier);
    // Reset selected protections to match new tier
    const newConfig = tierConfig[newTier];
    setSelectedProtections(allProtections.slice(0, newConfig.included));
    // Reset swap-related states
    setSwapCount(0);
    setPaidSwapProtections([]);
    setAddOnProtections([]);
    setIsInSwapMode(false);
    setRemovedProtection(null);
    // Close any open modals
    setShowBillingModal(false);
    setShowSwapModal(false);
    setShowSwapChargeModal(false);
    setShowSwapSelectionModal(false);
    setShowAddOnConfirmationModal(false);
  };

  return (
    <div className="flex flex-col h-full flex-1 min-h-0 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Protection Dashboard</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/analytics")}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            View Analytics →
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Settings →
          </button>
        </div>
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
          {Object.keys(tierConfig)
            .filter((tierOption) => tierOption !== "Enterprise")
            .map((tierOption) => (
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
              Extra Protections ({extraProtections} × ${config.addonsPrice})
              {isInSwapMode && removedProtection && " (swap pending)"}:
            </span>
            <span className="text-green-400 font-semibold">
              +${extraCost}/mo
            </span>
          </div>
        )}
        {swapCharges > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">
              Swap Charges ({paidSwaps} × $5):
            </span>
            <span className="text-red-400 font-semibold">
              +${swapCharges}/mo
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
      {/* Add-ons & Swaps summary for selected tier */}
      <div className="mb-6 p-4 bg-green-900/60 border-l-4 border-green-500 rounded-xl">
        <span className="text-green-300 font-semibold">Add-ons & Swaps: </span>
        <span className="text-green-100">
          {tier === "Pup JR." && "No add-ons or swaps."}
          {tier === "Pup SR." && (
            <>
              Up to 2 add-ons ($10 each), 1 free swap/month,
              <br />
              <span style={{ paddingLeft: "2.2ch", display: "inline-block" }}>
                $5 per extra swap. Swaps used: {swapCount}/1 free
              </span>
            </>
          )}
          {tier === "Guardian" &&
            "Up to 3 add-ons ($10 each), unlimited swaps."}
          {tier === "Alpha" && "Unlimited add-ons, unlimited swaps."}
        </span>
      </div>

      <div className="mb-6">
        <p className="text-gray-300 mb-2">
          Your {tier} plan includes{" "}
          <span className="text-green-400 font-semibold">
            {config.included}
          </span>{" "}
          protections.
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
        {allProtections.map((protection, idx) => {
          const isSelected = selectedProtections.includes(protection);
          const isAtMax = selectedProtections.length >= tierConfig[tier].max;
          const isSelectable = !isAtMax || isSelected; // Can always unselect, but can't select new ones at max

          return (
            <div
              key={protection}
              onClick={
                isSelectable ? () => handleToggle(protection) : undefined
              }
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? "border-green-400 bg-green-500/10"
                  : isSelectable
                  ? "border-gray-700 bg-gray-800/30 hover:border-gray-600 cursor-pointer"
                  : "border-gray-800 bg-gray-900/40 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`font-medium ${
                    isSelectable ? "text-white" : "text-gray-500"
                  }`}
                >
                  {protection}
                </span>
                <div className="flex items-center space-x-2">
                  {isSelected && isSelectable && (
                    <span className="text-green-400">✓</span>
                  )}
                </div>
              </div>
              {shouldShowAddOnIndicator(protection) && (
                <div className="text-center">
                  <span className="text-yellow-400 text-xs font-semibold">
                    +${config.addonsPrice}
                  </span>
                </div>
              )}
              {paidSwapProtections.includes(protection) && (
                <div className="text-center mt-1">
                  <span className="text-red-400 text-xs font-semibold">
                    +$5
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add One More Add-on Button for Pup SR. */}
      {tier === "Pup SR." && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="text-center">
            <h3 className="text-yellow-400 font-semibold mb-2">
              {selectedProtections.length >= tierConfig[tier].max
                ? "Max Add-ons Reached"
                : "Free Add-on Available"}
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              {selectedProtections.length >= tierConfig[tier].max
                ? "You have reached the maximum number of add-ons for your tier."
                : "You have a free add-on available this month. Select a protection above to add it without additional cost."}
            </p>
            <div className="text-yellow-400 text-xs mb-3">
              Swaps used: {swapCount}/{tierConfig[tier].swap} | Add-ons
              remaining:{" "}
              {Math.max(0, tierConfig[tier].max - selectedProtections.length)}
            </div>

            {/* Add One More Add-on Button (outside modal) */}
            {(() => {
              const isDisabled =
                selectedProtections.length >= tierConfig[tier].max;

              console.log("Outside modal button condition:", {
                tier,
                selectedProtectionsLength: selectedProtections.length,
                max: tierConfig[tier].max,
                swapCount,
                maxSwaps: tierConfig[tier].swap,
                isDisabled,
                reason:
                  selectedProtections.length >= tierConfig[tier].max
                    ? "Max protections reached"
                    : "Can add more",
              });

              return (
                <button
                  onClick={handleAddOneMoreAddon}
                  disabled={isDisabled}
                  className={`w-full px-4 py-2 font-semibold rounded-lg transition-all duration-200 transform ${
                    isDisabled
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-yellow-600 hover:bg-yellow-500 text-white hover:scale-105"
                  }`}
                >
                  {isDisabled ? "Max Add-ons Reached" : "Add One More Add-on"}
                </button>
              );
            })()}
          </div>
        </div>
      )}

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
                  <span className="ml-1 text-xs">(+${config.addonsPrice})</span>
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
                    +${config.addonsPrice}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                  <span className="text-white font-bold">
                    New Monthly Cost:
                  </span>
                  <span className="text-green-400 font-bold">
                    ${totalCost + config.addonsPrice}/mo
                  </span>
                </div>
                {tier === "Pup SR." && (
                  <div className="mt-2 text-center">
                    <span className="text-sm text-gray-400">
                      Current add-ons:{" "}
                      {Math.max(
                        0,
                        selectedProtections.length - config.included
                      )}{" "}
                      | New add-ons:{" "}
                      {Math.max(
                        0,
                        selectedProtections.length - config.included + 1
                      )}
                    </span>
                  </div>
                )}
                {tier === "Pup SR." && (
                  <div className="mt-3 text-center">
                    <span className="text-sm text-green-300 font-semibold">
                      Add-ons remaining:{" "}
                      {2 - (selectedProtections.length - config.included + 1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancelExtra}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              {tier === "Pup SR." && swapCount === 0 && (
                <button
                  onClick={() => {
                    setShowBillingModal(false);
                    setShowSwapSelectionModal(true);
                    setOriginalProtections([...selectedProtections]);
                    setIsInSwapMode(true);
                    setRemovedProtection(null); // No protection removed yet
                    // Keep the pending protection for the swap
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Free Swap Available
                </button>
              )}
              {(() => {
                const shouldShowButton = tier === "Pup SR.";
                const isDisabled =
                  selectedProtections.length >= tierConfig[tier].max;

                console.log("Add One More Add-on button condition:", {
                  tier,
                  selectedProtectionsLength: selectedProtections.length,
                  max: tierConfig[tier].max,
                  swapCount,
                  maxSwaps: tierConfig[tier].swap,
                  shouldShowButton,
                  isDisabled,
                  reason:
                    selectedProtections.length >= tierConfig[tier].max
                      ? "Max protections reached"
                      : "Can add more",
                });

                return shouldShowButton ? (
                  <button
                    onClick={handleAddOneMoreAddon}
                    disabled={isDisabled}
                    className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-all duration-200 transform ${
                      isDisabled
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-yellow-600 hover:bg-yellow-500 text-white hover:scale-105"
                    }`}
                  >
                    {isDisabled ? "Max Add-ons Reached" : "Add One More Add-on"}
                  </button>
                ) : null;
              })()}
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

      {/* Add-On Confirmation Modal */}
      {showAddOnConfirmationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-400 text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Confirm Add-On Selection
              </h3>
              <p className="text-gray-400">
                You're about to add{" "}
                <span className="text-green-400 font-semibold">
                  {pendingProtection}
                </span>{" "}
                to your protection plan.
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-600 rounded-xl p-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Add-On Protection:</span>
                  <span className="text-green-400 font-semibold">
                    {pendingProtection}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Additional Cost:</span>
                  <span className="text-yellow-400 font-semibold">
                    +${config.addonsPrice}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">New Total Protections:</span>
                  <span className="text-white font-semibold">
                    {selectedProtections.length + 1}
                  </span>
                </div>
                {tier === "Pup SR." && (
                  <div className="mt-3 text-center">
                    <span className="text-sm text-green-300 font-semibold">
                      Add-ons remaining:{" "}
                      {2 - (selectedProtections.length - config.included + 1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancelAddOnConfirmation}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddOnAndBilling}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Update Billing Later
              </button>
              <button
                onClick={handlePayForAddOn}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                💳 Pay Now (${totalCost + config.addonsPrice})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Swap Selection Modal */}
      {showSwapSelectionModal && !showBillingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Manage Your Protections for Free Swap
              </h3>
              <p className="text-gray-400">
                Unclick protections you want to remove, then select a new
                protection to add
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-600 rounded-xl p-4 mb-6">
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <span className="text-sm text-gray-300">
                    Current Protections ({selectedProtections.length}):
                  </span>
                </div>

                {/* Current protections - can be unclicked */}
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {selectedProtections.map((protection) => (
                    <button
                      key={protection}
                      onClick={() => {
                        // Remove this protection from selection
                        setSelectedProtections(
                          selectedProtections.filter((p) => p !== protection)
                        );
                      }}
                      className="p-3 text-left border border-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">
                          {protection}
                        </span>
                        <span className="text-red-400 text-sm">← Remove</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <div className="text-center mb-4">
                    <span className="text-sm text-gray-300">
                      Available Protections to Add:
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {allProtections.map((protection) => (
                      <button
                        key={protection}
                        onClick={() =>
                          handleSelectProtectionForSwap(protection)
                        }
                        disabled={selectedProtections.includes(protection)}
                        className={`p-3 text-left border rounded-lg transition-all duration-200 ${
                          !selectedProtections.includes(protection)
                            ? "bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-blue-500 cursor-pointer"
                            : "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-medium ${
                              !selectedProtections.includes(protection)
                                ? "text-white"
                                : "text-gray-500"
                            }`}
                          >
                            {protection}
                          </span>
                          {!selectedProtections.includes(protection) && (
                            <span className="text-blue-400 text-sm">→ Add</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancelSwap}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Swap Confirmation Modal */}
      {showSwapModal && !showBillingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 text-2xl">↔️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Confirm Free Swap
              </h3>
              <p className="text-gray-400">
                You are about to add {pendingProtection} as a free swap.
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-600 rounded-xl p-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Protections after swap:</span>
                  <span className="text-white font-semibold">
                    {selectedProtections.length + 1}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Protection to Add:</span>
                  <span className="text-green-400 font-semibold">
                    {pendingProtection}
                  </span>
                </div>
                {originalProtections.length > selectedProtections.length && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Protections Removed:</span>
                    <span className="text-red-400 font-semibold">
                      {originalProtections.length - selectedProtections.length}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                  <span className="text-white font-bold">Net Change:</span>
                  <span
                    className={`font-bold ${
                      selectedProtections.length + 1 >
                      originalProtections.length
                        ? "text-green-400"
                        : selectedProtections.length + 1 <
                          originalProtections.length
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {selectedProtections.length +
                      1 -
                      originalProtections.length >
                    0
                      ? "+"
                      : ""}
                    {selectedProtections.length +
                      1 -
                      originalProtections.length}{" "}
                    protection
                    {selectedProtections.length +
                      1 -
                      originalProtections.length !==
                    1
                      ? "s"
                      : ""}
                  </span>
                </div>
                {tier === "Pup SR." && (
                  <div className="mt-3 text-center">
                    <span className="text-sm text-yellow-300 font-semibold">
                      Free swaps remaining this month:{" "}
                      {Math.max(0, 1 - swapCount)}
                    </span>
                    <br />
                    <span className="text-sm text-gray-400">
                      Additional swaps: $5 each
                    </span>
                    {swapCount > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-red-400 font-semibold">
                          This will be a paid swap (+$5)
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {tier === "Guardian" && (
                  <div className="mt-3 text-center">
                    <span className="text-sm text-green-300 font-semibold">
                      Unlimited swaps included
                    </span>
                  </div>
                )}
                {tier === "Alpha" && (
                  <div className="mt-3 text-center">
                    <span className="text-sm text-green-300 font-semibold">
                      Unlimited swaps included
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancelSwap}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSwap}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Confirm Free Swap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paid Swap Charge Modal */}
      {showSwapChargeModal && !showBillingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-400 text-2xl">💸</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Swap Charge Required
              </h3>
              <p className="text-gray-400">
                You are about to swap a protection for{" "}
                <span className="text-red-400 font-semibold">
                  {pendingProtection}
                </span>{" "}
                in your protection selection. This will incur a $5 charge.
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
                  <span className="text-gray-300">Swap Charge:</span>
                  <span className="text-red-400 font-semibold">+$5</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                  <span className="text-white font-bold">
                    New Monthly Cost:
                  </span>
                  <span className="text-green-400 font-bold">
                    ${totalCost + config.swapPrice}/mo
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancelSwap}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPaidSwap}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Confirm Swap & Charge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
