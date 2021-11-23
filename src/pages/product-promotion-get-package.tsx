import React from "react";
import { Page, Navbar, BlockTitle, Block } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";

type Props = WithTranslation & {};

const MyGoodsPage = ({ t }: Props) => (
  <Page name="product-promotion">
    <Navbar backLink={t("Back").toString()} noHairline noShadow />
    <BlockTitle medium>{t("Service packages")}</BlockTitle>
    <Block>Get services to increase the number of views of your product</Block>
  </Page>
);

export default compose(withTranslation())(MyGoodsPage);
