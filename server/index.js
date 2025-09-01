const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000; // fallback to 5000 if .env is missing

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// ROUTE
app.post("/order", async (req, res) => {
  console.log("req.body:", req.body);
  if (
    !req.body ||
    !req.body.amount ||
    !req.body.currency ||
    !req.body.receipt
  ) {
    return res
      .status(400)
      .json({ error: "Missing required fields in request body" });
  }
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: req.body.amount, // e.g., 500
      currency: req.body.currency, // e.g., "INR"
      receipt: req.body.receipt, // e.g., "rcptid_11"
    };

    const order = await instance.orders.create(options);
    console.log("Created order:", order);

    if (!order) {
      return res.status(500).send("Something went wrong");
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - req.body:`, req.body);
  next();
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
