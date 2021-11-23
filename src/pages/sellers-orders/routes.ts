import { RouteParameters } from "../../routes";
import SellersOrders from "./sellers-orders";
import OrderDetailsPage from "./order-details";

const routes: RouteParameters[] = [
  {
    path: "/sellers-orders/",
    component: SellersOrders,
    routes: [
      {
        path: "order-details/:uid/",
        component: OrderDetailsPage,
      },
    ],
  },
];

export default routes;
