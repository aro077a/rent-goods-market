import React from "react";
import "./style.less";

export default ({ title }: { title: string }) => {
  return <div className="premium-badge">{title}</div>;
};
