import { WithTranslation } from "react-i18next";
import { F7Popup } from "framework7-react";
import { Profile } from "@/reducers/sessionReducer";

export type ForgotPasswordPopupProps = F7Popup.Props & {
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ForgotPasswordPopupMapProps = ForgotPasswordPopupProps &
  Pick<WithTranslation, "t"> & {
    profile?: Profile;
    loading: boolean;
    sending: boolean;
    changing: boolean;
    error: string;
    oneTimePassword?(email: string): void;
    loginWithCode?(email: string, code: string): void;
    changePassword?(password: string): void;
  };

export type Step = "init" | "code" | "password";

export type ForgotPasswordPopupState = {
  email: string;
  code: string;
  password: string;
  passwordRepeat: string;
  step: Step;
  showResend: boolean;
};
