import React from "react";
import { useTranslation } from "react-i18next";
import { BlockTitle, Col, Icon, Preloader, Row } from "framework7-react";

import PlusIcon from "../../../components-ui/icons/ic-plus";
import { imageType } from "../models";

import "./imageUpload.less";

const ImageUpload = ({
  handleImageChange,
  currentImage,
  images,
  handleSetCurrentImage,
  isImageLoaded,
  handleImageDelete,
}) => {
  const { t } = useTranslation();

  return (
    <Row className="image-container">
      <BlockTitle large>{t("General information")}</BlockTitle>
      <Col className="image-block">
        <div className={isImageLoaded ? "show-preloader-block" : "hide-preloader-block"}>
          <Preloader color="white" />
          <Icon ios="f7:multiply" md="material:close" />
        </div>
        {!currentImage?.file && images?.length === 0 ? (
          <>
            <label htmlFor="pictures">
              <div className="image-info-block">
                <div className="icon-block">
                  <Icon className="pure-hidden-xs" icon="ic-web-loader" />
                  <Icon className="pure-visible-xs" icon="ic-image" />
                </div>
                <p className="image-title pure-hidden-xs">{t("Add Image of your Product")}</p>
                <p className="image-subtitle">
                  {t("1600x1200 or larger recommended, up to 10MB each")}
                </p>
              </div>
            </label>
            <input
              id="pictures"
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                handleImageChange(e);
              }}
            />
          </>
        ) : (
          <>
            <img src={URL.createObjectURL(currentImage?.file)} alt="" className="current-image" />

            <img
              src={URL.createObjectURL(currentImage?.file)}
              alt=""
              className="current-blured-image"
            />
            <div className="trash-icon-block" onClick={() => handleImageDelete(currentImage?.id)}>
              <Icon ios="f7:trash" md="material:delete" />
            </div>
          </>
        )}
      </Col>
      <Col className="uploaded-images">
        {images?.map((image?: imageType) => {
          return (
            <div className="uploaded-image" key={image.id}>
              <img
                src={URL.createObjectURL(image?.file)}
                alt=""
                onClick={() => handleSetCurrentImage(image?.id)}
              />
              <div
                className="uploaded-image-trash-icon-block"
                onClick={() => handleImageDelete(image?.id)}
              >
                <Icon ios="f7:trash" md="material:delete" />
              </div>
            </div>
          );
        })}
        {images?.length > 0 ? (
          <>
            <label htmlFor="sub-pictures">
              <div className="add-image" id="pictures">
                <PlusIcon />
              </div>
            </label>
            <input
              id="sub-pictures"
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                handleImageChange(e);
              }}
            />
          </>
        ) : (
          <></>
        )}
      </Col>
    </Row>
  );
};

export default ImageUpload;
