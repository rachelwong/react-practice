import { removeItemEntirely, updateQty } from "@/context/cartReducer";
import { useCartDispatch, useCartSelector } from "@/context/cartStore";
import type { Product } from "@/services/types/ProductResponse";
import { CirclePlus, Trash } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "./ui/button";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

interface ReduxCartDrawerItemProps {
  product: Product;
}

const ReduxCartDrawerItem = ({ product }: ReduxCartDrawerItemProps) => {
  const selectedProducts = useCartSelector((state) => state.selectedProducts);

  const selectedProduct = selectedProducts.find(
    (x) => x.id === product.id.toString(),
  );

  const [qty, setQty] = useState<string>("");

  const [error, setError] = useState<string | null>(null);

  const dispatch = useCartDispatch();

  const handleQtyChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value))) {
      setError("Must be a number");
      return;
    }
    if (!isNaN(Number(e.target.value)) && Number(e.target.value) < 0) {
      setError("Valid number is 0 or positive value.");
      return;
    }
    setQty(e.target.value);
  };

  useEffect(() => {
    if (!selectedProduct || !selectedProduct?.qty) {
      return;
    }
    setQty(selectedProduct.qty.toString() ?? "");
  }, [selectedProduct]);

  return (
    <div className="flex flex-row justify-between items-end gap-x-3">
      <Field>
        <FieldLabel>{product.title}</FieldLabel>
        <Input
          aria-invalid={!!error}
          type="text"
          value={qty}
          onChange={(e) => {
            handleQtyChange(e);
          }}
          placeholder="Qty"
        />
        {error && <FieldError>{error}</FieldError>}
      </Field>
      <Button
        disabled={!!error}
        variant="secondary"
        size="lg"
        onClick={() => {
          dispatch(updateQty({ id: product.id.toString(), qty: Number(qty) }));
        }}
      >
        <CirclePlus />
      </Button>
      <Button
        variant="destructive"
        size="lg"
        onClick={() => {
          dispatch(removeItemEntirely(product.id.toString()));
        }}
      >
        <Trash />
      </Button>
    </div>
  );
};

export default ReduxCartDrawerItem;
