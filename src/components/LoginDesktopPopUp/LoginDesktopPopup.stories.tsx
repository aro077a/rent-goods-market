import React, { useState } from "react";
import { Meta, Story } from "@storybook/react/types-6-0";

import F7Wrapper from "@/F7Wrapper";

import { LoginDesktopPopup } from "./LoginDesktopPopup";
import { LoginDesktopPopupProps } from "./LoginDesktopPopup.types";

export default {
  title: "Components/LoginDesktopPopup",
  component: LoginDesktopPopup,
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

const Wrapper: Story<LoginDesktopPopupProps> = (args) => {
  const [opened, setOpened] = useState(true);

  return <LoginDesktopPopup opened={opened} setOpened={setOpened} {...args} />;
};

export const Default: Story<LoginDesktopPopupProps> = (args) => <Wrapper {...args} />;
Default.args = {
  onRegister: () => alert("register"),
  onForgotPassword: () => alert("onForgotPassword"),
};
