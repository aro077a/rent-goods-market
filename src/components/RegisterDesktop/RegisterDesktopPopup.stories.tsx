import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";

import F7Wrapper from "@/F7Wrapper";

import { RegisterDesktopPopupProps } from "./RegisterDesktopPopup.types";

import RegisterDesktopPopup from "./RegisterDesktopPopup";

export default {
  title: "Components/RegisterDesktopPopup",
  component: RegisterDesktopPopup,
  decorators: [
    (Story) => (
      <F7Wrapper>
        <Story />
      </F7Wrapper>
    ),
  ],
  argTypes: {
    opened: {
      control: { type: "boolean" },
      defaultValue: true,
    },
  },
} as Meta;

export const Default: Story<RegisterDesktopPopupProps> = (args) => (
  <RegisterDesktopPopup {...args} />
);
Default.args = {};
