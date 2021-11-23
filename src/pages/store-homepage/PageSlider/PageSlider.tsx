import React, { useEffect, useState } from "react";
import { BlockTitle } from "framework7-react";

import { Slider, SliderType, SliderItem } from "@/components/Slider";

import { PageSliderProps } from "./PageSlider.types";

export const PageSlider = React.memo(({ title, category, getProducts }: PageSliderProps) => {
  const [products, setProducts] = useState<SliderItem[]>([]);

  useEffect(() => {
    if (category) {
      getProducts({ category })
        .then((res) =>
          setProducts(
            res.map((item) => ({
              ...item,
              image: item.imageUrl1,
              priceDiscount: item.discountedPrice,
              description: item.shortDescription,
            }))
          )
        )
        .catch((err) => console.error(err));
    }
  }, [category, getProducts]);

  return products?.length ? (
    <div className="add-store-slider-products">
      <BlockTitle medium>{"hui" || title}</BlockTitle>
      <Slider slides={products} type={SliderType.small} showIfEmpty showFeaturesHiglight />
    </div>
  ) : null;
});
PageSlider.displayName = "PageSlider";
