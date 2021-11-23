import React, { useState } from "react";
import { Page, Popup, PageContent, Col, Radio, f7 } from "framework7-react";
import "../../cart/style.less";
import SmallModalHeader from "../../../components-ui/small-modal-header";
import { useSelector } from "react-redux";
import { IApplicationStore } from "../../../store/rootReducer";
import { useTranslation } from "react-i18next";
import { Card } from "../../../types/commonapi";
import PaymentCardCreatePage from "../../payment-card-create";
import { SavedCard } from "../../../reducers/paymentCardsReducer";
import classNames from "classnames";
import "../style.module.less";

interface Props {
  opened: boolean;
  selectedCard: Card | null;
  onClose: () => void;
  onSaveCard: (card: Card) => void;
  setSelectedCard: (card: Card) => void;
  onSetNewCard: (card: SavedCard) => void;
  onClickAddNew: () => void;
}

const PaymentPopup = ({
  opened,
  onClose,
  selectedCard,
  setSelectedCard,
  onClickAddNew,
}: Props) => {
  const { t } = useTranslation();
  const cards = useSelector(
    (state: IApplicationStore) => state.paymentCardsReducer.cards
  );

  const [radioSelected, setRadioSelected] = useState(selectedCard?.uid);

  const paymentItem = (card: Card) => {
    return (
      <div className="cart-block-item" key={`mobile-${card.uid}`}>
        <div className="radio-center">
          <Radio
            checked={radioSelected === card.uid}
            onChange={() => {
              setRadioSelected(card.uid);
              f7.popup.close();
              setTimeout(() => setSelectedCard(card), 500);
            }}
          />
        </div>
        <div className="payment-row">
          <i
            className={classNames(
              "icon",
              `ic-${card.type && card.type.toLowerCase()}`
            )}
          />
          <Col className="info-block">
            <div className="item-title">{card.maskedNumber}</div>
            <div className="cart-date-text">{`${card.expMonth} / ${card.expYear}`}</div>
          </Col>
        </div>
      </div>
    );
  };

  return (
    <Popup
      opened={opened}
      onPopupClosed={() => {
        onClose();
      }}
    >
      <Page pageContent={false}>
        <SmallModalHeader popupClose title={t("Payment Methods")} />
        <PageContent>
          <div className="cart-mobile-block">
            <Col>
              {cards.map(paymentItem)}
              <div className="add-new" onClick={onClickAddNew}>
                + {t("Add New Card")}
              </div>
            </Col>
          </div>
        </PageContent>
      </Page>
    </Popup>
  );
};

export default PaymentPopup;
