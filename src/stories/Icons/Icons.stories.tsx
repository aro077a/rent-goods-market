import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import { Icon } from "framework7-react";

import * as Icons from "@/components-ui/icons";

import { classIcons } from "./classIcons";

import "./Icons.less";

export default {
  title: "Global/Icons",
} as Meta;

export const All: Story = () => (
  <div className="icons-container">
    {Object.entries(Icons).map(([key, Icon]) => (
      <div key={key} className="icons-container__icon">
        <p>{key}</p>
        <Icon />
      </div>
    ))}
    {classIcons.map((className) => (
      <div key={className} className="icons-container__icon">
        <p>{className}</p>
        <Icon className={className} />
      </div>
    ))}
  </div>
);
