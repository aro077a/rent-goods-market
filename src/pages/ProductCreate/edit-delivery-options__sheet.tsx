import React from "react";
import {
  Sheet,
  PageContent,
  BlockTitle,
  F7Sheet,
  List,
  ListItem,
  Icon,
  Link,
  Preloader,
  Block,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import classNames from "classnames";
import { DeliveryMethod } from "../../types/marketplaceapi";

type Props = F7Sheet.Props & {
  deliveryMethod?: DeliveryMethod;
  onEditClickHandle(): void;
  onRemoveClickHandle(): void;
};

const EditDeliveryOptionsSheet = ({
  t,
  deliveryMethod,
  onEditClickHandle,
  onRemoveClickHandle,
  ...rest
}: Props & WithTranslation) => (
  <Sheet id="edit_delivery_options__sheet" backdrop {...rest}>
    <PageContent>
      {deliveryMethod && (
        <>
          <BlockTitle medium>{deliveryMethod.name}</BlockTitle>
          <List noHairlines>
            <ListItem
              link
              title={t("Edit").toString()}
              noChevron
              onClick={onEditClickHandle}
            ></ListItem>
            <ListItem
              link
              title={t("Remove").toString()}
              noChevron
              onClick={onRemoveClickHandle}
            ></ListItem>
          </List>
        </>
      )}
    </PageContent>
  </Sheet>
);

export default compose(withTranslation())(EditDeliveryOptionsSheet) as React.ComponentClass<Props>;
