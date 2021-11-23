import React, { PureComponent } from "react";
import { Link } from "framework7-react";
import classNames from "classnames";
import "./style.less";
import { IcBurger } from "../../components-ui/icons";

type Props = Link.Props & {
  opened?: boolean;
};

class OpenCategoriesButton extends PureComponent<Props> {
  render() {
    const { className, text, opened, ...rest } = this.props;
    return (
      <Link
        className={classNames("no-ripple", "open-categories-button", opened && "opened", className)}
        {...rest}
      >
        <IcBurger />
        <span>{text}</span>
      </Link>
    );
  }
}

export default OpenCategoriesButton;
