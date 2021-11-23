import { SwiperOptions } from "swiper";

import { SliderType } from "./Slider.types";

export const getParams = (type?: SliderType) => {
  const params: SwiperOptions = {
    spaceBetween: 8,
  };

  switch (type) {
    case SliderType.small:
      params.centeredSlides = false;
      params.breakpoints = {
        320: {
          slidesPerView: 2.5,
          spaceBetween: 8,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 16,
        },
      };
      break;
    case SliderType.big:
      params.breakpoints = {
        320: {
          slidesPerView: 1.1,
          spaceBetween: 16,
        },
        768: {
          centeredSlides: false,
          slidesPerView: 4,
          spaceBetween: 16,
        },
      };
      break;
    case SliderType.top:
      params.breakpoints = {
        320: {
          slidesPerView: 1.08,
          spaceBetween: 16,
        },
        768: {
          slidesPerView: 1,
        },
      };
      break;
    default:
      break;
  }

  return params;
};
