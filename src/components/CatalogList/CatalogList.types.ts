import { IProduct } from "@/reducers/productReducer";

export type CatalogListProps = {
  data: IProduct[];
  onClick: (uid: string) => void;
  selectedProducts?: Set<string>;
};
