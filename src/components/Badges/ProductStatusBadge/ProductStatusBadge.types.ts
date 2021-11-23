import { WithTranslation } from "react-i18next";

import { Product } from "@/types/marketplaceapi";

export type ProductStatusBadgeProps = Partial<WithTranslation> & {
  status: Product.StatusEnum;
  statusText?: string;
};
