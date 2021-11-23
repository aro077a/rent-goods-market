import React from "react";
import {
  Sheet,
  PageContent,
  BlockTitle,
  F7Sheet,
  List,
  ListItem,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { ProductOrder } from "../../types/paymentapi";

type Props = WithTranslation &
  F7Sheet.Props & {
    order: ProductOrder;
    onStatusChangeClick?(status: string): void;
  };

const ChangeOrderStatusSheet = ({
  order,
  onStatusChangeClick,
  t,
  ...rest
}: Props) => (
  <Sheet
    id="change_order_status_sheet"
    style={{ height: "auto" }}
    swipeToClose
    backdrop
    {...rest}
  >
    <PageContent>
      <BlockTitle medium>{t("Change Order Status to:")}</BlockTitle>
      <List noHairlines>
        {!order.statusExtended && (
          <ListItem
            link
            title={t("Processing").toString()}
            noChevron
            onClick={() => onStatusChangeClick("PRC")}
          />
        )}
        {(!order.statusExtended || ["PRC"].includes(order.statusExtended)) && (
          <ListItem
            link
            title={t("Shipped").toString()}
            noChevron
            onClick={() => onStatusChangeClick("SHP")}
          />
        )}
        {(!order.statusExtended ||
          ["PRC", "SHP"].includes(order.statusExtended)) && (
          <ListItem
            link
            title={t("Ready for Pickup").toString()}
            noChevron
            onClick={() => onStatusChangeClick("RCV")}
          />
        )}
        {(!order.statusExtended ||
          ["PRC", "SHP", "RCV"].includes(order.statusExtended)) && (
          <ListItem
            link
            title={t("Completed").toString()}
            noChevron
            onClick={() => onStatusChangeClick("DLV")}
          />
        )}
      </List>
    </PageContent>
  </Sheet>
);

export default compose(withTranslation())(ChangeOrderStatusSheet);
