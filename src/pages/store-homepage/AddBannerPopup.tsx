import React, { useEffect } from "react";
import { Block, BlockTitle, Button, List, Popup } from "framework7-react";
import { useTranslation } from "react-i18next";

import { IcImageAdd } from "@/components-ui/icons";
import { CustomInput } from "@/components/CustomInput/CustomInput";

const AddBannerPopup = ({
  title,
  link,
  banner,
  isOpenBannerPopup,
  handleCloseBannerPopup,
  handleChangeLink,
  handleChangeTitle,
  handleChangeFile,
  bannerMobImage,
  bannerDeskImage,
  handleActionBanner,
  handleChangeBanner,
}) => {
  const { t } = useTranslation();
  useEffect(() => handleChangeBanner(banner), [banner, handleChangeBanner]);

  return (
    <Popup
      backdrop
      slot="fixed"
      id="add-banner-popup"
      className="add-store-popup add-banner-popup"
      opened={isOpenBannerPopup}
      onPopupClosed={handleCloseBannerPopup}
      tabletFullscreen
    >
      <section className="add-store-popup-container">
        <BlockTitle medium>
          <Button className="close" onClick={handleCloseBannerPopup} iconMaterial="clear" />
          {t("Add Banner")}
        </BlockTitle>
        <Block className="add-banner-popup-desktop banner-content">
          <BlockTitle>{t("Desktop image")}</BlockTitle>
          <Block className="add-banner-popup-desktop-label banner-content-label">
            {!bannerDeskImage && !banner?.desktopImageUrl ? (
              <>
                <IcImageAdd fill="var(--base-80)" />
                <p>{t("Add Desktop Image of Your Banner")}</p>
                <span>{t("(2592x848 or larger recommended, up to 10MB each)")}</span>
                <input type="file" onChange={(e) => handleChangeFile(e, "bannerDeskImage")} />
              </>
            ) : (
              <img src={bannerDeskImage} />
            )}
          </Block>
        </Block>
        <Block className="add-banner-popup-mobile banner-content">
          <BlockTitle>{t("Mobile image")}</BlockTitle>
          <Block className="add-banner-popup-mobile-label banner-content-label">
            {!bannerMobImage && !banner?.mobileImageUrl ? (
              <>
                <IcImageAdd fill="var(--base-80)" />
                <p>{t("Add Mobile Image of Your Banner")}</p>
                <span>{t("(656х320 or larger recommended, up to 10MB)")}</span>
                <input type="file" onChange={(e) => handleChangeFile(e, "bannerMobImage")} />
              </>
            ) : (
              <img src={bannerMobImage} />
            )}
          </Block>
        </Block>
        <List className="add-banner-popup-form">
          <div className="add-banner-popup-form-field">
            <BlockTitle>{t("Banner Title")}</BlockTitle>
            <CustomInput
              slot="list"
              value={title}
              label={t("Title").toString()}
              onChange={(e): void => handleChangeTitle(e.target.value)}
              required
              validate
            />
          </div>
          <div className="add-banner-popup-form-field">
            <BlockTitle>{t("Link to")}</BlockTitle>
            <CustomInput
              slot="list"
              value={link}
              label={t("Link to").toString()}
              onChange={(e): void => handleChangeLink(e.target.value)}
              required
              validate
            />
          </div>
        </List>
        <Block className="add-store-popup-container-done">
          <Button
            fill
            round
            raised
            onClick={() => handleActionBanner("add")}
            disabled={!bannerDeskImage || !bannerMobImage || !title || !link}
          >
            {t(banner ? "Edit" : "Add")}
          </Button>
        </Block>
      </section>
    </Popup>
  );
};

export default AddBannerPopup;
