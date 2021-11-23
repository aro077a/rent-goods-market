import classNames from "classnames";
import { Navbar, NavTitle, NavRight, Link, NavLeft } from "framework7-react";
import React from "react";
import "./style.less";

const SmallModalHeader = ({
  title,
  className,
  popupClose,
  sheetClose,
}: {
  title: string;
  className?: string;
  popupClose?: boolean;
  sheetClose?: boolean;
}) => {
  return (
    <Navbar
      className={classNames("small-modal-header", className)}
      noShadow
      noHairline
    >
      <NavLeft></NavLeft>
      <NavTitle>{title}</NavTitle>
      <NavRight>
        <Link
          sheetClose={sheetClose}
          popupClose={popupClose}
          iconMaterial="clear"
        />
      </NavRight>
    </Navbar>
  );
};

export default SmallModalHeader;
