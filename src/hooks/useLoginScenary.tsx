import React, { SetStateAction, useCallback } from "react";

export const useLoginScenary = (
  setLoginPopupOpened: React.Dispatch<SetStateAction<boolean>>,
  setForgotPasswordPopupOpened: React.Dispatch<SetStateAction<boolean>>,
  setRegisterPopupOpened: React.Dispatch<SetStateAction<boolean>>
) => {
  const onRegister = useCallback(() => {
    setLoginPopupOpened(false);
    setRegisterPopupOpened(true);
  }, [setLoginPopupOpened, setRegisterPopupOpened]);

  const onForgotPassword = useCallback(() => {
    setLoginPopupOpened(false);
    setForgotPasswordPopupOpened(true);
  }, [setForgotPasswordPopupOpened, setLoginPopupOpened]);

  const onLoginClick = useCallback(() => {
    setLoginPopupOpened(true);
  }, [setLoginPopupOpened]);

  return { onRegister, onForgotPassword, onLoginClick };
};
