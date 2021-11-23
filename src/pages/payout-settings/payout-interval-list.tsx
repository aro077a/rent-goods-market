import React from "react";
import { ListItem, List } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";

import "./style.less";

type Props = WithTranslation & {
  selectedInterval?: string;
  onSelectInterval?(interval: string): void;
};

const PayoutIntervalList = ({
  selectedInterval,
  onSelectInterval,
  t,
}: Props) => (
  <List mediaList noChevron noHairlines noHairlinesBetween>
    <ListItem
      radio
      checked={selectedInterval == "weekly"}
      name="interval"
      value="weekly"
      onClick={() => onSelectInterval("weekly")}
    >
      <div slot="title">{t("Weekly")}</div>
      <div slot="text">{t("sent on Tuesdays for past calendar week")}</div>
    </ListItem>
    <ListItem
      radio
      checked={selectedInterval == "bi-weekly"}
      name="interval"
      value="bi-weekly"
      onClick={() => onSelectInterval("bi-weekly")}
    >
      <div slot="title">{t("Bi-weekly")}</div>
      <div slot="text">{t("sent on Tuesdays for 2 past calendar weeks")}</div>
    </ListItem>
    <ListItem
      radio
      checked={selectedInterval == "monthly"}
      name="interval"
      value="monthly"
      onClick={() => onSelectInterval("monthly")}
    >
      <div slot="title">{t("Monthly")}</div>
      <div slot="text">{t("in 5 working days for past calendar month")}</div>
    </ListItem>
  </List>
);

export default compose(withTranslation())(PayoutIntervalList);
