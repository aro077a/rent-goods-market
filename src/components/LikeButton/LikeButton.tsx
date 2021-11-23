import React from "react";
import { Icon } from "framework7-react";
import cn from "classnames";

import { IcWish } from "@/components-ui/icons/ic-wish";

import { LikeButtonProps } from "./LikeButton.types";

import "./LikeButton.less";

export const LikeButton = React.forwardRef<HTMLButtonElement, LikeButtonProps>(
  ({ active, className, bordered, shadow = false, ...props }, ref) => (
    <button
      {...props}
      ref={ref}
      className={cn("link", "like-button", { material: !bordered }, className)}
    >
      {bordered ? (
        shadow ? (
          <IcWish className={cn("ic-wish-shadow", { active })} />
        ) : (
          <Icon className={cn("ic-wish", { active })}></Icon>
        )
      ) : (
        <Icon material={active ? "favorite" : "favorite_border"}></Icon>
      )}
    </button>
  )
);
LikeButton.displayName = "LikeButton";
