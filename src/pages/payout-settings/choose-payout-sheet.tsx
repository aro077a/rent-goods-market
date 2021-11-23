import React from "react";
import {
  Sheet,
  PageContent,
  F7Sheet,
  List,
  ListItem,
  BlockTitle,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { IcBankAccount, IcBankCard } from "../../components-ui/icons";

type Props = WithTranslation &
  F7Sheet.Props & {
    onBankAccountClick?(): void;
    onBankCardClick?(): void;
  };

const ChoosePayoutSheet = ({
  onBankAccountClick,
  onBankCardClick,
  t,
  ...rest
}: Props) => (
  <Sheet
    id="choose_payout_sheet"
    style={{ height: "auto" }}
    swipeToClose
    backdrop
    {...rest}
  >
    <PageContent>
      <BlockTitle medium>{t("Choose Payout Destination")}</BlockTitle>
      <List noHairlines>
        <ListItem
          link
          title={t("Bank Account").toString()}
          noChevron
          onClick={onBankAccountClick}
          sheetClose
        >
          <IcBankAccount slot="media" />
        </ListItem>
        <ListItem
          link
          title={t("Bank Card").toString()}
          noChevron
          onClick={onBankCardClick}
          sheetClose
        >
          <IcBankCard slot="media" />
        </ListItem>
      </List>
    </PageContent>
  </Sheet>
);

export default compose(withTranslation())(ChoosePayoutSheet);
