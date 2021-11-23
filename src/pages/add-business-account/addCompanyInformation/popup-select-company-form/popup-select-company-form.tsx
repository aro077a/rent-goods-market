import React from "react";
import { Link, Popup } from "framework7-react";
import { useTranslation } from "react-i18next";
import "./style.less";

type Form = {
  value: string;
  label: string;
};

type PopupSelectCompanyForm = {
  isOpened: boolean;
  options: Form[];
  onChange: (string) => void;
  closePopup: () => void;
};

const PopupSelectCompanyForm = ({
  isOpened,
  options,
  onChange,
  closePopup,
}: PopupSelectCompanyForm) => {
  const { t } = useTranslation();

  const handleOptionClick = (option) => {
    onChange(option);
    closePopup();
  };

  return (
    <Popup
      id="select-company-form-popup"
      backdrop
      opened={isOpened}
      onPopupClose={closePopup}
    >
      <div className="header">
        <h2>{t("Company Legal Form")}</h2>
        <Link onClick={closePopup} iconF7="xmark" iconOnly />
      </div>
      <ul className="options">
        {options?.map((option, index) => (
          <li key={index} onClick={() => handleOptionClick(option)}>
            {option.label}
          </li>
        ))}
      </ul>
    </Popup>
  );
};

export default PopupSelectCompanyForm;
