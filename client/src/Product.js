import BodyconImg from "./bodycon.jpeg";
function Product() {
  const amount = 500;
  const currency = "INR";
  const receiptId = "rcptid_11";
  const paymentHandler = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/order", {
      method: "POST",
      body: JSON.stringify({
        amount,
        currency,
        receipt: receiptId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();
    console.log(order);

    var options = {
      key: "rzp_test_RBsUTnNqDbnM7E", // Enter the Key ID generated from the Dashboard
      amount, // Amount is in currency subunits.
      currency,
      name: "Acme Corp", //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: function (response) {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name: "Vampire", //your customer's name
        email: "vampire@example.com",
        contact: "+919876543210", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.preventDefault();
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
