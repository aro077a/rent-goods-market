import React from "react";
import { Popup, F7Popup, Page, Navbar, NavRight, Link } from "framework7-react";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";
import { withTranslation, WithTranslation } from "react-i18next";

import "./style.less";
import { IcClose } from "../../components-ui/icons";

type Props = F7Popup.Props &
  Pick<WithTranslation, "t"> & {
    url: string;
    title: string;
    onClose: any;
  };

class IframeContentPopup extends React.Component<Props> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  renderIframe() {
    const { url } = this.props;
    return (
      <iframe
        id="iframeContent"
        src={url}
        className="iframe-popup-content"
        frameBorder="0"
      />
    );
  }

  render() {
    const { title, onClose, className, t, ...props } = this.props;

    return (
      <Popup {...props} className={classNames("iframe-popup", className)}>
        <Page>
          <Navbar title={t(title).toString()} noShadow noHairline>
            <NavRight>
              <Link popupClose>
                <IcClose />
              </Link>
            </NavRight>
          </Navbar>
          {this.renderIframe()}
        </Page>
      </Popup>
    );
  }
}

export default compose<any>(
  withTranslation(),
  connect(null, null)
)(IframeContentPopup);
