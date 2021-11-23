import { RouteParameters } from "../../routes";
import OrderDetailsPage from "./order_details";
import OrdersPage from "./orders";

const routes: RouteParameters[] = [
  {
    path: "/orders/",
    component: OrdersPage,
  },
  {
    path: "/orders/details",
    component: OrderDetailsPage,
  },
];

export default routes;
