import React from "react";
import { BlockTitle, Block, Popup, PageContent } from "framework7-react";
import { useTranslation } from "react-i18next";

import { ThemedButton } from "@/components/ThemedButton";

type Props = Popup.Props;

export const CongratulationsPage = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Popup id="congratulations_page" {...props}>
      <PageContent className="display-flex justify-content-center align-items-center">
        <BlockTitle medium className="success-text">
          {t("Your order is completed")}
        </BlockTitle>
        <Block className="text-align-center">
          <p>{t("Information about the order will be available in the section My оrders")}</p>
        </Block>
        <ThemedButton fill large raised round popupClose>
          {t("Continue")}
        </ThemedButton>
      </PageContent>
    </Popup>
  );
};
