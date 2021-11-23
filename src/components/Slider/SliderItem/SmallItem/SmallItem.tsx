import React, { useMemo, useCallback } from "react";
import { Block } from "framework7-react";
import cn from "classnames";

import { SliderItemProps } from "@/components/Slider/SliderItem/SliderItem.types";
import { PremiumBadge } from "@/components/Badges";
import { hasFeatureCode } from "@/components/Catalog/CatalogItem/utils";
import { IcCrown } from "@/components-ui/icons";
import { Price } from "@/components/Price";
import { LikeButton } from "@/components/LikeButton";
import { useAppSelector } from "@/hooks/store";

import "./SmallItem.less";

export const SmallItem = ({
  item,
  empty,
  onClickAddToWish,
  showFeaturesHiglight,
}: SliderItemProps): JSX.Element => {
  const { featureCodes, image } = useMemo(() => item, [item]);

  const onLikeClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      onClickAddToWish(item.uid);
    },
    [item.uid, onClickAddToWish]
  );

  const handleItemClick = useCallback(() => item?.onClick?.(item), [item]);

  const isPremium = useMemo(() => hasFeatureCode("higlight_bold", featureCodes), [featureCodes]);

  const isCrowShown = useMemo(
    () => showFeaturesHiglight && hasFeatureCode("vip", featureCodes),
    [featureCodes, showFeaturesHiglight]
  );

  const { resizeEvent } = useAppSelector((state) => state.rootReducer);

  const shadowedLike = useMemo(() => resizeEvent.width <= 768, [resizeEvent.width]);

  const priceSize = useMemo(() => (shadowedLike ? "small" : "medium"), [shadowedLike]);

  return (
    <>
      <div
        className={cn("link", {
          "feature-higlight-bold": showFeaturesHiglight && isPremium,
        })}
        onClick={handleItemClick}
      >
        <div className="header-image">
          {isPremium && <PremiumBadge className="premium-container" />}
          {image && <img src={image} className="slider-item_small__image" />}
        </div>
        <Block className="info">
          <div className="title-row">
            <div className="title">{item.name}</div>
            {isCrowShown && (
              <div className="feature-icon-crow">
                <IcCrown />
              </div>
            )}
          </div>
          <p className="description">{item.description || item.category}</p>
          <p className="category pure-visible-xs">{item.categoryName}</p>
          {!empty && (
            <Price
              className="slider-item_small__price"
              size={priceSize}
              price={item.price}
              discountedPrice={item.priceDiscount}
              currencyCode={item.currencyCode}
              period={item?.rentOptions?.period}
            />
          )}
        </Block>
      </div>
      {!empty && (
        <LikeButton
          className="add-wish"
          active={item.wish}
          bordered
          shadow={shadowedLike}
          onClick={onLikeClick}
        />
      )}
    </>
  );
};
