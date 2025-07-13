const express = require("express");
const router = express.Router();
const axios = require("axios");

// Get analytics overview
router.get("/overview", async (req, res) => {
  try {
    const { period = "30d" } = req.query;

    // Get analytics from Python service
    const response = await axios.get(
      `${process.env.PYTHON_SERVICE_URL}/analytics/overview?period=${period}`
    );

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching analytics overview:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch analytics overview",
    });
  }
});

// Get fraud trends
router.get("/fraud-trends", async (req, res) => {
  try {
    const { period = "30d" } = req.query;

    // Get fraud trends from Python service
    const response = await axios.get(
      `${process.env.PYTHON_SERVICE_URL}/analytics/fraud-trends?period=${period}`
    );

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching fraud trends:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch fraud trends",
    });
  }
});

// Get customer insights
router.get("/customer-insights", async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    // Get customer insights from Python service
    const response = await axios.get(
      `${process.env.PYTHON_SERVICE_URL}/analytics/customer-insights?limit=${limit}`
    );

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching customer insights:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch customer insights",
    });
  }
});

// Get order patterns
router.get("/order-patterns", async (req, res) => {
  try {
    const { period = "30d" } = req.query;

    // Get order patterns from Python service
    const response = await axios.get(
      `${process.env.PYTHON_SERVICE_URL}/analytics/order-patterns?period=${period}`
    );

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching order patterns:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch order patterns",
    });
  }
});

module.exports = router;
