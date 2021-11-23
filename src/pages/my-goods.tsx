import React, { Component } from "react";
import {
  Block,
  BlockTitle,
  Col,
  Fab,
  Icon,
  Link,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  Page,
  Preloader,
  Row,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import cn from "classnames";

import { loadMyGoodsList } from "@/actions/myGoodsActions";
import { deleteProduct } from "@/actions/productCreateActions";
import { CatalogList } from "@/components/CatalogList";
import { SellerAreaMenu } from "@/components/SellerAreaMenu";
import { ThemedButton } from "@/components/ThemedButton";
import { IProduct } from "@/reducers/productReducer";
import connectProductStatus, { IProductStatusProps } from "@/store/connectProductStatus";
import { IApplicationStore, ResizeEvent } from "@/store/rootReducer";
import { createUUID } from "@/utils";

import "./my-goods.less";

type Props = IProductStatusProps &
  WithTranslation & {
    loading?: boolean;
    error?: string;
    products?: IProduct[];
    hasProducts?: boolean;
    loadMyGoodsList?(): void;
    deleteProduct?(uid: string): void;
    resizeEvent?: ResizeEvent;
  };

type State = {
  chooseItemStatusActions?: boolean;
  item?: IProduct;
};

class MyGoodsPage extends Component<Props, State> {
  private _id: string;

  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      chooseItemStatusActions: false,
    };
  }

  pageInitHandle = () => {
    console.log("my-goods -> pageInitHandle");

    // always update list on page loading
    if (!this.props.products.length) {
      this.props.loadMyGoodsList();
    }
  };

  componentDidMount() {
    this._id = createUUID();
  }

  componentDidUpdate(prevProps: Props) {
    console.log("my-goods -> componentDidUpdate");

    const { loading, error, hasProducts } = this.props;
    if (error && error !== prevProps.error) {
      this.$f7.dialog.alert(error);
    }

    if (!loading && prevProps.loading && this.doneCallback) {
      this.doneCallback();
      this.doneCallback = null;
    }

    if (hasProducts && !prevProps.hasProducts) {
      const ptr = this.$f7.ptr.create("#my_goods" + this._id + " .ptr-content");
      ptr.on("refresh", (_el, done) => this.refreshHandle(done));
    }

    this.handleChangeProductStatus(prevProps);
  }

  componentWillUnmount() {
    console.log("my-goods -> componentWillUnmount");

    this.$f7.ptr.destroy("#my_goods" + this._id + " .ptr-content");
  }

  handleChangeProductStatus = (prevProps: Props) => {
    console.log("my-goods -> handleChangeProductStatus");

    const {
      productStatusReducer: { loading, error, item, action },
      t,
    } = this.props;
    if (error && error !== prevProps.productStatusReducer.error) {
      this.$f7.dialog.alert(t(error));
    }

    if (loading) this.$f7.preloader.show();
    else this.$f7.preloader.hide();

    if (item && item !== prevProps.productStatusReducer.item && !loading && !error) {
      let message = "";
      switch (action) {
        case "changeQuantity":
          message = t(`Quantity changed to`, { quantity: item.quantity });
          break;
        case "changeStatus":
          message = t(`Status changed`);
          break;
      }
      this.$f7.dialog.alert(message);
    }
  };

  doneCallback: () => void;

  refreshHandle = (done: () => void) => {
    this.doneCallback = done;
    this.props.loadMyGoodsList();
  };

  selectProductHandle = (uid: string) => {
    this.$f7router.navigate(`product-details/${uid}/`);
  };

  handleBackLink = () => {
    this.$f7router.navigate("/", {
      clearPreviousHistory: true,
      force: true,
    });
  };

  renderProductsList = () => {
    const { loading, products, hasProducts, t } = this.props;

    if (loading && !this.doneCallback)
      return (
        <Block className="text-align-center">
          <Preloader />
        </Block>
      );

    if (!hasProducts) {
      return (
        <Block className="text-align-center">
          <BlockTitle medium>{t("No Products for sale")}</BlockTitle>
          <p>{t("NewProductMessage")}</p>
          <Block className="button-container">
            <ThemedButton style={{ minWidth: 136 }} href="add/1/" fill large round raised>
              {t("Add Product")}
            </ThemedButton>
          </Block>
        </Block>
      );
    }

    return <CatalogList data={products} onClick={this.selectProductHandle} />;
  };

  render() {
    console.log("my-goods -> render");

    const {
      loading,
      hasProducts,
      t,
      resizeEvent: { isLG, isMD, isXL },
    } = this.props;
    const isSmallScreen = !isLG && !isMD && !isXL;

    return (
      <Page
        id={"my_goods" + this._id}
        name="my-goods"
        onPageInit={this.pageInitHandle}
        ptr={hasProducts}
        onPtrRefresh={this.refreshHandle}
        className={cn(!hasProducts && "empty")}
      >
        {isSmallScreen ? (
          <Navbar title={t("My products")} backLink={t("Back").toString()} noHairline noShadow />
        ) : (
          <Navbar noHairline noShadow>
            <NavLeft>
              <Link iconOnly onClick={this.handleBackLink}>
                <Icon className="icon-back" />
              </Link>
            </NavLeft>
            <NavTitle>{t("My products")}</NavTitle>
            <NavRight>
              <ThemedButton className="import-button" fill round href="./import-products/">
                {t("Import")}
              </ThemedButton>
            </NavRight>
          </Navbar>
        )}

        <Row resizableFixed>
          <Col
            width="0"
            large="25"
            xlarge="20"
            className="pure-hidden-xs pure-hidden-sm pure-hidden-md"
          >
            {!loading && <SellerAreaMenu selected="SellerArea_Products" />}
          </Col>
          <Col width="100" large="75" xlarge="80">
            {this.renderProductsList()}
          </Col>
        </Row>

        {!loading && hasProducts && (
          <Fab href="add/" position="right-bottom" slot="fixed">
            <Icon ios="f7:plus" md="material:add" />
          </Fab>
        )}
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  ...state.myGoodsReducer,
  hasProducts: state.myGoodsReducer.products !== null && state.myGoodsReducer.products.length > 0,
  resizeEvent: state.rootReducer.resizeEvent,
});

const mapDispatchToProps = (dispatch) => ({
  loadMyGoodsList: () => dispatch(loadMyGoodsList()),
  deleteProduct: (uid: string) => dispatch(deleteProduct(uid)),
});

export default compose(
  withTranslation(),
  connectProductStatus,
  connect(mapStateToProps, mapDispatchToProps)
)(MyGoodsPage);
