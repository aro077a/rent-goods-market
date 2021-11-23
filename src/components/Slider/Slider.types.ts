import { SliderItem } from "./SliderItem/SliderItem.types";

export enum SliderType {
  "top" = "top",
  "big" = "big",
  "small" = "small",
  "images" = "images",
}

export type SliderProps = {
  slides: SliderItem[];
  type: SliderType;
  className?: string;
  showIfEmpty?: boolean;
  startChat?(uid: string): void;
  onClick?(item: SliderItem): void;
  showFeaturesHiglight?: boolean;
  videoPlayOnClick?(videoId: string, videoType: string): void;
  sliderZoom?: boolean;
  changeActiveIndex?(index: number): void;
};
