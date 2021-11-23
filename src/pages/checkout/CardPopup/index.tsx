import { Button, Icon, Input, List, Popup } from "framework7-react";
import React, { useState } from "react";
import "./style.module.less";

interface Props {
  opened: boolean;
  onConfirm: (code: string) => void;
  onClose: () => void;
}

const CardPopup = ({ opened, onConfirm, onClose }: Props) => {
  const [number, setNumber] = useState("");
  const [cvc, setCvc] = useState("");
  const [expire, setExpire] = useState("");
  const [holder, setHolder] = useState("");
  return (
    <Popup opened={opened} className="popup-container">
      <div className="popup-title-row">
        <div className="popup-title">Add New Card</div>
        <div onClick={onClose} className="popup-close-icon">
          <Icon material="close" />
        </div>
      </div>
      <div className="popup-body">
        <List noHairlinesMd style={{ marginTop: 15 }}>
          <Input
            type="number"
            placeholder="Card Number"
            onChange={(e) => setNumber(e.target.value)}
          />
        </List>
        <List noHairlinesMd style={{ marginTop: 15 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Input
              type="number"
              placeholder="MM / YY"
              pattern={}
              onChange={(event) => setExpire(event.target.value)}
            />
            <Input
              type="number"
              placeholder="CVC"
              maxlength={4}
              onChange={(event) => setCvc(event.target.value)}
            />
          </div>
        </List>
        <List noHairlinesMd style={{ marginTop: 15 }}>
          <Input
            type="text"
            placeholder="Card Holder"
            onChange={(event) => setHolder(event.target.value)}
          />
        </List>
        <div className="popup-button-row">
          <div />
          <Button fill round onClick={() => {}}>
            Confirm
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default CardPopup;
