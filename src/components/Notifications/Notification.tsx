import React from "react";
import classNames from "classnames";

import "./style.less";

type Props = {
  danger?: boolean;
  success?: boolean;
  title?: string;
  text?: string;
};

const Notification = ({ danger, success, title, text }: Props) => (
  <div
    className={classNames([
      "notification-static",
      danger && "danger",
      success && "success",
    ])}
  >
    <div className="header">{title}</div>
    <div className="content">{text}</div>
  </div>
);

export default Notification;
