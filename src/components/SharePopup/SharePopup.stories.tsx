import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";

import F7Wrapper from "@/F7Wrapper";

import { SharePopup } from "./SharePopup";
import { SharePopupProps } from "./SharePopup.types";

export default {
  title: "Components/SharePopup",
  component: SharePopup,
  decorators: [
    (Story) => (
      <F7Wrapper>
        <Story />
      </F7Wrapper>
    ),
  ],
} as Meta;

export const Default: Story<SharePopupProps> = (args) => <SharePopup {...args} />;
Default.args = {
  large: false,
  text: "SharePopup text",
  uid: "1",
};

export const Large: Story<SharePopupProps> = (args) => <SharePopup {...args} />;
Large.args = {
  large: true,
  text: "SharePopup text",
  uid: "1",
};
