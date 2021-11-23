import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import cn from "classnames";
import { Checkbox, ListItem } from "framework7-react";

import { removeFromCart, setSelectedToCart } from "@/actions/cartActions";
import { addToWishList } from "@/actions/productActions";
import { AddWishButton } from "@/components/AddWishButton";
import { CartItemPrice } from "@/components/CartItemPrice";
import { ProductItemPopover } from "@/components/SellerCart/ProductItemPopover";
import { IcRemove } from "@/components-ui/icons";
import { useAppSelector } from "@/hooks/store";

import { CartItemProps } from "./CartItem.types";

import "./CartItem.less";

export const CartItem: React.FC<CartItemProps> = ({ item, f7router, popover }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const selected = useAppSelector((state) => state.cartReducer.selected);
  const wishList = useAppSelector((state) => state.productReducer.productsWishList);

  const isSelected = useMemo(() => selected.includes(item.itemUid), [item.itemUid, selected]);

  const toggleSelection = useCallback(() => {
    const newList = isSelected
      ? selected.filter((i) => i !== item.itemUid)
      : [...selected, item.itemUid];
    console.log(newList);

    dispatch(setSelectedToCart(newList));
  }, [dispatch, isSelected, item.itemUid, selected]);

  const handleProductClick = useCallback(
    () => f7router.navigate(`/product-details/${item.productUid}/`),
    [f7router, item.productUid]
  );

  const handleAddToWishList = useCallback(
    () => dispatch(addToWishList(item.productUid)),
    [dispatch, item.productUid]
  );

  const isAddedToWishList = useMemo(
    () => !!wishList.find((i) => i.uid === item.productUid),
    [item.productUid, wishList]
  );

  const onDelete = useCallback(() => dispatch(removeFromCart(item)), [dispatch, item]);

  return (
    <ListItem className={cn("product-item", { disabled: !item.quantity })} noChevron>
      <div slot="inner-start" className="product-item-content">
        <div className="product-item-content-head">
          <Checkbox
            className={cn("checkbox-cart", { selected: isSelected })}
            checked={isSelected}
            onChange={toggleSelection}
          />
          <div
            slot="media"
            className="product-item-content-head-image"
            onClick={handleProductClick}
          >
            {item.imageThumbnailUrl1 && <img src={item.imageThumbnailUrl1} />}
          </div>
          <div className="product-item-content-head-desc">
            <div className="item-text" onClick={handleProductClick}>
              <p>{item.productName}</p>
              <div
                slot="content-end"
                className="actions-container pure-visible-xs product-item-content-head-desc-price"
              >
                <div>
                  <CartItemPrice item={item} />
                </div>
              </div>
              <span>{item.productDescription}</span>
            </div>
            <div
              slot="content-end"
              className="actions-container pure-hidden-xs product-item-content-head-desc-price"
            >
              <div>
                <CartItemPrice item={item} />
              </div>
            </div>
          </div>
        </div>
        <div slot="before-title" className="before-title product-item-content-bottom">
          <div slot="inner" className="product-item-content-bottom-actions">
            <ProductItemPopover {...popover} item={item} />
            <div className="buttons-container product-item-content-bottom-actions-content-buttons">
              <AddWishButton
                text={t("Save for Later")}
                onClick={handleAddToWishList}
                active={isAddedToWishList}
              />
              <div
                className="buttons-container product-item-content-bottom-actions-content-buttons-remove"
                onClick={onDelete}
              >
                <IcRemove fill="var(--base-80)" />
                <span>{t("Remove")} </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ListItem>
  );
};
