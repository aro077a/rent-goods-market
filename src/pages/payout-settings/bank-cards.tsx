import React from "react";
import { ListItem, List } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { IcFramecard, IcMastercard, IcVisa } from "../../components-ui/icons";
import { PayoutExternalCard } from "../../types/commonapi";

type Props = WithTranslation & {
  cards?: Array<PayoutExternalCard>;
};

const cardIcons = {
  unknown: <IcFramecard slot="media" />,
  visa: <IcVisa large slot="media" />,
  mastercard: <IcMastercard large slot="media" />,
};

const getCardIcon = (card: PayoutExternalCard) => {
  if (card.brand && card.brand in cardIcons) {
    return cardIcons[card.brand];
  }
  if (card.iin && parseInt(card.iin.substr(0, 1)) == 4) {
    return cardIcons.visa;
  }
  if (card.iin && parseInt(card.iin.substr(0, 1)) == 5) {
    return cardIcons.mastercard;
  }
  return cardIcons.unknown;
};

const PayoutExternalAccountCards = ({ cards }: Props) => (
  <List mediaList noHairlines className="cards">
    {cards.map((card) => (
      <ListItem key={card.lastFour}>
        {getCardIcon(card)}
        <div slot="title">
          {card.brand} •••• {card.lastFour}
        </div>
        <div slot="subtitle">
          {card.expMonth} <span>/</span> {card.expYear}
        </div>
      </ListItem>
    ))}
  </List>
);

export default compose(withTranslation())(PayoutExternalAccountCards);
