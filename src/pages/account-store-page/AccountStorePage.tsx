import React, { PureComponent } from "react";
import {
  Col,
  Icon,
  Link,
  Navbar,
  NavLeft,
  NavTitle,
  Page,
  Row,
  Block,
  Preloader,
} from "framework7-react";
import { compose } from "redux";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { IApplicationStore, ResizeEvent } from "../../store/rootReducer";
import { SellerAreaMenu } from "../../components/SellerAreaMenu";
import { getAccountStores } from "../../actions/accountStore";
import { IAccountStoresState } from "../../reducers/accountStoresReducer";
import { AccountStoreItem } from "./AccountStoreItem";
import connectShare, { IShareProps } from "../../store/connectShare";
import { getProfile } from "../../selectors/profile";
import { Profile } from "../../reducers/sessionReducer";
import { getProductDetailsLink } from "../../actions/shareActions";
import { analytics } from "../../Setup";
import { Store } from "../../types/marketplaceapi";
import "./index.less";

type Props = WithTranslation &
  IShareProps &
  IAccountStoresState & {
    resizeEvent?: ResizeEvent;
    getAccountStores(): void;
    profile?: Profile;
  };

type State = {};

class AccountStorePage extends PureComponent<Props, State> {
  pageInitHandle = () => {
    this.props.getAccountStores();
  };

  handleBackLink = () => {
    this.$f7router.navigate("/", {
      clearPreviousHistory: true,
      force: true,
    });
  };

  handleShareStore = (store) => {
    const { profile, share } = this.props;
    analytics.shareProduct(profile, store);
    share(store.name, getProductDetailsLink(store.uid));
  };

  handleStatusRedirect = () => {
    const { profile } = this.props;

    if (profile.type === "S") {
      this.$f7router.navigate("/profile/seller-area/my-goods/", {
        reloadAll: true,
      });
    }
  };

  render() {
    const {
      props: {
        t,
        accountStores,
        resizeEvent: { isLG, isMD, isXL },
        accountStoresLoading,
      },
      handleStatusRedirect,
    } = this;

    const isSmallScreen = !isLG && !isMD && !isXL;

    return (
      <Page
        id="account-store-page"
        name="account-store-page"
        onPageInit={this.pageInitHandle}
        onPageBeforeIn={handleStatusRedirect}
      >
        {isSmallScreen ? (
          <Navbar title={t("Store")} backLink={t("Back").toString()} noHairline noShadow />
        ) : (
          <Navbar noHairline noShadow>
            <NavLeft>
              <Link iconOnly onClick={this.handleBackLink}>
                <Icon className="icon-back" />
              </Link>
            </NavLeft>
            <NavTitle>{t("Store")}</NavTitle>
          </Navbar>
        )}

        <Row className="account-stores-page-content-row" resizableFixed>
          <Col
            width="0"
            large="25"
            xlarge="20"
            className="pure-hidden-xs pure-hidden-sm pure-hidden-md"
          >
            <SellerAreaMenu selected="SellerArea_Store" />
          </Col>
          <Col width="100" large="75" xlarge="80" className="account-stores">
            {accountStoresLoading ? (
              <Block className="text-align-center">
                <Preloader />
              </Block>
            ) : (
              accountStores.map((store: Store, index) => (
                <AccountStoreItem key={index} store={store} />
              ))
            )}
          </Col>
        </Row>
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  resizeEvent: state.rootReducer.resizeEvent,
  accountStores: state.accountStoresReducer.accountStores,
  accountStoresLoading: state.accountStoresReducer.accountStoresLoading,
  profile: getProfile(state),
});

const mapDispatchToProps = (dispatch: any) => ({
  getAccountStores: () => dispatch(getAccountStores()),
});

export default compose(
  connectShare,
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(AccountStorePage);
