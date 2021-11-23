import { RouteParameters } from "../../routes";
import ServicePackagesPage from "./service-packages";
import GetServicePackagePage from "./get-service-package";

export const routes: RouteParameters[] = [
  {
    path: "/promo/",
    component: ServicePackagesPage,
    routes: [
      {
        path: "package/:id/",
        component: GetServicePackagePage,
      },
      {
        path: ":id/",
        component: GetServicePackagePage,
      },
    ],
  },
];

export const getProductPromotionRootUrl = () => "/promo";
export const getProductPromotionGetPackage = (productUid: string) =>
  `${getProductPromotionRootUrl()}/get/${productUid}`;
