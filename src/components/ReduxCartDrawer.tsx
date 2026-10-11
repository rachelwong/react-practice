import { toggleDrawer } from "@/context/cartReducer";
import { cartProducts, invoiceTotal } from "@/context/cartSelectors";
import { useCartDispatch, useCartSelector } from "@/context/cartStore";
import { CornerDownLeft, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import ReduxCartDrawerItem from "./ReduxCartDrawerItem";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

const ReduxCartDrawer = () => {
  const selectedProducts = useCartSelector(cartProducts);
  const drawerStatus = useCartSelector((state) => state.drawerStatus);
  const dispatch = useCartDispatch();

  const total = useCartSelector(invoiceTotal);

  // rounded up to nearest 2 decimals
  const formattedTotal = Math.ceil(total * 100) / 100;

  // close drawer if no products remaining
  useEffect(() => {
    if (selectedProducts.length === 0) {
      dispatch(toggleDrawer(false));
    }
  }, [selectedProducts.length]);

  return (
    <Drawer
      open={drawerStatus}
      swipeDirection="right"
      onOpenChange={() => {
        dispatch(toggleDrawer(true));
      }}
    >
      <DrawerTrigger render={<Button variant="outline" />}>
        <ShoppingCart />
        See Cart
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Your items</DrawerTitle>
          <DrawerDescription>Your cart items</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-y-3 p-3">
          {selectedProducts.map((product) => (
            <ReduxCartDrawerItem key={product.id} product={product} />
          ))}
          <h3 className="font-extrabold text-3xl text-slate-800">
            Total: ${formattedTotal}
          </h3>
        </div>
        <DrawerFooter>
          <Button
            variant="outline"
            onClick={() => {
              dispatch(toggleDrawer(false));
            }}
          >
            <CornerDownLeft />
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ReduxCartDrawer;
