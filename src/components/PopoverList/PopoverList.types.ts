import { PopoverButtonValue } from "@/components/PopoverButton/PopoverButton.types";

export type PopoverListProps = {
  text?: string;
  className?: string;
  popoverIsOpen: boolean;
  popoverQty?: number;
  selectedValue?: PopoverButtonValue;
  itemType?: string;
  onChange: (value: PopoverButtonValue) => void;
  onClick: () => void;
};
