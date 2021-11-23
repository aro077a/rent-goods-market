import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Block, BlockTitle, Button, Col, List, ListItem, Row } from "framework7-react";
import { Map } from "immutable";

import { useAppSelector } from "@/hooks/store";
import { isLoggedIn } from "@/selectors/isLoggedIn";
import { formatPrice } from "@/utils";

import { CartItem } from "./CartItem";
import { SellerCartProps } from "./SellerCart.types";

import "./SellerCart.less";

export const SellerCart = ({ items, onCheckout, f7router, onLogin }: SellerCartProps) => {
  const { t } = useTranslation();

  const [quantityPopOpen, setQuantityPopOpen] = useState(Map<string, boolean>());
  const [quantityValue, setQuantityValue] = useState(Map<string, number>());

  const currency = useAppSelector((state) => state.classificatorReducer.currencyClassificator);

  const selected = useAppSelector((state) => state.cartReducer.selected);

  const getCurrencySymbol = useCallback(
    (currencyCode: string) => currency.find((c) => c.code === currencyCode)?.symbol ?? "",
    [currency]
  );

  useEffect(() => {
    items.forEach((item) => {
      setQuantityValue((map) => map.set(item.itemUid, item.quantity));
    });
  }, [items]);

  const allItemsCount = useMemo(
    () =>
      items
        .filter((item) => selected.includes(item.itemUid) && item.deliveryMethodOption)
        .reduce((sum, item) => sum + item.quantity, 0),
    [items, selected]
  );

  const productsCount = useMemo(
    () =>
      items.filter((item) => selected.includes(item.itemUid) && item.deliveryMethodOption).length,
    [items, selected]
  );

  const itemsPrice = useMemo(
    () =>
      formatPrice(
        items
          .filter((item) => item.deliveryMethodOption && selected.includes(item.itemUid))
          .reduce(
            (total, item) =>
              total + (item.productDiscountedPrice ?? item.productPrice) * item.quantity,
            0
          ),
        getCurrencySymbol(items[0].productCurrencyCode)
      ),
    [getCurrencySymbol, items, selected]
  );

  const deliveryPrice = useMemo(
    () =>
      formatPrice(
        items
          .filter((item) => item.deliveryMethodOption && selected.includes(item.itemUid))
          .reduce((total, item) => total + item.deliveryMethodOption.price * item.quantity, 0),
        getCurrencySymbol(items[0].productCurrencyCode)
      ),
    [getCurrencySymbol, items, selected]
  );

  const totalPrice = useMemo(
    () =>
      formatPrice(
        items
          .filter((item) => item.deliveryMethodOption && selected.includes(item.itemUid))
          .reduce(
            (total, item) =>
              total +
              (item.productDiscountedPrice ?? item.productPrice) * item.quantity +
              (item.deliveryMethodOption?.price ?? 0) * item.quantity,
            0
          ),
        getCurrencySymbol(items[0].productCurrencyCode)
      ),
    [getCurrencySymbol, items, selected]
  );

  const logged = useAppSelector(isLoggedIn);

  const onCheckoutClick = useCallback(() => {
    if (!logged) {
      onLogin();
      return;
    }
    onCheckout(items[0].sellerUid);
  }, [items, logged, onCheckout, onLogin]);

  return (
    <Row className="seller-cart" noGap>
      <Col width="100" className="seller-cart-products-col">
        <List>
          <ul>
            <div className="manuf-group-wrapper">
              {items.map((item) => (
                <CartItem
                  key={item.productUid}
                  item={item}
                  f7router={f7router}
                  popover={{
                    quantityPopOpen,
                    quantityValue,
                    setQuantityPopOpen,
                    setQuantityValue,
                  }}
                />
              ))}
            </div>
          </ul>
        </List>
      </Col>
      <Col width="100" className="seller-cart-order-summary-col">
        <div className="seller-cart-order-summary">
          <BlockTitle medium>{t("Order summary")}</BlockTitle>
          <List className="order-summary" noHairlines noChevron noHairlinesBetween>
            <ListItem title={String(t("Seller"))} after={items[0].sellerName} />
            <ListItem title={t("Items") + ` (${allItemsCount})`} after={itemsPrice} />
            <ListItem title={String(t("Delivery"))} after={deliveryPrice} />
            <ListItem title={String(t("Total"))} after={totalPrice} className="total" />
          </List>
          <Block>
            <Button round large fill onClick={onCheckoutClick} disabled={allItemsCount === 0}>
              <span>
                {t("Go to checkout")} ({productsCount})
              </span>
            </Button>
          </Block>
        </div>
      </Col>

      <Col width="100" className="seller-cart-order-summary-col-mobile">
        <div className="seller-cart-order-summary-mobile">
          <div className="info">
            <div className="seller-name">{`${t("Seller")}: ${items[0].sellerName}`}</div>
            <div className="price">{totalPrice}</div>
          </div>
          <Block className="seller-cart-order-summary-mobile-checkout">
            <Button round large fill onClick={onCheckoutClick} disabled={allItemsCount === 0}>
              <span>{`${t("Checkout")} (${productsCount})`}</span>
            </Button>
          </Block>
        </div>
      </Col>
    </Row>
  );
};
