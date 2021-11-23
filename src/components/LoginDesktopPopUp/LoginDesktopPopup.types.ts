import { F7Popup } from "framework7-react";

export type LoginDesktopPopupProps = F7Popup.Props & {
  onRegister: () => void;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  onForgotPassword?: () => void;
};
