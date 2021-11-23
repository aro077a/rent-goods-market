import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import { F7ListInput, List } from "framework7-react";

import F7Wrapper from "@/F7Wrapper";

import { CustomInput } from "./CustomInput";

export default {
  title: "Components/CustomInput",
  component: CustomInput,
  decorators: [
    (Story) => (
      <F7Wrapper>
        <Story />
      </F7Wrapper>
    ),
  ],
} as Meta;

export const Default: Story<F7ListInput.Props> = (args) => (
  <List noHairlinesMd>
    <CustomInput slot="list" {...args} />
  </List>
);
Default.args = {};

export const WithValidation: Story<F7ListInput.Props> = (args) => (
  <List noHairlinesMd>
    <CustomInput slot="list" {...args} />
  </List>
);
WithValidation.args = {
  label: "Label",
  validate: true,
  required: true,
  errorMessage: "Error message",
};

export const WithClearButton: Story<F7ListInput.Props> = (args) => (
  <List noHairlinesMd>
    <CustomInput slot="list" {...args} />
  </List>
);
WithClearButton.args = {
  clearButton: true,
  label: "Clear me",
};
