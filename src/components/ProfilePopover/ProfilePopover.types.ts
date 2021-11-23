import { F7Popover } from "framework7-react";

export type ProfilePopoverProps = F7Popover.Props & {
  onVerifyClick: () => void;
  onAboutClick: () => void;
};
