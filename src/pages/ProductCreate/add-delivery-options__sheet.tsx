import React from "react";
import { Sheet, PageContent, BlockTitle, F7Sheet, List, ListItem } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { DeliveryMethod } from "../../types/marketplaceapi";
import { IcDeliveryPurple, IcLocationGreen, IcClose } from "../../components-ui/icons";
import { formatPrice } from "../../utils";
import connectCurrencies, { ICurrencyProps } from "../../store/connectCurrencies";

export const DELIVERY_METHOD = "Delivery method";
export const PICK_UP_POINT = "Pick-up point";

export type DeliveryMethodItem = DeliveryMethod & {
  selected?: boolean;
};

const getItemIcon = (type: DeliveryMethod.TypeEnum) =>
  type === DeliveryMethod.TypeEnum.DELIVERY ? (
    <div className="icon-container">
      <IcDeliveryPurple width="32px" height="32px" />
    </div>
  ) : (
    <div className="icon-container">
      <IcLocationGreen width="32px" height="32px" />
    </div>
  );

type Props = F7Sheet.Props & {
  onSelectItemClickHandle?(item: typeof DELIVERY_METHOD | typeof PICK_UP_POINT): void;
  deliveryMethods: DeliveryMethodItem[];
  onDeliveryMethodClickHandle?(uid: string): void;
};

const AddDeliveryOptionsSheet = ({
  t,
  onSelectItemClickHandle,
  deliveryMethods,
  onDeliveryMethodClickHandle,
  currencies,
  onSheetClosed,
  ...rest
}: Props & WithTranslation & ICurrencyProps) => (
  <Sheet id="add_delivery_options__sheet" backdrop {...rest}>
    <PageContent>
      <BlockTitle className="block-title" medium>
        {t("Add a delivery options")}
        <span className="x-button" onClick={() => onSheetClosed()}>
          <IcClose fill="var(--base-120)" />
        </span>
      </BlockTitle>
      <List noHairlines>
        <ListItem onClick={() => onSelectItemClickHandle(DELIVERY_METHOD)}>
          <div className="icon">
            <IcDeliveryPurple />
          </div>
          <span className="title">{t("New Delivery Method").toString()}</span>
        </ListItem>
        <ListItem onClick={() => onSelectItemClickHandle(PICK_UP_POINT)}>
          <div className="icon">
            <IcLocationGreen />
          </div>
          <span className="title">{t("New Pick-up Point").toString()}</span>
        </ListItem>
      </List>
      {deliveryMethods && deliveryMethods.length && (
        <>
          <p className="save-block-title">{t("Saved")}</p>
          <List noHairlines>
            {deliveryMethods.map((item, i) => (
              <ListItem key={item.uid || i.toString()}>
                <div
                  onClick={() => onDeliveryMethodClickHandle(item.uid)}
                  className={item.selected ? "selected saved" : "saved"}
                >
                  {getItemIcon(item.type)}
                  <div slot="title">
                    <strong>{item.name}</strong>
                    {item.options &&
                      item.options.length &&
                      item.options.map((o, i) => (
                        <div key={o.uid || i.toString()}>
                          <div>{o.countries && o.countries.map((c) => c.name).join(", ")}</div>
                          <div>{`${o.deliveryTimeDaysMin}-${o.deliveryTimeDaysMax}`}</div>
                          <div>
                            {o.price > 0
                              ? formatPrice(
                                  o.price,
                                  currencies.filter((c) => c.code === o.currencyCode)[0].symbol
                                )
                              : t("Free shipping")}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </PageContent>
  </Sheet>
);
export default compose(
  withTranslation(),
  connectCurrencies
)(AddDeliveryOptionsSheet) as React.ComponentClass<Props>;
