import React from "react";
import cn from "classnames";
import { F7Link, Link } from "framework7-react";

import { IcCart } from "../../components-ui/icons";
import { Badge } from "../Badge";

import "./CartLink.less";

type Props = F7Link.Props & { cartCount: number };

export const CartLink = React.memo(({ className, cartCount, ...props }: Props) => (
  <Link href="/cart/" {...props} className={cn("cart-link", className)}>
    <IcCart />
    {!!cartCount && <Badge />}
  </Link>
));
CartLink.displayName = "CartLink";
