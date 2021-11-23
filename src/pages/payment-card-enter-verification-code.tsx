import React, { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import {
  Popup,
  Page,
  Navbar,
  Block,
  List,
  ListItem,
  Fab,
  Icon,
  NavTitle,
  NavRight,
  Link,
} from "framework7-react";
import { compose } from "redux";
import { connect } from "react-redux";
import { IApplicationStore } from "../store/rootReducer";
import classNames from "classnames";
import { ListInput } from "../components/ListInput";
import { Card } from "../types/commonapi";
import { verifyCreditCard } from "../actions/paymentCardsActions";

type Props = WithTranslation & {
  cardUid: string;
  card: Card;
  verifyCreditCardLoading?: boolean;
  verifyCreditCardError?: any;
  verifyCreditCard?(cardUid: string, verificationCode: string): void;
};

type State = {
  verifyCode?: string;
};

class PaymentCardEnterVerificationCodePage extends Component<
  Props & Popup.Props,
  State
> {
  state = {
    verifyCode: "",
  };

  componentDidUpdate(prevProps: Props) {
    const { verifyCreditCardLoading, verifyCreditCardError, t } = this.props;

    if (verifyCreditCardLoading && !prevProps.verifyCreditCardLoading) {
      this.$f7.preloader.show();
    } else if (!verifyCreditCardLoading && prevProps.verifyCreditCardLoading) {
      this.$f7.preloader.hide();
    }

    if (
      !verifyCreditCardLoading &&
      verifyCreditCardError &&
      verifyCreditCardError !== prevProps.verifyCreditCardError
    ) {
      this.$f7.dialog.alert(verifyCreditCardError);
    } else if (
      !verifyCreditCardLoading &&
      prevProps.verifyCreditCardLoading &&
      !verifyCreditCardError
    ) {
      this.$f7.dialog.alert(t("Success"));
      this.$f7.popup.close();
    }
  }

  backLinkHandle = () => {
    this.$f7.popup.close();
  };

  verifyHandle = () => {
    const {
      card: { uid },
    } = this.props;
    const { verifyCode } = this.state;
    if (verifyCode) {
      this.props.verifyCreditCard(uid, verifyCode);
    }
  };

  render() {
    const { card, t, ...rest } = this.props;
    return (
      <Popup id="payment_card_enter_verification_code" {...rest}>
        <Page>
          <Navbar noHairline noShadow>
            <NavTitle sliding>{t("Enter verification code")}</NavTitle>
            <NavRight>
              <Link popupClose>{t("Close")}</Link>
            </NavRight>
          </Navbar>

          {card && (
            <List noHairlines>
              <ListItem link={false} title={card.maskedNumber} noChevron>
                <span slot="media">
                  <i
                    className={classNames(
                      "icon",
                      `ic-${card.type.toLowerCase()}`
                    )}
                  ></i>
                </span>
                <span slot="footer">
                  {card.expMonth}/{card.expYear}
                </span>
              </ListItem>
            </List>
          )}
          <Block>
            <p>
              {t(
                "Check your bank statement for the verification code shown in the payment details of your initial deposit"
              )}
            </p>
          </Block>
          <List noHairlinesMd form>
            <ListInput
              name="verifyCode"
              label={t("Verification code").toString()}
              floatingLabel
              type="text"
              placeholder=""
              clearButton
              slot="list"
              cleaveFormatInputOptions={{ blocks: [4] }}
              required
              validateOnBlur
              onChange={(e) => this.setState({ verifyCode: e.target.value })}
              value={this.state.verifyCode}
            />
          </List>
          <Fab position="right-bottom" onClick={this.verifyHandle} slot="fixed">
            <Icon ios="f7:checkmark_alt" md="material:check" />
          </Fab>
        </Page>
      </Popup>
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
  verifyCreditCardLoading: state.paymentCardsReducer.verifyCreditCardLoading,
  verifyCreditCardError: state.paymentCardsReducer.verifyCreditCardError,
});

const mapDispatchToProps = (dispatch: any) => ({
  verifyCreditCard: (cardUid: string, verificationCode: string) =>
    dispatch(verifyCreditCard(cardUid, verificationCode)),
});

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(PaymentCardEnterVerificationCodePage) as React.ComponentClass<
  Pick<Props, "cardUid"> & Popup.Props
>;
