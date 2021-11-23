import React from "react";
import { Block, BlockTitle, Button, Link, PageContent } from "framework7-react";
import { compose } from "redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { createProductUrl } from "../../utils";

import "./style.less";

type Props = Pick<WithTranslation, "t"> & {
  opened?: boolean;
  productUid?: string;
  type?: string;
  onClose?(): void;
  onStartChat?(message?: string): void;
  orderNumber?: string;
};

class StartChat extends React.Component<Props> {
  getMessage = () => {
    const { t, productUid, type, orderNumber } = this.props;
    if (type === "store") {
      return t("ChatMessageStore");
    } else if (type === "buyer") {
      return t("Hi! I am contacting you with regards to my order No.", {
        orderNumber,
      });
    } else if (type === "seller") {
      return t("Hi! I am contacting you with regards to your order No.", {
        orderNumber,
      });
    }

    if (!productUid) {
      return null;
    }
    const productUrl = createProductUrl(productUid);
    const formatted = `<span>${productUrl}</span>`;
    const message = t("ChatMessageProduct", { productUrl: formatted });
    return message.replaceAll("\n", "<br/>");
  };

  startChatHandle = () => {
    const { t, productUid, type, onStartChat } = this.props;
    if (type === "buyer" || type === "seller") {
      return onStartChat();
    }
    const productUrl = createProductUrl(productUid);
    const message = t("ChatMessageProduct", { productUrl });
    onStartChat(message);
  };

  closeHandle = () => {
    this.props.onClose();
  };

  render() {
    const { t, type } = this.props;

    return (
      <PageContent className="start-chat-content">
        <BlockTitle medium>
          <Link
            className="close"
            onClick={this.closeHandle}
            iconMaterial="clear"
          />
          {type === "store"
            ? t("Chat with Store")
            : type === "seller"
            ? t("Chat with Buyer")
            : t("Start Chat with Seller")}
        </BlockTitle>
        <Block>
          <p>
            {type !== "buyer"
              ? t(
                  "You are going to open chat with buyer and send following message"
                )
              : t(
                  "You are going to open chat with Seller with the following message"
                )}
          </p>
        </Block>
        <Block className="message">
          <div dangerouslySetInnerHTML={{ __html: this.getMessage() }} />
        </Block>
        <Block className="buttons">
          <Button fill large round raised onClick={this.startChatHandle}>
            {t("Start Chat")}
          </Button>
        </Block>
      </PageContent>
    );
  }
}

export default compose(withTranslation())(StartChat);
