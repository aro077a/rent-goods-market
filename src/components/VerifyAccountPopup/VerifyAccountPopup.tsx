import React from "react";
import { Block, F7Popup, Link, Navbar, NavRight, Page, Popup } from "framework7-react";
import { useTranslation } from "react-i18next";
import cn from "classnames";

import { IcClose, IcMarketspace, IcMarketspaceApp, IcPassport } from "@/components-ui/icons";

import "./style.less";

type VerifyAccountPopupProps = F7Popup.Props;

export const VerifyAccountPopup = ({ className, ...props }: VerifyAccountPopupProps) => {
  const { t } = useTranslation();

  return (
    <Popup {...props} className={cn("verify-account-popup", className)}>
      <Page>
        <Navbar title={t("Verify Your Account").toString()} noShadow noHairline>
          <NavRight>
            <Link popupClose>
              <IcClose />
            </Link>
          </NavRight>
        </Navbar>
        <Block className="no-margin-top">
          <p>
            {t(
              "Account verification takes a few minutes. It is mandatory for Sellers willing to accept payments using MarketSpace services."
            )}
          </p>
          <h3>{t("How to verify your account?")}</h3>
          <p>
            1. {t("Open Gem4me application on your phone")} <IcMarketspaceApp />
          </p>
          <p>
            2. {t("Open MarketSpace")} <IcMarketspace />
          </p>
          <p>3. {t("Open profile menu ")}</p>
          <p>
            4. {t('Find "Verify Your Account"')} <IcPassport />
          </p>
        </Block>
      </Page>
    </Popup>
  );
};
