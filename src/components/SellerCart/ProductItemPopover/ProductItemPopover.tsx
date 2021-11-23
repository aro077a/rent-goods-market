import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { addToCart } from "@/actions/cartActions";
import { PopoverButton } from "@/components/PopoverButton";
import { PopoverButtonValue } from "@/components/PopoverButton/PopoverButton.types";
import { PopoverList } from "@/components/PopoverList";
import { SmallSelector } from "@/components/SmallSelector";

import { ProductItemPopoverProps } from "./ProductItemPopover.types";

import "./ProductItemPopover.less";

export const ProductItemPopover: React.FC<ProductItemPopoverProps> = ({
  item,
  quantityValue,
  setQuantityValue,
  quantityPopOpen,
  setQuantityPopOpen,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const changeQuantity = useCallback(
    (productUid: string, q: number, itemUid: string) => {
      dispatch(addToCart(productUid, q, itemUid));
    },
    [dispatch]
  );

  const onPopoverButtonChange = useCallback(
    (val: number) => {
      setQuantityValue((obj) => obj.set(item.itemUid, val));
      setQuantityPopOpen((obj) => obj.set(item.itemUid, false));
      changeQuantity(item.productUid, val, item.itemUid);
    },
    [changeQuantity, item.itemUid, item.productUid, setQuantityPopOpen, setQuantityValue]
  );

  const onPopoverListChange = useCallback(
    (val: PopoverButtonValue) => {
      setQuantityPopOpen((obj) => obj.set(item.itemUid, false));
      setQuantityValue((obj) => obj.set(item.itemUid, val));
      if (val === "input" || val === "") return;
      changeQuantity(item.productUid, val, item.itemUid);
    },
    [changeQuantity, item.itemUid, item.productUid, setQuantityPopOpen, setQuantityValue]
  );

  const onPopoverButtonClick = useCallback(
    () => setQuantityPopOpen((obj) => obj.set(item.itemUid, true)),
    [item.itemUid, setQuantityPopOpen]
  );

  const onPopoverListClick = useCallback(
    () => setQuantityPopOpen((obj) => obj.set(item.itemUid, false)),
    [item.itemUid, setQuantityPopOpen]
  );

  const value = useMemo(() => quantityValue.get(item.itemUid) ?? 1, [item.itemUid, quantityValue]);

  const popoverIsOpen = useMemo(
    () => !!quantityPopOpen.get(item.itemUid),
    [item.itemUid, quantityPopOpen]
  );

  return (
    <div className="product-item-actions-content-popover row-center">
      <SmallSelector item={item} />
      <div className="count-stepper">
        <div className="popover-qty">
          <PopoverButton
            value={value}
            maxValue={item.availableQuantity}
            text={t(`Qty`)}
            popoverOpen={`.popover-qty-menu-${item.itemUid}`}
            onChange={onPopoverButtonChange}
            onClick={onPopoverButtonClick}
            quantity={Number(value)}
            itemType="P"
          />
          <PopoverList
            text={`${t("Available")}: ${item.availableQuantity}`}
            className={`popover-qty-menu-${item.itemUid}`}
            popoverQty={item.availableQuantity}
            selectedValue={value}
            onChange={onPopoverListChange}
            popoverIsOpen={popoverIsOpen}
            onClick={onPopoverListClick}
            itemType="P"
          />
        </div>
      </div>
    </div>
  );
};
