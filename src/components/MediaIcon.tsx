import React from "react";
import classNames from "classnames";

import "./MediaIcon.style.less";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  icon?: string;
  color?: "#7D6AB3" | "#71AD5C" | "#EF5D54";
};

const MediaIcon = ({ icon, color, className, ...rest }: Props) => (
  <span
    {...rest}
    className={classNames("media-icon", className)}
    style={color ? { backgroundColor: color } : null}
  >
    <i className={`icon ${icon}`}></i>
  </span>
);

export default MediaIcon;
