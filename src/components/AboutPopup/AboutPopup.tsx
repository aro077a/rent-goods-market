import React from "react";
import {
  Popup,
  F7Popup,
  Page,
  Navbar,
  NavRight,
  Link,
  Block,
  BlockTitle,
  List,
  Icon,
  ListItem,
} from "framework7-react";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";
import { IClassificator } from "../../reducers/classificatorReducer";
import { Profile } from "../../reducers/sessionReducer";
import { getProfile } from "../../selectors/profile";
import { IApplicationStore } from "../../store/rootReducer";
import { withTranslation, WithTranslation } from "react-i18next";
import { Logo } from "../Logo";

import "./style.less";
import { IcClose } from "../../components-ui/icons";

const pjson = require("../../../package.json");

type Props = F7Popup.Props &
  Pick<WithTranslation, "t"> & {
    profile?: Profile;
    urls: IClassificator[];
    onContentLinkClick: any;
    onContactSupportClick: any;
  };

class AboutPopup extends React.Component<Props> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  private appName = process.env.APP_NAME;
  private appSiteLink = process.env.APP_SITE_LINK;
  private appSiteTitle = process.env.APP_SITE_TITLE;
  private companyName = process.env.COMPANY_NAME;
  private redirectToUrls = process.env.REDIRECT_URLS === "true";

  currentYear = () => {
    const now = new Date();
    return now.getFullYear();
  };

  getLinkUrl = (code: string) => {
    const { urls } = this.props;
    const filtered = urls.filter((u) => u.code === code);
    return filtered.length > 0 ? filtered[0].value : "#";
  };

  redirectToUrl = (event, url) => {
    event.preventDefault();
    window.open(url);
  };

  handleContentUrl = (event, code, title) => {
    const url = this.getLinkUrl(code);
    if (this.props.onContentLinkClick && !this.redirectToUrls) {
      this.openIframe(title, url);
    } else {
      this.redirectToLinkUrl(event, url);
    }
  };

  openIframe = (title, url) => {
    this.props.onContentLinkClick(title, url);
  };

  redirectToLinkUrl = (event, url) => {
    event.preventDefault();
    window.open(url);
  };

  render() {
    const { onContactSupportClick, className, onPopupClosed, t, ...props } = this.props;

    return (
      <Popup
        {...props}
        onPopupClosed={onPopupClosed}
        className={classNames("about-popup", className)}
      >
        <Page>
          <Navbar noShadow noHairline>
            <NavRight>
              <Link popupClose>
                <IcClose />
              </Link>
            </NavRight>
          </Navbar>
          <Block className="text-align-center">
            <Block>
              <Logo full={false} />
            </Block>
            <BlockTitle large className="name">
              {this.appName}
            </BlockTitle>
            <p className="version">
              {t("Version")} {pjson.version}
            </p>
          </Block>
          <List noHairlines>
            <ListItem
              link="#"
              title={t("Terms & Conditions").toString()}
              onClick={(event) =>
                this.handleContentUrl(event, "TermsAndConditions", "Terms & Conditions")
              }
              popupClose
            >
              <Icon slot="media" f7="doc" />
            </ListItem>
            <ListItem
              link="#"
              title={t("Privacy Policy").toString()}
              onClick={(event) => this.handleContentUrl(event, "PrivacyPolicy", "Privacy Policy")}
              popupClose
            >
              <Icon slot="media" f7="checkmark_shield" />
            </ListItem>
            <ListItem
              link="#"
              title={t("Contact Support").toString()}
              onClick={onContactSupportClick}
              popupClose
            >
              <Icon slot="media" f7="headphones" />
            </ListItem>

            <ListItem
              link="#"
              title={this.appSiteTitle}
              onClick={(event) => this.redirectToUrl(event, this.appSiteLink)}
            >
              <Icon slot="media" f7="arrow_up_right_circle" />
            </ListItem>
          </List>
          <Block className="copyright">
            &copy; {this.currentYear()} {this.companyName}
          </Block>
        </Page>
      </Popup>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  profile: getProfile(state),
  urls: state.classificatorReducer.entitiesClassificators.Url_app,
});
export default compose<any>(withTranslation(), connect(mapStateToProps, null))(AboutPopup);
