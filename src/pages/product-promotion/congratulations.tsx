import React from "react";
import { BlockTitle, Block, Popup, PageContent } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";

import { ThemedButton } from "@/components/ThemedButton";

type Props = Popup.Props;

const CongratulationsPage = ({ t, ...rest }: Props & WithTranslation) => (
  <Popup id="congratulations_page" {...rest}>
    <PageContent className="display-flex justify-content-center align-items-center">
      <BlockTitle medium className="success-text">
        {t("Congratulations")}
      </BlockTitle>
      <Block className="text-align-center">
        <p>{t("You have succesfully buy the Premium Package")}</p>
      </Block>
      <ThemedButton fill large raised round popupClose>
        {t("Continue")}
      </ThemedButton>
    </PageContent>
  </Popup>
);

export default compose<React.FC<Props>>(withTranslation())(CongratulationsPage);
