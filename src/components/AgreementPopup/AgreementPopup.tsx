import React from "react";
import { Popup, F7Popup, Page, Block } from "framework7-react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation, WithTranslation } from "react-i18next";
import cn from "classnames";

import { TC_AGREEMENT_SETTINGS_KEY, updateSettings } from "@/actions/profileActions";
import { IClassificator } from "@/reducers/classificatorReducer";
import { Profile } from "@/reducers/sessionReducer";
import connectProfile from "@/store/connectProfile";
import { IApplicationStore } from "@/store/rootReducer";
import { ThemedButton } from "@/components/ThemedButton";

import "./style.less";

type Props = F7Popup.Props &
  Pick<WithTranslation, "t"> & {
    profile?: Profile;
    updating?: boolean;
    error?: any;
    urls: IClassificator[];
    updateSettings?(settings: any): void;
  };

class AgreementPopup extends React.Component<Props> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  async componentDidUpdate(prevProps: Readonly<Props>) {
    const { t, profile, updating, error } = this.props;
    if (updating && updating !== prevProps.updating) {
      this.$f7.preloader.show();
    }

    if (!updating && error) {
      this.$f7.preloader.hide();
      this.$f7.dialog.alert(t(error));
    }

    const termsSettings = profile?.accountSettings.filter((s) => {
      return s.name === TC_AGREEMENT_SETTINGS_KEY;
    });

    if (!updating && updating !== prevProps.updating && termsSettings.length > 0) {
      this.$f7.preloader.hide();
      this.$f7.popup.close();
    }
  }

  getLinkUrl = (code: string) => {
    const { urls } = this.props;
    const filtered = urls.filter((u) => u.code === code);
    return filtered.length > 0 ? filtered[0].value : "#";
  };

  handleAcceptButton = () => {
    const settings = {};
    settings[TC_AGREEMENT_SETTINGS_KEY] = "true";
    this.props.updateSettings(settings);
  };

  renderIframe() {
    const url = this.getLinkUrl("TermsAndConditions");
    return (
      <iframe id="iframeContent" src={url} className="agreement-popup-iframe" frameBorder="0" />
    );
  }

  render() {
    const { className, t, ...props } = this.props;

    return (
      <Popup {...props} className={cn("agreement-popup", className)}>
        <Page>
          <Block className="agreement-popup-content">
            {this.renderIframe()}
            <div className="accept-button-area">
              <ThemedButton
                round
                fill
                large
                className="accept-button"
                onClick={this.handleAcceptButton}
              >
                {t("Accept")}
              </ThemedButton>
            </div>
          </Block>
        </Page>
      </Popup>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  profile:
    state.profileReducer.profile && state.profileReducer.profile.uid
      ? state.profileReducer.profile
      : state.sessionReducer.profile,
  urls: state.classificatorReducer.entitiesClassificators.Url_app,
});

const mapDispatchToProps = (dispatch) => ({
  updateSettings: (settings: any) => dispatch(updateSettings(settings)),
});

export default compose<any>(
  withTranslation(),
  connectProfile,
  connect(mapStateToProps, mapDispatchToProps)
)(AgreementPopup);
