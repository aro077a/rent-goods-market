import React from "react";
import { Link, F7Link } from "framework7-react";

import "./ChatWithSeller.less";

type Props = F7Link.Props & {};

export default (props: Props) => (
  <Link
    {...props}
    className={`chat-with-seller pure-visible-xs ${
      props.className ? props.className : ""
    }`}
    text=""
  >
    <i className="ic-union"></i>
    {props.text}
  </Link>
);
