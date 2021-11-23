import React, { useCallback, useMemo } from "react";
import cn from "classnames";
import { Icon, List, ListItem, Popover } from "framework7-react";

import { PopoverButtonValue } from "@/components/PopoverButton/PopoverButton.types";

import { PopoverListProps } from "./PopoverList.types";

import "./PopoverList.less";

const MAX_SHOWING_ITEMS = 10;

export const PopoverList = ({
  text,
  className,
  popoverIsOpen,
  popoverQty,
  selectedValue,
  itemType,
  onChange,
  onClick,
}: PopoverListProps): JSX.Element => {
  const isShowPlus = useMemo(() => itemType === "P" || itemType === "I", [itemType]);

  const options = useMemo<{ value: PopoverButtonValue; title: string | number }[]>(
    () =>
      Array.from({ length: MAX_SHOWING_ITEMS }, (_, index) =>
        popoverQty > MAX_SHOWING_ITEMS && index === MAX_SHOWING_ITEMS - 1
          ? {
              value: isShowPlus ? "input" : index + 1,
              title: `${index + 1}${isShowPlus ? "+" : ""}`,
            }
          : { value: index + 1, title: index + 1 }
      ),
    [isShowPlus, popoverQty]
  );

  const makeListItemClick = useCallback(
    (value: PopoverButtonValue) => () => {
      onChange(value);
      onClick();
    },
    [onChange, onClick]
  );

  return (
    <Popover className={cn("popover-list", className)} opened={popoverIsOpen}>
      <List>
        {text && <p className="popover-list-title">{text}</p>}
        {options.map((item, index) => (
          <ListItem title={item.title} key={index} onClick={makeListItemClick(item.value)}>
            {item.value === selectedValue && <Icon material="done" className="selected-icon" />}
          </ListItem>
        ))}
      </List>
    </Popover>
  );
};
