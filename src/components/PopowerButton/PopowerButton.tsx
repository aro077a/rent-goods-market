import React, { PureComponent } from "react";
import { Icon } from "framework7-react";
import { Button } from "../ThemedButton";
import classNames from "classnames";

import "./index.less";

type Props = {
  text?: string;
  icon?: string;
  className?: string;
  popoverOpen: string;
};

class PopowerButton extends PureComponent<Props> {
  render() {
    const { text, icon, className, ...rest } = this.props;
    return (
      <Button className={classNames("popower-button", className)} {...rest}>
        {icon && <Icon className="popower-button-left-icon" material={icon} />}
        <span className="popower-button-text">{text}</span>
        <Icon className="popower-button-right-icon" material="expand_more" />
      </Button>
    );
  }
}

export default PopowerButton;
