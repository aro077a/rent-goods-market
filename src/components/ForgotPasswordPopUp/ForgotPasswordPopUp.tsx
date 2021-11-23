import React from "react";
import { Popup, Page, Navbar, NavRight, Link, Block, List, Button } from "framework7-react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import cn from "classnames";

import {
  changePassword,
  loginWithOneTimePassword,
  oneTimePassword,
} from "@/actions/sessionActions";
import { getProfile } from "@/selectors/profile";
import { IApplicationStore } from "@/store/rootReducer";
import { isEmail } from "@/utils";
import { IcClose } from "@/components-ui/icons";
import { CustomInput } from "@/components/CustomInput";

import {
  ForgotPasswordPopupProps,
  ForgotPasswordPopupState,
  ForgotPasswordPopupMapProps,
  Step,
} from "./ForgotPasswordPopUp.types";

import "./ForgotPasswordPopUp.less";

const initialState: ForgotPasswordPopupState = {
  email: "",
  code: "",
  password: "",
  passwordRepeat: "",
  step: "init",
  showResend: false,
};

class ForgotPasswordPopup extends React.Component<
  ForgotPasswordPopupMapProps,
  ForgotPasswordPopupState
> {
  constructor(props: Readonly<ForgotPasswordPopupMapProps>) {
    super(props);
    this.state = initialState;
  }

  _resendTimeout: NodeJS.Timeout;

  componentDidUpdate(prevProps: ForgotPasswordPopupMapProps) {
    const { sending, loading, changing, error } = this.props;

    if (!sending && prevProps.sending) {
      this.processStepResult("code", error);
    }

    if (!loading && prevProps.loading) {
      this.processStepResult("password", error);
    }

    if (!changing && prevProps.changing) {
      this.$f7.preloader.hide();

      if (error) {
        this.showError(error);
      } else {
        this.clearState();
        this.$f7.popup.close();
      }
    }
  }

  componentWillUnmount() {
    this.setState(initialState);
  }

  sendOneTimePassword() {
    const { t } = this.props;

    const { email } = this.state;
    if (!email) {
      this.$f7.dialog.alert(t("Please fill out email field"));
      return;
    }

    this.activateResendTimeout();

    this.$f7.preloader.show();
    this.props.oneTimePassword(email);
  }

  loginWithCode() {
    const { t } = this.props;

    const { email, code } = this.state;
    if (!code) {
      this.$f7.dialog.alert(t("Please fill out code field"));
      return;
    }

    this.$f7.preloader.show();
    this.props.loginWithCode(email, code);
  }

  changePassword() {
    const { t } = this.props;

    const { password, passwordRepeat } = this.state;
    if (!password || !passwordRepeat) {
      this.$f7.dialog.alert(t("Please fill out password fields"));
      return;
    }

    if (password != passwordRepeat) {
      this.$f7.dialog.alert(t("Please make sure your passwords match"));
      return;
    }

    this.$f7.preloader.show();
    this.props.changePassword(password);
  }

  activateResendTimeout = () => {
    this.setState({ showResend: false });

    clearTimeout(this._resendTimeout);

    this._resendTimeout = setTimeout(() => {
      clearTimeout(this._resendTimeout);

      this.setState({ showResend: true });
    }, 20000);
  };

  processStepResult = (step: Step, error?: string) => {
    this.$f7.preloader.hide();

    if (error) {
      this.clearState();
      this.showError(error);
    } else {
      this.setState({ step });
    }
  };

  showError = (error: string) => {
    const { t } = this.props;

    if (error === "Client is not authorized") {
      error = "Incorrect code. Please try again.";
    }

    this.$f7.dialog.alert(t(error));
  };

  clearState = () => this.setState(initialState);

  getTitle = () => {
    const { t } = this.props;
    const { step } = this.state;
    switch (step) {
      case "code":
        return t("Enter Code");
      case "password":
        return t("Change Password");
      default:
        return t("Reset Password");
    }
  };

  onClose = () => this.props.setOpened(false);

  onOpen = () => this.props.setOpened(true);

  render() {
    const { className, t, ...props } = this.props;
    const { step, email, code, password, passwordRepeat } = this.state;

    return (
      <Popup
        {...props}
        onPopupClose={this.onClose}
        onPopupOpen={this.onOpen}
        className={cn("forgot-password-popup", className)}
      >
        <Page className="forgot-password-popup__page">
          <Navbar noShadow noHairline className="forgot-password-popup__navbar">
            <NavRight>
              <Link popupClose onClick={this.clearState} className="forgot-password-popup__close">
                <IcClose />
              </Link>
            </NavRight>
          </Navbar>
          <Block className="forgot-password-popup__content">
            <Block className="forgot-password-popup__top">
              <i className="logo forgot-password-popup__logo" />
              <h3 className="forgot-password-popup__top-title">{this.getTitle()}</h3>
            </Block>
            {step === "init" && (
              <Block className="forgot-password-popup__step">
                <Block className="step-hint">
                  {t("Enter your e-mail and we will send you code")}
                </Block>
                <List noHairlines form>
                  <CustomInput
                    name="email"
                    label={t("E-mail").toString()}
                    floatingLabel
                    type="email"
                    placeholder=""
                    value={email}
                    onInput={(e) => this.setState({ email: e.target.value })}
                  />
                </List>
                <Block className="forgot-password-popup__step-btn">
                  <Button
                    fill
                    large
                    round
                    raised
                    onClick={this.sendOneTimePassword.bind(this)}
                    disabled={this.props.loading || !isEmail(email)}
                  >
                    {t("Continue")}
                  </Button>
                </Block>
              </Block>
            )}
            {step === "code" && (
              <Block className="forgot-password-popup__step">
                <Block className="step-hint">
                  {t("We have sent you the code to your email")} &nbsp;
                  <strong>{email}</strong>
                </Block>
                <List noHairlines form>
                  <CustomInput
                    name="code"
                    label={t("Enter Code").toString()}
                    floatingLabel
                    type="text"
                    placeholder=""
                    slot="list"
                    value={code}
                    onInput={(e) => this.setState({ code: e.target.value })}
                  />
                </List>
                <Block className="forgot-password-popup__step-btn">
                  <Button
                    fill
                    large
                    round
                    raised
                    onClick={this.loginWithCode.bind(this)}
                    // ? how long is code
                    disabled={this.props.loading || !code}
                  >
                    {t("Continue")}
                  </Button>

                  {this.state.showResend && (
                    <p className="sign-up-text">
                      {t("Did not get a Code?")} &nbsp;
                      <Link onClick={this.sendOneTimePassword.bind(this)}>{t("Resend")}</Link>
                    </p>
                  )}
                </Block>
              </Block>
            )}
            {step === "password" && (
              <Block className="forgot-password-popup__step">
                <List noHairlines form>
                  <CustomInput
                    name="password"
                    label={t("New Password").toString()}
                    floatingLabel
                    type="password"
                    placeholder=""
                    clearButton
                    slot="list"
                    value={password}
                    onInput={(e) => this.setState({ password: e.target.value })}
                  />
                  <CustomInput
                    name="passwordRepeat"
                    label={t("Repeat Password").toString()}
                    floatingLabel
                    type="password"
                    placeholder=""
                    clearButton
                    slot="list"
                    value={passwordRepeat}
                    onInput={(e) => this.setState({ passwordRepeat: e.target.value })}
                  />
                </List>
                <Block className="forgot-password-popup__step-btn">
                  <Button
                    fill
                    large
                    round
                    raised
                    onClick={this.changePassword.bind(this)}
                    // ? how long is password
                    disabled={
                      this.props.loading ||
                      !password ||
                      !passwordRepeat ||
                      password !== passwordRepeat
                    }
                  >
                    {t("Done")}
                  </Button>
                </Block>
              </Block>
            )}
          </Block>
        </Page>
      </Popup>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  profile: getProfile(state),
  loading: state.sessionReducer.passwordLoginLoading,
  sending: state.sessionReducer.passwordResetLoading,
  changing: state.sessionReducer.passwordChangeLoading,
  error: state.sessionReducer.passwordError,
});

const mapDispatchToProps = (dispatch) => ({
  oneTimePassword: (email: string) => dispatch(oneTimePassword(email)),
  loginWithCode: (email: string, code: string) => dispatch(loginWithOneTimePassword(email, code)),
  changePassword: (password: string) => dispatch(changePassword(password)),
});

export default compose<React.FC<ForgotPasswordPopupProps>>(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(ForgotPasswordPopup);
