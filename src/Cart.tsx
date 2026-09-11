import Layout from "./components/Layout";

const Cart = () => {
  const cartHeading = (
    <>
      <h3>Shopping Cart</h3>
      <p>
        Instructions from{" "}
        <a
          href="https://www.reactgrind.com/problems/shopping-cart-usereducer"
          target="_blank"
        >
          https://www.reactgrind.com/problems/shopping-cart-usereducer
        </a>
      </p>
    </>
  );
  return (
    <Layout heading={cartHeading}>
      <div className="shopping-cart"></div>
    </Layout>
  );
};

export default Cart;
