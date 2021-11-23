import React from "react";
import classNames from "classnames";

import "./style.less";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  text: string;
  show: boolean;
};

const Toast = (props: Props) => {
  const { className, text, show } = props;
  return show ? (
    <div {...props} className={classNames("toast", className)}>
      <div>{text}</div>
    </div>
  ) : null;
};

export default Toast;
