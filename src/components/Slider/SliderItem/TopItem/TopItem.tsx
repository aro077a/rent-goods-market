import React, { useCallback } from "react";

import { SliderItemProps } from "@/components/Slider/SliderItem/SliderItem.types";

import "./TopItem.less";

export const TopItem = ({ onClick, item }: SliderItemProps) => {
  const { name, promo } = item;

  const handleClick = useCallback(() => onClick(item), [item, onClick]);

  return (
    <div onClick={handleClick} className="slider-item_top__content">
      <p className="name">{name}</p>
      <p className="promo">{promo}</p>
    </div>
  );
};
