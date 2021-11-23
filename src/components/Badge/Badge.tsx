import React from "react";
import cn from "classnames";

import "./Badge.less";

export const Badge = ({
  className,
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
  <div {...props} className={cn("badge", "badge-mini", className)} />
);
