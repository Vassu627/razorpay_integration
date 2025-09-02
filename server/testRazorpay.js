const Razorpay = require("razorpay");
require("dotenv").config();

console.log("KEY_ID:", JSON.stringify(process.env.RAZORPAY_KEY_ID));
console.log("SECRET:", JSON.stringify(process.env.RAZORPAY_SECRET));

const instance = new Razorpay({
  key_id: "rzp_test_RCMac4ijgirre9",
  key_secret: "WnodqDnkEtfPN2EWrtEr3yro",
});

const options = {
  amount: 500,
  currency: "INR",
  receipt: "rcptid_11",
};

instance.orders
  .create(options)
  .then((order) => {
    console.log("Order created:", order);
  })
  .catch((err) => {
    console.error("Error creating order:", err);
  });
