import React, { useCallback, useMemo } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  BlockTitle,
  F7Popup,
  F7Sheet,
  Icon,
  Link,
  List,
  ListItem,
  Navbar,
  NavRight,
  NavTitle,
  PageContent,
  Popup,
  Sheet,
} from "framework7-react";
import { bindActionCreators, compose } from "redux";

import {
  changeAddress,
  changeCountry,
  toggleSelectCountryPopup,
  toggleSelectCustomerLocationSheet,
} from "@/actions/customer-location/customerLocationActions";
import { IcGlobe } from "@/components-ui/icons";
import { getProfile } from "@/selectors/profile";
import { IApplicationStore } from "@/store/rootReducer";
import { Address } from "@/types/commonapi";

import "./style.less";

function getAddressLine(address: Address) {
  return `${address.city}, ${address.firstAddressLine}, ${address.postalCode}`;
}

const mapStateToProps = (state: IApplicationStore) => ({
  addressList: getProfile({ ...state }).addresses,
  resizeEvent: state.rootReducer.resizeEvent,
  ...state.customerLocationReducer,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      toggleSelectCustomerLocationSheet,
      toggleSelectCountryPopup,
      changeCountry,
      changeAddress,
    },
    dispatch
  );

type Props = Partial<ReturnType<typeof mapStateToProps>> &
  Partial<ReturnType<typeof mapDispatchToProps>> &
  F7Sheet.Props &
  F7Popup.Props & {
    addressList?: Address[];
  };

const SelectCustomerLocationSheet = ({
  addressList,
  selectCustomerLocationSheetOpened,
  onSheetClosed,
  onPopupClosed,
  toggleSelectCustomerLocationSheet,
  toggleSelectCountryPopup,
  changeCountry,
  changeAddress,
  addressUid,
  t,
  resizeEvent,
  ...rest
}: Props & WithTranslation) => {
  const Component: React.ComponentClass<F7Sheet.Props | F7Popup.Props> = resizeEvent.isXS
    ? Sheet
    : Popup;

  const dialogClosed = useCallback(
    (instance) => {
      toggleSelectCustomerLocationSheet(false);
      if (resizeEvent.isXS && onSheetClosed) {
        onSheetClosed(instance);
      } else if (onPopupClosed) {
        onPopupClosed(instance);
      }
    },
    [onPopupClosed, onSheetClosed, resizeEvent.isXS, toggleSelectCustomerLocationSheet]
  );

  const props: F7Sheet.Props | F7Popup.Props = useMemo(
    () =>
      resizeEvent.isXS
        ? {
            onSheetClosed: dialogClosed,
          }
        : { onPopupClosed: dialogClosed },
    [dialogClosed, resizeEvent.isXS]
  );

  return (
    <Component
      id="select_customer_location__sheet"
      backdrop
      opened={selectCustomerLocationSheetOpened}
      {...rest}
      {...props}
    >
      <Navbar noHairline noShadow>
        <NavTitle>{t("Delivery location")}</NavTitle>
        <NavRight>
          <Link iconOnly onClick={dialogClosed}>
            <Icon ios="f7:multiply" md="material:close" />
          </Link>
        </NavRight>
      </Navbar>

      <PageContent className="page-content-delivery-location">
        <List noHairlines>
          <ListItem
            link
            title={t("Select a country").toString()}
            onClick={() => {
              toggleSelectCustomerLocationSheet(false);
              setTimeout(() => toggleSelectCountryPopup(true), 380);
            }}
          >
            <IcGlobe slot="media" />
          </ListItem>
          {/*<ListItem link title={t("Add address").toString()} onClick={() => {}}>
          <IcLocation slot="media" />
        </ListItem>*/}
        </List>
        {addressList && addressList.length && (
          <>
            <BlockTitle className="saved-address">{t("Saved addressess")}</BlockTitle>
            <List
              mediaList
              noHairlines
              noHairlinesBetween
              className="no-margin-top no-margin-bottom saved-addressess"
            >
              {addressList.map((item) => (
                <ListItem
                  key={item.uid}
                  radio
                  checked={addressUid === item.uid}
                  onClick={() => {
                    changeCountry(item.country.code); // TODO: ?
                    changeAddress(item.uid);
                    toggleSelectCustomerLocationSheet(false);
                  }}
                >
                  <div slot="title">
                    <strong>{item.country.name}</strong>
                    <div className="address-line">{getAddressLine(item)}</div>
                  </div>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </PageContent>
    </Component>
  );
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(SelectCustomerLocationSheet) as React.FC<Props>;
