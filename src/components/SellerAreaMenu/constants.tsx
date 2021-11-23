import React from "react";

import { IcOrders, IcStore, IcProduct, IcSettings } from "@/components-ui/icons";

export const menu = {
  SellerArea_Store: {
    link: "/profile/seller-area/store/",
    title: "Store",
    icon: <IcStore slot="media" />,
  },
  SellerArea_Products: {
    link: "/profile/seller-area/my-goods/",
    title: "My products",
    icon: <IcProduct slot="media" />,
  },
  SellerArea_Orders: {
    link: "/profile/seller-area/sellers-orders/",
    title: "Orders",
    icon: <IcOrders slot="media" />,
  },
  SellerArea_ProductPromotion: {
    link: "/profile/seller-area/product-promotion/",
    title: "Product promotion",
    icon: "star",
  },
  SellerArea_PayoutSettings: {
    link: "/profile/seller-area/payout-settings/",
    title: "Payout Settings",
    icon: <IcSettings slot="media" />,
  },
  Switch_To_Business: {
    link: "/profile/seller-area/add-business-account/",
    title: "Switch to Business Account",
    icon: <IcStore slot="media" />,
  },
};

export const ITEMS_WITH_ACCORDION = 4;
