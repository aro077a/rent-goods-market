import { ProductRentOptions } from "@/types/marketplaceapi";

export type PriceProps = {
  className?: string;
  price: number;
  discountedPrice?: number;
  currencyCode: string;
  period?: ProductRentOptions.PeriodEnum;
  withSaleIcon?: boolean;
  direction?: "row" | "column";
  size?: "xsmall" | "small" | "medium" | "large";
};
