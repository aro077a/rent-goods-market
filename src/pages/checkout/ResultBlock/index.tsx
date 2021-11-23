import React from "react";
import "./style.module.less";
import { useTranslation } from "react-i18next";
import { Button } from "framework7-react";

interface Props {
  success: boolean;
  onClick: () => void;
}

const ResultBlock = ({ success, onClick }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="result-content">
      {success ? (
        <div className="done-title">{t("Your order is completed")}</div>
      ) : (
        <div className="failed-title">{t("Payment failed")}</div>
      )}
      <div className="description">
        {success ? t("done-description") : t("failed-description")}
      </div>
      <Button className="button" round large fill onClick={onClick}>
        <span>{success ? t("Continue") : t("Try again")}</span>
      </Button>
    </div>
  );
};

export default ResultBlock;
