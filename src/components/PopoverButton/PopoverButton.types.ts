import { WithTranslation } from "react-i18next";

export type PopoverButtonValue = "" | "input" | number;

export type PopoverButtonProps = {
  text?: string;
  icon?: string;
  className?: string;
  popoverOpen: string;
  value?: PopoverButtonValue;
  quantity?: number;
  maxValue?: number;
  itemType: string;
  onChange: (e: number) => void;
  onClick: () => void;
};

export type PopoverButtonMapProps = Pick<WithTranslation, "t"> & PopoverButtonProps;

export type PopoverButtonState = {
  inputValue: PopoverButtonValue;
};
