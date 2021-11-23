import React from "react";
import { Link } from "framework7-react";

import { IcShare, IcShareLarge } from "@/components-ui/icons";

import { ShareButtonProps } from "./ShareButton.types";

import "./ShareButton.less";

export const ShareButton = ({ large = false, ...props }: ShareButtonProps): JSX.Element => (
  <Link className="share-button" href="#" iconOnly {...props}>
    {large ? <IcShareLarge /> : <IcShare />}
  </Link>
);
