import React, { useMemo, useCallback } from "react";
import { ListItem, F7SwipeoutActions, F7SwipeoutButton } from "framework7-react";
import cn from "classnames";

import { useAppSelector } from "@/hooks/store";
import { Price } from "@/components/Price";
import { LikeButton } from "@/components/LikeButton";
import { getSubcategoryNameBySubcategoryId } from "@/utils";
import { ProductStatusBadge } from "@/components/Badges";
import { AnaliticDetails } from "@/components/ProductDetails";
import { IcCrown } from "@/components-ui/icons";
import { PremiumBadge } from "@/components/Badges";

import { CatalogItemProps } from "./CatalogItem.types";
import { hasFeatureCode } from "./utils";

import "./CatalogItem.less";

export const CatalogItem = ({
  categories,
  item,
  item: {
    uid,
    name,
    shortDescription,
    category,
    price,
    currencyCode,
    discountedPrice,
    wish,
    imageThumbnailUrl1,
    status,
    featureCodes,
    sale,
    rentOptions,
  },
  addToWish,
  onClick,
  swipeoutActions,
  simplePrice,
  showStatus,
  showAnalytics,
  showFeaturesHiglight,
  ...props
}: CatalogItemProps): JSX.Element => {
  const link = useMemo(() => (onClick ? "#" : `/product-details/${uid}/`), [onClick, uid]);

  const subcategory = useMemo(
    () => (showStatus ? "" : getSubcategoryNameBySubcategoryId(category, categories)),
    [categories, category, showStatus]
  );

  const isCrownIconShown = useMemo(
    () => showFeaturesHiglight && hasFeatureCode("vip", featureCodes),
    [featureCodes, showFeaturesHiglight]
  );

  const onItemClick = useCallback(() => onClick?.(uid), [onClick, uid]);

  const onLikeButtonClick = useCallback(() => addToWish(uid), [addToWish, uid]);

  const { resizeEvent } = useAppSelector((state) => state.rootReducer);

  const shadowedLike = useMemo(() => resizeEvent.width <= 768, [resizeEvent.width]);

  return (
    <ListItem
      link={link}
      subtitle={subcategory}
      text={shortDescription}
      noChevron
      onClick={onItemClick}
      swipeout={swipeoutActions && swipeoutActions.length > 0}
      className={cn("catalog-item", {
        "feature-higlight-bold":
          showFeaturesHiglight && hasFeatureCode("higlight_bold", featureCodes),
      })}
      {...props}
    >
      <div slot="inner-start" className="item-title-row">
        <div className="item-title">
          <div className="catalog-item-title">{name}</div>
        </div>
        {isCrownIconShown && (
          <div className="feature-icon-crow">
            <IcCrown />
          </div>
        )}
      </div>
      <div className="inner-end" slot="inner-end">
        <Price
          size="small"
          price={price}
          discountedPrice={simplePrice ? undefined : discountedPrice}
          currencyCode={currencyCode}
          period={rentOptions?.period}
          withSaleIcon={!!sale}
        />
      </div>
      <div slot="media" className="image">
        {imageThumbnailUrl1 && <img src={imageThumbnailUrl1} />}
        {item.promotion && <PremiumBadge className="premium-container" />}
      </div>
      {typeof addToWish === "function" && (
        <div slot="root-start" className="item-content a-pos">
          <div className="item-media">
            <div className="image">
              <LikeButton
                active={wish}
                bordered
                shadow={shadowedLike}
                onClick={onLikeButtonClick}
              />
            </div>
          </div>
        </div>
      )}
      {showStatus && (
        <div slot="subtitle">
          <ProductStatusBadge status={status} statusText={item.statusValue} />
        </div>
      )}
      {showAnalytics && (
        <div slot="inner-end">
          <div className="product-stats">
            <AnaliticDetails type="view" count={item.viewCount} />
            <AnaliticDetails type="wish" count={item.wishCount} />
          </div>
        </div>
      )}
      {!!swipeoutActions?.length &&
        swipeoutActions.map((_item, i) => (
          <F7SwipeoutActions key={i.toString()} {..._item}>
            {_item.buttons.map((__item, i) => (
              <F7SwipeoutButton
                key={i.toString()}
                {...{ ...__item, onClick: () => __item.onClick(item) }}
              />
            ))}
          </F7SwipeoutActions>
        ))}
    </ListItem>
  );
};
