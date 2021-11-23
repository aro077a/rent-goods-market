import React from "react";
import { Block, BlockTitle, Link, PageContent } from "framework7-react";
import { useTranslation } from "react-i18next";

import { StoreInfoSheetProps } from "./StoreInfoSheet.types";

export const StoreInfoSheet = ({ type, onClose }: StoreInfoSheetProps) => {
  const { t } = useTranslation();

  return (
    <PageContent className="start-chat-content">
      <BlockTitle medium>
        <Link className="close" onClick={onClose} iconMaterial="clear" />
        {type === "store" ? t("Chat with Store") : t("Start Сhat with Seller")}
      </BlockTitle>
      <Block>
        <p>{t("You are going to open chat with Seller with the following message")}</p>
      </Block>
    </PageContent>
  );
};
