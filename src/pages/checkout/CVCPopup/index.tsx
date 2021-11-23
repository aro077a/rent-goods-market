import { Button, Icon, Input, List, Popup } from "framework7-react";
import React, { useState } from "react";
import "./style.module.less";

interface Props {
  opened: boolean;
  cartNumber: string;
  onConfirm: (code: string) => void;
  onClose: () => void;
}

const CVCPopup = ({ opened, cartNumber, onConfirm, onClose }: Props) => {
  const [code, setCode] = useState("");
  return (
    <Popup opened={opened} className="popup-container">
      <div className="popup-title-row">
        <div className="popup-title">{cartNumber}</div>
        <div onClick={onClose} className="popup-close-icon">
          <Icon material="close" />
        </div>
      </div>
      <div className="popup-body">
        <List noHairlinesMd style={{ marginTop: 15 }}>
          <Input
            type="number"
            placeholder="CVC"
            maxlength={4}
            onChange={(val) => setCode(val.target.value)}
          />
        </List>
        <div className="popup-button-row">
          <div />
          <Button
            fill
            round
            disabled={code === ""}
            onClick={() => {
              if (code !== "") onConfirm(code as string);
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default CVCPopup;
