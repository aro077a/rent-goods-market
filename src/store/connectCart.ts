import { connect } from "react-redux";

import {
  addToCart,
  removeFromCart,
  removeFromCartBySeller,
  updateCart,
} from "@/actions/cartActions";
import { IProduct } from "@/reducers/productReducer";
import { CartItem } from "@/types/marketplaceapi";

import { IApplicationStore } from "./rootReducer";

// export interface ItemCart {
//   product: IProduct;
//   price: number;
//   count: number;
//   discount: number;
//   total: number;
//   selectedForPurchase?: boolean;
// }

export interface ICartProps {
  isFetchingCart: boolean;
  isUpdatingCart: boolean;
  errorCart?: unknown;
  itemsCart: CartItem[];
  discountCart: number;
  totalCart: number;
  totalSelectedForPurchase: number;

  cartAdd?(uid: string, count: number): void;

  cartUpdate?(item: IProduct, count: number): void;

  cartRemove?(item: IProduct, count: number): void;

  cartRemoveBySeller?(seller: string): void;
}

const mapStateToProps = (state: IApplicationStore): ICartProps => ({
  isFetchingCart: state.cartReducer.isFetching,
  isUpdatingCart: state.cartReducer.isUpdating,
  errorCart: state.cartReducer.error,
  itemsCart: state.cartReducer.items,
  discountCart: state.cartReducer.discount,
  totalCart: state.cartReducer.total,
  totalSelectedForPurchase: state.cartReducer.totalSelectedForPurchase,
});

const mapDispatchToProps = (
  dispatch
): Pick<ICartProps, "cartAdd" | "cartUpdate" | "cartRemove" | "cartRemoveBySeller"> => ({
  cartAdd: (productUid, count: number) => dispatch(addToCart(productUid, count)),
  cartUpdate: (item: IProduct, count: number) => dispatch(updateCart(item, count)),
  cartRemove: (item: IProduct) => dispatch(removeFromCart(item)),
  cartRemoveBySeller: (seller: string) => dispatch(removeFromCartBySeller(seller)),
});

export default connect(mapStateToProps, mapDispatchToProps);
