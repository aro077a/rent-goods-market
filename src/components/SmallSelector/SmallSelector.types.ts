import { CartItem } from "@/types/marketplaceapi";

export type DropDownItems = {
  value: any;
  title: string;
  subtitle?: string;
  description?: string;
};

export type SmallSelectorProps = {
  item: CartItem;
  countryName?: string;
};
