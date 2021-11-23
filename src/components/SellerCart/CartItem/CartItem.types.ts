import { CartItem } from "@/types/marketplaceapi";
import { Router } from "framework7/modules/router/router";

import { ProductItemPopoverProps } from "@/components/SellerCart/ProductItemPopover/ProductItemPopover.types";

export type CartItemProps = {
  item: CartItem;
  f7router: Router.Router;
  popover: Omit<ProductItemPopoverProps, "item">;
};
