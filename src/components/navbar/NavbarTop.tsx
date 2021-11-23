import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { toggleSelectCustomerLocationSheet } from "@/actions/customer-location/customerLocationActions";
import { AboutPopup } from "@/components/AboutPopup";
import { ContactSupportPopup } from "@/components/ContactSupportPopup";
import LanguageLink from "@/components/LanguageLink/LanguageLink";
import { SelectCustomerLocationButtonNavbar } from "@/components/select-customer-location-button-navbar";
import { useAppSelector } from "@/hooks/store";
import { getProfile } from "@/selectors/profile";

export const NavbarTop = React.memo(() => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    customerLocationReducer: { country },
  } = useAppSelector((state) => state);
  const profile = useAppSelector((state) => getProfile(state));

  const [aboutPopupOpened, setAboutPopupOpened] = useState(false);
  const [contactSupportPopupOpened, setContactSupportPopupOpened] = useState(false);

  const appName = process.env.APP_NAME;
  const currentCountry = country || profile.country;

  return (
    <div className="navbar-top-container">
      <div className="navbar-top-container-content">
        <div className="navbar-top-container-content-left">
          <div
            className="navbar-top-container-content-left-about"
            onClick={() => setAboutPopupOpened(!aboutPopupOpened)}
          >
            <p>{t("About app", { appName }).toString()}</p>
          </div>
          <div
            className="navbar-top-container-content-left-support"
            onClick={() => setContactSupportPopupOpened(!contactSupportPopupOpened)}
          >
            <p>{t("Support")}</p>
          </div>
        </div>
        <div className="navbar-top-container-content-right">
          <SelectCustomerLocationButtonNavbar
            text={t("Deliver to").toString()}
            locationText={currentCountry?.name}
            onClick={() => dispatch(toggleSelectCustomerLocationSheet(true))}
          />
          <LanguageLink />
        </div>
      </div>

      <AboutPopup
        profile={profile}
        backdrop={true}
        opened={aboutPopupOpened}
        onPopupClosed={() => setAboutPopupOpened(!aboutPopupOpened)}
        onContactSupportClick={() => setAboutPopupOpened(!aboutPopupOpened)}
      />
      <ContactSupportPopup
        profile={profile}
        category="Application"
        backdrop={true}
        opened={contactSupportPopupOpened}
        onPopupClosed={() => setContactSupportPopupOpened(!contactSupportPopupOpened)}
      />
    </div>
  );
});
NavbarTop.displayName = "NavbarTop";
