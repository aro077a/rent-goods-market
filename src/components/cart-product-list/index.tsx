import React from "react";
import { List, Link, ListItem, Stepper } from "framework7-react";
import { chain } from "lodash";
import cn from "classnames";

import { IProduct } from "@/reducers/productReducer";
import { Price } from "@/components/Price";
import { IcDelivery } from "@/components-ui/icons";
import { AddWishButton } from "@/components/AddWishButton";
import { ThemedButton } from "@/components/ThemedButton";

import "./style.less";

type Props = List.Props & {
  items: {
    product: IProduct;
    price: number;
    count: number;
    discount: number;
    total: number;
  }[];
  onMoreLinkClick?(group: string): void;
  onProductCountStepperChange?(item: IProduct, value: number): void;
  freeDeliveryLabel: string;
  estimatedDeliveryTimeLabel: string;
  onSelectDeliveryMethodClick?(): void;
  onDeleteItemClick?(product: IProduct): void;
  onAddToWishListClick?(product: IProduct): void;
  wishList?: IProduct[];
  showActions?: boolean;
  payOnlyThisSellerLabel: string;
  onPayOnlyThisSellerClick?(sellerUid: string): void;
  isItemLink?: boolean;
};

const isAddedToWishList = (uid: string, wishList: IProduct[]) => {
  return wishList.filter((item) => item.uid === uid).length > 0;
};

const CartProductList = (props: Props) => {
  const {
    className,
    items,
    onMoreLinkClick,
    onProductCountStepperChange,
    freeDeliveryLabel,
    estimatedDeliveryTimeLabel,
    onSelectDeliveryMethodClick,
    onAddToWishListClick,
    onDeleteItemClick,
    wishList = [],
    showActions,
    payOnlyThisSellerLabel,
    onPayOnlyThisSellerClick,
    isItemLink,
    ...rest
  } = props;
  const groupedItems = chain(items)
    .groupBy((item) => item.product.sellerUid)
    .map((value, key) => {
      return { key, items: value };
    })
    .value();

  const ifCartHasMultipleManufacturer = groupedItems.length > 1;

  return (
    <List
      className={cn("cart-product-list", className)}
      mediaList
      noHairlines
      noHairlinesBetween
      {...rest}
    >
      <ul>
        {groupedItems.map((g) => {
          return (
            <div key={g.key} className="manuf-group-wrapper">
              <li className="manuf-group media-item no-chevron">
                <div className="item-content">
                  <div className="group-info">
                    <div className="group-icon"></div>
                    <div className="group-title">{g.key}</div>
                  </div>
                  <Link
                    href="#"
                    iconOnly
                    className="link-more pure-visible-xs"
                    iconF7="ellipsis_vertical"
                    onClick={() => onMoreLinkClick(g.key)}
                  />
                </div>
              </li>
              {g.items.map(
                ({
                  product,
                  product: {
                    shortDescription,
                    uid,
                    name,
                    price,
                    discountedPrice,
                    currencyCode,
                    imageThumbnailUrl1,
                  },
                  count,
                }) => {
                  return (
                    <ListItem
                      key={uid}
                      noChevron
                      id={uid}
                      className="product-item"
                      link={isItemLink}
                    >
                      <div slot="media" className="image">
                        {imageThumbnailUrl1 && <img src={imageThumbnailUrl1} />}
                      </div>
                      <div slot="inner-start" className="item-title-row">
                        <div className="item-title">{name}</div>
                      </div>
                      <div slot="inner-end" className="item-text">
                        {shortDescription}
                      </div>
                      <div slot="content-end" className="count-stepper pure-hidden-xs">
                        <Stepper
                          min={1}
                          value={count}
                          onStepperChange={(val) => onProductCountStepperChange(product, val)}
                        />
                      </div>
                      <div slot="content-end" className="actions-container pure-hidden-xs">
                        <Price
                          {...{
                            price,
                            discountedPrice,
                            currencyCode,
                          }}
                        />
                        {showActions && (
                          <div className="buttons-container">
                            <AddWishButton
                              onClick={() => onAddToWishListClick(product)}
                              active={isAddedToWishList(product.uid, wishList)}
                            />
                            <Link
                              iconMaterial="delete_outline"
                              onClick={() => onDeleteItemClick(product)}
                            />
                          </div>
                        )}
                      </div>
                      <div slot="inner-end" className="small-price-stepper pure-visible-xs">
                        <Price
                          {...{
                            price,
                            discountedPrice,
                            currencyCode,
                          }}
                        />
                        <div className="stepper-container">
                          <Stepper
                            min={1}
                            value={count}
                            onStepperChange={(val) => onProductCountStepperChange(product, val)}
                          />
                        </div>
                      </div>
                    </ListItem>
                  );
                }
              )}
              <ListItem
                link
                className="free-delivery-item-container free-delivery-item-container-small free-delivery-item pure-visible-xs"
                title={freeDeliveryLabel}
                footer={estimatedDeliveryTimeLabel}
                chevronCenter
                onClick={onSelectDeliveryMethodClick}
              >
                {/* @ts-ignore */}
                <IcDelivery slot="media" />
              </ListItem>
              <ListItem
                className="free-delivery-item-container free-delivery-item pure-hidden-xs"
                title={freeDeliveryLabel}
                footer={estimatedDeliveryTimeLabel}
                noChevron
              >
                {ifCartHasMultipleManufacturer && (
                  <div slot="content-end">
                    <ThemedButton round large fill onClick={() => onPayOnlyThisSellerClick(g.key)}>
                      {payOnlyThisSellerLabel}
                    </ThemedButton>
                  </div>
                )}
              </ListItem>
            </div>
          );
        })}
      </ul>
    </List>
  );
};

export default CartProductList;
