import React from "react";
import {
  Sheet,
  PageContent,
  F7Sheet,
  List,
  ListItem,
  Icon,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";

import "./edit-currency-sheet.style.less";

type EditCurrencySheetAction = {
  type: "SetAsPrimary" | "Remove";
  walletUid: string;
};

type Props = WithTranslation &
  F7Sheet.Props & {
    walletUid: string;
    onActionClick?(action: EditCurrencySheetAction): void;
  };

const EditCurrencySheet = ({ walletUid, t, onActionClick, ...rest }: Props) => {
  return (
    <Sheet id="edit_currency_sheet" swipeToClose backdrop {...rest}>
      <PageContent>
        <List noHairlines noChevron>
          <ListItem
            link
            title={t("Set as primary").toString()}
            onClick={() =>
              onActionClick({
                walletUid,
                type: "SetAsPrimary",
              })
            }
          >
            <span slot="media">
              <Icon f7="checkmark_alt" />
            </span>
          </ListItem>
          <ListItem
            link
            title={t("Remove currency").toString()}
            onClick={() =>
              onActionClick({
                walletUid,
                type: "Remove",
              })
            }
          >
            <span slot="media">
              <Icon material="delete_outline" />
            </span>
          </ListItem>
        </List>
      </PageContent>
    </Sheet>
  );
};

export default compose(withTranslation())(EditCurrencySheet);
