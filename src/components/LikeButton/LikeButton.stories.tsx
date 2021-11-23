import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";

import { LikeButton } from "./LikeButton";

import { LikeButtonProps } from "./LikeButton.types";

export default {
  title: "Components/LikeButton",
  component: LikeButton,
} as Meta;

export const Default: Story<LikeButtonProps> = (args) => <LikeButton {...args} />;
Default.args = {};

export const DefaultActive: Story<LikeButtonProps> = (args) => <LikeButton {...args} />;
DefaultActive.args = {
  active: true,
};

export const Bordered: Story<LikeButtonProps> = (args) => <LikeButton {...args} />;
Bordered.args = {
  bordered: true,
};

export const BorderedActive: Story<LikeButtonProps> = (args) => <LikeButton {...args} />;
BorderedActive.args = {
  bordered: true,
  active: true,
};

export const BorderedShadow: Story<LikeButtonProps> = (args) => <LikeButton {...args} />;
BorderedShadow.args = {
  bordered: true,
  shadow: true,
};

export const BorderedShadowActive: Story<LikeButtonProps> = (args) => <LikeButton {...args} />;
BorderedShadowActive.args = {
  bordered: true,
  shadow: true,
  active: true,
};
