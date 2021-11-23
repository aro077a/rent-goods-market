import { handleError } from "@/error-handler";
import { IProduct } from "@/reducers/productReducer";
import { getCountryCodeFromState } from "@/selectors/getCountryCodeFromState";
import { isLoggedIn } from "@/selectors/isLoggedIn";
import { IApplicationStore } from "@/store/rootReducer";
import { CartControllerApi, CartItem } from "@/types/marketplaceapi";
import { LocalStorageCartItem, LocalStorageItems } from "@/types/shared/localStorage";
import { createUUID } from "@/utils";

import { loadProductDetails } from "./productActions";

export const CART_LOAD = "CART_LOAD";
export const CART_LOAD_SUCCESS = "CART_LOAD_SUCCESS";
export const CART_LOAD_ERROR = "CART_LOAD_ERROR";
export const CART_ADD = "CART_ADD";
export const CART_UPDATE = "CART_UPDATE";
export const CART_REMOVE = "CART_REMOVE";
export const CART_REMOVE_BY_SELLER = "CART_REMOVE_BY_SELLER";
export const CART_CLEAR = "CART_CLEAR";
export const SELECT_FOR_PURCHASE = "SELECT_FOR_PURCHASE";
export const CART_SET_SELECTED = "CART_SET_SELECTED";

export const BY_SELLER = "BY_SELLER";

const cartLoad = () => ({ type: CART_LOAD });

const cartLoadSuccess = (items: CartItem[]) => ({
  type: CART_LOAD_SUCCESS,
  payload: { items },
});

const cartLoadError = (error: unknown) => ({
  type: CART_LOAD_ERROR,
  payload: { error },
});

const cartUpdate = (item: CartItem, count: number) => ({
  type: CART_UPDATE,
  payload: { item, count },
});

const cartRemove = (uid: string) => ({
  type: CART_REMOVE,
  payload: { uid },
});

const cartRemoveBySeller = (seller: string) => ({
  type: CART_REMOVE_BY_SELLER,
  payload: { seller },
});

const cartClear = (onlySelectedForPurchase = false) => ({
  type: CART_CLEAR,
  payload: { onlySelectedForPurchase },
});

const selectForPurchase = (sellerUid: string) => ({
  type: SELECT_FOR_PURCHASE,
  payload: {
    filter: BY_SELLER,
    sellerUid,
  },
});

const cartSetSelected = (selected: string[]) => ({
  type: CART_SET_SELECTED,
  payload: { selected },
});

const productToCartItem = (product: IProduct, itemUid: string, quantity = 1): CartItem => ({
  itemUid,
  productUid: product.uid,
  quantity,
  productCurrencyCode: product.currencyCode,
  productDescription: product.shortDescription,
  productDiscountedPrice: product.discountedPrice,
  productName: product.name,
  productPrice: product.price,
  productSalePrice: product.salePrice,
  availableDeliveryMethods: product.deliveryMethods,
  imageThumbnailUrl1: product.imageThumbnailUrl1,
  parameters: product.productParams,
  pickupAllowed: product.pickupAllowed,
  sellerEmail: product.sellerEmail,
  sellerIban: product.sellerIban,
  sellerName: product.seller.name,
  sellerPhone: product.sellerPhone,
  sellerUid: product.sellerUid,
  shippingAllowed: product.shippingAllowed,
  type: product.type,
  availableQuantity: product.quantity,
});

const loadCartItemsFromProducts = async (
  localStorageItems: LocalStorageCartItem[],
  state: IApplicationStore
) => {
  const products = await Promise.all(
    localStorageItems.map(({ productUid }) => loadProductDetails(productUid, state))
  );

  return products.map((product, index) =>
    productToCartItem(product, localStorageItems[index].itemUid, localStorageItems[index].quantity)
  );
};

export const loadCart =
  (countryCode?: string) => async (dispatch, getState: () => IApplicationStore) => {
    const state = getState();

    dispatch(cartLoad());
    try {
      let items: CartItem[] = [];

      if (isLoggedIn(state)) {
        const result = await new CartControllerApi().getAccountCartUsingGET(
          countryCode || getCountryCodeFromState(state)
        );

        if (!result.successful) {
          throw new Error(handleError(result));
        }

        items = result.body?.[0]?.items ?? [];
      } else {
        const cartItemsUidsFromLocalStorage: LocalStorageCartItem[] =
          JSON.parse(localStorage.getItem(LocalStorageItems.CART)) || [];
        items = await loadCartItemsFromProducts(cartItemsUidsFromLocalStorage, state);
      }

      dispatch(cartLoadSuccess(items));
    } catch (error) {
      dispatch(cartLoadError(error.toString()));
    }
  };

export const addToCart =
  (productUid: string, quantity: number, itemUid?: string) =>
  async (dispatch, getState: () => IApplicationStore) => {
    const state = getState();
    const newItemUid = itemUid || createUUID();
    const newItem: LocalStorageCartItem = {
      itemUid: newItemUid,
      productUid,
      quantity,
    };

    try {
      let items: CartItem[] = [];
      if (isLoggedIn(state)) {
        const result = await new CartControllerApi().addItemToCartUsingPOST(
          newItem,
          getCountryCodeFromState(state)
        );

        items = result.body?.[0]?.items ?? [];
      } else {
        const searchedItem = state.cartReducer.items.find(
          (item) => item.productUid === productUid || item.itemUid === itemUid
        );
        let newItems: LocalStorageCartItem[];
        if (searchedItem) {
          newItems = state.cartReducer.items.map<LocalStorageCartItem>((item) =>
            item.itemUid === itemUid
              ? { itemUid: item.itemUid, productUid: item.productUid, quantity }
              : { itemUid: item.itemUid, productUid: item.productUid, quantity: item.quantity }
          );
          items = state.cartReducer.items.map<CartItem>((item) =>
            item.itemUid === searchedItem.itemUid ? { ...item, quantity } : item
          );
        } else {
          newItems = [
            ...state.cartReducer.items.map<LocalStorageCartItem>(
              ({ itemUid, productUid, quantity }) => ({
                itemUid,
                productUid,
                quantity,
              })
            ),
            newItem,
          ];
          const product = await loadProductDetails(productUid, state);
          items = [...state.cartReducer.items, productToCartItem(product, newItemUid, quantity)];
        }
        localStorage.setItem(LocalStorageItems.CART, JSON.stringify(newItems));
      }

      dispatch(cartLoadSuccess(items));
    } catch (err) {
      console.error("at cartActions in addToCart", err);
    }
  };

export const updateCart = (item: IProduct, quantity: number) => async (dispatch) => {
  try {
    // await new CartControllerApi().removeItemFromCartUsingPOST({
    //   productUid: item.uid,
    // });
    // await new CartControllerApi().addItemToCartUsingPOST({
    //   quantity: count,
    //   productUid: item.uid,
    // });
  } catch (err) {
    console.error("at cartActions in cartUpdate", err);
  }

  dispatch(cartUpdate(item, quantity));
};

export const removeFromCart =
  ({ itemUid }: CartItem) =>
  async (dispatch, getState: () => IApplicationStore) => {
    const state = getState();

    try {
      dispatch(cartRemove(itemUid));
      if (isLoggedIn(state)) {
        const result = await new CartControllerApi().removeItemFromCartUsingPOST(
          {
            itemUid,
          },
          getCountryCodeFromState(state)
        );
        dispatch(cartLoadSuccess(result.body?.[0]?.items ?? []));
        dispatch(loadCart());
      } else {
        localStorage.setItem(
          LocalStorageItems.CART,
          JSON.stringify(state.cartReducer.items.filter((item) => item.itemUid !== itemUid))
        );
      }
    } catch (err) {
      console.error("at cartActions in cartRemove", err);
    }
  };

export const removeFromCartBySeller =
  (seller: string) => async (dispatch, getState: () => IApplicationStore) => {
    /*
    const state = getState();
    try {
      const items = state.cartReducer.items.filter(
        (item) => item.product.sellerUid === seller
      );
      items.forEach(async (item) => {
        await new CartControllerApi().removeItemFromCartUsingPOST({
          productUid: item.uid,
        });
      });
    } catch (err) {
      console.error(err);
    }
    */

    dispatch(cartRemoveBySeller(seller));
  };

export const clearCart = (onlySelectedForPurchase = false) => cartClear(onlySelectedForPurchase);

export const selectForPurchaseBySeller = (sellerUid: string) => selectForPurchase(sellerUid);

export const setSelectedToCart = (selected: string[]) => cartSetSelected(selected);

export const sendCartFromLocalStorage =
  () => async (dispatch, getState: () => IApplicationStore) => {
    const state = getState();

    try {
      const items: LocalStorageCartItem[] =
        JSON.parse(localStorage.getItem(LocalStorageItems.CART)) || [];

      const response = await new CartControllerApi().addItemsToCartUsingPOST(
        items,
        getCountryCodeFromState(state)
      );

      dispatch(cartLoadSuccess(response.body[0].items));

      localStorage.removeItem(LocalStorageItems.CART);
    } catch (error) {
      console.error("at cartActions in sendCartFromLocalStorage", error);
      dispatch(cartLoadError(error?.toString()));
    }
  };
