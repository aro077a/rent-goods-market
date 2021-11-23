import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Icon, Link, Swiper, SwiperSlide } from "framework7-react";

import { IProductCreateUploadedFileInfo } from "@/reducers/productCreateReducer";
import { getBackgroundStyle, noop } from "@/utils";

import { SliderImageUploaderProps } from "./SliderImageUploader.types";

import "./SliderImageUploader.less";

export const SliderImageUploader = ({
  onSelectFile,
  images,
  onDeleteFile,
}: SliderImageUploaderProps): JSX.Element => {
  const { t } = useTranslation();

  const processing = useCallback(
    (item: IProductCreateUploadedFileInfo) => item.attaching || item.detaching,
    []
  );

  const onInputChange = useCallback(
    (item: IProductCreateUploadedFileInfo, index: number) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (processing(item)) {
          return;
        }

        const file = e.target.files?.[0];

        if (file) {
          onSelectFile(index, file);
        }
      },
    [onSelectFile, processing]
  );

  return (
    <Swiper
      className="slider-image-uploader"
      init
      params={{
        spaceBetween: 8,
        slidesPerView: 3,
      }}
    >
      {images.map((item, index) => (
        <SwiperSlide key={index} style={processing(item) ? {} : getBackgroundStyle(item.imageLink)}>
          <Link className="content" href="#" onClick={noop}>
            <input
              type="file"
              accept="image/*"
              className="slider-image-uploader__hidden-input"
              onChange={onInputChange(item, index)}
            />
            {processing(item) ? (
              <div>
                {t("Compressing... ")}
                {t("withTranslation...")}
              </div>
            ) : (
              !item.imageLink && (
                <>
                  <Icon className="pure-hidden-xs" icon="ic-web-loader" />
                  <Icon className="pure-visible-xs" icon="ic-image" />
                  <div className="subtitle pure-hidden-xs">{t("Add Image of your Product")}</div>
                  <div className="title pure-hidden-xs">
                    {t("1600x1200 or larger recommended, up to 10MB each")}
                  </div>
                </>
              )
            )}
          </Link>

          {item.imageLink && (
            <Link href="#" className="input-clear-button" onClick={() => onDeleteFile(index)} />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
