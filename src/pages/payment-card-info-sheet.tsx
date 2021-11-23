import React, { Component } from "react";
import {
  PageContent,
  BlockTitle,
  List,
  ListItem,
  Icon,
  Sheet,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { connect } from "react-redux";
import { IApplicationStore } from "../store/rootReducer";

import "./payment-card-info-sheet.less";
import { Card } from "../types/commonapi";
import {
  deletePaymentCard,
  selectForPayment,
} from "../actions/paymentCardsActions";
import connectF7, { WithFramework7Props } from "../store/connectF7";

type Props = WithTranslation & {
  cardUid: string;
  card: Card;
  deleteCardLoading?: boolean;
  deleteCardError?: any;
  deletePaymentCard(uid: string): void;
  selectForPaymentLoading?: boolean;
  selectForPaymentError?: any;
  selectForPayment(uid: string): void;
  onSelectEditCard?(uid: string): void;
  onSelectEnterVerifyCode?(uid: string): void;
};

class PaymentCardInfoSheetPage extends Component<Props & Sheet.Props> {
  componentDidUpdate(prevProps: Props) {
    this.handleDeleteCard(prevProps);
    this.handleSelectForPayment(prevProps);
  }

  handleDeleteCard = (prevProps: Props) => {
    const { deleteCardLoading, deleteCardError } = this.props;
    if (deleteCardLoading && !prevProps.deleteCardLoading) {
      this.$f7.preloader.show();
    } else if (
      deleteCardError &&
      deleteCardError !== prevProps.deleteCardError
    ) {
      this.$f7.preloader.hide();
      this.$f7.dialog.alert(deleteCardError);
    } else if (!deleteCardLoading && prevProps.deleteCardLoading) {
      this.$f7.preloader.hide();
      this.$f7.sheet.close();
    }
  };

  handleSelectForPayment = (prevProps: Props) => {
    const { selectForPaymentLoading, selectForPaymentError } = this.props;
    if (selectForPaymentLoading && !prevProps.selectForPaymentLoading) {
      this.$f7.preloader.show();
    } else if (
      selectForPaymentError &&
      selectForPaymentError !== prevProps.selectForPaymentError
    ) {
      this.$f7.preloader.hide();
      this.$f7.dialog.alert(selectForPaymentError);
    } else if (!selectForPaymentLoading && prevProps.selectForPaymentLoading) {
      this.$f7.preloader.hide();
      this.$f7.dialog.alert("Success!", () => this.$f7.sheet.close());
    }
  };

  /*
  shouldComponentUpdate(nextProps: Props) {
    if (!nextProps.card) {
      this.$f7.preloader.hide();
      this.$f7router.back();
      return false;
    }
    return true;
  }
  */

  _func: any = null;

  enterVerificationCodeHandle = () => {
    const {
      card: { uid },
    } = this.props;
    this.props.onSelectEnterVerifyCode(uid);
  };

  removeHandle = () => {
    const { card } = this.props;
    this.props.deletePaymentCard(card.uid);
    /*
    this.$f7.dialog.confirm(t("Really?"), () => {
      this.props.deletePaymentCard(card.uid);
    });
    */
  };

  selectForPaymentHandle = () => {
    const { card } = this.props;
    this.props.selectForPayment(card.uid);
  };

  handleEditCard = () => {
    const {
      card: { uid },
    } = this.props;
    this.props.onSelectEditCard(uid);
  };

  renderActions = () => {
    if (!this.props.card) return null;

    const {
      card: { status, primary },
      t,
    } = this.props;

    const selectedForPayment =
      status === "V" && !primary ? (
        <ListItem
          link="#"
          title={t("Selected for payment").toString()}
          noChevron
          onClick={this.selectForPaymentHandle}
        >
          <Icon slot="media" ios="f7:checkmark_alt" md="material:done" />
        </ListItem>
      ) : null;

    const enterVerificationCode =
      status === "N" ? (
        <ListItem
          link
          title={t("Enter verification code").toString()}
          onClick={this.enterVerificationCodeHandle}
        >
          <div slot="media"></div>
        </ListItem>
      ) : null;

    return (
      <List>
        {selectedForPayment}
        {enterVerificationCode}
        <ListItem
          link
          title={t("Edit card").toString()}
          onClick={this.handleEditCard}
        >
          <Icon slot="media" ios="f7:square_pencil" md="material:edit" />
        </ListItem>
        ,
        <ListItem
          link
          title={t("Remove card").toString()}
          noChevron
          onClick={this.removeHandle}
        >
          <Icon slot="media" ios="f7:trash" md="material:delete" />
        </ListItem>
      </List>
    );
  };

  render() {
    const { card, t, ...rest } = this.props;
    return (
      <Sheet id="payment_card_info_sheet" swipeToClose backdrop {...rest}>
        <PageContent>
          {card && <BlockTitle medium>{card.maskedNumber}</BlockTitle>}
          {this.renderActions()}
        </PageContent>
      </Sheet>
    );
  }
}

const mapStateToProps = (
  state: IApplicationStore,
  props: Pick<Props, "cardUid">
) => ({
  card: state.paymentCardsReducer.cards.filter(
    (item) => item.uid === props.cardUid
  )[0],
  deleteCardLoading: state.paymentCardsReducer.deleteCardLoading,
  deleteCardError: state.paymentCardsReducer.deleteCardError,
  selectForPaymentLoading: state.paymentCardsReducer.selectForPaymentLoading,
  selectForPaymentError: state.paymentCardsReducer.selectForPaymentError,
});

const mapDispatchToProps = (
  dispatch: any,
  ownProps: Props & WithFramework7Props
) => ({
  deletePaymentCard: (uid: string) => {
    const { $f7, t } = ownProps;
    $f7.dialog.confirm(t("Really?"), () => {
      dispatch(deletePaymentCard(uid));
    });
  },
  selectForPayment: (uid: string) => {
    const { $f7 } = ownProps;
    dispatch(selectForPayment(uid));
    $f7.sheet.close();
  },
});

export default compose(
  withTranslation(),
  connectF7,
  connect(mapStateToProps, mapDispatchToProps)
)(PaymentCardInfoSheetPage) as React.ComponentClass<
  Pick<Props, "cardUid" | "onSelectEditCard" | "onSelectEnterVerifyCode"> &
    Sheet.Props
>;
