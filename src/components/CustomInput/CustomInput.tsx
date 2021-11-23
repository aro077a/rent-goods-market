import React from "react";
import { f7, F7ListInput, ListInput } from "framework7-react";
import { useTranslation } from "react-i18next";
import cn from "classnames";

import "./CustomInput.less";

export const CustomInput = ({ className, ...props }: F7ListInput.Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <ListInput
      id="custom-input"
      className={cn("custom-input", { "safari-version": f7.device.ios }, className)}
      floatingLabel
      type="text"
      errorMessage={t("Required field")}
      {...props}
    />
  );
};
