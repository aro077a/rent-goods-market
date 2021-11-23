import React from "react";
import { BlockTitle, Block, Popup, PageContent } from "framework7-react";
import { useTranslation } from "react-i18next";

import { ThemedButton } from "@/components/ThemedButton";

type Props = Popup.Props & {};

export const PaymentFailedPage = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Popup id="payment_failed_page" {...props}>
      <PageContent className="display-flex justify-content-center align-items-center">
        <BlockTitle medium className="failed-text">
          {t("Payment failed")}
        </BlockTitle>
        <Block className="text-align-center">
          <p>{t("Check your billing information and try again")}</p>
        </Block>
        <ThemedButton fill large raised round popupClose>
          {t("Try again")}
        </ThemedButton>
      </PageContent>
    </Popup>
  );
};
