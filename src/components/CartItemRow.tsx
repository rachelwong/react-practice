// Component to display one type of product by name, id, quantity
// Actions are remove 1, add 1, remove all of this id

import type { CartItemDisplay } from "@/types/Cart";
import { CurrencyFormatter } from "@/utils";
import { Button } from "./ui/button";
import { TableCell, TableRow } from "./ui/table";

interface CartItemRowProps {
  item: CartItemDisplay;
  removeSingle: (id: string) => void;
  removeAllById: (id: string) => void;
  addItem: (id: string) => void;
}

const CartItemRow = ({
  item,
  removeSingle,
  removeAllById,
  addItem,
}: CartItemRowProps) => {
  return (
    <TableRow key={item.id}>
      <TableCell className="font-medium">{item.id}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>x {item.qty}</TableCell>
      <TableCell>{CurrencyFormatter.format(item.subtotal)}</TableCell>
      <TableCell className="text-right gap-3 flex align-center justify-end">
        <Button
          variant="outline"
          className="bg-green-500"
          onClick={() => {
            addItem(item.id);
          }}
        >
          +
        </Button>
        <Button
          variant="outline"
          className="bg-red-500"
          onClick={() => removeSingle(item.id)}
        >
          -
        </Button>
        <Button
          variant="outline"
          className="bg-blue-500"
          onClick={() => removeAllById(item.id)}
        >
          Clear
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default CartItemRow;
