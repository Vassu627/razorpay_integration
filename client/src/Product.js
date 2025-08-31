import BodyconImg from "./bodycon.jpeg";
function Product() {
  const amount = 500;
  const currency = "INR";
  const receiptId = "rcptid_11";
  const paymentHandler = async (e) => {
    const response = await fetch("http://localhost:5000/order", {
      method: "POST",
      body: JSON.stringify({
        amount,
        currency,
        reciept: receiptId,
      }),
      headers: {
        "Content-Type": "application.json",
      },
    });
    const order = await response.json();
    console.log(order);
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
