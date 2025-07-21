import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex items-center justify-center p-4">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>

              {/* Error Title */}
              <h1 className="text-2xl font-bold text-white mb-2">
                Something went wrong
              </h1>

              {/* Error Message */}
              <p className="text-gray-400 mb-6">
                We're sorry, but something unexpected happened. Our team has
                been notified.
              </p>

              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="bg-gray-800 border border-gray-600 rounded-xl p-4 mb-6 text-left">
                  <h3 className="text-red-400 font-semibold mb-2">
                    Error Details:
                  </h3>
                  <div className="text-sm text-gray-300 mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <details className="text-xs text-gray-400">
                      <summary className="cursor-pointer hover:text-gray-300">
                        Stack Trace
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-900 rounded overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  🔄 Reload Page
                </button>

                <button
                  onClick={() => (window.location.href = "/")}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  🏠 Go to Home
                </button>
              </div>

              {/* Contact Support */}
              <div className="mt-6 pt-6 border-t border-gray-600">
                <p className="text-sm text-gray-400 mb-2">
                  Still having issues?
                </p>
                <button
                  onClick={() => {
                    const subject = encodeURIComponent(
                      "DarkShepherd.ai - Error Report"
                    );
                    const body = encodeURIComponent(
                      `Error: ${this.state.error?.toString()}\n\nComponent Stack: ${
                        this.state.errorInfo?.componentStack
                      }\n\nUser Agent: ${navigator.userAgent}`
                    );
                    window.open(
                      `mailto:support@darkshepherd.ai?subject=${subject}&body=${body}`
                    );
                  }}
                  className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors duration-200"
                >
                  📧 Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
