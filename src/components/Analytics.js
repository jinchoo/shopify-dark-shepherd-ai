import React from "react";
import { useTier } from "./TierContext";

const Analytics = () => {
  const { tier, config, selectedProtections, allProtections } = useTier();

  // Calculate extra protections and pricing
  const extraProtections = Math.max(
    0,
    selectedProtections.length - config.included
  );
  const extraCost = extraProtections * config.addonsPrice;
  const totalCost = config.price + extraCost;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Security Analytics</h2>
        <div className="text-right">
          <div className="text-sm text-gray-400">Selected Protections</div>
          <div className="text-2xl font-bold text-green-400">
            {selectedProtections.length}
          </div>
        </div>
      </div>

      {/* Pricing Information */}
      <div className="mb-6 p-4 bg-gray-800 border border-gray-600 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300">Base Price ({tier}):</span>
          <span className="text-white font-semibold">${config.price}/mo</span>
        </div>
        {extraProtections > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">
              Extra Protections ({extraProtections} × ${config.addonsPrice}):
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedProtections.map((protection, index) => (
          <div
            key={protection}
            className={`p-6 rounded-xl border-2 ${
              index >= config.included
                ? "border-yellow-500 bg-yellow-500/20"
                : "border-green-500 bg-green-500/20"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{protection}</h3>
              <div className="flex items-center space-x-2">
                {index >= config.included && (
                  <span className="px-2 py-1 bg-yellow-500 text-yellow-900 text-xs rounded-full font-semibold">
                    +$10
                  </span>
                )}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    index >= config.included
                      ? "bg-yellow-500 text-yellow-900"
                      : "bg-green-500 text-green-900"
                  }`}
                >
                  Active
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Threat Level</span>
                <span className="text-red-400 font-semibold">High</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Blocked Attacks</span>
                <span className="text-green-400 font-semibold">
                  {Math.floor(Math.random() * 1000) + 100}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-green-400 font-semibold">
                  {Math.floor(Math.random() * 20) + 80}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Last Updated</span>
                <span className="text-gray-300 text-sm">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProtections.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            No protections selected yet
          </div>
          <div className="text-gray-500">
            Go to Dashboard to select your security protections
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
