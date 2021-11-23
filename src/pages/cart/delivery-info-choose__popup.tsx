import React, { Component } from "react";
import { Page, List, ListItem, Icon, Popup, PageContent } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { connect } from "react-redux";

import { Address } from "@/types/commonapi";
import { selectDeliveryAddress } from "@/actions/checkoutActions";
import connectAccountAddress, { IAccountAddressProps } from "@/store/connectAccountAddress";
import SmallModalHeader from "@/components-ui/small-modal-header";

import "./style.less";

type DeliveryInfoChoosePageProps = Omit<Popup.Props, "onPopupClosed"> & {
  selectDeliveryAddress?(address: Address): () => void;
  onPopupClosed: (instance, addDeliveryInformation: boolean) => void;
};

type DeliveryInfoChoosePageMapProps = Pick<WithTranslation, "t"> &
  IAccountAddressProps &
  DeliveryInfoChoosePageProps;

type State = {
  addDeliveryInformation?: boolean;
};

class DeliveryInfoChoosePage extends Component<DeliveryInfoChoosePageMapProps, State> {
  constructor(props: Readonly<DeliveryInfoChoosePageMapProps>) {
    super(props);
    this.state = {};
  }

  onOpen = (instance) => {
    this.setState({ addDeliveryInformation: false });
    if (this.props.onPopupOpened) {
      this.props.onPopupOpened(instance);
    }
  };

  onClose = (instance) => {
    if (this.props.onPopupClosed) {
      this.props.onPopupClosed(instance, this.state.addDeliveryInformation);
    }
  };

  onItemClick = (address: Address) => {
    this.props.selectDeliveryAddress(address);
    this.$f7.popup.close();
  };

  addDeliveryInformation = () => {
    this.setState({ addDeliveryInformation: true }, () => {
      this.$f7.popup.close();
    });
  };

  render() {
    const {
      t,
      accountAddressState: { addresses },
      ...rest
    } = this.props;

    return (
      <Popup
        id="delivery_info_choose__popup"
        swipeToClose
        {...rest}
        onPopupOpened={this.onOpen}
        onPopupClosed={this.onClose}
      >
        <Page pageContent={false}>
          <SmallModalHeader popupClose title={t("Delivery information")} />
          <PageContent>
            <List mediaList noChevron noHairlines noHairlinesBetween>
              {addresses.map((item) => (
                <ListItem
                  key={item.uid}
                  radio
                  name="delivery-media-radio"
                  value={item.uid}
                  title={item.firstAddressLine}
                  onClick={() => this.onItemClick(item)}
                >
                  <div slot="text">
                    {item.country.name}, {item.city} <br />
                    {item.firstAddressLine} <br />
                    {item.postalCode}
                  </div>
                </ListItem>
              ))}
              <ListItem
                className="item-add-link"
                link
                title={t("Add delivery Information").toString()}
                noChevron
                onClick={this.addDeliveryInformation}
              >
                <span slot="media">
                  <Icon ios="f7:plus" md="material:add" />
                </span>
              </ListItem>
            </List>
          </PageContent>
        </Page>
      </Popup>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  selectDeliveryAddress: (address: Address) => dispatch(selectDeliveryAddress(address)),
});

export default compose<React.FC<DeliveryInfoChoosePageProps>>(
  withTranslation(),
  connectAccountAddress,
  connect(mapStateToProps, mapDispatchToProps)
)(DeliveryInfoChoosePage);
