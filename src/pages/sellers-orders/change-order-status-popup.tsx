import React, { Component } from "react";
import {
  Popup,
  F7Popup,
  List,
  ListItem,
  Navbar,
  NavTitle,
  NavRight,
  Link,
  Block,
  Button,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { ProductOrder } from "../../types/paymentapi";

type Props = WithTranslation &
  F7Popup.Props & {
    order?: ProductOrder;
    onStatusChangeClick?(status: string): void;
  };

type State = {
  status?: string;
};

class ChangeOrderStatusPopup extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {};
  }

  changeStatus = (status: string) => {
    this.setState({
      status: status,
    });
  };

  render() {
    const { order, onStatusChangeClick, t, ...rest } = this.props;

    return (
      <Popup id="change_order_status_popup" backdrop {...rest}>
        <Navbar noShadow noHairline>
          <NavTitle>{t("Change Order Status to:")}</NavTitle>
          <NavRight>
            <Link popupClose iconMaterial="clear" />
          </NavRight>
        </Navbar>
        {order && (
          <List noHairlines noHairlinesBetween className="no-margin-vertical">
            {!order.statusExtended && (
              <ListItem
                radio
                title={t("Processing").toString()}
                value="PRC"
                onClick={() => this.changeStatus("PRC")}
              />
            )}
            {(!order.statusExtended ||
              ["PRC"].includes(order.statusExtended)) && (
              <ListItem
                radio
                title={t("Shipped").toString()}
                value="SHP"
                onClick={() => this.changeStatus("SHP")}
              />
            )}
            {(!order.statusExtended ||
              ["PRC", "SHP"].includes(order.statusExtended)) && (
              <ListItem
                radio
                title={t("Ready for Pickup").toString()}
                value="RCV"
                onClick={() => this.changeStatus("RCV")}
              />
            )}
            {(!order.statusExtended ||
              ["PRC", "SHP", "RCV"].includes(order.statusExtended)) && (
              <ListItem
                radio
                title={t("Completed").toString()}
                value="DLV"
                onClick={() => this.changeStatus("DLV")}
              />
            )}
          </List>
        )}
        <Block className="popup-footer">
          <Button
            fill
            large
            round
            raised
            className="change-status-button"
            onClick={() => onStatusChangeClick(this.state.status)}
          >
            {t("Confirm")}
          </Button>
        </Block>
      </Popup>
    );
  }
}

export default compose(withTranslation())(ChangeOrderStatusPopup);
