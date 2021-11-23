import React from "react";
import { Page, Navbar, BlockTitle } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import connectServicePackages, {
  IServicePackagesProps,
} from "../../store/connectServicePackages";
import { IApplicationStore } from "../../store/rootReducer";
import { connect } from "react-redux";
import { ProductFeatureType } from "../../types/marketplaceapi";
import { Catalog } from "../../components/Catalog/index";
import ServicePackageDescription from "../../components/ServicePackageList/ServicePackageDescription";

type Props = WithTranslation &
  IServicePackagesProps & {
    id?: string;
    item: ProductFeatureType;
  };

const GetServicePackagePage = ({
  item,
  item: { code, name, description, price, duration, typeCode },
  loadServicePackages,
  loadPublishedProducts,
  publishedProducts,
  t,
}: Props) => (
  <Page
    name="get-service-package"
    onPageInit={async (_page) => {
      if (!item) {
        await loadServicePackages();
      }
      loadPublishedProducts();
    }}
  >
    <Navbar
      title={t("Get service package")}
      backLink={t("Back").toString()}
      noHairline
      noShadow
    />
    {item ? (
      <>
        <ServicePackageDescription
          code={code}
          typeCode={typeCode}
          title={name}
          description={description}
          price={price}
          duration={duration}
          full
        />
        <BlockTitle>{t("Select a product")}</BlockTitle>
        <Catalog
          items={publishedProducts}
          onClick={() => {}}
          simplePrice
          showAnalytics
        />
      </>
    ) : null}
  </Page>
);

const mapStateToProps = (_state: IApplicationStore, ownProps: Props) => {
  const { servicePackages, id } = ownProps;
  const item = servicePackages.filter((item) => item.code === id)[0];
  return {
    item,
  };
};

export default compose(
  withTranslation(),
  connectServicePackages,
  connect(mapStateToProps, null)
)(GetServicePackagePage);
