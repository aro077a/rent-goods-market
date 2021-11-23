import React from "react";
import { SwiperSlide } from "swiper/react";

import { SliderType } from "@/components/Slider/Slider.types";

import { SliderItemProps } from "./SliderItem.types";
import { getBackgroundImageStyle } from "./utils";
import { SmallItem } from "./SmallItem";
import { BigItem } from "./BigItem";
import { TopItem } from "./TopItem";
import { ImagesItem } from "./ImagesItem";

import "./SliderItem.less";

export const SliderItem: React.FC<SliderItemProps> = ({
  type,
  item,
  empty,
  classificator = [],
  onClickAddToWish,
  onClickStartChat,
  onClick = () => undefined,
  showFeaturesHiglight,
  videoPlayOnClick,
}) => {
  const { image } = item;

  switch (type) {
    case SliderType.top:
      return (
        <SwiperSlide
          key={item.uid || item.href}
          className="slider-item slider-item_top link"
          style={getBackgroundImageStyle(image)}
        >
          <TopItem item={item} onClick={onClick} />
        </SwiperSlide>
      );

    case SliderType.big:
      return (
        <SwiperSlide key={item.uid} className="slider-item slider-item_big no-padding">
          <BigItem
            item={item}
            empty={empty}
            onClickAddToWish={onClickAddToWish}
            onClickStartChat={onClickStartChat}
            classificator={classificator}
          />
        </SwiperSlide>
      );

    case SliderType.small:
      return (
        <SwiperSlide
          key={item.uid || item.href}
          className="slider-item slider-item_small no-padding"
        >
          <SmallItem
            item={item}
            empty={empty}
            onClickAddToWish={onClickAddToWish}
            showFeaturesHiglight={showFeaturesHiglight}
          />
        </SwiperSlide>
      );

    case SliderType.images: {
      return image ? (
        <SwiperSlide
          key={item.uid || item.href}
          className="slider-item"
          style={getBackgroundImageStyle(image)}
        />
      ) : (
        <SwiperSlide key={item.uid || item.href} className="slider-item">
          <ImagesItem item={item} videoPlayOnClick={videoPlayOnClick} />
        </SwiperSlide>
      );
    }
    default:
      return null;
  }
};
