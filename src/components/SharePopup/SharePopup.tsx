import React, { useEffect, useState, useCallback, useMemo } from "react";
import { BlockTitle, Button, f7, Link, Navbar, NavRight, Popup } from "framework7-react";
import {
  EmailShareButton,
  FacebookShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  TelegramIcon,
  WhatsappIcon,
} from "react-share";
import { useTranslation } from "react-i18next";

import { ShareButton } from "@/components/ShareButton";

import { SharePopupProps } from "./SharePopup.types";

import "./SharePopup.less";

export const SharePopup: React.FC<SharePopupProps> = ({ uid, large = false, text = "" }) => {
  const { t } = useTranslation();

  const [url, setUrl] = useState<string>("");
  const [opened, setOpened] = useState<boolean>(false);
  const pageTitle = document.title;

  // ? why do you need it
  // const share = useAppSelector((state) => state.shareReducer);

  useEffect(() => {
    const url = window.location.toString();
    setUrl(url.substr(0, url.indexOf("#") + 1) + `/product-details/${uid}/`);
  }, [uid]);

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(url).then(() => {
      f7.dialog.preloader("Copied!");
      setTimeout(() => {
        f7.dialog.close();
      }, 1000);
    });
  }, [url]);

  const handleOpen = useCallback(() => setOpened(true), []);

  const handleClose = useCallback(() => setOpened(false), []);

  const shareTitle = useMemo(() => `QRent Art: ${pageTitle}`, [pageTitle]);

  return (
    <div>
      <ShareButton onClick={handleOpen} large={large} text={text} />

      <Popup
        id="share-container"
        swipeToClose
        swipeHandler=".swipe-handler"
        opened={opened}
        onPopupClosed={handleClose}
      >
        <Navbar>
          <BlockTitle medium className="title">
            {t("Share social network")}
          </BlockTitle>
          <NavRight>
            <Link popupClose>{t("Close")}</Link>
          </NavRight>
        </Navbar>

        <div className="share-buttons-container">
          <div className="social-network">
            <EmailShareButton url={url} title={shareTitle}>
              <EmailIcon size={60} round />
            </EmailShareButton>
          </div>
          <div className="social-network">
            <WhatsappShareButton url={url} title={shareTitle}>
              <WhatsappIcon size={60} round />
            </WhatsappShareButton>
          </div>
          <div className="social-network">
            <FacebookShareButton url={url} title={shareTitle}>
              <FacebookIcon size={60} round />
            </FacebookShareButton>
          </div>
          <div className="social-network">
            <TelegramShareButton url={url} title={shareTitle}>
              <TelegramIcon size={60} round />
            </TelegramShareButton>
          </div>
        </div>
        <div className="url-container">
          <div className="url">{url}</div>
          <Button className="copy-btn" onClick={onCopy}>
            {t("copy")}
          </Button>
        </div>
      </Popup>
    </div>
  );
};
