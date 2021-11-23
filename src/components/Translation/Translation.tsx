import React, { memo } from "react";
import { Icon } from "framework7-react";
import "./index.less";
import { compose } from "redux";
import { WithTranslation, withTranslation } from "react-i18next";

type Props = WithTranslation & {
  translated: boolean;
  onClick: () => void;
};

const Translation = ({ t, translated, onClick }: Props) => {
  return (
    <div className="translation block">
      <p className={`${translated ? "translation-translated" : ""}`}>
        <Icon material="translate" />
        {translated ? (
          <>
            <span>{t("Translated by")} Marketspace</span>
            <span onClick={onClick}>{t("See Original")}</span>
          </>
        ) : (
          <span onClick={onClick}>{t("See Translation")}</span>
        )}
      </p>
    </div>
  );
};

export default compose(withTranslation())(memo(Translation));
