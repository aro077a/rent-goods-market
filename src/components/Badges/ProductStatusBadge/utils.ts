import { Product } from "@/types/marketplaceapi";

export const getProductStatusText = (status: Product.StatusEnum): string => {
  switch (status) {
    case Product.StatusEnum.DRF:
      return "Draft";
    case Product.StatusEnum.AFR:
      return "Assigned for Review";
    case Product.StatusEnum.DCL:
      return "Declined";
    case Product.StatusEnum.APR:
      return "Approved";
    case Product.StatusEnum.PBL:
      return "Published";
    case Product.StatusEnum.SUS:
      return "Suspended";
    case Product.StatusEnum.EXP:
      return "Expired";
    case Product.StatusEnum.OOS:
      return "Out of Stock";
    case Product.StatusEnum.DSC:
      return "Discontinued";
    default:
      return "";
  }
};
