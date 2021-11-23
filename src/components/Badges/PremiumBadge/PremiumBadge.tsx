import React from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";

import { PremiumBadgeProps } from "./PremiumBadge.types";

import "./PremiumBadge.less";

export const PremiumBadge = React.forwardRef<HTMLDivElement, PremiumBadgeProps>(
  ({ className, ...props }, ref) => {
    const { t } = useTranslation();

    return (
      <div {...props} className={cn("badge-premium", className)} ref={ref}>
        {t("Premium")}
      </div>
    );
  }
);
PremiumBadge.displayName = "PremiumBadge";
