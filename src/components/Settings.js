import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTier } from "./TierContext";

const Settings = () => {
  const navigate = useNavigate();
  const { tier, config, selectedProtections, swapCount } = useTier();
  const [activeTab, setActiveTab] = useState("subscription");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  // Modal states
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [showBillingHistoryModal, setShowBillingHistoryModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Calculate billing details
  const extraProtections = Math.max(
    0,
    selectedProtections.length - config.included
  );
  const extraCost = extraProtections * config.addonsPrice;

  // Calculate swap charges (only for Pup SR. - $5 per swap beyond the free one)
  const freeSwaps = tier === "Pup SR." ? 1 : 0;
  const paidSwaps = Math.max(0, swapCount - freeSwaps);
  const swapCharges = paidSwaps * config.swapPrice;

  const totalCost = config.price + extraCost + swapCharges;

  const tabs = [
    { id: "subscription", label: "Subscription & Billing", icon: "💳" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "account", label: "Account", icon: "👤" },
  ];

  // Handle upgrade plan
  const handleUpgradePlan = () => {
    navigate("/pricing");
  };

  // Handle view usage
  const handleViewUsage = () => {
    setShowUsageModal(true);
  };

  // Handle billing history
  const handleBillingHistory = () => {
    setShowBillingHistoryModal(true);
  };

  // Handle cancel plan
  const handleCancelPlan = () => {
    setShowCancelModal(true);
  };

  // Handle cancel confirmation
  const handleCancelConfirm = () => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation before proceeding.");
      return;
    }
    // Here you would typically make an API call to cancel the subscription
    alert(
      "Your subscription has been cancelled. You'll receive a 10% discount on your final bill."
    );
    setShowCancelModal(false);
    setCancelReason("");
  };

  // Mock usage data
  const usageData = {
    "AI Fraud Detection": {
      usage: "98%",
      limit: "Unlimited",
      status: "Active",
    },
    "Real-Time Alerts": {
      usage: "1,247",
      limit: "Unlimited",
      status: "Active",
    },
    "PCI Compliance": { usage: "100%", limit: "Full", status: "Active" },
    "AI Assistant": { usage: "156", limit: "Unlimited", status: "Active" },
    "DDoS Protection": { usage: "24/7", limit: "Always On", status: "Active" },
    "Malware Scanning": {
      usage: "2,891",
      limit: "Unlimited",
      status: "Active",
    },
  };

  // Mock billing history
  const billingHistory = [
    {
      date: "2024-01-15",
      amount: "$119.00",
      status: "Paid",
      invoice: "INV-2024-001",
    },
    {
      date: "2023-12-15",
      amount: "$119.00",
      status: "Paid",
      invoice: "INV-2023-012",
    },
    {
      date: "2023-11-15",
      amount: "$109.00",
      status: "Paid",
      invoice: "INV-2023-011",
    },
    {
      date: "2023-10-15",
      amount: "$99.00",
      status: "Paid",
      invoice: "INV-2023-010",
    },
  ];

  const renderSubscriptionTab = () => (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Current Plan</h3>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
            Active
          </span>
        </div>

        {/* Billing Message for Extra Protections */}
        {extraProtections > 0 && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="text-yellow-400 text-xl">💰</div>
              <div>
                <h4 className="text-yellow-400 font-semibold mb-2">
                  Billing Update
                </h4>
                <p className="text-gray-300 mb-2">
                  You have selected{" "}
                  <span className="text-yellow-400 font-semibold">
                    {extraProtections} extra protection
                    {extraProtections > 1 ? "s" : ""}
                  </span>{" "}
                  beyond your plan's included protections.
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Extra charges starting today:
                    </span>
                    <span className="text-yellow-400 font-semibold">
                      +${extraCost + swapCharges}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Next billing cycle total:
                    </span>
                    <span className="text-green-400 font-semibold">
                      ${totalCost}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">{tier}</h4>
            <p className="text-gray-400 mb-4">Your current subscription plan</p>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Base Price:</span>
                <span className="text-white font-semibold">
                  ${config.price}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Included Protections:</span>
                <span className="text-green-400 font-semibold">
                  {config.included}
                </span>
              </div>
              {extraProtections > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Extra Protections:</span>
                  <span className="text-yellow-400 font-semibold">
                    +{extraProtections} (${config.addonsPrice}/mo)
                  </span>
                </div>
              )}
              {swapCharges > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Swap Charges:</span>
                  <span className="text-red-400 font-semibold">
                    +${swapCharges}/mo
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-600">
                <span className="text-white font-bold">Total Monthly:</span>
                <span className="text-green-400 font-bold text-lg">
                  ${totalCost}/mo
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-2">
              Active Protections
            </h4>
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
                    <span className="ml-1 text-xs">
                      (+${config.addonsPrice})
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          Billing Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">
              Payment Method
            </h4>
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div>
                  <p className="text-white font-medium">•••• •••• •••• 4242</p>
                  <p className="text-gray-400 text-sm">Expires 12/25</p>
                </div>
              </div>
            </div>
            <button className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium">
              Update Payment Method
            </button>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-3">
              Billing Address
            </h4>
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
              <p className="text-white">John Doe</p>
              <p className="text-gray-300">123 Security Street</p>
              <p className="text-gray-300">San Francisco, CA 94105</p>
              <p className="text-gray-300">United States</p>
            </div>
            <button className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium">
              Update Billing Address
            </button>
          </div>
        </div>
      </div>

      {/* Plan Actions */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Plan Management</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleUpgradePlan}
            className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
          >
            <div className="text-center">
              <div className="text-green-400 text-2xl mb-2">⬆️</div>
              <h4 className="text-white font-semibold mb-1">Upgrade Plan</h4>
              <p className="text-gray-400 text-sm">
                Get more protections and features
              </p>
            </div>
          </button>

          <button
            onClick={handleViewUsage}
            className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <div className="text-center">
              <div className="text-blue-400 text-2xl mb-2">📊</div>
              <h4 className="text-white font-semibold mb-1">View Usage</h4>
              <p className="text-gray-400 text-sm">
                See your protection usage stats
              </p>
            </div>
          </button>

          <button
            onClick={handleBillingHistory}
            className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-colors"
          >
            <div className="text-center">
              <div className="text-yellow-400 text-2xl mb-2">📄</div>
              <h4 className="text-white font-semibold mb-1">Billing History</h4>
              <p className="text-gray-400 text-sm">
                Download invoices and receipts
              </p>
            </div>
          </button>

          <button
            onClick={handleCancelPlan}
            className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <div className="text-center">
              <div className="text-red-400 text-2xl mb-2">❌</div>
              <h4 className="text-white font-semibold mb-1">Cancel Plan</h4>
              <p className="text-gray-400 text-sm">Cancel your subscription</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          Notification Preferences
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div>
              <h4 className="text-white font-semibold">Email Alerts</h4>
              <p className="text-gray-400 text-sm">
                Receive security alerts via email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div>
              <h4 className="text-white font-semibold">SMS Alerts</h4>
              <p className="text-gray-400 text-sm">
                Receive urgent alerts via SMS
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div>
              <h4 className="text-white font-semibold">Push Notifications</h4>
              <p className="text-gray-400 text-sm">
                Receive notifications in the app
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Security Settings</h3>

        <div className="space-y-4">
          <button className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-semibold">
                  Two-Factor Authentication
                </h4>
                <p className="text-gray-400 text-sm">
                  Add an extra layer of security
                </p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </button>

          <button className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-semibold">Change Password</h4>
                <p className="text-gray-400 text-sm">
                  Update your account password
                </p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </button>

          <button className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-semibold">Active Sessions</h4>
                <p className="text-gray-400 text-sm">
                  Manage your active login sessions
                </p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          Account Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="john.doe@example.com"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <button className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "subscription":
        return renderSubscriptionTab();
      case "notifications":
        return renderNotificationsTab();
      case "security":
        return renderSecurityTab();
      case "account":
        return renderAccountTab();
      default:
        return renderSubscriptionTab();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">
            Manage your account, subscription, and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Usage Modal */}
      {showUsageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-4xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                Protection Usage Statistics
              </h3>
              <button
                onClick={() => setShowUsageModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedProtections.map((protection) => {
                const data = usageData[protection] || {
                  usage: "N/A",
                  limit: "N/A",
                  status: "Inactive",
                };
                return (
                  <div
                    key={protection}
                    className="bg-gray-800 border border-gray-700 rounded-xl p-4"
                  >
                    <h4 className="text-white font-semibold mb-3">
                      {protection}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Usage:</span>
                        <span className="text-green-400 font-semibold">
                          {data.usage}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Limit:</span>
                        <span className="text-blue-400 font-semibold">
                          {data.limit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-green-400 font-semibold">
                          {data.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Billing History Modal */}
      {showBillingHistoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Billing History</h3>
              <button
                onClick={() => setShowBillingHistoryModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              {billingHistory.map((invoice, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">
                        {invoice.invoice}
                      </h4>
                      <p className="text-gray-400 text-sm">{invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">
                        {invoice.amount}
                      </p>
                      <span className="text-green-400 text-sm">
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                  <button className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Plan Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Cancel Subscription
              </h3>
              <p className="text-gray-400 mb-4">
                Are you sure you want to cancel your subscription? We'd hate to
                see you go!
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                <p className="text-yellow-400 font-semibold mb-1">
                  Special Offer
                </p>
                <p className="text-gray-300 text-sm">
                  Stay with us and get{" "}
                  <span className="text-yellow-400 font-semibold">10% off</span>{" "}
                  your next month's bill!
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Why are you cancelling?
              </label>
              <p className="text-gray-400 text-sm mb-3">
                Your feedback is very important to us. We want to improve our
                service to provide better customer satisfaction. Please share
                your thoughts with us.
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Help us improve our service and provide better customer satisfaction..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows="3"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelConfirm}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Cancel Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
