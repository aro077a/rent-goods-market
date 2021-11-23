import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";

import { AnaliticDetails } from "./AnaliticDetails";
import { AnaliticDetailsProps } from "./AnaliticDetails.types";

export default {
  title: "Components/AnaliticDetails",
  component: AnaliticDetails,
} as Meta;

export const View: Story<AnaliticDetailsProps> = (args) => <AnaliticDetails {...args} />;
View.args = {
  count: 12,
  type: "view",
};

export const Wish: Story<AnaliticDetailsProps> = (args) => <AnaliticDetails {...args} />;
Wish.args = {
  count: 12,
  type: "wish",
};
