import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";

import { ShareButton } from "./ShareButton";
import { ShareButtonProps } from "./ShareButton.types";

export default {
  title: "Components/ShareButton",
  component: ShareButton,
} as Meta;

export const Default: Story<ShareButtonProps> = (args) => <ShareButton {...args} />;
Default.args = {
  text: "Share",
};

export const Large: Story<ShareButtonProps> = (args) => <ShareButton {...args} />;
Large.args = {
  text: "Share",
  large: true,
};
