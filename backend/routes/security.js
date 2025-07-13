const express = require("express");
const router = express.Router();
const axios = require("axios");

// Get security alerts
router.get("/alerts", async (req, res) => {
  try {
    // Get alerts from Python service
    const response = await axios.get(
      `${process.env.PYTHON_SERVICE_URL}/security/alerts`
    );

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching security alerts:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch security alerts",
    });
  }
});

// Get fraud analysis for specific order
router.get("/fraud/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Get fraud analysis from Python service
    const response = await axios.get(
      `${process.env.PYTHON_SERVICE_URL}/fraud/order/${orderId}`
    );

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching fraud analysis:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch fraud analysis",
    });
  }
});

// Get risk score for customer
router.get("/risk/customer/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    // Get risk analysis from Python service
    const response = await axios.get(
      `${process.env.PYTHON_SERVICE_URL}/risk/customer/${customerId}`
    );

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching risk analysis:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch risk analysis",
    });
  }
});

// Get security dashboard data
router.get("/dashboard", async (req, res) => {
  try {
    // Get dashboard data from Python service
    const response = await axios.get(
      `${process.env.PYTHON_SERVICE_URL}/security/dashboard`
    );

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching security dashboard:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch security dashboard",
    });
  }
});

module.exports = router;
