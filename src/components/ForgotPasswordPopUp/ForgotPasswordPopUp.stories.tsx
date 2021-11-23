import React, { useState } from "react";
import { Meta, Story } from "@storybook/react/types-6-0";

import F7Wrapper from "@/F7Wrapper";

import ForgotPasswordPopup from "./ForgotPasswordPopUp";
import { ForgotPasswordPopupProps } from "./ForgotPasswordPopUp.types";

export default {
  title: "Components/ForgotPasswordPopup",
  component: ForgotPasswordPopup,
  argTypes: {
    opened: {
      control: { type: "boolean" },
      defaultValue: true,
    },
  },
  decorators: [
    (Story) => (
      <F7Wrapper>
        <Story />
      </F7Wrapper>
    ),
  ],
} as Meta;

const Wrapper: Story<ForgotPasswordPopupProps> = (args) => {
  const [opened, setOpened] = useState(true);

  return <ForgotPasswordPopup opened={opened} setOpened={setOpened} {...args} />;
};

export const Default: Story<ForgotPasswordPopupProps> = (args) => <Wrapper {...args} />;
Default.args = {};
