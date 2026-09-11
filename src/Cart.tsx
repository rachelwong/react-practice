import {
  Table,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CartItemRow from "./components/CartItemRow";
import Layout from "./components/Layout";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import useCart from "./hooks/useCart";
import type { CartItemDisplay } from "./types/Cart";

const Cart = () => {
  const {
    allAvailableProducts,
    cartItems,
    invoiceTotal,
    addItemToCart,
    removeItemFromCart: removeSingle,
    removeAllId: removeAllById,
    clearCart,
  } = useCart();

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

  // display cart items grouped by matching id
  const formattedCartItems = cartItems.reduce<CartItemDisplay[]>((acc, cur) => {
    // find by id
    const existing = acc.find((line) => line.id === cur.id);

    // if there is already a matching product selected, increment the quantity and subtotal
    if (existing) {
      existing.qty += 1;
      existing.subtotal = existing.qty * existing.price;
    }
    // if not, add a new item to the display list
    else {
      acc.push({
        id: cur.id,
        name: cur.name,
        price: cur.price,
        qty: 1,
        subtotal: cur.price,
      });
    }
    return acc;
  }, []);

  return (
    <Layout heading={cartHeading}>
      <div className="cart">
        <div className="cart-actions flex items-center justify-start gap-x6">
          {allAvailableProducts.map((product) => {
            return (
              <Button
                key={product.id}
                className="cart-btn"
                onClick={() => {
                  addItemToCart(product.id);
                }}
              >
                Add {product.name}
              </Button>
            );
          })}
        </div>
        {!cartItems.length && (
          <Alert className="cart-error my-3">
            <AlertTitle>Cart Empty</AlertTitle>
            <AlertDescription>
              You need to add more items in order to checkout
            </AlertDescription>
          </Alert>
        )}
        {!!cartItems.length && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>{" "}
              {formattedCartItems.map((item) => {
                return (
                  <CartItemRow
                    item={item}
                    addItem={addItemToCart}
                    removeSingle={removeSingle}
                    removeAllById={removeAllById}
                  />
                );
              })}
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Total Amount:</TableCell>
                  <TableCell className="text-right">{invoiceTotal}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <div className="flex justify-end align-center mt-6">
              <Button
                onClick={() => clearCart()}
                variant="default"
                className="reset-btn bg-blue-800"
              >
                Reset Cart
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
