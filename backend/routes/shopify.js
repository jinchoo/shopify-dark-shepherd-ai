const express = require("express");
const router = express.Router();
const Shopify = require("shopify-api-node");
const axios = require("axios");

// Shopify API configuration
const shopifyConfig = {
  shopName: process.env.SHOPIFY_SHOP_NAME,
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  apiVersion: "2024-01",
};

// Initialize Shopify API
const shopify = new Shopify({
  shopName: shopifyConfig.shopName,
  accessToken: shopifyConfig.accessToken,
  apiVersion: shopifyConfig.apiVersion,
});

// Get shop information
router.get("/shop", async (req, res) => {
  try {
    const shop = await shopify.shop.get();
    res.json({
      success: true,
      data: shop,
    });
  } catch (error) {
    console.error("Error fetching shop info:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch shop information",
    });
  }
});

// Get recent orders
router.get("/orders", async (req, res) => {
  try {
    const { limit = 50, status = "any" } = req.query;
    const orders = await shopify.order.list({
      limit: parseInt(limit),
      status: status,
    });

    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });
  }
});

// Get customers
router.get("/customers", async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const customers = await shopify.customer.list({
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: customers,
      count: customers.length,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch customers",
    });
  }
});

// Get products
router.get("/products", async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const products = await shopify.product.list({
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
    });
  }
});

// Get order by ID
router.get("/orders/:id", async (req, res) => {
  try {
    const order = await shopify.order.get(req.params.id);
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch order",
    });
  }
});

// Get customer by ID
router.get("/customers/:id", async (req, res) => {
  try {
    const customer = await shopify.customer.get(req.params.id);
    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch customer",
    });
  }
});

// Webhook endpoint for order creation
router.post("/webhooks/orders/create", async (req, res) => {
  try {
    const order = req.body;
    console.log("New order created:", order.id);

    // Send order data to Python service for fraud analysis
    try {
      await axios.post(`${process.env.PYTHON_SERVICE_URL}/analyze-order`, {
        order_id: order.id,
        order_data: order,
      });
    } catch (pythonError) {
      console.error("Error sending to Python service:", pythonError);
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Error");
  }
});

// Webhook endpoint for customer creation
router.post("/webhooks/customers/create", async (req, res) => {
  try {
    const customer = req.body;
    console.log("New customer created:", customer.id);

    // Send customer data to Python service for risk analysis
    try {
      await axios.post(`${process.env.PYTHON_SERVICE_URL}/analyze-customer`, {
        customer_id: customer.id,
        customer_data: customer,
      });
    } catch (pythonError) {
      console.error("Error sending to Python service:", pythonError);
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Error");
  }
});

// Get analytics data
router.get("/analytics", async (req, res) => {
  try {
    const { period = "30d" } = req.query;

    // Get orders for the period
    const orders = await shopify.order.list({
      limit: 250,
      status: "any",
    });

    // Calculate basic analytics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + parseFloat(order.total_price || 0),
      0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        period,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch analytics",
    });
  }
});

module.exports = router;
