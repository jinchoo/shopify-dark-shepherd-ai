import React from "react";
import { useNavigate } from "react-router-dom";

const tiers = [
  {
    name: "Pup JR.",
    price: 0,
    included: 3,
    extra: 0,
    description:
      "Simple, free plan. 3 protections included. No add-ons or swaps.",
    popular: false,
  },
  {
    name: "Pup SR.",
    price: 99,
    included: 6,
    extra: 10,
    description:
      "6 protections included. Up to 2 add-ons ($10 each). 1 free swap/month, then $5 per swap.",
    popular: true,
  },
  {
    name: "Guardian",
    price: 199,
    included: 9,
    extra: 10,
    description:
      "9 protections included. Up to 3 add-ons ($10 each). Unlimited swaps.",
    popular: false,
  },
  {
    name: "Alpha",
    price: 299,
    included: 12,
    extra: 0,
    description:
      "12 active protections. Unlimited add-ons. Unlimited swaps and protections.",
    popular: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  const handleTierClick = (tierName) => {
    console.log(`Selected tier: ${tierName}`);
    navigate("/login");
  };

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Choose Your <span className="text-green-400">Protection</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Select the perfect security tier for your store. All plans include
            our AI-powered protection with flexible swapping options.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              onClick={() => handleTierClick(tier.name)}
              className={`relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:border-green-400 hover:shadow-green-500/20 ${
                tier.popular ? "ring-2 ring-green-400" : ""
              }`}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  {tier.popular && (
                    <span className="ml-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  {tier.name === "Enterprise" ? (
                    <div className="text-2xl font-bold text-green-400">
                      Contact Sales
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl font-bold text-green-400">
                        ${tier.price}
                      </div>
                      <div className="text-gray-400 text-sm">per month</div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="text-gray-300 text-sm">
                    <span className="font-semibold text-white">Included:</span>{" "}
                    {tier.included} protections
                  </div>
                  {tier.extra > 0 && (
                    <div className="text-gray-300 text-sm">
                      <span className="font-semibold text-white">Extra:</span> $
                      {tier.extra} each
                    </div>
                  )}
                </div>

                <div className="text-gray-400 text-xs mb-4 leading-relaxed">
                  {tier.description}
                </div>

                <div className="text-green-400 text-sm font-medium">
                  Select Plan →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl p-8 mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              How Swappable Protections Work
            </h2>
            <p className="text-gray-400">
              Flexible security that grows with your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-400 font-bold">1</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Pup JR.</h3>
              <p className="text-gray-400 text-sm">
                3 included. No add-ons or swaps.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-400 font-bold">2</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Pup SR.</h3>
              <p className="text-gray-400 text-sm">
                6 included, up to 2 add-ons ($10 each). 1 free swap/month, $5
                per extra swap.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-400 font-bold">3</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Guardian</h3>
              <p className="text-gray-400 text-sm">
                9 included, up to 3 add-ons ($10 each). Unlimited swaps.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-400 font-bold">4</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Alpha</h3>
              <p className="text-gray-400 text-sm">
                12 active, unlimited add-ons, unlimited swaps and protections.
              </p>
            </div>
          </div>
        </div>

        {/* Get Started Section */}
        <div className="text-center">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Secure Your Store?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of businesses that trust DarkShepherd.ai to protect
              their e-commerce operations. Get started today with our AI-powered
              security platform.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Get Started Now
            </button>
            <p className="text-gray-400 text-sm mt-4">
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            All plans include 24/7 AI monitoring and expert support
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
