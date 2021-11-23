import React from "react";
import { BlockTitle, Block, Popup, PageContent } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";

import { ThemedButton } from "@/components/ThemedButton";

type Props = Popup.Props;

const PaymentFailedPage = ({ t, ...rest }: Props & WithTranslation) => (
  <Popup id="payment_failed_page" {...rest}>
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

export default compose<React.FC<Props>>(withTranslation())(PaymentFailedPage);
