import React from "react";
import { Button, F7Button } from "framework7-react";

import "./style.less";

export const ThemedButton = (props: F7Button.Props & { children: React.ReactNode }) => (
  <Button {...props} />
);
