import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import cn from "classnames";
import { Button, Col, f7, Icon, Navbar, Page, Radio, Row } from "framework7-react";
import { Map } from "immutable";

import { addToCart, loadCart, removeFromCart } from "@/actions/cartActions";
import { createProductsPurchaseOrder, resetOrder } from "@/actions/ordersActions";
import { loadPaymentCardsList, savePaymentCard } from "@/actions/paymentCardsActions";
import { removeAddress } from "@/actions/profileActions";
import { CartItemPrice } from "@/components/CartItemPrice";
import { PopoverButton } from "@/components/PopoverButton";
import { PopoverList } from "@/components/PopoverList";
import { SmallSelector } from "@/components/SmallSelector";
import { useAppSelector } from "@/hooks/store";
import DeliveryInfoEditPopup from "@/pages/cart/delivery-info-edit__popup";
import PaymentCardCreatePage from "@/pages/payment-card-create";
import { SavedCard } from "@/reducers/paymentCardsReducer";
import { Profile } from "@/reducers/sessionReducer";
import { Card, Country } from "@/types/commonapi";
import { Address, CartItem } from "@/types/marketplaceapi";
import { PaymentApiOrder } from "@/types/paymentapi";
import { formatPrice } from "@/utils";

import CountryPopup from "./CountryPopup";
import CVCPopup from "./CVCPopup";
import DeliveryEdit from "./DeliveryEdit";
import DeliveryInit from "./DeliveryInit";
import DeliveryPopup from "./DeliveryPopup";
import PaymentPopup from "./PaymentPopup";
import ResultBlock from "./ResultBlock";

import "./style.module.less";

export const CheckoutPage = ({ f7router }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [newCard, setNewCard] = useState<SavedCard | null>(null);

  const [orderCreating, setOrderCreating] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<PaymentApiOrder>();
  const [orderError, setOrderError] = useState<unknown>();

  const [CVCShow, setCVCShow] = useState(false);
  const [addCardShow, setAddCartShow] = useState(false);

  const [showNewDelivery, setShowNewDelivery] = useState(false);
  const [showEditDelivery, setShowEditDelivery] = useState(false);
  const [showCountryPopup, setShowCountryPopup] = useState(false);
  const [showCountryEditPopup, setShowCountryEditPopup] = useState(false);
  const [showMobileDeliverySelect, setShowMobileDeliverySelect] = useState(false);
  const [showMobilePaymentSelect, setShowMobilePaymentSelect] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState<Country>(null);

  const ordersReducer = useAppSelector((state) => state.ordersReducer);

  const profile = useAppSelector((state) => state.sessionReducer.profile);

  const items = useAppSelector((state) => state.cartReducer.items);

  const selected = useAppSelector((state) => state.cartReducer.selected);

  const filteredItems = useMemo(
    () =>
      items
        //.filter((i) => !!i.deliveryMethodOption)
        .filter((i) => i.quantity > 0)
        .filter((i) => selected.includes(i.itemUid)),
    [items, selected]
  );

  const itemsCount = filteredItems.reduce((sum, item) => sum + item.quantity, 0);

  const currency = useAppSelector((state) => state.classificatorReducer.currencyClassificator);

  const cards = useAppSelector((state) => state.paymentCardsReducer.cards);

  const [quantityPopOpen, setQuantityPopOpen] = useState(Map<string, boolean>());
  const [quantityValue, setQuantityValue] = useState(Map<string, number>());

  useEffect(() => {
    ordersReducer.orderCreating ? f7.preloader.show() : f7.preloader.hide();
    ordersReducer.orderCreating && setOrderCreating(true);
  }, [ordersReducer.orderCreating]);

  useEffect(() => {
    if (ordersReducer.order) {
      setCreatedOrder(ordersReducer.order);
      filteredItems.forEach((item) => dispatch(removeFromCart(item)));
    }
  }, [dispatch, filteredItems, ordersReducer.order]);

  useEffect(() => {
    ordersReducer.orderCreatingError && setOrderError(ordersReducer.orderCreatingError);
  }, [ordersReducer.orderCreatingError]);

  useEffect(() => {
    items.forEach((item) => {
      setQuantityValue((map) => map.set(item.itemUid, item.quantity));
    });
  }, [items]);

  useEffect(() => {
    dispatch(loadPaymentCardsList());
  }, [dispatch]);

  useEffect(() => {
    selectedAddress && dispatch(loadCart(selectedAddress.countryCode));
  }, [dispatch, selectedAddress]);

  useEffect(() => {
    if (items.length === 0) f7router.navigate("/cart/");
  }, [f7router, items]);

  useEffect(() => {
    const primary = profile.addresses ? profile.addresses.find((add) => add.primary) : undefined;
    if (primary) setSelectedAddress(primary);
  }, [profile]);

  const clickProductHandle = useCallback(
    (uid: string) => {
      f7router.navigate(`/product-details/${uid}/`);
    },
    [f7router]
  );

  const getCurrencySymbol = useCallback(
    (currencyCode: string) => {
      return currency.find((c) => c.code === currencyCode)?.symbol ?? "";
    },
    [currency]
  );

  const calculateDeliveryPrice = useCallback(() => {
    return formatPrice(
      filteredItems.reduce(
        (total, item) => total + (item.deliveryMethodOption?.price ?? 0) * item.quantity,
        0
      ),
      getCurrencySymbol(items[0]?.productCurrencyCode)
    );
  }, [filteredItems, getCurrencySymbol, items]);

  const calculateTotal = useCallback(() => {
    return formatPrice(
      filteredItems.reduce(
        (total, item) =>
          total +
          (item.productDiscountedPrice ?? item.productPrice) * item.quantity +
          (item.deliveryMethodOption?.price ?? 0) * item.quantity,
        0
      ),
      getCurrencySymbol(items[0]?.productCurrencyCode)
    );
  }, [filteredItems, getCurrencySymbol, items]);

  const removeAddressHandler = useCallback(
    (uid: string) => {
      dispatch(removeAddress(uid));
    },
    [dispatch]
  );

  const getItemsPrice = useCallback(() => {
    return formatPrice(
      filteredItems.reduce(
        (total, item) => total + (item.productDiscountedPrice ?? item.productPrice) * item.quantity,
        0
      ),
      getCurrencySymbol(filteredItems[0]?.productCurrencyCode)
    );
  }, [filteredItems, getCurrencySymbol]);

  const changeQuantity = useCallback(
    (productUid: string, q: number, itemUid: string) => {
      dispatch(addToCart(productUid, q, itemUid));
    },
    [dispatch]
  );

  const createOrderWithNewCard = useCallback(() => {
    if (!newCard) return;
    const items: { productUid: string; count: number }[] = filteredItems.map((value) => ({
      productUid: value.productUid,
      count: value.quantity,
    }));
    dispatch(createProductsPurchaseOrder("bankcard", selectedAddress, items, {}, newCard));
  }, [dispatch, filteredItems, newCard, selectedAddress]);

  const onConfirmClick = useCallback(() => {
    if (newCard && selectedCard.uid.includes("temporary")) {
      createOrderWithNewCard();
    } else {
      setCVCShow(true);
    }
  }, [createOrderWithNewCard, newCard, selectedCard.uid]);

  const saveCard = useCallback(
    (card: SavedCard) => {
      dispatch(savePaymentCard(card, false));
    },
    [dispatch]
  );

  const createOrderWithSavedCard = useCallback(
    (cvc: string) => {
      const items: { productUid: string; count: number }[] = filteredItems.map((value) => ({
        productUid: value.productUid,
        count: value.quantity,
      }));
      setCVCShow(false);
      dispatch(
        createProductsPurchaseOrder("bankcard", selectedAddress, items, {
          cardUid: selectedCard.uid,
          cvc,
        })
      );
    },
    [dispatch, filteredItems, selectedAddress, selectedCard.uid]
  );

  const getEmailOrPhone = useCallback((profile: Profile) => {
    if (profile.accountEmails && profile.accountEmails.length > 0) {
      return profile.accountEmails[0].email;
    }
    if (profile.accountPhones && profile.accountPhones.length > 0) {
      return profile.accountPhones[0].number;
    }
    return null;
  }, []);

  const deliveryItem = (address: Address) => {
    return (
      <div className="cart-block-item" key={address.uid}>
        <div>
          <Radio
            checked={selectedAddress?.uid === address.uid}
            onChange={() => setSelectedAddress(address)}
          />
        </div>
        <Col className="info-block">
          <div className="item-title">{`${profile.person.name} ${profile.person.surname}`}</div>
          <div className="item-text">{getEmailOrPhone(profile)}</div>
          <div className="item-text">{`${address.country.name}, ${address.city}, ${address.firstAddressLine}`}</div>
        </Col>
        <div>
          <a className="popover-open menu-link" data-popover={`.popover-link-${address.uid}`}>
            <Icon material="more_vert" />
          </a>
          <div className={`popover popover-link-${address.uid} menu`}>
            <div className="popover-inner">
              <div className="list">
                <ul>
                  <li>
                    <a
                      className="menu-item list-button item-link popover-close "
                      onClick={() => {
                        setSelectedAddress(address);
                        setShowEditDelivery(true);
                      }}
                    >
                      <Icon material="edit" className="menu-item-icon" />
                      <span className="menu-item-text">{t("Edit")}</span>
                    </a>
                  </li>
                  {!address.primary ? (
                    <li>
                      <a
                        className="menu-item list-button item-link popover-close"
                        onClick={() => {
                          removeAddressHandler(address.uid);
                        }}
                      >
                        <Icon material="clear" className="menu-item-icon" />
                        <span className="menu-item-text">{t("Remove")}</span>
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const mobileDeliveryBlock = () => {
    return (
      <div className="cart-block-item mobile-delivery">
        <Col className="info-block">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="item-title">{t("Delivery information")}</div>
            <a className="popover-open menu-link" onClick={() => setShowMobileDeliverySelect(true)}>
              <Icon material="edit" />
            </a>
          </div>

          {selectedAddress ? (
            <div>
              <div className="item-text">{getEmailOrPhone(profile)}</div>
              <div className="item-text">{selectedAddress.firstAddressLine}</div>
            </div>
          ) : null}
          <DeliveryPopup
            opened={showMobileDeliverySelect}
            onSelected={(address) => {
              setSelectedAddress(address);
              setShowMobileDeliverySelect(false);
            }}
            addDelivery={() => {
              setShowNewDelivery(true);
            }}
            onClose={() => setShowMobileDeliverySelect(false)}
          />
        </Col>
      </div>
    );
  };

  const paymentMobileBlock = () => {
    if (!cards || cards.length === 0) {
      return (
        <div className="cart-block-item mobile-payment">
          <Col className="info-block">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="item-title">{t("Payment Methods")}</div>
            </div>
            <div className="add-new" onClick={() => setAddCartShow(true)}>
              + {t("Add New Card")}
            </div>
          </Col>
        </div>
      );
    }
    return (
      <div className="cart-block-item mobile-payment">
        <Col className="info-block">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="item-title">{t("Payment Methods")}</div>
            <a className="popover-open menu-link" onClick={() => setShowMobilePaymentSelect(true)}>
              <Icon material="edit" />
            </a>
          </div>

          {selectedCard ? (
            <div className="payment-row mt10">
              <i
                className={cn("icon", `ic-${selectedCard.type && selectedCard.type.toLowerCase()}`)}
              />
              <Col className="info-block">
                <div className="item-title">{selectedCard.maskedNumber}</div>
                <div className="cart-date-text">{`${selectedCard.expMonth} / ${selectedCard.expYear}`}</div>
              </Col>
            </div>
          ) : null}
          <PaymentPopup
            opened={showMobilePaymentSelect}
            selectedCard={selectedCard}
            setSelectedCard={(card) => setSelectedCard(card)}
            onClickAddNew={() => setAddCartShow(true)}
            onSetNewCard={(card) => setNewCard(card)}
            onSaveCard={(card) => saveCard(card as SavedCard)}
            onClose={() => setShowMobilePaymentSelect(false)}
          />
        </Col>
      </div>
    );
  };

  const paymentItem = (card: Card) => {
    return (
      <div className="cart-block-item" key={card.uid}>
        <div className="radio-center">
          <Radio
            checked={selectedCard?.uid === card.uid}
            onChange={() => {
              setSelectedCard(card);
              if (card.uid.includes("temporary")) {
                setNewCard(card as SavedCard);
              }
            }}
          />
        </div>
        <div className="payment-row">
          <i className={cn("icon", `ic-${card.type && card.type.toLowerCase()}`)} />
          <Col className="info-block">
            <div className="item-title">{card.maskedNumber}</div>
            <div className="cart-date-text">{`${card.expMonth} / ${card.expYear}`}</div>
          </Col>
        </div>
      </div>
    );
  };

  const popoverOption = (item: CartItem) => (
    <div className="popover-content">
      <SmallSelector item={item} countryName={selectedAddress?.country.name} />
      <PopoverButton
        value={quantityValue.get(item.itemUid) ?? 1}
        maxValue={item.availableQuantity}
        text={t(`Qty`)}
        className="quality-selector"
        popoverOpen={`.popover-qty-menu-${item.itemUid}`}
        onChange={(val) => {
          setQuantityValue((obj) => obj.set(item.itemUid, val));
          setQuantityPopOpen((obj) => obj.set(item.itemUid, false));
          changeQuantity(item.productUid, val, item.itemUid);
        }}
        onClick={() => setQuantityPopOpen((obj) => obj.set(item.itemUid, true))}
        quantity={quantityValue.get(item.itemUid) ?? 1}
        itemType={"P"}
      />
      <PopoverList
        text={`${t("Available")}: ${item.availableQuantity}`}
        className={`popover-qty-menu-${item.itemUid}`}
        popoverQty={item.availableQuantity}
        selectedValue={quantityValue.get(item.itemUid) ?? 1}
        onChange={(val) => {
          setQuantityPopOpen((obj) => obj.set(item.itemUid, false));
          setQuantityValue((obj) => obj.set(item.itemUid, Number(val)));
          if (val === "input") return;
          changeQuantity(item.productUid, Number(val), item.itemUid);
        }}
        popoverIsOpen={!!quantityPopOpen.get(item.itemUid)}
        onClick={() => setQuantityPopOpen((obj) => obj.set(item.itemUid, false))}
        itemType={"P"}
      />
    </div>
  );

  const productItem = (item: CartItem) => {
    return (
      <div className="cart-block-item order-list" key={item.itemUid}>
        <Col
          className="info-block order-list-head"
          onClick={() => clickProductHandle(item.productUid)}
        >
          <div className="image">
            <img src={item.imageThumbnailUrl1} />
          </div>
          <div className="no-wrap-row">
            <div className="description-block">
              <div className="item-title">{item.productName}</div>
              <div className="description-block-price-mobile">
                <CartItemPrice item={item} />
              </div>
              <div className="item-description">{item.productDescription}</div>
            </div>
            <CartItemPrice item={item} />
          </div>
        </Col>
        <div className="delivery-block order-list-bottom">{popoverOption(item)}</div>
      </div>
    );
  };

  const deliveryBlock = (address: Address[] | undefined) => {
    return (
      <div className="cart-block delivery">
        <div className="card-block-title">{t("Delivery Information")}</div>
        <Col>
          {address && address.map(deliveryItem)}
          <div className="add-new" onClick={() => setShowNewDelivery(true)}>
            + {t("Add New Information")}
          </div>
        </Col>
        <DeliveryEdit
          opened={showEditDelivery}
          address={selectedAddress}
          onPopupClosed={(_, chooseCountry) => {
            if (chooseCountry) {
              setShowEditDelivery(false);
              setShowCountryEditPopup(true);
            } else {
              setShowEditDelivery(false);
              setShowCountryEditPopup(false);
            }
          }}
          country={selectedCountry}
          onAddOrUpdateInfo={(address) => {
            console.log(address);
          }}
        />
        <DeliveryInfoEditPopup
          opened={showNewDelivery}
          onPopupClosed={(_, chooseCountry) => {
            if (chooseCountry) {
              setShowNewDelivery(false);
              setShowCountryPopup(true);
            } else {
              setShowNewDelivery(false);
              setShowCountryPopup(false);
            }
          }}
          country={selectedCountry}
          onAddOrUpdateInfo={(address) => {
            console.log(address);
          }}
        />
        <CountryPopup
          opened={showCountryPopup}
          onSelected={(country) => {
            setSelectedCountry(country);
            setShowCountryPopup(false);
            setShowNewDelivery(true);
          }}
          onClose={() => {
            setShowCountryPopup(false);
            setShowNewDelivery(true);
          }}
        />
        <CountryPopup
          opened={showCountryEditPopup}
          onSelected={(country) => {
            setSelectedCountry(country);
            setShowCountryEditPopup(false);
            setShowEditDelivery(true);
          }}
          onClose={() => {
            setShowCountryEditPopup(false);
            setShowEditDelivery(true);
          }}
        />
      </div>
    );
  };

  const paymentBlock = (cards: Card[]) => {
    return (
      <div className="cart-block payment">
        <div className="card-block-title">{t("Payment Methods")}</div>
        <Col>
          {cards.map(paymentItem)}
          <div className="add-new" onClick={() => setAddCartShow(true)}>
            + {t("Add New Card")}
          </div>
        </Col>
        <PaymentCardCreatePage
          opened={addCardShow}
          onPopupClosed={() => setAddCartShow(false)}
          onSaveCard={(card) => {
            saveCard(card);
            setNewCard(null);
          }}
        />
      </div>
    );
  };

  const resultBlock = () => {
    const hasUndeliverableItems = filteredItems.filter((i) => !i.deliveryMethodOption);
    return (
      <div className="cart-block result-block ml24 checkout-result-content-summary">
        <div className="card-block-title">{t("Order Summary")}</div>
        <Col>
          <div className="result-item-row">
            <div className="result-item-title">{t("Seller")}</div>
            <div className="result-item-value">{filteredItems[0]?.sellerName}</div>
          </div>
          <div className="result-item-row">
            <div className="result-item-title">
              {t("Items")} ({itemsCount})
            </div>
            <div className="result-item-value">{getItemsPrice()}</div>
          </div>
          <div className="result-item-row">
            <div className="result-item-title">{t("Delivery")}</div>
            <div className="result-item-value">{calculateDeliveryPrice()}</div>
          </div>
          <div className="result-item-row result-item-total">
            <div className="result-item-total-title">{t("Total")}</div>
            <div className="result-item-total-title">{calculateTotal()}</div>
          </div>
          <div className="result-button">
            <Button
              round
              large
              fill
              onClick={onConfirmClick}
              disabled={!selectedCard || !selectedAddress || hasUndeliverableItems.length > 0}
            >
              <span>{t("Confirm and pay")}</span>
              <CVCPopup
                opened={CVCShow}
                cartNumber={selectedCard?.maskedNumber}
                onConfirm={(code) => createOrderWithSavedCard(code)}
                onClose={() => setCVCShow(false)}
              />
            </Button>
          </div>
        </Col>
      </div>
    );
  };

  const itemsBlock = (items: CartItem[]) => {
    return (
      <Row className="cart-block">
        <div className="card-block-title">{t("Order list")}</div>
        <Col>{items.map(productItem)}</Col>
      </Row>
    );
  };

  const renderContent = () => {
    if (orderCreating && createdOrder)
      return (
        <ResultBlock
          success={true}
          onClick={() => {
            dispatch(resetOrder());
            f7router.navigate("/", { force: true });
          }}
        />
      );
    if (orderError)
      return (
        <ResultBlock
          success={false}
          onClick={() => {
            dispatch(resetOrder());
            f7router.navigate("/cart/", { force: true });
          }}
        />
      );
    return (
      <div className="content checkout-result-content">
        <div className="checkout-result-content-info">
          {mobileDeliveryBlock()}
          {paymentMobileBlock()}
          {deliveryBlock(profile.addresses)}
          {paymentBlock(cards)}
          {itemsBlock(filteredItems)}
        </div>
        {resultBlock()}
      </div>
    );
  };

  if (!profile.addresses || profile.addresses.length === 0) {
    return (
      <Page className="bg">
        <Navbar title={t("Checkout")} backLink="Back" />
        <DeliveryInit />
      </Page>
    );
  }

  return (
    <Page className="bg checkout-result">
      <Navbar title={t("Checkout")} backLink="Back" />
      {renderContent()}
    </Page>
  );
};
