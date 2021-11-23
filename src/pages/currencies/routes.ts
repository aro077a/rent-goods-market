import { RouteParameters } from "../../routes";
import MyCurrenciesPage from "./my-currencies";

const routes: RouteParameters[] = [
  {
    path: "/currencies/",
    component: MyCurrenciesPage,
  },
];

export default routes;
