import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";

import { SliderType } from "@/components/Slider/Slider.types";

import { Slider } from "./Slider";
import { SliderProps } from "./Slider.types";

export default {
  title: "Components/Slider",
  component: Slider,
  argTypes: {},
} as Meta;

const bigItemMock: SliderProps = {
  type: SliderType.big,
  slides: Array.from({ length: 4 }, () => ({
    uid: "4bf21def-63da-45ca-9841-9a762c8180c4",
    name: "Computer mouse",
    shortDescription: "Westrom computer mouse",
    category: "Other",
    categoryName: "Other",
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
  })),
  startChat: () => undefined,
};

const topItemMock: SliderProps = {
  type: SliderType.top,
  slides: Array.from({ length: 4 }, () => ({
    image:
      "https://www.googleapis.com/download/storage/v1/b/productpicture_dev/o/IMG_banner_44c31ff2-8d36-4b4e-a3ed-7167a8f049ce?generation=1606566142960539&alt=media",
    uid: "f0927b4a-47c3-4c12-87c5-f46a4d1ааа9d",
  })),
  onClick: () => undefined,
};

export const Top: Story<SliderProps> = (args) => <Slider {...args} />;
Top.args = {
  ...topItemMock,
  type: SliderType.top,
};

export const Big: Story<SliderProps> = (args) => <Slider {...args} />;
Big.args = {
  ...bigItemMock,
  type: SliderType.big,
};

export const Small: Story<SliderProps> = (args) => <Slider {...args} />;
Small.args = {
  ...bigItemMock,
  type: SliderType.small,
};
