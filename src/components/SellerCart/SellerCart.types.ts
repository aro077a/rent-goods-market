import { Router } from "framework7/modules/router/router";

import { CartItem } from "@/types/marketplaceapi";

export interface SellerCartProps {
  items: CartItem[];
  onCheckout: (sellerUid: string) => void;
  f7router: Router.Router;
  onLogin: () => void;
}
