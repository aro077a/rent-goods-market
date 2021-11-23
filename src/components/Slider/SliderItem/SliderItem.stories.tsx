import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";

import { SliderType } from "@/components/Slider/Slider.types";

import { SliderItem } from "./SliderItem";
import { SliderItemProps } from "./SliderItem.types";

export default {
  title: "Components/SliderItem",
  component: SliderItem,
  argTypes: {},
} as Meta;

const bigItemMock: SliderItemProps = {
  item: {
    uid: "4bf21def-63da-45ca-9841-9a762c8180c4",
    name: "Computer mouse",
    shortDescription: "Westrom computer mouse",
    category: "Other",
    price: 8,
    currencyCode: "USD",
    sellerPhone: "37129548213",
    wish: false,
    image:
      "https://www.googleapis.com/download/storage/v1/b/productpicture_teta/o/PDP_100-000-159-31_7878d9db-4999-4337-a17c-029323184cfa?generation=1621501827669989&alt=media",
    priceDiscount: 5,
    href: "/product-details/4bf21def-63da-45ca-9841-9a762c8180c4/",
    onClick: () => undefined,
    description: "Westrom computer mouse",
  },
  onClickAddToWish: () => undefined,
  onClickStartChat: () => undefined,
  classificator: [],
};

const topItemMock: SliderItemProps = {
  item: {
    image:
      "https://www.googleapis.com/download/storage/v1/b/productpicture_dev/o/IMG_banner_44c31ff2-8d36-4b4e-a3ed-7167a8f049ce?generation=1606566142960539&alt=media",
    uid: "f0927b4a-47c3-4c12-87c5-f46a4d1ааа9d",
  },
  onClick: () => undefined,
};

const smallItemMock: SliderItemProps = {
  item: {
    uid: "292573c7-06fd-487d-90e6-6ed4660fe904",
    name: "Test product",
    shortDescription: "Test product description",
    category: "009001006",
    categoryName: "Other",
    price: 123,
    currencyCode: "USD",
    wish: false,
    image:
      "https://www.googleapis.com/download/storage/v1/b/productpicture_teta/o/PDP_622-300-734-33_128139e9-df08-443a-ade8-4a7e2629cdec?generation=1632578638178566&alt=media",
    href: "/product-details/292573c7-06fd-487d-90e6-6ed4660fe904/",
    onClick: () => undefined,
    description: "Test product description",
  },
  onClickAddToWish: () => undefined,
  showFeaturesHiglight: true,
};

export const Top: Story<SliderItemProps> = (args) => <SliderItem {...args} />;
Top.args = {
  type: SliderType.top,
  ...topItemMock,
};

export const Big: Story<SliderItemProps> = (args) => <SliderItem {...args} />;
Big.args = {
  type: SliderType.big,
  ...bigItemMock,
};

export const Small: Story<SliderItemProps> = (args) => <SliderItem {...args} />;
Small.args = {
  type: SliderType.small,
  ...smallItemMock,
};
