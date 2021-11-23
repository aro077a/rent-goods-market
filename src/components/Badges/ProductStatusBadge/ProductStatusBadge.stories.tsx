import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";

import ProductStatusBadge from "./ProductStatusBadge";

import { ProductStatusBadgeProps } from "./ProductStatusBadge.types";
import { Product } from "@/types/marketplaceapi";

export default {
  title: "Components/Badges/ProductStatusBadge",
  component: ProductStatusBadge,
} as Meta;

export const Draft: Story<ProductStatusBadgeProps> = (args) => <ProductStatusBadge {...args} />;
Draft.args = {
  status: Product.StatusEnum.DRF,
};

export const Declined: Story<ProductStatusBadgeProps> = (args) => <ProductStatusBadge {...args} />;
Declined.args = {
  status: Product.StatusEnum.DCL,
};

export const Approved: Story<ProductStatusBadgeProps> = (args) => <ProductStatusBadge {...args} />;
Approved.args = {
  status: Product.StatusEnum.APR,
};

export const Published: Story<ProductStatusBadgeProps> = (args) => <ProductStatusBadge {...args} />;
Published.args = {
  status: Product.StatusEnum.PBL,
};

export const Expired: Story<ProductStatusBadgeProps> = (args) => <ProductStatusBadge {...args} />;
Expired.args = {
  status: Product.StatusEnum.EXP,
};

export const Discontinued: Story<ProductStatusBadgeProps> = (args) => (
  <ProductStatusBadge {...args} />
);
Discontinued.args = {
  status: Product.StatusEnum.DSC,
};

export const Suspended: Story<ProductStatusBadgeProps> = (args) => <ProductStatusBadge {...args} />;
Suspended.args = {
  status: Product.StatusEnum.SUS,
};

export const OutOfStock: Story<ProductStatusBadgeProps> = (args) => (
  <ProductStatusBadge {...args} />
);
OutOfStock.args = {
  status: Product.StatusEnum.OOS,
};

export const Archive: Story<ProductStatusBadgeProps> = (args) => <ProductStatusBadge {...args} />;
Archive.args = {
  status: Product.StatusEnum.AFR,
};
