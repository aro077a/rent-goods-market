import React, { Component } from "react";
import {
  Popup,
  F7Popup,
  Page,
  PageContent,
  List,
  Block,
  BlockTitle,
  NavRight,
  Link,
  Navbar,
  Icon,
  Fab,
  NavTitle,
  Button,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { ProductOrder } from "../../types/paymentapi";
import { ListInput } from "../../components/ListInput";

type Props = WithTranslation &
  F7Popup.Props & {
    desktop?: boolean;
    order?: ProductOrder;
    onTrackingInfoChange?(
      trackingNumber: string,
      trackingCarrier: string
    ): void;
  };

type State = {
  trackingNumber?: string;
  trackingCarrier?: string;
  formErrors?: any;
  formValidFields?: any;
  formValid: boolean;
};

const initialState: State = {
  trackingNumber: "",
  trackingCarrier: "",
  formErrors: {
    trackingNumber: "",
    trackingCarrier: "",
  },
  formValidFields: {
    trackingNumber: false,
    trackingCarrier: false,
  },
  formValid: false,
};

class AddTrackingInfoPopup extends Component<Props & Popup.Props, State> {
  constructor(props: Readonly<WithTranslation & Props & Popup.Props>) {
    super(props);
    this.state = initialState;
  }

  title = () => {
    const { order, t } = this.props;
    return order && order.trackingCarrier
      ? t("Edit Tracking Number")
      : t("Add Tracking Number");
  };

  handleUserInput = (e: any) => {
    let { name, value, rawValue = null } = e.target;
    value = rawValue !== null ? rawValue : value;
    // @ts-ignore
    this.setState({ [name]: value }, () => this.validateField(name, value));
  };

  validateField = (fieldName: keyof State, value: string) => {
    const { t } = this.props;
    let formValidFields = this.state.formValidFields;
    let fieldValidationErrors = this.state.formErrors;
    let errorText = "";
    let requiredFieldErrorText = t("Please fill out this field.");

    errorText = value.length ? errorText : requiredFieldErrorText;
    fieldValidationErrors[fieldName] = errorText;
    formValidFields[fieldName] = !errorText.length;

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

  handleContinueButton = () => {
    if (!this.state.formValid) {
      Object.keys(this.state.formValidFields).forEach((key) => {
        // @ts-ignore
        this.validateField(key, this.state[key]);
      });
      if (!this.state.formValid) {
        return;
      }
    }

    this.props.onTrackingInfoChange(
      this.state.trackingNumber,
      this.state.trackingCarrier
    );
  };

  render() {
    const { t, order, desktop, ...rest } = this.props;

    return (
      <Popup
        id="add_tracking_info_popup"
        backdrop
        onPopupOpened={() => {
          if (order) {
            this.setState({
              trackingNumber: order.trackingNumber,
              trackingCarrier: order.trackingCarrier,
            });
          }
        }}
        onPopupClosed={() => {
          this.setState({
            trackingNumber: "",
            trackingCarrier: "",
          });
        }}
        {...rest}
      >
        <Page pageContent={false}>
          <Navbar noShadow noHairline={!desktop}>
            {desktop && <NavTitle>{this.title()}</NavTitle>}
            <NavRight>
              <Link popupClose iconMaterial="clear" />
            </NavRight>
          </Navbar>
          <PageContent>
            {!desktop && <BlockTitle>{this.title()}</BlockTitle>}
            <List noHairlines form className="no-margin-vertical">
              <ListInput
                name="trackingNumber"
                label={t("Tracking Number").toString()}
                type="text"
                placeholder=""
                required
                value={this.state.trackingNumber}
                slot="list"
                onBlur={this.handleUserInput}
                onChange={this.handleUserInput}
                {...this.getErrorMessagesProps("trackingNumber")}
              />
              <ListInput
                name="trackingCarrier"
                label={t("Carrier").toString()}
                type="text"
                placeholder=""
                required
                value={this.state.trackingCarrier}
                slot="list"
                onBlur={this.handleUserInput}
                onChange={this.handleUserInput}
                {...this.getErrorMessagesProps("trackingCarrier")}
              />
            </List>
            {!desktop && (
              <>
                <Block className="no-margin-vertical">
                  <hr />
                </Block>
                <Fab
                  position="right-bottom"
                  onClick={this.handleContinueButton}
                >
                  <Icon ios="f7:checkmark_alt" md="material:check" />
                </Fab>
              </>
            )}
            {desktop && (
              <Block className="popup-footer">
                <Button
                  fill
                  large
                  round
                  raised
                  className="save-button"
                  onClick={this.handleContinueButton}
                >
                  {t("Save")}
                </Button>
              </Block>
            )}
          </PageContent>
        </Page>
      </Popup>
    );
  }
}

export default compose(withTranslation())(AddTrackingInfoPopup);
