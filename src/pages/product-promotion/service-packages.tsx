import React from "react";
import {
  Page,
  Navbar,
  BlockTitle,
  Block,
  Framework7Extensions,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { ServicePackageList } from "../../components/ServicePackageList";
import connectServicePackages, {
  IServicePackagesProps,
} from "../../store/connectServicePackages";
import { connect } from "react-redux";

type Props = IServicePackagesProps &
  WithTranslation & {
    navigateToGetServicePackage?(uid: string): void;
  };

const ServicePackagesPage = ({
  servicePackages,
  loadServicePackages,
  navigateToGetServicePackage,
  t,
}: Props) => (
  <Page
    name="service-packages"
    onPageInit={() => {
      if (!servicePackages.length) {
        loadServicePackages();
      }
    }}
  >
    <Navbar backLink={t("Back").toString()} noHairline noShadow />
    <BlockTitle medium>{t("Service packages")}</BlockTitle>
    <Block>Get services to increase the number of views of your product</Block>
    <Block>
      <ServicePackageList
        items={servicePackages}
        onClick={navigateToGetServicePackage}
      />
    </Block>
  </Page>
);

const mapDispatchToProps = (
  _dispatch: any,
  props: Props & Framework7Extensions
) => {
  return {
    navigateToGetServicePackage: (code: string) => {
      props.$f7router.navigate(`${encodeURI(code)}/`);
    },
  };
};

export default compose(
  withTranslation(),
  connectServicePackages,
  connect(null, mapDispatchToProps)
)(ServicePackagesPage);
