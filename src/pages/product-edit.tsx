import React from "react";
import { Page, Navbar } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";

type Props = WithTranslation & {};

const MyGoodsPage = ({ t }: Props) => (
  <Page name="product-edit">
    <Navbar title={t("Edit product")} backLink={t("Back").toString()}></Navbar>
  </Page>
);

export default compose(withTranslation())(MyGoodsPage);
