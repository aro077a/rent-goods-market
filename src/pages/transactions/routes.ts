import { RouteParameters } from "../../routes";
import TransactionsPage from "./transactions";

const routes: RouteParameters[] = [
  {
    path: "/transactions/",
    component: TransactionsPage,
  },
];

export default routes;
