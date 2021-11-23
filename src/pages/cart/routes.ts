import { RouteParameters } from "@/routes";

import CartPage from "./cart";
import CheckoutPage from "./checkout";

const routes: RouteParameters[] = [
  {
    path: "/cart/",
    component: CartPage,
    routes: [
      {
        path: "/checkout/",
        component: CheckoutPage,
      },
    ],
  },
];

export default routes;
