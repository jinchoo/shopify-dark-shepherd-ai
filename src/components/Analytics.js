import React, { useState } from "react";
import { useTier } from "./TierContext";

const Analytics = () => {
  const { tier, config, selectedProtections } = useTier();
  const [expandedCard, setExpandedCard] = useState(null);
  const [fixingProtection, setFixingProtection] = useState(null);
  const [fixResults, setFixResults] = useState({});
  const [updatedSecurityData, setUpdatedSecurityData] = useState({});

  // Calculate extra protections and pricing
  const extraProtections = Math.max(
    0,
    selectedProtections.length - config.included
  );
  const extraCost = extraProtections * config.addonsPrice;
  const totalCost = config.price + extraCost;

  // Security data for each protection
  const getSecurityData = (protection) => {
    // Check if we have updated data for this protection
    if (updatedSecurityData[protection]) {
      return updatedSecurityData[protection];
    }
    const data = {
      "Basic alerts": {
        status: "warning",
        threatLevel: "Medium",
        blockedAttacks: 45,
        successRate: 92,
        lastUpdated: "2 minutes ago",
        description: "Real-time alerts for suspicious activities",
        issues: [
          "Alert sensitivity needs adjustment",
          "2 false positives detected",
        ],
        recommendations: [
          "Increase sensitivity threshold",
          "Review alert patterns",
        ],
        fixAction: "Optimize alert settings",
      },
      "Basic fraud scan": {
        status: "good",
        threatLevel: "Low",
        blockedAttacks: 128,
        successRate: 98,
        lastUpdated: "5 minutes ago",
        description: "Automated fraud detection and prevention",
        issues: [],
        recommendations: [
          "Continue monitoring",
          "Consider advanced fraud tools",
        ],
        fixAction: "Run deep scan",
      },
      "Weekly summary": {
        status: "good",
        threatLevel: "Low",
        blockedAttacks: 12,
        successRate: 100,
        lastUpdated: "1 hour ago",
        description: "Weekly security report and insights",
        issues: [],
        recommendations: ["Review weekly trends", "Share with team"],
        fixAction: "Generate report",
      },
      "DDoS Protection": {
        status: "critical",
        threatLevel: "High",
        blockedAttacks: 2047,
        successRate: 85,
        lastUpdated: "30 seconds ago",
        description: "Distributed Denial of Service attack prevention",
        issues: ["DDoS attack in progress", "Bandwidth usage at 95%"],
        recommendations: ["Scale up protection", "Contact support immediately"],
        fixAction: "Activate emergency protection",
      },
      "Advanced analytics": {
        status: "warning",
        threatLevel: "Medium",
        blockedAttacks: 89,
        successRate: 94,
        lastUpdated: "10 minutes ago",
        description: "Advanced threat detection and analysis",
        issues: [
          "Anomaly detection needs tuning",
          "3 suspicious patterns detected",
        ],
        recommendations: ["Update detection rules", "Review recent alerts"],
        fixAction: "Update detection rules",
      },
      "AI assistant": {
        status: "good",
        threatLevel: "Low",
        blockedAttacks: 67,
        successRate: 96,
        lastUpdated: "15 minutes ago",
        description: "AI-powered security recommendations",
        issues: [],
        recommendations: ["Continue AI learning", "Review suggestions"],
        fixAction: "Run AI analysis",
      },
      "PCI compliance tools": {
        status: "warning",
        threatLevel: "Medium",
        blockedAttacks: 34,
        successRate: 91,
        lastUpdated: "1 hour ago",
        description: "Payment Card Industry compliance monitoring",
        issues: ["Compliance score at 87%", "2 violations detected"],
        recommendations: [
          "Address compliance issues",
          "Update security policies",
        ],
        fixAction: "Run compliance check",
      },
      "Real-time threat intelligence": {
        status: "critical",
        threatLevel: "High",
        blockedAttacks: 156,
        successRate: 82,
        lastUpdated: "1 minute ago",
        description: "Real-time threat intelligence and updates",
        issues: ["New threat detected", "Intelligence feed delayed"],
        recommendations: [
          "Update threat database",
          "Check intelligence sources",
        ],
        fixAction: "Update threat database",
      },
      "Account takeover (ATO) protection": {
        status: "good",
        threatLevel: "Low",
        blockedAttacks: 23,
        successRate: 97,
        lastUpdated: "5 minutes ago",
        description: "Account takeover prevention and detection",
        issues: [],
        recommendations: ["Continue monitoring", "Review login patterns"],
        fixAction: "Run ATO scan",
      },
      "Bot mitigation (CAPTCHA, rate limits)": {
        status: "warning",
        threatLevel: "Medium",
        blockedAttacks: 445,
        successRate: 89,
        lastUpdated: "2 minutes ago",
        description: "Bot attack prevention and mitigation",
        issues: ["Bot traffic increased 40%", "Rate limits need adjustment"],
        recommendations: ["Increase rate limits", "Update CAPTCHA settings"],
        fixAction: "Adjust rate limits",
      },
    };
    return (
      data[protection] || {
        status: "good",
        threatLevel: "Low",
        blockedAttacks: Math.floor(Math.random() * 100) + 10,
        successRate: Math.floor(Math.random() * 20) + 80,
        lastUpdated: "Recently",
        description: "Security protection active",
        issues: [],
        recommendations: ["Continue monitoring"],
        fixAction: "Run security check",
      }
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "good":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "critical":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case "good":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleFixProtection = async (protection) => {
    setFixingProtection(protection);

    // Simulate fixing process with detailed steps
    const steps = [
      "Initializing scan...",
      "Analyzing security patterns...",
      "Detecting vulnerabilities...",
      "Applying fixes...",
      "Verifying changes...",
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // Generate realistic fix results
    const securityData = getSecurityData(protection);
    const results = {
      success: Math.random() > 0.2, // 80% success rate
      issuesFound: Math.floor(Math.random() * 3) + 1,
      issuesFixed: Math.floor(Math.random() * 3) + 1,
      newStatus: Math.random() > 0.3 ? "good" : "warning",
      improvements: [
        "Security patterns updated",
        "Threat detection enhanced",
        "Response time improved",
      ],
      recommendations: [
        "Monitor for 24 hours",
        "Review weekly reports",
        "Consider additional protections",
      ],
    };

    setFixResults((prev) => ({
      ...prev,
      [protection]: results,
    }));

    // Update the security data to reflect the fix
    const originalData = getSecurityData(protection);
    const updatedData = {
      ...originalData,
      status: results.newStatus,
      threatLevel: results.newStatus === "good" ? "Low" : "Medium",
      successRate: Math.min(
        100,
        originalData.successRate + (results.success ? 5 : 2)
      ),
      lastUpdated: "Just now",
      issues: results.success ? [] : originalData.issues.slice(0, 1), // Remove some issues if successful
    };

    setUpdatedSecurityData((prev) => ({
      ...prev,
      [protection]: updatedData,
    }));

    setFixingProtection(null);
  };

  const handleCardClick = (protection) => {
    setExpandedCard(expandedCard === protection ? null : protection);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 h-full overflow-y-auto">
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

      {/* Security Overview */}
      <div className="mb-6 p-4 bg-blue-900/60 border border-blue-500/30 rounded-xl">
        <h3 className="text-blue-300 font-semibold mb-2">Security Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {
                selectedProtections.filter(
                  (p) => getSecurityData(p).status === "good"
                ).length
              }
            </div>
            <div className="text-gray-400">Good</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {
                selectedProtections.filter(
                  (p) => getSecurityData(p).status === "warning"
                ).length
              }
            </div>
            <div className="text-gray-400">Warning</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {
                selectedProtections.filter(
                  (p) => getSecurityData(p).status === "critical"
                ).length
              }
            </div>
            <div className="text-gray-400">Critical</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedProtections.map((protection, index) => {
          const securityData = getSecurityData(protection);
          const isExpanded = expandedCard === protection;
          const isFixing = fixingProtection === protection;
          const fixResult = fixResults[protection];

          return (
            <div
              key={protection}
              onClick={() => handleCardClick(protection)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                index >= config.included
                  ? "border-yellow-500 bg-yellow-500/10"
                  : "border-green-500 bg-green-500/10"
              } ${isExpanded ? "ring-2 ring-blue-400" : ""}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {protection}
                </h3>
                <div className="flex items-center space-x-2">
                  {index >= config.included && (
                    <span className="px-2 py-1 bg-yellow-500 text-yellow-900 text-xs rounded-full font-semibold">
                      +$10
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBg(
                      securityData.status
                    )} text-white`}
                  >
                    {securityData.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Threat Level</span>
                  <span
                    className={`font-semibold ${getStatusColor(
                      securityData.status
                    )}`}
                  >
                    {securityData.threatLevel}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Blocked Attacks</span>
                  <span className="text-green-400 font-semibold">
                    {securityData.blockedAttacks}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Success Rate</span>
                  <span className="text-green-400 font-semibold">
                    {securityData.successRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Last Updated</span>
                  <span className="text-gray-300 text-sm">
                    {securityData.lastUpdated}
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-600 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">
                      Description
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {securityData.description}
                    </p>
                  </div>

                  {securityData.issues.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-red-400 mb-2">
                        Issues Detected
                      </h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {securityData.issues.map((issue, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-red-400 mr-2">•</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">
                      Recommendations
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {securityData.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fix Results */}
                  {fixResult && (
                    <div className="mt-4 p-3 bg-gray-800 border border-gray-600 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-white">
                          Fix Results
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            fixResult.success
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {fixResult.success ? "SUCCESS" : "ISSUES REMAIN"}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Issues Found:</span>
                          <span className="text-white">
                            {fixResult.issuesFound}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Issues Fixed:</span>
                          <span className="text-green-400">
                            {fixResult.issuesFixed}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">New Status:</span>
                          <span
                            className={`font-semibold ${getStatusColor(
                              fixResult.newStatus
                            )}`}
                          >
                            {fixResult.newStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <h5 className="text-xs font-semibold text-green-400 mb-1">
                          Improvements Made:
                        </h5>
                        <ul className="text-xs text-gray-300 space-y-1">
                          {fixResult.improvements.map((improvement, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-green-400 mr-2">✓</span>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <h5 className="text-xs font-semibold text-blue-400 mb-1">
                          Next Steps:
                        </h5>
                        <ul className="text-xs text-gray-300 space-y-1">
                          {fixResult.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-blue-400 mr-2">→</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* One-Click Fix Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFixProtection(protection);
                    }}
                    disabled={isFixing}
                    className={`w-full px-4 py-2 font-semibold rounded-lg transition-all duration-200 ${
                      isFixing
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white transform hover:scale-105"
                    }`}
                  >
                    {isFixing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Fixing...
                      </div>
                    ) : (
                      `🔧 ${securityData.fixAction}`
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
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
