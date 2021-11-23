import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import cn from "classnames";
import { Block, Button, f7, Link, List, Navbar, NavRight, Page, Popup } from "framework7-react";

import { loginWithUserPassword } from "@/actions/sessionActions";
import { CustomInput } from "@/components/CustomInput";
import { IcClose } from "@/components-ui/icons";
import { useAppSelector } from "@/hooks/store";
import { isEmail, isPhone } from "@/utils";

import { LoginDesktopPopupProps } from "./LoginDesktopPopup.types";

import "./LoginDesktopPopup.less";

export const LoginDesktopPopup = ({
  onRegister,
  onForgotPassword,
  setOpened,
  className,
  ...props
}: LoginDesktopPopupProps): JSX.Element => {
  const { t } = useTranslation();

  const { loading } = useAppSelector((state) => state.sessionReducer);

  useEffect(() => {
    if (!loading) {
      f7.preloader.hide();
      f7.popup.close();
    }
  }, [loading]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const login = useCallback(() => {
    f7.preloader.show();
    dispatch(loginWithUserPassword(username, password));
  }, [dispatch, password, username]);

  const onUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value),
    []
  );

  const onPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
    []
  );

  const onOpen = useCallback(() => setOpened(true), [setOpened]);

  const onClose = useCallback(() => setOpened(false), [setOpened]);

  const usernameError = useMemo(() => !isEmail(username) && !isPhone(username), [username]);

  const passwordError = useMemo(() => !password.trim().length, [password]);

  return (
    <Popup
      {...props}
      onPopupOpen={onOpen}
      onPopupClose={onClose}
      className={cn("login-popup", className)}
    >
      <Page className="login-popup__page">
        <Navbar noShadow noHairline className="login-popup__navbar">
          <NavRight>
            <Link popupClose className="login-popup__close" onClick={onClose}>
              <IcClose />
            </Link>
          </NavRight>
        </Navbar>
        <Block className="login-popup__content">
          <Block className="login-popup__top">
            <i className="logo login-popup__logo" />
            <h3 className="login-popup__top-title">{t("Login")}</h3>
          </Block>
          <List noHairlines form className="login-popup__list">
            <CustomInput
              name="username"
              value={username}
              label={t("E-mail or phone").toString()}
              floatingLabel
              type="text"
              clearButton
              slot="list"
              onInput={onUsernameChange}
            />
            <CustomInput
              name="password"
              value={password}
              label={t("Password").toString()}
              floatingLabel
              type="password"
              clearButton
              slot="list"
              onInput={onPasswordChange}
            />
          </List>
          <Block className="forgot-password-block">
            <Link className="forgot-password-link" onClick={onForgotPassword}>
              {t("Forgot your Password?")}
            </Link>
          </Block>
          <Block className="login-form">
            <Button
              fill
              large
              round
              raised
              onClick={login}
              disabled={usernameError || passwordError || loading}
            >
              {t("Login")}
            </Button>
            <p className="sign-up-text">
              {t("Not on QRent Art yet?")}&nbsp;
              <Link popupClose onClick={onRegister}>
                {t("Sign Up")}
              </Link>
            </p>
          </Block>
        </Block>
      </Page>
    </Popup>
  );
};
