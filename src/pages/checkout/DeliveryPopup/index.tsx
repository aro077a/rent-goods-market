import React from "react";
import {
  Page,
  List,
  ListItem,
  Icon,
  Popup,
  PageContent,
  f7,
} from "framework7-react";
import "../../cart/style.less";
import SmallModalHeader from "../../../components-ui/small-modal-header";
import { useSelector } from "react-redux";
import { IApplicationStore } from "../../../store/rootReducer";
import { useTranslation } from "react-i18next";
import { Address } from "../../../types/commonapi";

interface Props {
  opened: boolean;
  onSelected: (address: Address) => void;
  onClose: () => void;
  addDelivery: () => void;
}

const DeliveryPopup = ({ opened, onClose, onSelected, addDelivery }: Props) => {
  const { t } = useTranslation();
  const profile = useSelector(
    (state: IApplicationStore) => state.sessionReducer.profile
  );

  return (
    <Popup
      opened={opened}
      onPopupClosed={() => {
        onClose();
      }}
    >
      <Page pageContent={false}>
        <SmallModalHeader popupClose title={t("Delivery information")} />
        <PageContent>
          <List mediaList noChevron noHairlines noHairlinesBetween>
            {profile.addresses.map((item) => {
              return (
                <ListItem
                  key={item.uid}
                  radio
                  name="delivery-media-radio"
                  value={item.uid}
                  title={item.firstAddressLine}
                  onClick={() => {
                    onClose();
                    f7.popup.close();
                    setTimeout(() => onSelected(item), 500);
                  }}
                >
                  <div slot="text">
                    {item.country.name}, {item.city} <br />
                    {item.firstAddressLine} <br />
                    {item.postalCode}
                  </div>
                </ListItem>
              );
            })}
            <ListItem
              className="item-add-link"
              link
              title={t("Add delivery Information").toString()}
              noChevron
              onClick={() => {
                addDelivery();
              }}
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
};

export default DeliveryPopup;
