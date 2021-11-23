import React, { useMemo, useCallback } from "react";

import { useDispatch } from "react-redux";
import SwiperCore, { Pagination, Navigation, Virtual } from "swiper/core";
import { Swiper } from "swiper/react";
import cn from "classnames";

import { addToWishList } from "@/actions/productActions";
import { useAppSelector } from "@/hooks/store";

import { SliderProps, SliderType } from "./Slider.types";
import { getParams } from "./utils";
import { SliderItem } from "./SliderItem";

import "swiper/swiper.less";
import "./Slider.less";

SwiperCore.use([Pagination, Navigation, Virtual]);

const EmptySlides = ({ type }: { type: SliderType }): JSX.Element[] => {
  const slidesCounts = type === SliderType.small ? 2 : 1;

  return [slidesCounts].map((_, index) => <SliderItem key={index} type={type} item={{}} empty />);
};

export const Slider: React.FC<SliderProps> = ({
  className,
  slides,
  type,
  showIfEmpty = false,
  startChat,
  onClick,
  videoPlayOnClick,
  showFeaturesHiglight,
  sliderZoom,
  changeActiveIndex,
}) => {
  const handleChangeIndex = useCallback(
    (e: SwiperCore) => changeActiveIndex?.(e.realIndex + 1),
    [changeActiveIndex]
  );

  const dispatch = useDispatch();

  const addToWish = useCallback((uid: string) => dispatch(addToWishList(uid)), [dispatch]);

  const categoriesClassificator = useAppSelector((state) => state.categoryReducer.flat) || [];

  const params = useMemo(() => getParams(type), [type]);

  return (
    <Swiper
      {...params}
      spaceBetween={sliderZoom ? 20 : 30}
      onSlideChange={handleChangeIndex}
      loop
      navigation
      pagination={type === SliderType.top || type === SliderType.images}
      className={cn("slider", type, className)}
    >
      {slides.length > 0
        ? slides.map((item) => (
            <React.Fragment key={`${item.name}${item.href}`}>
              {SliderItem({
                type,
                item,
                classificator: categoriesClassificator,
                onClickAddToWish: addToWish,
                onClickStartChat: startChat,
                onClick,
                showFeaturesHiglight,
                videoPlayOnClick,
              })}
            </React.Fragment>
          ))
        : showIfEmpty
        ? EmptySlides({ type })
        : null}
    </Swiper>
  );
};
