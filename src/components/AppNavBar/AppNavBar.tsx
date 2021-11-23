import React, { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { searchClear } from "@/actions/productActions";
import { Navbar } from "@/components/navbar";
import { ProfilePopover } from "@/components/ProfilePopover";
import { VerifyAccountPopup } from "@/components/VerifyAccountPopup";
import { CategoriesMenuDesktop } from "@/components/categories-menu-desktop";
import { LoginDesktopPopup } from "@/components/LoginDesktopPopUp";
import { ForgotPasswordPopUp } from "@/components/ForgotPasswordPopUp";
import { RegisterDesktopPopup } from "@/components/RegisterDesktop";
import { getProfile } from "@/selectors/profile";
import { useAppSelector } from "@/hooks/store";
import { useLoginScenary } from "@/hooks/useLoginScenary";

import { AppNavBarProps } from "./AppNavBar.types";

import "./AppNavBar.less";

export const AppNavBar = ({ f7router }: AppNavBarProps) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [profilePopoverOpened, setProfilePopoverOpened] = useState(false);
  const [categoriesMenuOpened, setCategoriesMenuOpened] = useState(false);
  const [aboutPopupOpened, setAboutPopupOpened] = useState(false);
  const [loginPopupOpened, setLoginPopupOpened] = useState(false);
  const [forgotPasswordPopupOpened, setForgotPasswordPopupOpened] = useState(false);
  const [registerPopupOpened, setRegisterPopupOpened] = useState(false);
  const [verifyAccountPopupOpened, setVerifyAccountPopupOpened] = useState(false);
  const [searchBarEnable, setSearchBarEnable] = useState(false);

  const profile = useAppSelector(getProfile);

  const searchProductsAutocomplete = useAppSelector(
    (state) => state.productReducer.productsAutocomplete
  );

  const searchLoadingAutocomplete = useAppSelector(
    (state) => state.productReducer.loadingAutocomplete
  );

  const resizeEvent = useAppSelector((state) => state.rootReducer.resizeEvent);

  const entryDirect = useAppSelector(
    (state) => state.rootReducer.entryPageName === "product-details"
  );

  const searchbarClearHandle = useCallback(() => dispatch(searchClear()), [dispatch]);

  const onClickLogoLink = useCallback(() => f7router.navigate("/"), [f7router]);

  const isMobile = useMemo(() => resizeEvent.width < 769, [resizeEvent.width]);

  const onClickOpenCategoriesMenu = useCallback(() => setCategoriesMenuOpened((prev) => !prev), []);

  const onSearchbarEnable = useCallback(() => setSearchBarEnable(true), []);
  const onSearchbarDisable = useCallback(() => setSearchBarEnable(false), []);

  const onFindedProductItemClick = useCallback(
    (uid) => f7router.navigate(`/product-details/${uid}/`),
    [f7router]
  );

  const backLink = useMemo(
    () => (!entryDirect && isMobile ? t("Back").toString() : false),
    [entryDirect, isMobile, t]
  );

  const handleClickProfileLink = useCallback(() => setProfilePopoverOpened(true), []);
  const onProfilePopoverClosed = useCallback(() => {
    setProfilePopoverOpened(false);
    setLoginPopupOpened(false);
  }, []);

  const onAboutClick = useCallback(() => setAboutPopupOpened(true), []);
  const onVerifyClick = useCallback(() => setVerifyAccountPopupOpened(true), []);
  const onVerifyPopupClosed = useCallback(() => setVerifyAccountPopupOpened(false), []);
  const onRegisterPopupClose = useCallback(() => {
    setRegisterPopupOpened(false);
  }, []);

  const { onRegister, onForgotPassword, onLoginClick } = useLoginScenary(
    setLoginPopupOpened,
    setForgotPasswordPopupOpened,
    setRegisterPopupOpened
  );

  return (
    <div className="app-navbar-container">
      <Navbar
        profile={profile}
        showProfileLink={!isMobile}
        onClickProfileLink={handleClickProfileLink}
        onClickLogoLink={onClickLogoLink}
        onClickOpenCategoriesMenu={onClickOpenCategoriesMenu}
        openCategoriesMenuButton={categoriesMenuOpened}
        onSearchbarEnable={onSearchbarEnable}
        onSearchbarDisable={onSearchbarDisable}
        onSearchClickClear={searchbarClearHandle}
        findedProducts={searchProductsAutocomplete}
        findProductLoading={searchLoadingAutocomplete}
        onFindedProductItemClick={onFindedProductItemClick}
        backLink={backLink}
        slot="fixed"
        showShare
        onLoginClick={onLoginClick}
      />
      <div slot="fixed">
        <CategoriesMenuDesktop className="pure-hidden-xs" opened={categoriesMenuOpened} />
      </div>

      {/* // ? if we have a profile - we are logged in because default is null */}
      {profile && (
        <ProfilePopover
          backdrop={false}
          opened={profilePopoverOpened}
          target=".profile-link"
          onPopoverClosed={onProfilePopoverClosed}
          onAboutClick={onAboutClick}
          onVerifyClick={onVerifyClick}
          slot="fixed"
        />
      )}
      <LoginDesktopPopup
        opened={loginPopupOpened}
        setOpened={setLoginPopupOpened}
        onRegister={onRegister}
        onForgotPassword={onForgotPassword}
      />
      <ForgotPasswordPopUp
        opened={forgotPasswordPopupOpened}
        setOpened={setForgotPasswordPopupOpened}
      />
      <RegisterDesktopPopup opened={registerPopupOpened} onPopupClose={onRegisterPopupClose} />
      <VerifyAccountPopup
        backdrop
        opened={verifyAccountPopupOpened}
        onPopupClosed={onVerifyPopupClosed}
      />
    </div>
  );
};
