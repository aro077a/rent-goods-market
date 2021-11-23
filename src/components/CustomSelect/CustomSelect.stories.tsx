import React, { useState } from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import F7Wrapper from "@/F7Wrapper";

import { CustomSelect } from "./CustomSelect";
import { CustomSelectProps, CustomSelectValue } from "./CustomSelect.types";

export default {
  title: "Components/CustomSelect",
  component: CustomSelect,
  decorators: [
    (Story) => (
      <F7Wrapper>
        <Story />
      </F7Wrapper>
    ),
  ],
} as Meta;

const Wrapper: Story<CustomSelectProps> = (args) => {
  const [value, setValue] = useState<CustomSelectValue>(null);

  return <CustomSelect {...args} value={value} onChange={setValue} />;
};

export const Default: Story<CustomSelectProps> = (args) => <Wrapper {...args} />;
Default.args = {
  label: "Country",
  options: [
    { label: "Latvia", value: "LV" },
    { label: "Afghanistan", value: "AF" },
    { label: "Åland Islands", value: "AX" },
    { label: "Albania", value: "AL" },
    { label: "Algeria", value: "DZ" },
    { label: "American Samoa", value: "AS" },
  ],
};
