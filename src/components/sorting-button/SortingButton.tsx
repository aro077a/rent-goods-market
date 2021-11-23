import React from "react";
import { Link, Icon } from "framework7-react";
import classNames from "classnames";

import "./style.less";

export default (props: Link.Props & { opened?: boolean }): JSX.Element => {
  const { className, text, opened, ...rest } = props;
  return (
    <Link
      className={classNames("sorting-button", className, opened && "opened")}
      {...rest}
    >
      <span>{text}</span>
      <Icon material="expand_more" />
    </Link>
  );
};
