import React from "react";
import {
  Searchbar,
  Link,
  Swiper,
  SwiperSlide,
  Block,
  BlockTitle,
} from "framework7-react";
import { formatPrice } from "../utils";

import "./PriceDetails.less";

const getPriceClassName = (vertical?: boolean, reverse?: boolean): string => {
  return "price" + (vertical ? " vertical" : "") + (reverse ? " reverse" : "");
};

const Price = ({
  price,
  priceDiscount,
  currencyCode,
  vertical,
  reverse,
}: {
  price?: number;
  priceDiscount?: number;
  currencyCode?: string;
  vertical?: boolean;
  reverse?: boolean;
}) => {
  return (
    <p className={getPriceClassName(vertical, reverse)}>
      {typeof priceDiscount !== "undefined" ? (
        <span className="discount">
          {formatPrice(priceDiscount, currencyCode)}
        </span>
      ) : null}
      <span className={typeof priceDiscount !== "undefined" ? "full" : null}>
        {formatPrice(price, currencyCode)}
      </span>
    </p>
  );
};

export default Price;
