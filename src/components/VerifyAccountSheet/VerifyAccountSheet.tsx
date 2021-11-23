import React from "react";
import { Block, F7Sheet, Link, PageContent } from "framework7-react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation, WithTranslation } from "react-i18next";
import cn from "classnames";

import { IcClose, IcPassportLarge } from "@/components-ui/icons";
import { Sheet } from "@/components/Sheet";
import { ThemedButton } from "@/components/ThemedButton";
import { IApplicationStore } from "@/store/rootReducer";
import { createAuthorizationCode } from "@/actions/sessionActions";

import "./style.less";

type Props = F7Sheet.Props &
  Pick<WithTranslation, "t"> & {
    loading?: boolean;
    code?: string;
    error?: any;
    language?: string;
    createAuthorizationCode?(): void;
  };

class VerifyAccountSheet extends React.Component<Props> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  private passportUrl = process.env.PASSPORT_URL;

  componentDidUpdate(prevProps: Readonly<Props>) {
    const { loading, code, error, t } = this.props;

    if (loading && !prevProps.loading) {
      this.$f7.preloader.show();
    }

    if (!loading && prevProps.loading) {
      this.$f7.preloader.hide();

      if (error != null && error != prevProps.error) {
        this.$f7.dialog.alert(t(error));
      }

      if (!error && code && code != prevProps.code) {
        const redirectUrl = this.formatPassportUrl(code);
        if (redirectUrl !== null) {
          this.$f7.sheet.close();
          window.open(redirectUrl, "_self");
        }
      }
    }
  }

  handleOpenPassportClick = () => {
    this.props.createAuthorizationCode();
  };

  formatPassportUrl = (code: string) => {
    const { language, t } = this.props;

    if (this.passportUrl == null || this.passportUrl.length === 0) {
      this.$f7.dialog.alert(t("Could not generate Passport URL"));

      return null;
    }

    return this.passportUrl.replace("{CODE}", code).replace("{LANGUAGE}", language);
  };

  render() {
    const { loading, className, t, ...props } = this.props;
    return (
      <Sheet
        className={cn("verify-account-sheet", className)}
        style={{ height: "auto" }}
        swipeToClose
        backdrop
        {...props}
      >
        <PageContent>
          <Link sheetClose className="close-sheet">
            <IcClose />
          </Link>
          <Block>
            <div className="passport-icon">
              <IcPassportLarge />
            </div>
            <h1>{t("Verify Your Account")}</h1>
            <p className="text-align-center">
              {t(
                "Account verification takes a few minutes. It is mandatory for Sellers willing to accept payments using MarketSpace services."
              )}
            </p>
            <div className="open-passport-button-area">
              <ThemedButton
                round
                fill
                large
                className="open-passport-button"
                disabled={loading}
                onClick={this.handleOpenPassportClick}
              >
                {t("Open Passport")}
              </ThemedButton>
            </div>
          </Block>
        </PageContent>
      </Sheet>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  loading: state.sessionReducer.authorizationCodeLoading,
  code: state.sessionReducer.authorizationCode,
  error: state.sessionReducer.authorizationCodeError,
  language: state.rootReducer.language,
});

const mapDispatchToProps = (dispatch) => ({
  createAuthorizationCode: () => dispatch(createAuthorizationCode()),
});

export default compose<React.FC<Props>>(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(VerifyAccountSheet);
