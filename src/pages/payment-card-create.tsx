import React, { Component } from "react";
import {
  Page,
  Navbar,
  List,
  ListItem,
  Row,
  Col,
  Fab,
  Icon,
  Popup,
  NavTitle,
  NavRight,
  Link,
  Checkbox,
  Block,
  NavLeft,
  Button,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { ListInput } from "../components/ListInput";
import { IApplicationStore } from "../store/rootReducer";
import { connect } from "react-redux";
import { savePaymentCard } from "../actions/paymentCardsActions";
import { SavedCard } from "../reducers/paymentCardsReducer";
import connectCards, { ICardsProps } from "../store/connectCards";
import { isValidCardExpDate, isValidCardFormat } from "../utils";
import { IcVisa, IcMastercard, IcFramecard } from "../components-ui/icons";

import "./payment-card-create.less";
import cloneDeep from "lodash/cloneDeep";

const cardIcons = {
  unknown: <IcFramecard />,
  visa: <IcVisa />,
  mastercard: <IcMastercard />,
};

const IcCard = ({ cardType = "unknown" }) =>
  cardIcons[cardType] ? cardIcons[cardType] : cardIcons["unknown"];

type Props = WithTranslation &
  ICardsProps & {
    saveCardLoading: boolean;
    saveCardError: any;
    savedCard: SavedCard;
    saveCard?(card: SavedCard): () => void;
    saveCardByDefault?: boolean;
    onSaveCard?(card: SavedCard): void;
  };

type State = Pick<SavedCard, "cardNumber" | "cvv" | "cardHolder"> & {
  expireDate: string;
  formErrors?: any;
  formValidFields?: any;
  formValid: boolean;
  cardType?: string;
  saveCard?: boolean;
};

const initialState: State = {
  cardNumber: "",
  expireDate: "",
  cvv: "",
  cardHolder: "",
  formErrors: { cardNumber: "", expireDate: "", cvv: "", cardHolder: "" },
  formValidFields: {
    cardNumber: false,
    expireDate: false,
    cvv: false,
    cardHolder: false,
  },
  formValid: false,
  cardType: "unknown",
};

class PaymentCardCreatePage extends Component<Props & Popup.Props, State> {
  constructor(props: Readonly<WithTranslation & Props & Popup.Props>) {
    super(props);
    this.state = {
      ...cloneDeep(initialState),
      saveCard: props.saveCardByDefault,
    };
  }
  handlePopupOpen = (instance: any) => {
    this.setState({ ...cloneDeep(initialState) });
    if (this.props.onPopupOpen) this.props.onPopupOpen(instance);
  };

  componentDidUpdate(prevProps: Props) {
    const { saveCardLoading, saveCardError, t } = this.props;

    if (saveCardLoading && !prevProps.saveCardLoading) {
      this.$f7.preloader.show();
    } else if (!saveCardLoading && prevProps.saveCardLoading) {
      this.$f7.preloader.hide();
    }

    if (saveCardError && saveCardError !== prevProps.saveCardError) {
      this.$f7.dialog.alert(saveCardError);
    }

    if (!saveCardLoading && !saveCardError && prevProps.saveCardLoading) {
      this.$f7.dialog.alert(t("CreditCardSavedSuccess"), () =>
        this.$f7.popup.close()
      );
    }
  }

  handleBlurInput = (e: any) => this.handleUserInput(e);

  handleUserInput = (e: any) => {
    let { name, value, rawValue = null } = e.target;
    value = rawValue !== null && name !== "expireDate" ? rawValue : value;
    // @ts-ignore
    this.setState({ [name]: value }, () => this.validateField(name, value));
  };

  handleInputClear = (e: any) => {
    let { name } = e.target;
    // @ts-ignore
    this.setState({ [name]: "" }, () => this.validateField(name, ""));
  };

  validateField = (fieldName: keyof State, value: string) => {
    const { t } = this.props;
    let formValidFields = this.state.formValidFields;
    let fieldValidationErrors = this.state.formErrors;
    let errorText = "";
    let requiredFieldErrorText = t("Please fill out this field.");

    switch (fieldName) {
      case "cardNumber":
        errorText = value.length ? errorText : requiredFieldErrorText;
        errorText =
          value.length && isValidCardFormat(value)
            ? errorText
            : t(
                "You entered the number incorrectly. Check it out and try again."
              );
        fieldValidationErrors.cardNumber = errorText;
        formValidFields.cardNumber = !errorText.length;
        break;
      case "expireDate":
        errorText = value.length ? errorText : requiredFieldErrorText;
        errorText = isValidCardExpDate(value)
          ? errorText
          : t("Enter a valid date.");
        fieldValidationErrors.expireDate = errorText;
        formValidFields.expireDate = !errorText.length;
        break;
      case "cvv":
        errorText = value.length ? errorText : requiredFieldErrorText;
        errorText =
          value.length && value.length < 3
            ? t("Enter the correct CVV.")
            : errorText;
        fieldValidationErrors.cvv = errorText;
        formValidFields.cvv = !errorText.length;
        break;
      case "cardHolder":
        errorText = value.toString().length
          ? errorText
          : requiredFieldErrorText;
        errorText = value.match(
          /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/i
        )
          ? errorText
          : t("Latin characters only.");
        fieldValidationErrors.cardHolder = errorText;
        formValidFields.cardHolder = !errorText.length;
        break;
      default:
        break;
    }

    this.setState(
      {
        formErrors: fieldValidationErrors,
        formValidFields,
      },
      this.validateForm
    );
  };

  validateForm = () => {
    this.setState({
      formValid: !this.formHasErrors(this.state.formValidFields),
    });
  };

  formHasErrors = (formValidFields: any) => {
    return Object.keys(formValidFields).some((key) => !formValidFields[key]);
  };

  getErrorMessagesProps = (fieldName: string) => {
    const { t } = this.props;
    return {
      errorMessage: t(this.state.formErrors[fieldName]),
      errorMessageForce: !!this.state.formErrors[fieldName],
    };
  };

  mapStateToEntity = (): SavedCard => {
    const { cardNumber, expireDate, cvv, cardHolder, saveCard } = this.state;
    const monthYearParts = expireDate.split("/");
    return {
      cardNumber,
      expMonth: parseInt(monthYearParts[0]),
      expYear: parseInt(monthYearParts[1]),
      cvv,
      cardHolder,
      saveCard,
    };
  };

  saveCardHandle = () => {
    const { saveCardLoading } = this.props;
    if (saveCardLoading || !this.state.formValid) {
      Object.keys(this.state.formValidFields).forEach((key) => {
        // @ts-ignore
        this.validateField(key, this.state[key]);
      });
      return;
    }
    const savedCard = this.mapStateToEntity();
    this.props.saveCard(savedCard);
  };

  handleCardTypeChanged = (cardType: string) => this.setState({ cardType });

  render() {
    const { saveCardLoading, t, saveCardByDefault, ...rest } = this.props;
    const { cardType, saveCard } = this.state;
    return (
      <Popup
        id="payment_card_create"
        swipeToClose
        {...rest}
        onPopupOpen={this.handlePopupOpen}
      >
        <Page>
          <Navbar noHairline noShadow className="credit-card-navbar">
            <NavRight>
              <Link iconOnly popupClose>
                <Icon material="close" />
              </Link>
            </NavRight>
            <NavTitle sliding>{t("Add New Card")}</NavTitle>
          </Navbar>
          <List noHairlinesMd form className="credit-card-list">
            <ListInput
              className="credit-card-list-item"
              name="cardNumber"
              label="Card Number"
              floatingLabel
              type="tel"
              maxlength={24}
              placeholder=""
              clearButton
              slot="list"
              cleaveFormatInputOptions={{
                creditCard: true,
                onCreditCardTypeChanged: this.handleCardTypeChanged,
              }}
              disabled={saveCardLoading}
              required
              onBlur={this.handleBlurInput}
              onInputClear={this.handleInputClear}
              value={this.state.cardNumber}
              {...this.getErrorMessagesProps("cardNumber")}
            >
              <div slot="input" className="card-type">
                <IcCard cardType={cardType} />
              </div>
            </ListInput>
            <ListItem slot="list">
              <Row>
                <Col>
                  <ListInput
                    name="expireDate"
                    label="MM/YY"
                    floatingLabel
                    type="tel"
                    placeholder=""
                    clearButton
                    wrap={false}
                    cleaveFormatInputOptions={{
                      datePattern: ["m", "y"],
                      date: true,
                    }}
                    disabled={saveCardLoading}
                    required
                    onBlur={this.handleBlurInput}
                    onInputClear={this.handleInputClear}
                    value={this.state.expireDate}
                    {...this.getErrorMessagesProps("expireDate")}
                  />
                </Col>
                <Col>
                  <ListInput
                    name="cvv"
                    label="CVV"
                    floatingLabel
                    type="tel"
                    maxlength={4}
                    placeholder=""
                    clearButton
                    wrap={false}
                    cleaveFormatInputOptions={{ blocks: [3] }}
                    disabled={saveCardLoading}
                    required
                    onBlur={this.handleBlurInput}
                    onInputClear={this.handleInputClear}
                    value={this.state.cvv}
                    {...this.getErrorMessagesProps("cvv")}
                  />
                </Col>
              </Row>
            </ListItem>
            <ListInput
              name="cardHolder"
              label="Card Holder"
              floatingLabel
              type="text"
              placeholder=""
              clearButton
              slot="list"
              disabled={saveCardLoading}
              required
              onBlur={this.handleBlurInput}
              onChange={this.handleUserInput}
              onInputClear={this.handleInputClear}
              value={this.state.cardHolder}
              {...this.getErrorMessagesProps("cardHolder")}
            />
          </List>
          {!saveCardByDefault && (
            <Block className="credit-card-checkbox-container">
              <Checkbox
                name="save-card"
                value={saveCard}
                checked={saveCard}
                onChange={() =>
                  this.setState({ saveCard: !this.state.saveCard })
                }
              />
              {t("Save this card for future purchases")}
            </Block>
          )}
          <div className="credit-card-button-row">
            <div />
            <Button fill round onClick={this.saveCardHandle}>
              {t("Confirm")}
            </Button>
          </div>
        </Page>
      </Popup>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  ...state.paymentCardsReducer,
});

const mapDispatchToProps = (dispatch: any, props: Props) => ({
  saveCard: (card: SavedCard) =>
    typeof props.onSaveCard !== "undefined"
      ? props.onSaveCard(card)
      : dispatch(savePaymentCard(card)),
});

export default compose(
  withTranslation(),
  connectCards,
  connect(mapStateToProps, mapDispatchToProps)
)(PaymentCardCreatePage) as React.ComponentClass<
  Popup.Props & {
    saveCardByDefault?: boolean;
    onSaveCard?(card: SavedCard): void;
  }
>;
