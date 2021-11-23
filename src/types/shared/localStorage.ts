import { CartItem } from "@/types/marketplaceapi";

export enum LocalStorageItems {
  CART = "CART",
  WISH_LIST = "WISH_LIST",
}

export type LocalStorageCartItem = Pick<CartItem, "productUid" | "quantity" | "itemUid">;
