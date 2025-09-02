import React from "react";
import BodyconImg from "./bodycon.jpeg";

function Product() {
  const amount = 5; // INR 500
  const currency = "INR";
  const receiptId = "rcptid_11";

  const paymentHandler = async (e) => {
    e.preventDefault();

    // 1. Create order on backend
    const orderResponse = await fetch("http://localhost:5000/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency, receipt: receiptId }),
    });

    const order = await orderResponse.json();

    if (!order.id) {
      alert("Could not create order. Try again.");
      return;
    }

    // 2. Open Razorpay checkout
    const options = {
      key: "rzp_test_RCMac4ijgirre9", // Your test key here
      amount: amount * 100, // amount in paise
      currency,
      name: "Acme Corp",
      description: "Test Transaction",
      image: "https://example.com/your_logo", // optional
      order_id: order.id,
      handler: async function (response) {
        // 3. Send payment details to backend for verification
        const verifyResponse = await fetch("http://localhost:5000/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const verifyData = await verifyResponse.json();

        if (verifyData.status === "success") {
          alert("Payment successful and verified!");
        } else {
          alert("Payment verification failed!");
        }
      },
      prefill: {
        name: "Vampire",
        email: "vampire@example.com",
        contact: "+919876543210",
      },
      notes: { address: "Razorpay Corporate Office" },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: function () {
          alert("Payment popup closed.");
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      alert("Payment failed: " + response.error.description);
      console.error(response.error);
    });

    rzp.open();
  };

  return (
    <div className="product">
      <h2>Bodycon</h2>
      <p>Tight Red Bodycon dress</p>
      <img src={BodyconImg} alt="Red Bodycon Dress" />
      <br />
      <button onClick={paymentHandler}>Pay</button>
    </div>
  );
}

export default Product;
