import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Block } from "framework7-react";

import { useAppSelector } from "@/hooks/store";
import ChatWithSeller from "@/components/ChatWithSeller";
import { LikeButton } from "@/components/LikeButton";
import { Price } from "@/components/Price";
import { getBackgroundImageStyle } from "@/components/Slider/SliderItem/utils";
import { getCategoryNameByCategoryId } from "@/utils";

import { SliderItemProps } from "@/components/Slider/SliderItem/SliderItem.types";

import "./BigItem.less";

export const BigItem = ({
  item,
  empty,
  onClickAddToWish,
  onClickStartChat,
  classificator,
}: SliderItemProps) => {
  const {
    image,
    name,
    price,
    uid,
    category,
    categoryName,
    currencyCode,
    priceDiscount,
    description,
    wish,
    rentOptions,
  } = item;

  const { t } = useTranslation();

  const handleItemClick = useCallback(() => item?.onClick?.(item), [item]);

  const imageStyles = useMemo(() => getBackgroundImageStyle(image), [image]);

  const displayedCategory = useMemo(
    () => categoryName || getCategoryNameByCategoryId(category, classificator),
    [classificator, category, categoryName]
  );

  const handleStartChat = useCallback(() => onClickStartChat(uid), [uid, onClickStartChat]);

  const handleLike = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      onClickAddToWish(uid);
    },
    [uid, onClickAddToWish]
  );

  const { resizeEvent } = useAppSelector((state) => state.rootReducer);

  const shadowedLike = useMemo(() => resizeEvent.width <= 768, [resizeEvent.width]);

  return (
    <>
      <div className="link slider-link" onClick={handleItemClick}>
        <div className="header-image" style={imageStyles}>
          {!empty && (
            <>
              <LikeButton
                className="add-wish"
                active={wish}
                bordered
                shadow={shadowedLike}
                onClick={handleLike}
              />
              <ChatWithSeller text={t("Chat with seller")} onClick={handleStartChat} />
            </>
          )}
        </div>
        <Block className="info">
          <p className="title">{name}</p>
          <span className="category">{displayedCategory}</span>
          <span className="description pure-visible-xl">{description}</span>
          {!empty && (
            <Price
              price={price}
              discountedPrice={priceDiscount}
              currencyCode={currencyCode}
              period={rentOptions?.period}
              className="slider-item_big__price"
            />
          )}
        </Block>
      </div>
    </>
  );
};
