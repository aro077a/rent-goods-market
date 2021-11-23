import { RouteParameters } from "@/routes";

import { AddCompanyInformation } from "./addCompanyInformation/add-company-information";
import { AddStoreInformation } from "./addStoreInformation/add-store-information";
import { VerifyInformation } from "./verifyInformation/verify-information";

const routes: RouteParameters[] = [
  {
    path: "/add-business-account/",
    component: AddCompanyInformation,
    routes: [
      {
        path: "/store-info/",
        component: AddStoreInformation,
      },
      {
        path: "/verify-data/",
        component: VerifyInformation,
      },
    ],
  },
];

export default routes;
