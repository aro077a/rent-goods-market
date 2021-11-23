import React from "react";
import classNames from "classnames";

import "./style.less";

type Props = {
  className?: string;
  full?: boolean;
};

export default (props: Props) => {
  const { className, full } = props;
  return (
    <div className={classNames("logo-container", className)}>
      <i className="logo"></i>
      {full && <span className="logo-text">QRent Art</span>}
    </div>
  );
};
