import React, { PureComponent } from "react";
import cn from "classnames";
import { Link } from "framework7-react";

import { IcLocation } from "@/components-ui/icons";

import "./style.less";

type Props = Link.Props & {
  locationText?: string;
};

export class SelectCustomerLocationButtonNavbar extends PureComponent<Props> {
  render() {
    const { className, text, locationText, ...rest } = this.props;
    return (
      <Link
        className={cn(
          "no-ripple",
          "select-customer-location-button-navbar",
          "header-navbar-location",
          className
        )}
        {...rest}
      >
        <IcLocation />
        <p className="header-navbar-location-info">
          <p>{text}</p>
          <span>{locationText}</span>
        </p>
      </Link>
    );
  }
}
