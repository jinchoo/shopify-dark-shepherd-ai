import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Get payment details from location state
  const paymentDetails = location.state || {
    addOnProtection: "Additional Protection",
    addOnCost: 10,
    currentTier: "Pup SR.",
    totalCost: 109,
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Auto-redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-400 text-2xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-400 mb-4">
              Your payment has been processed successfully.
            </p>
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Protection Added:</span>
                  <span className="text-white">
                    {paymentDetails.addOnProtection}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Amount Paid:</span>
                  <span className="text-green-400">
                    ${paymentDetails.addOnCost}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-600">
                  <span className="text-white font-semibold">
                    New Monthly Total:
                  </span>
                  <span className="text-green-400 font-bold">
                    ${paymentDetails.totalCost}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Redirecting to dashboard in 3 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <svg
                className="w-16 h-16 text-green-400 drop-shadow-lg"
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
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            DarkShepherd.ai
          </h1>
          <p className="text-gray-400 text-sm">Secure Payment</p>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Payment Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Add-on Protection:</span>
              <span className="text-white">
                {paymentDetails.addOnProtection}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Current Tier:</span>
              <span className="text-white">{paymentDetails.currentTier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Additional Cost:</span>
              <span className="text-yellow-400">
                +${paymentDetails.addOnCost}/mo
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-600">
              <span className="text-white font-bold">New Monthly Total:</span>
              <span className="text-green-400 font-bold text-lg">
                ${paymentDetails.totalCost}/mo
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Select Payment Method
          </h3>
          <div className="space-y-3">
            <label className="flex items-center p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3 text-green-500 focus:ring-green-500"
              />
              <div className="flex items-center">
                <span className="text-2xl mr-3">💳</span>
                <div>
                  <div className="text-white font-medium">
                    Credit/Debit Card
                  </div>
                  <div className="text-gray-400 text-sm">
                    Visa, Mastercard, American Express
                  </div>
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3 text-green-500 focus:ring-green-500"
              />
              <div className="flex items-center">
                <span className="text-2xl mr-3">🅿️</span>
                <div>
                  <div className="text-white font-medium">PayPal</div>
                  <div className="text-gray-400 text-sm">
                    Pay with your PayPal account
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Payment Form */}
        {paymentMethod === "card" && (
          <form onSubmit={handlePayment} className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </form>
        )}

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </div>
          ) : (
            `Pay $${paymentDetails.addOnCost}`
          )}
        </button>

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Payment;
