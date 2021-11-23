import React, { useMemo, useCallback } from "react";
import { Link, Icon } from "framework7-react";

import { createThumbnailVideoURLLink } from "@/utils";
import { SliderItemProps } from "@/components/Slider/SliderItem/SliderItem.types";
import { getBackgroundImageStyle } from "@/components/Slider/SliderItem/utils";

import "./ImagesItem.less";

export const ImagesItem = ({ videoPlayOnClick, item: { videoId, videoType } }: SliderItemProps) => {
  const linkStyle = useMemo(
    () => getBackgroundImageStyle(createThumbnailVideoURLLink(videoId, videoType)),
    [videoId, videoType]
  );

  const onClick = useCallback(
    () => videoPlayOnClick?.(videoId, videoType),
    [videoId, videoPlayOnClick, videoType]
  );

  return (
    <Link className="slider-item_images" onClick={onClick} style={linkStyle}>
      <Icon material="play_circle_filled" size="5rem" className="slider-item_images__icon" />
    </Link>
  );
};
