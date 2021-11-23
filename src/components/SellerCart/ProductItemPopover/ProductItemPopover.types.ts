import { Map } from "immutable";

import { PopoverButtonValue } from "@/components/PopoverButton/PopoverButton.types";
import { CartItem } from "@/types/marketplaceapi";

export type ProductItemPopoverProps = {
  item: CartItem;
  quantityValue: Map<string, PopoverButtonValue>;
  setQuantityValue: React.Dispatch<React.SetStateAction<Map<string, PopoverButtonValue>>>;
  quantityPopOpen: Map<string, boolean>;
  setQuantityPopOpen: React.Dispatch<React.SetStateAction<Map<string, boolean>>>;
};
