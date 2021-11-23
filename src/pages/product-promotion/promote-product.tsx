import React from "react";
import { Page, Navbar, Block, List, ListItem, Framework7Extensions } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { IApplicationStore } from "../../store/rootReducer";
import { connect } from "react-redux";
import { IProduct } from "../../reducers/productReducer";
import { Price } from "../../components/Price/index";
import { AnaliticDetails } from "@/components/ProductDetails";
import { ServicePackageList } from "../../components/ServicePackageList";
import connectServicePackages, { IServicePackagesProps } from "../../store/connectServicePackages";

import "./style.less";
import PaymentCardSelectPaymentMethodSheetPage from "../payment-card-select-payment-method";
import PaymentCardCreatePage from "../payment-card-create";
import { IOrdersState } from "../../reducers/ordersReducer";
import { createPromotionOrder } from "../../actions/ordersActions";
import connectF7, { WithFramework7Props } from "../../store/connectF7";
import CongratulationsPage from "./congratulations";
import PaymentFailedPage from "./payment-failed";
import connectWallet, { IWalletProps } from "../../store/connectWallet";
import { SavedCard } from "../../reducers/paymentCardsReducer";

type Props = WithTranslation &
  IServicePackagesProps &
  Partial<IWalletProps> & {
    uid: string;
    item?: IProduct;
    navigateToGetServicePackage?(uid: string): void;
    ordersReducer?: IOrdersState;
    createPromotionOrderWithCard?(
      featureUid: string,
      featureCurrencyCode: string,
      productUid: string,
      cardUid: string,
      cvc: string,
      savedCard?: SavedCard
    ): void;
    createPromotionOrderWithWallet?(
      featureUid: string,
      featureCurrencyCode: string,
      productUid: string,
      walletUid: string
    ): void;
  };

type State = {
  selectPaymentMethodOpened?: boolean;
  paymentCardCreateOpened?: boolean;
  selectedPromoCode?: string;
  selectedPromoCodeCurrency?: string;
  congratulationsOpened?: boolean;
  paymentFailedOpened?: boolean;
};

class PromoteProductPage extends React.Component<Props & WithFramework7Props, State> {
  constructor(
    props: Readonly<
      WithTranslation &
        IServicePackagesProps & {
          uid: string;
          item?: IProduct;
          navigateToGetServicePackage?(uid: string): void;
          ordersReducer?: IOrdersState;
          createPromotionOrder?(featureUid: string, productUid: string): void;
        } & WithFramework7Props
    >
  ) {
    super(props);
    this.state = {
      paymentCardCreateOpened: false,
      selectPaymentMethodOpened: false,
      congratulationsOpened: false,
      paymentFailedOpened: false,
    };
  }

  componentDidUpdate(prevProps: Props) {
    this.handlePromoOrder(prevProps);
  }

  handlePromoOrder(prevProps: Props) {
    const { orderCreating, orderCreatingError, order } = this.props.ordersReducer;

    if (orderCreating && !prevProps.ordersReducer.orderCreating) {
      this.$f7.preloader.show();
    } else if (!orderCreating && prevProps.ordersReducer.orderCreating) {
      this.$f7.preloader.hide();
    }

    if (orderCreatingError && orderCreatingError !== prevProps.ordersReducer.orderCreatingError) {
      console.log(orderCreatingError);
      this.setState((prev) => {
        return {
          paymentFailedOpened: !prev.paymentCardCreateOpened,
        };
      });
    }

    if (order && prevProps.ordersReducer.order !== order) {
      this.setState((prev) => {
        return {
          congratulationsOpened: !prev.congratulationsOpened,
        };
      });
    }
  }

  toggleSheet = (
    sheetOpenedState: keyof Pick<State, "selectPaymentMethodOpened" | "paymentCardCreateOpened">,
    show = true
  ) => this.setState({ [sheetOpenedState]: show });

  enterCVC = async (): Promise<string> => {
    return new Promise((resolve) => {
      const { t } = this.props;

      const dialog = this.$f7.dialog.prompt(
        t("Please, enter CVC/CVV"),
        (val: string) => {
          resolve(val);
        },
        () => resolve()
      );

      const el = dialog.$el
        .find("input")
        .attr("type", "number")
        .attr("minlength", "3")
        .attr("maxlength", "4")[0] as any;

      /* TODO */
      el.addEventListener("keypress", function (ev: { preventDefault: () => void }) {
        if (this.value.length === this.maxLength) {
          ev.preventDefault();
          return false;
        }
        return true;
      });
      el.select();
    });
  };

  renderPopups() {
    const { congratulationsOpened, paymentFailedOpened } = this.state;
    return (
      <>
        <CongratulationsPage
          opened={congratulationsOpened}
          onPopupClosed={() => this.setState({ congratulationsOpened: false })}
        />
        <PaymentFailedPage
          opened={paymentFailedOpened}
          onPopupClosed={() => this.setState({ paymentFailedOpened: false })}
        />
      </>
    );
  }

  render() {
    const {
      item,
      t,
      loadServicePackages,
      servicePackages,
      createPromotionOrderWithCard,
      createPromotionOrderWithWallet,
      wallets,
    } = this.props;
    const {
      selectPaymentMethodOpened,
      paymentCardCreateOpened,
      selectedPromoCode,
      selectedPromoCodeCurrency,
    } = this.state;
    const { toggleSheet } = this;
    return (
      <Page
        name="promote-product"
        onPageAfterIn={() => {
          loadServicePackages();
        }}
      >
        <Navbar
          backLink={t("Back").toString()}
          title={t("Promote the product")}
          noHairline
          noShadow
        />
        {item && (
          <List className="promote-product-details" mediaList noChevron noHairlines>
            <ListItem title={item.name} noChevron>
              <div
                slot="media"
                className="image"
                style={{ backgroundImage: `url(${item.imageThumbnailUrl1})` }}
              />
              <div slot="inner-end">
                <Price className="simple" price={item.price} currencyCode={item.currencyCode} />
              </div>
              <div slot="inner-end">
                <div className="product-stats">
                  <AnaliticDetails type="view" count={item.viewCount} />
                  <AnaliticDetails type="wish" count={item.wishCount} />
                </div>
              </div>
            </ListItem>
          </List>
        )}
        <Block>
          <ServicePackageList
            items={servicePackages}
            onClick={(code, currencyCode) => {
              this.setState({
                selectedPromoCode: code,
                selectedPromoCodeCurrency: currencyCode,
              });
              toggleSheet("selectPaymentMethodOpened");
            }}
          />
        </Block>

        {this.renderPopups()}

        <PaymentCardSelectPaymentMethodSheetPage
          opened={selectPaymentMethodOpened}
          onSelectAddCard={() => {
            toggleSheet("selectPaymentMethodOpened", false);
            setTimeout(() => toggleSheet("paymentCardCreateOpened"), 380);
          }}
          onSheetClosed={() => toggleSheet("selectPaymentMethodOpened", false)}
          onSelectPaymentCard={async (cardUid) => {
            toggleSheet("selectPaymentMethodOpened", false);
            const cvc = await this.enterCVC();
            if (cvc) {
              createPromotionOrderWithCard(
                selectedPromoCode,
                selectedPromoCodeCurrency,
                item.uid,
                cardUid,
                cvc
              );
            }
          }}
          onSelectWallet={async (uid) => {
            const wallet = wallets.filter((item) => item.uid === uid)[0];
            const servicePackage = servicePackages.filter(
              (item) => item.code === selectedPromoCode
            )[0];

            toggleSheet("selectPaymentMethodOpened", false);

            if (servicePackage.price > wallet.balance) {
              this.$f7.dialog.alert(t("Refill your balance!"));
              return;
            }

            createPromotionOrderWithWallet(
              selectedPromoCode,
              selectedPromoCodeCurrency,
              item.uid,
              wallet.uid
            );
          }}
        />

        <PaymentCardCreatePage
          opened={paymentCardCreateOpened}
          onPopupClosed={() => {
            toggleSheet("paymentCardCreateOpened", false);
          }}
          onSaveCard={(card) => {
            this.setState({ paymentCardCreateOpened: false }, () => {
              createPromotionOrderWithCard(
                selectedPromoCode,
                selectedPromoCodeCurrency,
                item.uid,
                null,
                null,
                card
              );
            });
          }}
        />
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore, ownProps: Props) => ({
  item:
    state.productCreateReducer.product && state.productCreateReducer.product.uid === ownProps.uid
      ? state.productCreateReducer.product
      : null,
  ordersReducer: state.ordersReducer,
});

const mapDispatchToProps = (dispatch: any, props: Props & Framework7Extensions) => {
  return {
    navigateToGetServicePackage: (uid: string) => {
      props.$f7router.navigate(`${uid}/`);
    },
    createPromotionOrderWithCard: (
      featureUid: string,
      featureCurrencyCode: string,
      productUid: string,
      cardUid: string,
      cvc: string,
      savedCard: SavedCard
    ) =>
      dispatch(
        createPromotionOrder(
          featureUid,
          featureCurrencyCode,
          productUid,
          {
            source: "card",
            cardUid,
            cvc,
          },
          savedCard
        )
      ),
    createPromotionOrderWithWallet: (
      featureUid: string,
      featureCurrencyCode: string,
      productUid: string,
      walletUid: string
    ) =>
      dispatch(
        createPromotionOrder(featureUid, featureCurrencyCode, productUid, {
          source: "wallet",
          walletUid,
        })
      ),
  };
};

export default compose(
  withTranslation(),
  connectServicePackages,
  connectF7,
  connectWallet,
  connect(mapStateToProps, mapDispatchToProps)
)(PromoteProductPage);
