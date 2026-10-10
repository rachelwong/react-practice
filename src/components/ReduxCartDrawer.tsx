import { useCartSelector } from "@/context/cartStore";
import { CirclePlus, CornerDownLeft, ShoppingCart, Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

const ReduxCartDrawer = () => {
  const cartProducts = useCartSelector((state) =>
    state.availableProducts.filter((x) =>
      state.selectedProducts.some((y) => y.id.toString() === x.id.toString()),
    ),
  );

  return (
    <Drawer swipeDirection="right">
      <DrawerTrigger render={<Button variant="outline" />}>
        <ShoppingCart />
        See Cart
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Your items</DrawerTitle>
          <DrawerDescription>Your cart items</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-y-3">
          {cartProducts.map((product) => (
            <div className="flex flex-row justify-between items-end p-3 gap-x-3">
              <Field>
                <FieldLabel>{product.title}</FieldLabel>
                <Input onChange={() => {}} placeholder="Qty" />
              </Field>
              <Button variant="secondary" size="lg" onClick={() => {}}>
                <CirclePlus />
              </Button>
              <Button variant="destructive" size="lg" onClick={() => {}}>
                <Trash />
              </Button>
            </div>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>
            <CornerDownLeft />
            Cancel
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ReduxCartDrawer;
