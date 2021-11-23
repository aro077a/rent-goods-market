import React from "react";
import { Link, Icon } from "framework7-react";
import cn from "classnames";

import { AddWishButtonProps } from "./AddWishButton.types";

import "./AddWishButton.less";

export const AddWishButton = React.memo(
  ({ className, active, withShadow, ...props }: AddWishButtonProps) => (
    <Link href="#" iconOnly {...props} className={cn(className, "add-wish", { active })}>
      {withShadow ? (
        <i className={cn("icon", active ? "ic-wish-shadow-active" : "ic-wish-shadow-inactive")}></i>
      ) : (
        <Icon material={active ? "favorite" : "favorite_border"}></Icon>
      )}
    </Link>
  )
);
AddWishButton.displayName = "AddWishButton";
