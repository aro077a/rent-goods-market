import React, { Component } from "react";
import {
  Page,
  Navbar,
  Block,
  BlockTitle,
  List,
  ListItem,
  Toggle,
  Icon,
  NavTitle,
  NavLeft,
  Link,
} from "framework7-react";
import { compose } from "redux";
import "./profile.less";
import { AboutPopup } from "../components/AboutPopup";
import { Avatar } from "../components/Avatar";
import { ContactSupportPopup } from "../components/ContactSupportPopup";
import { IframeContentPopup } from "../components/IframeContentPopup";
import connectProfile from "../store/connectProfile";
import { Profile } from "../reducers/sessionReducer";
import { withTranslation, WithTranslation } from "react-i18next";
import { ProfileStatus } from "../components/ProfileStatus";
import connectLocalConfig from "../store/connectLocalConfig";
import { ILocalConfig } from "../store/rootReducer";
import { setLayoutTheme } from "../utils";
import {
  IcOrders,
  IcPassport,
  IcSellerArea,
  IcTransaction,
  IcWallet,
  IcAbout,
} from "../components-ui/icons";
import { VerifyAccountSheet } from "../components/VerifyAccountSheet";

type Props = WithTranslation & {
  profile: Profile;
  localConfig?: ILocalConfig;
};

type State = {
  aboutPopupOpened?: boolean;
  contactSupportPopupOpened?: boolean;
  iframeContentPopupOpened?: boolean;
  verifySheetOpened?: boolean;
  iframeContent?: {
    title: string;
    url: string;
  };
};

class ProfilePage extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      aboutPopupOpened: false,
      contactSupportPopupOpened: false,
      iframeContentPopupOpened: false,
      verifySheetOpened: false,
      iframeContent: {
        title: null,
        url: null,
      },
    };
  }

  changeThemeHandle = (on: boolean) => setLayoutTheme(on ? "dark" : "light");

  menuItemEnabled = (item: string): boolean => {
    const { localConfig } = this.props;
    const profileMenuItems = localConfig.profileMenuItems;
    return (
      profileMenuItems &&
      profileMenuItems.length > 0 &&
      profileMenuItems.includes(item)
    );
  };

  profileVerified = (): boolean => {
    const { profile } = this.props;
    return ["SF", "MF", "BF"].includes(profile.status);
  };

  private appName = process.env.APP_NAME;

  render() {
    const { profile, t } = this.props;

    return (
      <Page id="profile" name="profile" stacked>
        <Navbar noHairline noShadow>
          <NavLeft>
            <Link href="/" iconOnly>
              <i className="icon icon-back" />
            </Link>
          </NavLeft>
          <NavTitle>{t("Profile")}</NavTitle>
        </Navbar>
        <Block className="avatar-container">
          <Avatar profile={profile} />
          <BlockTitle large className="profile-name">
            {profile.person?.name} {profile.person?.surname}
          </BlockTitle>
          {profile.accountEmails && profile.accountEmails.length ? (
            <p className="profile-field">{profile.accountEmails[0].email}</p>
          ) : null}
          {profile && <ProfileStatus profile={profile} />}
        </Block>
        <List noHairlines noHairlinesBetween>
          {this.menuItemEnabled("SellerArea") && (
            <ListItem link="seller-area/" title={t("Seller Area").toString()}>
              <div
                slot="media"
                className="display-flex justify-content-center align-content-center"
              >
                <IcSellerArea />
              </div>
            </ListItem>
          )}
          {this.menuItemEnabled("MyWishList") && (
            <ListItem link="/wish-list/" title={t("My wish list").toString()}>
              <Icon slot="media" material="favorite_border" />
            </ListItem>
          )}
          {this.menuItemEnabled("MyWallet") && (
            <ListItem link="wallet/" title={t("My wallet").toString()}>
              <div
                slot="media"
                className="display-flex justify-content-center align-content-center"
              >
                <IcWallet />
              </div>
            </ListItem>
          )}
          {this.menuItemEnabled("MyOrders") && (
            <ListItem link="orders/" title={t("My Orders").toString()}>
              <div
                slot="media"
                className="display-flex justify-content-center align-content-center"
              >
                <IcOrders />
              </div>
            </ListItem>
          )}
          {this.menuItemEnabled("Transactions") && (
            <ListItem link="transactions/" title={t("Transactions").toString()}>
              <div
                slot="media"
                className="display-flex justify-content-center align-content-center"
              >
                <IcTransaction />
              </div>
            </ListItem>
          )}
          {this.menuItemEnabled("Notifications") && (
            <ListItem title={t("Notifications").toString()}>
              <Icon slot="media" f7="bell" />
              <Toggle slot="after" />
            </ListItem>
          )}
          {this.menuItemEnabled("DarkMode") && (
            <ListItem title={t("Dark mode").toString()}>
              <Icon slot="media" f7="moon" />
              <Toggle slot="after" onToggleChange={this.changeThemeHandle} />
            </ListItem>
          )}
          {this.menuItemEnabled("Language") && (
            <ListItem title={t("English").toString()}>
              <Icon slot="media" material="language" />
            </ListItem>
          )}
          {this.menuItemEnabled("Verify") && !this.profileVerified() && (
            <ListItem
              link="#"
              title={t("Verify Your Account").toString()}
              popoverClose
              onClick={() => this.setState({ verifySheetOpened: true })}
            >
              <div
                slot="media"
                className="display-flex justify-content-center align-content-center"
              >
                <IcPassport />
              </div>
            </ListItem>
          )}
          {this.menuItemEnabled("About") && (
            <ListItem
              link="#"
              title={t("About app", { appName: this.appName }).toString()}
              popoverClose
              onClick={() => this.setState({ aboutPopupOpened: true })}
            >
              <div
                slot="media"
                className="display-flex justify-content-center align-content-center"
              >
                <IcAbout />
              </div>
            </ListItem>
          )}
        </List>

        <AboutPopup
          profile={profile}
          backdrop={false}
          opened={this.state.aboutPopupOpened}
          onPopupClosed={() => this.setState({ aboutPopupOpened: false })}
          onContactSupportClick={() =>
            this.setState({ contactSupportPopupOpened: true })
          }
          onContentLinkClick={(title, url) =>
            this.setState({
              iframeContentPopupOpened: true,
              iframeContent: { title, url },
            })
          }
        />

        <ContactSupportPopup
          profile={profile}
          category="Application"
          backdrop={true}
          opened={this.state.contactSupportPopupOpened}
          onPopupClosed={() =>
            this.setState({ contactSupportPopupOpened: false })
          }
        />

        <IframeContentPopup
          backdrop={false}
          title={this.state.iframeContent.title}
          url={this.state.iframeContent.url}
          opened={this.state.iframeContentPopupOpened}
          onPopupClosed={() =>
            this.setState({
              iframeContentPopupOpened: false,
              iframeContent: { title: null, url: null },
            })
          }
        />

        <VerifyAccountSheet
          t={t}
          opened={this.state.verifySheetOpened}
          onSheetClosed={() => this.setState({ verifySheetOpened: false })}
        />
      </Page>
    );
  }
}

export default compose(
  withTranslation(),
  connectProfile,
  connectLocalConfig
)(ProfilePage);
