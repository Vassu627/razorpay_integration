const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Razorpay instance (reuse for requests)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Route to create order
app.post("/order", async (req, res) => {
  const { amount, currency, receipt } = req.body;

  if (!amount || !currency || !receipt) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const options = {
      amount: amount * 100, // amount in paise (multiply by 100)
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Unable to create order" });
  }
});

// Route to verify payment
app.post("/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    return res.json({
      status: "success",
      message: "Payment verified successfully",
    });
  } else {
    return res.status(400).json({
      status: "failure",
      message: "Invalid signature, payment verification failed",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
