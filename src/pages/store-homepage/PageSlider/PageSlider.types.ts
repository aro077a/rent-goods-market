import { IProduct } from "@/reducers/productReducer";

export type PageSliderProps = {
  title: string;
  category: string;
  getProducts: ({ category: string }) => Promise<IProduct[]>;
};
