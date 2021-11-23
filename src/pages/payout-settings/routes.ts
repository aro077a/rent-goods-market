import { RouteParameters } from "../../routes";
import EditBankAccountPayoutSettingsPage from "./edit-bank-account-payout-settings";
import PayoutSettingsPage from "./payout-settings";
import EditBankCardPayoutSettingsPage from "./edit-bank-card-payout-settings";

const routes: RouteParameters[] = [
  {
    path: "/payout-settings/",
    component: PayoutSettingsPage,
    routes: [
      {
        path: "/edit/bank-account/",
        component: EditBankAccountPayoutSettingsPage,
      },
      {
        path: "/edit/bank-card/",
        component: EditBankCardPayoutSettingsPage,
      },
    ],
  },
];

export default routes;
