import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";

import { ProductRentOptions } from "@/types/marketplaceapi";

import { Price } from "./Price";
import { PriceProps } from "./Price.types";

export default {
  title: "Components/Price",
  component: Price,
  argTypes: {},
} as Meta;

export const LargeDiscounted: Story<PriceProps> = (args) => <Price {...args} />;
LargeDiscounted.args = {
  size: "large",
  currencyCode: "USD",
  direction: "row",
  price: 1000,
  discountedPrice: 900,
  withSaleIcon: true,
};

export const ForPeriod: Story<PriceProps> = (args) => <Price {...args} />;
ForPeriod.args = {
  price: 1000,
  discountedPrice: 900,
  withSaleIcon: true,
  currencyCode: "RUB",
  period: ProductRentOptions.PeriodEnum.MONTH,
};

export const MediumColumn: Story<PriceProps> = (args) => <Price {...args} />;
MediumColumn.args = {
  size: "medium",
  currencyCode: "RUB",
  direction: "column",
  price: 1000,
  discountedPrice: 900,
};

export const SmallDefault: Story<PriceProps> = (args) => <Price {...args} />;
SmallDefault.args = {
  price: 1000,
  currencyCode: "EU",
  size: "small",
};

export const XSmallDiscountedWithountIcon: Story<PriceProps> = (args) => <Price {...args} />;
XSmallDiscountedWithountIcon.args = {
  price: 1000,
  discountedPrice: 900,
  currencyCode: "EU",
  size: "xsmall",
  withSaleIcon: false,
};
